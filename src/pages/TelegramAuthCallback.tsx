import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const TelegramAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<TelegramAuthData | null>(null);

  // API URL - используем HTTPS для Telegram или fallback на продакшен
  const API_URL =
    import.meta.env.VITE_API_URL_HTTPS ||
    import.meta.env.VITE_API_URL ||
    'https://api.supermock.ru';

  useEffect(() => {
    const processAuth = async () => {
      try {
        console.log('🔐 Начинаем обработку авторизации...');
        console.log('🌍 API_URL:', API_URL);

        // Получаем данные от Telegram Login Widget
        const id = searchParams.get('id');
        const firstName = searchParams.get('first_name');
        const lastName = searchParams.get('last_name');
        const username = searchParams.get('username');
        const photoUrl = searchParams.get('photo_url');
        const authDate = searchParams.get('auth_date');
        const hash = searchParams.get('hash');

        console.log('📋 Полученные параметры:', {
          id,
          firstName,
          lastName,
          username,
          photoUrl,
          authDate,
          hash,
        });

        if (!id || !firstName || !authDate || !hash) {
          throw new Error('Неполные данные авторизации');
        }

        const authData: TelegramAuthData = {
          id: parseInt(id),
          first_name: firstName,
          last_name: lastName || undefined,
          username: username || undefined,
          photo_url: photoUrl || undefined,
          auth_date: parseInt(authDate),
          hash: hash,
        };

        setUser(authData);
        console.log('📤 Отправляем данные на сервер:', authData);

        // Отправляем данные на backend для валидации и получения токена
        const response = await fetch(`${API_URL}/api/auth/telegram-widget`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authData),
        });

        console.log('📡 Ответ сервера:', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Ошибка ответа:', errorText);
          throw new Error(`Ошибка авторизации: ${response.status}`);
        }

        const data = await response.json();
        console.log('📄 Данные ответа:', data);

        if (data.success) {
          const { token: authToken } = data.data;

          // Сохраняем токен в localStorage
          localStorage.setItem('telegram_token', authToken);

          // Перенаправляем на главную страницу после успешной авторизации
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          throw new Error(data.error || 'Ошибка авторизации');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Неизвестная ошибка';
        console.error('💥 Ошибка авторизации:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    processAuth();
  }, [searchParams, API_URL, navigate]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Обработка авторизации
          </CardTitle>
          <CardDescription className="text-gray-600">
            Проверяем данные от Telegram...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Обрабатываем авторизацию...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Ошибка авторизации
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Button onClick={handleRetry} className="w-full">
                  Попробовать снова
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  Вернуться на главную
                </Button>
              </div>
            </div>
          )}

          {user && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Авторизация успешна!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Добро пожаловать, {user.first_name}!</p>
                    {user.username && (
                      <p className="text-xs text-green-600">@{user.username}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-green-600 text-center">
                  Перенаправление на главную страницу...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramAuthCallback;
