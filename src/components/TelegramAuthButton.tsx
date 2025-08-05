import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Link } from 'react-router-dom';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramAuthButtonProps {
  onAuthSuccess?: (userData: any) => void;
  onAuthError?: (error: string) => void;
  className?: string;
}

const TelegramAuthButton: React.FC<TelegramAuthButtonProps> = ({
  onAuthSuccess,
  onAuthError,
  className = '',
}) => {
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
  const botUsername =
    import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'SuperMock_bot';

  useEffect(() => {
    // Проверяем, находимся ли мы в Telegram Web App
    setIsInTelegram(!!window.Telegram?.WebApp);

    // Проверяем сохраненный токен
    const savedToken = localStorage.getItem('telegram_token');
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
          onAuthSuccess?.(data.data);
        } else {
          localStorage.removeItem('telegram_token');
        }
      } else {
        localStorage.removeItem('telegram_token');
      }
    } catch (error) {
      localStorage.removeItem('telegram_token');
    }
  };

  const handleTelegramWebAppAuth = async () => {
    if (!window.Telegram?.WebApp) {
      setError('Telegram Web App не доступен. Откройте приложение в Telegram.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const initData = tg.initData;
      if (!initData) {
        throw new Error('Данные инициализации Telegram не найдены');
      }

      const response = await fetch(`${API_URL}/api/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initData,
          user: tg.initDataUnsafe?.user,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка аутентификации: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const { user: userData, token: authToken } = data.data;
        setUser(userData);
        localStorage.setItem('telegram_token', authToken);
        onAuthSuccess?.(data.data);
      } else {
        throw new Error(data.error || 'Ошибка аутентификации');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      onAuthError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBotAuth = () => {
    // Перенаправляем на страницу авторизации с выбором метода
    window.location.href = '/auth';
  };

  const handleLogout = () => {
    localStorage.removeItem('telegram_token');
    setUser(null);
    setError(null);
  };

  // Если пользователь уже авторизован
  if (user) {
    return (
      <Card className={`max-w-md mx-auto ${className}`}>
        <CardHeader>
          <CardTitle className="text-green-600">✅ Авторизован</CardTitle>
          <CardDescription>Добро пожаловать в SuperMock!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 mb-4">
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
          <div className="space-y-2">
            <Link to="/choose-interview" className="block">
              <Button className="w-full">Начать собеседование</Button>
            </Link>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Выйти
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Если есть ошибка
  if (error) {
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
              {isInTelegram ? (
                <Button onClick={handleTelegramWebAppAuth} className="w-full">
                  Попробовать снова
                </Button>
              ) : (
                <Button onClick={handleBotAuth} className="w-full">
                  Авторизоваться через бота
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Основной интерфейс авторизации
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>🔐 Авторизация через Telegram</CardTitle>
        <CardDescription>
          Войдите через Telegram для доступа к приложению
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isInTelegram ? (
            // Если мы в Telegram Web App
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  ✅ Вы используете Telegram Web App
                </p>
              </div>
              <Button
                onClick={handleTelegramWebAppAuth}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Авторизация...
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
                    Войти через Telegram
                  </>
                )}
              </Button>
            </div>
          ) : (
            // Если мы в обычном браузере
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700">
                  💡 Откройте приложение в Telegram для автоматической
                  авторизации
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleBotAuth}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Авторизоваться через бота
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Или добавьте приложение в Telegram:
                  </p>
                  <a
                    href={`https://t.me/${botUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-600"
                  >
                    @{botUsername}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramAuthButton;
