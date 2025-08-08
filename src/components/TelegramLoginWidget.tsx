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

  // Определяем бота в зависимости от окружения
  const getCurrentBotUsername = () => {
    if (botUsername) return botUsername;
    return getBotUsername();
  };

  useEffect(() => {
    const currentBotUsername = getCurrentBotUsername();

    // Логируем конфигурацию при инициализации
    logBotConfig();

    // Загружаем Telegram Login Widget скрипт
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', currentBotUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', window.location.origin);
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-lang', 'ru');

    // Обработчик успешной авторизации
    window.TelegramLoginWidget = {
      dataOnauth: async (user: TelegramUser) => {
        try {
          console.log('🔐 Telegram Login Widget auth success:', user);
          console.log('🤖 Using bot:', currentBotUsername);

          // Отправляем данные на бэкенд для валидации
          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || 'https://api.supermock.ru'
            }/api/auth/telegram`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                initData: window.location.search.substring(1), // Получаем initData из URL
                user: user,
                botUsername: currentBotUsername, // Передаем информацию о боте
              }),
            }
          );

          if (!response.ok) {
            throw new Error('Ошибка валидации на сервере');
          }

          const data = await response.json();

          if (data.success) {
            // Сохраняем пользователя и токен
            localStorage.setItem('telegram_user', JSON.stringify(user));
            localStorage.setItem('telegram_token', data.token);
            localStorage.setItem('telegram_bot_username', currentBotUsername);

            onAuthSuccess?.(user, data.token);
            console.log('✅ Auth successful, token saved');
          } else {
            throw new Error(data.error || 'Ошибка авторизации');
          }
        } catch (error) {
          console.error('❌ Telegram Login Widget auth error:', error);
          onAuthError?.(
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
      },
    };

    // Добавляем скрипт в DOM
    if (widgetRef.current) {
      widgetRef.current.appendChild(script);
    }

    // Очистка при размонтировании
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
        <CardTitle className="text-center">
          🔐 Авторизация через Telegram
        </CardTitle>
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

          <div ref={widgetRef} className="flex justify-center">
            {/* Telegram Login Widget будет вставлен сюда */}
          </div>

          <div className="text-xs text-gray-500 text-center">
            Авторизация происходит через официальный Telegram API
          </div>
        </div>
      </CardContent>
    </ModernCard>
  );
};

export default TelegramLoginWidget;
