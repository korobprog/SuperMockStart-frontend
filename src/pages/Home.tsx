import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { setStoredToken, setStoredUser } from '../utils/auth';
import HeroSection from '../components/HeroSection';
import BackgroundGradient from '../components/BackgroundGradient';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const handleTelegramWebAppAuth = async () => {
      // Если пользователь уже авторизован, не обрабатываем авторизацию
      if (isAuthenticated) {
        return;
      }

      // Проверяем, доступен ли Telegram Web App
      const tg = window.Telegram?.WebApp;

      if (!tg) {
        console.log('Telegram Web App недоступен - обычная веб-страница');
        return;
      }

      console.log('🔍 Обнаружен Telegram Web App, обрабатываем авторизацию...');
      setIsProcessingAuth(true);

      try {
        // Получаем данные пользователя из Telegram Web App
        const telegramUser = tg.initDataUnsafe?.user;
        const initData = tg.initData;

        console.log('📋 Данные Telegram:', {
          telegramUser,
          initData: initData ? initData.substring(0, 50) + '...' : null,
        });

        if (!telegramUser || !initData) {
          throw new Error(
            'Данные пользователя недоступны. Убедитесь, что вы открыли приложение через бота.'
          );
        }

        // Инициализируем Telegram Web App
        tg.ready();
        tg.expand();

        // Автоматическая авторизация через Telegram Web App
        await authenticateWithTelegram(initData);
      } catch (error) {
        console.error('❌ Ошибка авторизации:', error);
        setAuthError(
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        );
      } finally {
        setIsProcessingAuth(false);
      }
    };

    handleTelegramWebAppAuth();
  }, [isAuthenticated]);

  const authenticateWithTelegram = async (initData: string) => {
    try {
      console.log('🔐 Авторизация через Telegram Web App...');

      const API_URL =
        import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

      const response = await fetch(`${API_URL}/api/auth/telegram-webapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      });

      const data = await response.json();
      console.log('📡 Ответ API Telegram:', data);

      if (response.ok && data.success && data.data?.token) {
        // Сохраняем токен и пользователя
        setStoredToken(data.data.token);
        setStoredUser(data.data.user);

        console.log('✅ Авторизация через Telegram успешна');

        // Обновляем страницу для применения авторизации
        window.location.reload();
      } else {
        throw new Error(data.error || 'Ошибка авторизации через Telegram');
      }
    } catch (error) {
      console.error('❌ Ошибка авторизации через Telegram:', error);
      throw error;
    }
  };

  // Если обрабатывается авторизация, показываем загрузку
  if (isProcessingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner
            message="Авторизация через Telegram Web App..."
            size="lg"
            fullScreen={true}
          />
        </div>
      </div>
    );
  }

  // Если есть ошибка авторизации, показываем её
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Ошибка авторизации</h1>
          <p className="text-gray-600 mb-6">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Обычная главная страница
  return (
    <div className="min-h-screen">
      <BackgroundGradient />
      <div className="relative z-10">
        <HeroSection />

        {/* Дополнительная информация для Telegram Web App */}
        {window.Telegram?.WebApp && (
          <div className="bg-blue-50 border-t border-blue-200 py-4">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <p className="text-blue-800 text-sm">
                  ✅ Открыто через Telegram Web App
                </p>
                {window.Telegram.WebApp.initDataUnsafe?.user && (
                  <p className="text-blue-600 text-xs mt-1">
                    Пользователь:{' '}
                    {window.Telegram.WebApp.initDataUnsafe.user.first_name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
