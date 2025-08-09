import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStoredToken, setStoredToken, setStoredUser } from '../utils/auth';

const TelegramBotAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<
    'checking' | 'success' | 'error' | 'manual'
  >('checking');

  useEffect(() => {
    const handleBotAuth = async () => {
      try {
        console.log('🔍 Обработка авторизации через Telegram Bot...');

        // Получаем userId из URL параметров
        const userId = searchParams.get('userId');
        console.log('📋 userId из URL:', userId);

        if (!userId) {
          throw new Error('userId не найден в URL параметрах');
        }

        // Проверяем, доступен ли Telegram Web App
        const tg = window.Telegram?.WebApp;

        if (tg) {
          console.log('✅ Telegram Web App доступен');

          // Получаем данные пользователя из Telegram Web App
          const telegramUser = tg.initDataUnsafe?.user;
          const initData = tg.initData;

          console.log('📋 Данные Telegram:', {
            telegramUser,
            initData: initData ? initData.substring(0, 50) + '...' : null,
          });

          if (telegramUser && initData) {
            // Автоматическая авторизация через Telegram Web App
            await authenticateWithTelegram(initData, telegramUser);
          } else {
            console.log('⚠️ Данные Telegram недоступны, используем userId');
            await authenticateWithUserId(userId);
          }
        } else {
          console.log('❌ Telegram Web App недоступен, используем userId');
          await authenticateWithUserId(userId);
        }
      } catch (error) {
        console.error('❌ Ошибка авторизации:', error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        setAuthStatus('error');
      } finally {
        setLoading(false);
      }
    };

    handleBotAuth();
  }, [searchParams]);

  const authenticateWithTelegram = async (
    initData: string,
    telegramUser: any
  ) => {
    try {
      console.log('🔐 Авторизация через Telegram Web App...');

      const API_URL =
        import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

      const response = await fetch(`${API_URL}/api/auth/telegram`, {
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
        setAuthStatus('success');

        // Перенаправляем на главную страницу
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        throw new Error(data.error || 'Ошибка авторизации через Telegram');
      }
    } catch (error) {
      console.error('❌ Ошибка авторизации через Telegram:', error);
      throw error;
    }
  };

  const authenticateWithUserId = async (userId: string) => {
    try {
      console.log('🔐 Авторизация через userId:', userId);

      const API_URL =
        import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

      const response = await fetch(`${API_URL}/api/telegram-bot/verify-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: parseInt(userId) }),
      });

      const data = await response.json();
      console.log('📡 Ответ API userId:', data);

      if (response.ok && data.success && data.data?.token) {
        // Сохраняем токен и пользователя
        setStoredToken(data.data.token);
        setStoredUser(data.data.user);

        console.log('✅ Авторизация через userId успешна');
        setAuthStatus('success');

        // Перенаправляем на главную страницу
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        throw new Error(data.error || 'Ошибка авторизации через userId');
      }
    } catch (error) {
      console.error('❌ Ошибка авторизации через userId:', error);
      setAuthStatus('manual');
      throw error;
    }
  };

  const retryAuth = async () => {
    setLoading(true);
    setError(null);
    setAuthStatus('checking');

    const userId = searchParams.get('userId');
    if (userId) {
      try {
        await authenticateWithUserId(userId);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        setAuthStatus('error');
      }
    }
    setLoading(false);
  };

  const getTestToken = async () => {
    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
      const response = await fetch(`${API_URL}/api/auth/test-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success && data.data?.token) {
        setStoredToken(data.data.token);
        setStoredUser(data.data.user);
        setAuthStatus('success');

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        throw new Error(data.error || 'Ошибка получения тестового токена');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      setAuthStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner message="Авторизация через Telegram Bot..." />
        </div>
      </div>
    );
  }

  if (authStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-4">Авторизация успешна!</h1>
          <p className="text-gray-600 mb-6">
            Перенаправление на главную страницу...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Авторизация через Telegram Bot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">❌ Ошибка: {error}</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>UserId:</strong>{' '}
              {searchParams.get('userId') || 'Не найден'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Telegram Web App:</strong>{' '}
              {window.Telegram?.WebApp ? '✅ Доступен' : '❌ Недоступен'}
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={retryAuth} className="w-full" disabled={loading}>
              {loading ? 'Повторная попытка...' : 'Повторить авторизацию'}
            </Button>

            <Button
              onClick={getTestToken}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Получение токена...' : 'Получить тестовый токен'}
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              className="w-full"
            >
              Вернуться на главную
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 Если авторизация не работает автоматически:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Убедитесь, что вы открыли ссылку из Telegram</li>
              <li>Попробуйте нажать "Повторить авторизацию"</li>
              <li>Или используйте "Получить тестовый токен"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramBotAuth;
