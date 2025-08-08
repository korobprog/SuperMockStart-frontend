import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../store/slices/authSlice';
import TelegramBotAuthButton from '../components/TelegramBotAuthButton';
import BackgroundGradient from '../components/BackgroundGradient';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const TelegramBotAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleBotAuth = async () => {
      try {
        console.log('🔍 Processing Telegram bot auth...');

        // Получаем параметры из URL
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');

        console.log('📋 Bot auth parameters:', { userId, token });

        // Проверяем обязательные поля
        if (!userId) {
          console.error('❌ Missing required bot auth parameters');
          setError('Отсутствуют обязательные параметры авторизации');
          setLoading(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        if (token) {
          // Если токен уже есть, используем его
          console.log('🔑 Using provided token');
          dispatch(setToken(token));
          setLoading(false);
        } else {
          // Если токена нет, верифицируем пользователя через бота
          console.log('🔍 Verifying user through bot...');
          const verifyResponse = await fetch(
            `${API_URL}/api/telegram-bot/verify-user`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: parseInt(userId) }),
            }
          );

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            console.log('✅ Bot verification successful:', verifyData);

            // Сохраняем токен и пользователя в Redux store
            dispatch(setToken(verifyData.data.token));

            // Преобразуем пользователя в формат, ожидаемый Redux
            const userForRedux = {
              id: verifyData.data.user.id,
              first_name: verifyData.data.user.firstName || 'User',
              last_name: verifyData.data.user.lastName,
              username: verifyData.data.user.username,
              is_bot: false,
            };

            dispatch(setUser(userForRedux));

            // Также сохраняем в localStorage для совместимости
            localStorage.setItem('authToken', verifyData.data.token);
            localStorage.setItem('token', verifyData.data.token);

            // Преобразуем пользователя в формат, ожидаемый auth.ts
            const userForStorage = {
              id: verifyData.data.user.id,
              first_name: verifyData.data.user.firstName || 'User',
              last_name: verifyData.data.user.lastName,
              username: verifyData.data.user.username,
              is_bot: false,
            };

            localStorage.setItem('user', JSON.stringify(userForStorage));

            console.log('✅ Bot auth completed successfully');
            setLoading(false);
          } else {
            const errorData = await verifyResponse.json();
            console.error('❌ Bot verification failed:', errorData);
            setError(errorData.error || 'Ошибка верификации через бота');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error during bot auth:', error);
        setError('Ошибка обработки авторизации');
        setLoading(false);
      }
    };

    handleBotAuth();
  }, [searchParams, dispatch, navigate]);

  const handleAuthSuccess = (userId: number, token: string) => {
    console.log('✅ Bot auth success:', { userId, token });

    // Создаем объект пользователя для совместимости
    const user = {
      id: userId,
      first_name: 'User',
      is_bot: false,
    };

    // Сохраняем в Redux и localStorage
    dispatch(setToken(token));
    dispatch(setUser(user));
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Перенаправляем на главную страницу
    navigate('/', { replace: true });
  };

  const handleAuthError = (error: string) => {
    console.error('❌ Bot auth error:', error);
    setError(error);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <BackgroundGradient className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Обработка авторизации...</p>
          </div>
        </div>
      </BackgroundGradient>
    );
  }

  if (error) {
    return (
      <BackgroundGradient className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-4">Ошибка авторизации</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={handleBackToHome}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Вернуться на главную
            </Button>
          </div>
        </div>
      </BackgroundGradient>
    );
  }

  return (
    <BackgroundGradient className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold">
                  Авторизация через Telegram бота
                </h1>
                <p className="text-sm text-muted-foreground">
                  Основной способ входа в SuperMock
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gradient">
              Авторизация через Telegram бота
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Безопасная и быстрая авторизация через Telegram бота
            </p>
          </div>

          {/* Auth Component */}
          <TelegramBotAuthButton
            onAuthSuccess={handleAuthSuccess}
            onAuthError={handleAuthError}
            directAuth={true}
          />
        </div>
      </main>
    </BackgroundGradient>
  );
};

export default TelegramBotAuth;
