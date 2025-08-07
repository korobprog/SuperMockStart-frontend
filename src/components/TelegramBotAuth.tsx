import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ModernCard,
} from './ui/card';

interface TelegramBotAuthProps {
  onAuthSuccess: (user: any, token: string) => void;
  onAuthError: (error: string) => void;
  className?: string;
}

const TelegramBotAuth: React.FC<TelegramBotAuthProps> = ({
  onAuthError,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);

  const handleTelegramBotAuth = async () => {
    setLoading(true);
    try {
      // Получаем имя бота из переменной окружения
      const botUsername =
        import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'SuperMock_bot';

      // Создаем уникальный ID для авторизации
      const authId = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}`;

      // Получаем API URL
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

      // Создаем LoginUrl через API
      const response = await fetch(`${apiUrl}/api/telegram-bot/login-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: Date.now(), // Временный ID пользователя
          redirectUrl: window.location.origin + '/auth-callback',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.loginUrl) {
          // Используем URL из LoginUrl объекта
          const authUrl = data.data.loginUrl.url;
          window.open(authUrl, '_blank');

          // Показываем сообщение пользователю
          alert(
            `Откройте бота @${botUsername} в Telegram и следуйте инструкциям для регистрации.\n\nСсылка авторизации: ${authUrl}`
          );

          // Сохраняем информацию о pending авторизации
          localStorage.setItem('pending_auth_id', authId);
          localStorage.setItem('auth_timestamp', Date.now().toString());
        } else {
          throw new Error('Ошибка создания ссылки авторизации');
        }
      } else {
        throw new Error('Ошибка API при создании ссылки авторизации');
      }

      // Не создаем мок-пользователя и не сохраняем токен
      // Пользователь должен пройти полную авторизацию через бота
    } catch (error) {
      console.error('Ошибка при открытии Telegram бота:', error);
      onAuthError('Ошибка при открытии Telegram бота');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernCard className={`max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-center">
          <span className="hidden sm:inline">🤖 Открыть Telegram бота</span>
          <span className="sm:hidden">
            🤖 Открыть
            <br />
            Telegram бота
          </span>
        </CardTitle>
        <CardDescription className="text-center">
          Откройте Telegram бота для регистрации и доступа к приложению
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
            <p className="text-sm text-muted-foreground mb-4">
              Нажмите кнопку ниже, чтобы открыть Telegram бота для регистрации
            </p>
          </div>
          <Button
            onClick={handleTelegramBotAuth}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold text-sm sm:text-base md:text-lg py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-400 hover:border-blue-300"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Открытие бота...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base">
                  Открыть Telegram бота
                </span>
              </>
            )}
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            <p>
              Бот: @
              {import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'SuperMock_bot'}
            </p>
            <p>Регистрация и авторизация через Telegram</p>
          </div>
        </div>
      </CardContent>
    </ModernCard>
  );
};

export default TelegramBotAuth;
