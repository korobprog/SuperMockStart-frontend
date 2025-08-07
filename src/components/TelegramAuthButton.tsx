import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Avatar from './ui/avatar';
import TelegramAvatarLoader from './TelegramAvatarLoader';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ModernCard,
} from './ui/card';
import { Play, User } from 'lucide-react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramAuthButtonProps {
  onAuthSuccess?: (user: TelegramUser, token: string) => void;
  onAuthError?: (error: string) => void;
  className?: string;
}

const TelegramAuthButton: React.FC<TelegramAuthButtonProps> = ({
  onAuthSuccess,
  onAuthError,
  className = '',
}) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [showAvatarLoader, setShowAvatarLoader] = useState(false);

  useEffect(() => {
    // Проверяем, находимся ли мы в Telegram Web App
    const checkTelegramWebApp = () => {
      if (window.Telegram?.WebApp) {
        setIsInTelegram(true);
        console.log('✅ Telegram Web App detected');
      } else {
        console.log('❌ Not in Telegram Web App');
      }
    };

    checkTelegramWebApp();

    // Проверяем сохраненного пользователя
    const savedUser = localStorage.getItem('telegram_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('✅ Found saved user:', parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }
  }, []);

  const handleTelegramWebAppAuth = async () => {
    setLoading(true);
    try {
      // Получаем данные пользователя из Telegram Web App
      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

      if (!telegramUser) {
        throw new Error('Не удалось получить данные пользователя из Telegram');
      }

      // Создаем токен авторизации
      const authToken = Math.random().toString(36).substring(2, 15);

      // Сохраняем пользователя и токен
      localStorage.setItem('telegram_user', JSON.stringify(telegramUser));
      localStorage.setItem('telegram_token', authToken);

      setUser(telegramUser);
      onAuthSuccess?.(telegramUser, authToken);

      console.log('✅ Telegram Web App auth successful:', telegramUser);
    } catch (error) {
      console.error('❌ Telegram Web App auth error:', error);
      onAuthError?.(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('telegram_user');
    localStorage.removeItem('telegram_token');
    setUser(null);
    setShowAvatarLoader(false);
    console.log('✅ User logged out');
  };

  const handleAvatarLoaded = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, photo_url: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('telegram_user', JSON.stringify(updatedUser));
      console.log('✅ Avatar loaded and saved:', avatarUrl);
    }
  };

  // Если пользователь уже авторизован
  if (user) {
    return (
      <ModernCard className={`max-w-md mx-auto ${className}`}>
        <CardHeader>
          <CardTitle className="text-green-600">✅ Авторизован</CardTitle>
          <CardDescription>Добро пожаловать в SuperMock!</CardDescription>
        </CardHeader>
        <CardContent>
          {showAvatarLoader ? (
            <TelegramAvatarLoader
              user={user}
              onAvatarLoaded={handleAvatarLoaded}
              className="mb-4"
            />
          ) : (
            <div className="flex items-center space-x-3 mb-4">
              <Avatar
                user={user}
                alt={`${user.first_name} ${user.last_name}`}
                size="lg"
                variant="card"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.first_name} {user.last_name}
                </p>
                {user.username && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    @{user.username}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Link to="/choose-interview" className="block">
              <Button className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-green-400 hover:border-green-300">
                <Play className="w-5 h-5 mr-2" />
                Начать собеседование
              </Button>
            </Link>

            {!showAvatarLoader && (
              <Button
                onClick={() => setShowAvatarLoader(true)}
                variant="outline"
                className="w-full"
              >
                <User className="w-4 h-4 mr-2" />
                Загрузить аватарку
              </Button>
            )}

            <Button onClick={handleLogout} variant="outline" className="w-full">
              Выйти
            </Button>
          </div>
        </CardContent>
      </ModernCard>
    );
  }

  // Основной интерфейс авторизации
  return (
    <ModernCard className={`max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-center">
          <span className="hidden sm:inline">
            🔐 Авторизация через Telegram
          </span>
          <span className="sm:hidden">
            🔐 Авторизация
            <br />
            через Telegram
          </span>
        </CardTitle>
        <CardDescription className="text-center">
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
                  ℹ️ Для авторизации откройте приложение в Telegram
                </p>
              </div>
              <Button
                onClick={() => {
                  // Открываем приложение в Telegram
                  const appUrl = window.location.href;
                  const telegramUrl = `https://t.me/SuperMock_bot?start=${encodeURIComponent(
                    appUrl
                  )}`;
                  window.open(telegramUrl, '_blank');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Открыть в Telegram
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </ModernCard>
  );
};

export default TelegramAuthButton;
