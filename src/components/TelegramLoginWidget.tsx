import React, { useEffect, useRef } from 'react';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ModernCard,
} from './ui/card';
import {
  getBotUsername,
  getBotInfo,
  logBotConfig,
} from '../utils/telegramConfig';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginWidgetProps {
  onAuthSuccess?: (user: TelegramUser, token: string) => void;
  onAuthError?: (error: string) => void;
  className?: string;
  botUsername?: string;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

const TelegramLoginWidget: React.FC<TelegramLoginWidgetProps> = ({
  onAuthSuccess,
  onAuthError,
  className = '',
  botUsername,
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);

  const getCurrentBotUsername = () => {
    if (botUsername) return botUsername;
    return getBotUsername();
  };

  useEffect(() => {
    const currentBotUsername = getCurrentBotUsername();

    logBotConfig();

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', currentBotUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', window.location.origin);
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-lang', 'ru');

    window.TelegramLoginWidget = {
      dataOnauth: async (user: TelegramUser) => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
          const response = await fetch(`${apiUrl}/api/auth/telegram-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telegramData: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                photo_url: user.photo_url,
                auth_date: user.auth_date,
                hash: user.hash,
              },
              user,
              botUsername: currentBotUsername,
            }),
          });

          if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Ошибка валидации на сервере');
          }

          const data = await response.json();

          if (data.success && (data.data?.token || data.token)) {
            const token: string = data.data?.token || data.token;
            localStorage.setItem('extended_token', token);
            localStorage.setItem('user', JSON.stringify(data.data?.user || user));
            localStorage.setItem('telegram_bot_username', currentBotUsername);
            onAuthSuccess?.(user, token);
          } else {
            throw new Error(data.error || 'Ошибка авторизации');
          }
        } catch (error) {
          onAuthError?.(error instanceof Error ? error.message : 'Unknown error');
        }
      },
    };

    if (widgetRef.current) {
      widgetRef.current.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [botUsername, onAuthSuccess, onAuthError]);

  const currentBotUsername = getCurrentBotUsername();
  const botInfo = getBotInfo();

  return (
    <ModernCard className={`max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-center">🔐 Авторизация через Telegram</CardTitle>
        <CardDescription className="text-center">
          Войдите через Telegram для доступа к приложению
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              ✅ Используйте Telegram Login Widget для безопасной авторизации
            </p>
            <p className="text-xs text-blue-600 mt-1">
              🤖 Бот: {currentBotUsername} ({botInfo.environment.toUpperCase()})
            </p>
          </div>

          <div ref={widgetRef} className="flex justify-center" />

          <div className="text-xs text-gray-500 text-center">
            Авторизация происходит через официальный Telegram API
          </div>
        </div>
      </CardContent>
    </ModernCard>
  );
};

export default TelegramLoginWidget;
