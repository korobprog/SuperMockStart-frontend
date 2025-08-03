import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TokenCheck: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

  useEffect(() => {
    const checkToken = async () => {
      try {
        console.log('🔍 Проверяем токен...');

        // Получаем userId из URL параметров
        const userId = searchParams.get('userId');

        if (!userId) {
          throw new Error('Не найден userId в параметрах');
        }

        console.log('👤 User ID:', userId);

        // Проверяем авторизацию пользователя
        const response = await fetch(
          `${API_URL}/api/telegram-bot/verify-user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: parseInt(userId),
            }),
          }
        );

        console.log('📡 Ответ сервера:', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Ошибка ответа:', errorText);
          throw new Error(`Ошибка проверки токена: ${response.status}`);
        }

        const data = await response.json();
        console.log('📄 Данные ответа:', data);

        if (data.success) {
          console.log('✅ Токен проверен успешно');

          // Сохраняем токен в localStorage
          if (data.data?.token) {
            localStorage.setItem('telegram_token', data.data.token);
            console.log('💾 Токен сохранен в localStorage');
          }

          setUser(data.data?.user);
          setSuccess(true);

          // Перенаправляем на главную страницу через 2 секунды
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          throw new Error(data.error || 'Ошибка проверки токена');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Неизвестная ошибка';
        console.error('💥 Ошибка проверки токена:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
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
          <div className="mx-auto mb-4 w-16 h-16 bg-[#0088cc] rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Проверка токена
          </CardTitle>
          <CardDescription className="text-gray-600">
            Проверяем авторизацию через Telegram...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0088cc] mx-auto mb-4"></div>
              <p className="text-gray-600">Проверяем токен...</p>
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
                    Ошибка проверки токена
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

          {success && user && (
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
                    Токен проверен успешно!
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

export default TokenCheck;
