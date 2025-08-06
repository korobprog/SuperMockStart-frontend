import React, { useState, useEffect } from 'react';
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
  token: string;
}

const TelegramDevPanel: React.FC = () => {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Проверяем, есть ли данные Telegram в localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      try {
        setTelegramUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored Telegram user:', e);
      }
    }
  }, []);

  const handleTelegramAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Проверяем, доступен ли Telegram WebApp
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;

        if (webApp.initData) {
          // Если есть данные от Telegram, отправляем их на сервер
          const response = await fetch(`${API_URL}/auth/telegram-widget`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: webApp.initDataUnsafe?.user?.id,
              first_name: webApp.initDataUnsafe?.user?.first_name,
              last_name: webApp.initDataUnsafe?.user?.last_name,
              username: webApp.initDataUnsafe?.user?.username,
              photo_url: webApp.initDataUnsafe?.user?.photo_url,
              hash: webApp.initData,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const user = data.data.user;
              setTelegramUser(user);
              localStorage.setItem('telegramUser', JSON.stringify(user));
              localStorage.setItem('userId', user.id.toString());
              console.log('Telegram user authenticated:', user);
            } else {
              setError(data.error || 'Authentication failed');
            }
          } else {
            setError('Failed to authenticate with server');
          }
        } else {
          setError('No Telegram data available');
        }
      } else {
        setError('Telegram WebApp not available');
      }
    } catch (err) {
      console.error('Telegram auth error:', err);
      setError('Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Создаем тестовые данные для разработки
      const testUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: 'https://via.placeholder.com/150',
      };

      const response = await fetch(`${API_URL}/auth/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const user = data.data.user;
          setTelegramUser(user);
          localStorage.setItem('telegramUser', JSON.stringify(user));
          localStorage.setItem('userId', user.id.toString());
          console.log('Test user authenticated:', user);
        } else {
          setError(data.error || 'Authentication failed');
        }
      } else {
        setError('Failed to authenticate with server');
      }
    } catch (err) {
      console.error('Manual auth error:', err);
      setError('Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const clearUser = () => {
    setTelegramUser(null);
    localStorage.removeItem('telegramUser');
    localStorage.removeItem('userId');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Telegram Development Panel</CardTitle>
        <CardDescription>
          Панель для разработки с Telegram интеграцией
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {telegramUser ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {telegramUser.photo_url && (
                <img
                  src={telegramUser.photo_url}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <div className="font-medium">
                  {telegramUser.first_name} {telegramUser.last_name}
                </div>
                <div className="text-sm text-gray-500">
                  @{telegramUser.username} (ID: {telegramUser.id})
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Token: {telegramUser.token.substring(0, 16)}...
            </div>
            <Button onClick={clearUser} variant="outline" size="sm">
              Clear User
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={handleTelegramAuth}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate with Telegram'}
            </Button>
            <Button
              onClick={handleManualAuth}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Authenticating...' : 'Use Test User (Dev)'}
            </Button>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramDevPanel;
