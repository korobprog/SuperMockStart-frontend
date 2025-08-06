import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramBotAuthProps {
  onAuthSuccess?: (user: TelegramUser, token: string) => void;
  onAuthError?: (error: string) => void;
  className?: string;
}

const TelegramBotAuth: React.FC<TelegramBotAuthProps> = ({
  onAuthSuccess,
  onAuthError,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<
    'initial' | 'waiting' | 'success' | 'error'
  >('initial');
  const [authUrl, setAuthUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<TelegramUser | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
  const botUsername =
    import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'SuperMock_bot';

  // Генерируем уникальный ID для пользователя (в реальном приложении это может быть из localStorage или другого источника)
  const generateUserId = () => {
    return Math.floor(Math.random() * 1000000) + 100000;
  };

  const createAuthUrl = async () => {
    try {
      setLoading(true);
      setError('');

      const userId = generateUserId();
      const redirectUrl = `${window.location.origin}/auth-callback`;

      const response = await fetch(`${API_URL}/api/telegram-bot/auth-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          redirectUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create auth URL');
      }

      const data = await response.json();

      if (data.success) {
        setAuthUrl(data.data.authUrl);
        setAuthStep('waiting');

        // Открываем URL в новой вкладке
        window.open(data.data.authUrl, '_blank');

        // Начинаем проверку авторизации
        startAuthCheck(userId);
      } else {
        throw new Error(data.error || 'Failed to create auth URL');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setAuthStep('error');
      onAuthError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startAuthCheck = (userId: number) => {
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/telegram-bot/verify-user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.success) {
            clearInterval(checkInterval);
            setUser(data.data.user);
            setAuthStep('success');

            // Сохраняем токен
            localStorage.setItem('telegram_token', data.data.token);

            onAuthSuccess?.(data.data.user, data.data.token);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    }, 2000); // Проверяем каждые 2 секунды

    // Останавливаем проверку через 5 минут
    setTimeout(() => {
      clearInterval(checkInterval);
      if (authStep === 'waiting') {
        setError('Authorization timeout. Please try again.');
        setAuthStep('error');
        onAuthError?.('Authorization timeout');
      }
    }, 5 * 60 * 1000);
  };

  const handleRetry = () => {
    setAuthStep('initial');
    setError('');
    setUser(null);
  };

  if (authStep === 'success' && user) {
    return (
      <Card className={`max-w-md mx-auto ${className}`}>
        <CardHeader>
          <CardTitle className="text-green-600">
            ✅ Авторизация успешна
          </CardTitle>
          <CardDescription>Добро пожаловать в SuperMock!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            {user.photo_url && (
              <img
                src={user.photo_url}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold">
                {user.first_name} {user.last_name}
              </p>
              {user.username && (
                <p className="text-sm text-gray-600">@{user.username}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (authStep === 'error') {
    return (
      <Card className={`max-w-md mx-auto ${className}`}>
        <CardHeader>
          <CardTitle className="text-red-600">❌ Ошибка авторизации</CardTitle>
          <CardDescription>
            Не удалось авторизоваться через Telegram
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-red-600">{error}</p>
            <div className="space-y-2">
              <Button onClick={handleRetry} className="w-full">
                Попробовать снова
              </Button>
              <Button
                onClick={() => setAuthStep('initial')}
                variant="outline"
                className="w-full"
              >
                Назад
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (authStep === 'waiting') {
    return (
      <Card className={`max-w-md mx-auto ${className}`}>
        <CardHeader>
          <CardTitle>⏳ Ожидание авторизации</CardTitle>
          <CardDescription>
            Откройте Telegram и нажмите кнопку "Start" в боте
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Если Telegram не открылся автоматически, нажмите кнопку ниже:
            </p>
            <Button
              onClick={() => window.open(authUrl, '_blank')}
              className="w-full"
            >
              Открыть в Telegram
            </Button>
            <Button onClick={handleRetry} variant="outline" className="w-full">
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>🔐 Авторизация через Telegram</CardTitle>
        <CardDescription>
          Войдите через Telegram бота для доступа к приложению
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Нажмите кнопку ниже, чтобы авторизоваться через Telegram бота
            </p>
          </div>

          <Button
            onClick={createAuthUrl}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Создание ссылки...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Войти через Telegram бота
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            <p>Бот: @{botUsername}</p>
            <p>Безопасная авторизация через Telegram</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramBotAuth;
