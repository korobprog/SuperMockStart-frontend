import React, { useEffect, useRef } from 'react';

interface TelegramLoginWidgetProps {
  onAuthSuccess?: (user: any) => void;
  onAuthError?: (error: string) => void;
  className?: string;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: any) => void;
    };
  }
}

const TelegramLoginWidget: React.FC<TelegramLoginWidgetProps> = ({
  onAuthSuccess,
  onAuthError,
  className = '',
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Получаем имя бота из переменной окружения
    const botUsername =
      import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'SuperMock_bot';

    // Создаем URL для callback - используем полный URL с протоколом
    const callbackUrl = `${window.location.protocol}//${window.location.host}/auth-callback`;

    // Для production используем HTTPS
    const finalCallbackUrl =
      import.meta.env.VITE_NODE_ENV === 'production'
        ? callbackUrl.replace('http://', 'https://')
        : callbackUrl;

    console.log('🔗 Telegram Login Widget callback URL:', finalCallbackUrl);
    console.log('🤖 Bot username:', botUsername);
    console.log('🌐 Current location:', window.location.href);
    console.log('🔧 Protocol:', window.location.protocol);
    console.log('🏠 Host:', window.location.host);
    console.log('🌍 Environment:', import.meta.env.VITE_NODE_ENV);

    // Создаем скрипт для Telegram Login Widget
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', finalCallbackUrl);
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-lang', 'ru');

    // Обработчик успешной авторизации
    const handleAuth = (user: any) => {
      console.log('✅ Telegram Login Widget auth success:', user);

      // Проверяем, что user является объектом
      if (!user || typeof user !== 'object') {
        console.error('❌ Invalid user data received:', user);
        onAuthError?.('Получены некорректные данные пользователя');
        return;
      }

      try {
        // Проверяем обязательные поля
        if (!user.id || !user.first_name) {
          console.error('❌ Missing required user fields:', user);
          onAuthError?.('Отсутствуют обязательные данные пользователя');
          return;
        }

        // Сохраняем пользователя
        localStorage.setItem('telegram_user', JSON.stringify(user));

        // Генерируем токен
        const token =
          Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        localStorage.setItem('telegram_token', token);

        // Вызываем callback с пользователем
        onAuthSuccess?.(user);
      } catch (error) {
        console.error('❌ Error saving user data:', error);
        onAuthError?.('Ошибка сохранения данных пользователя');
      }
    };

    // Добавляем обработчик в window с проверкой
    window.TelegramLoginWidget = {
      dataOnauth: (user: any) => {
        // Дополнительная проверка перед вызовом handleAuth
        if (user && typeof user === 'object') {
          handleAuth(user);
        } else {
          console.error('❌ Invalid user data in dataOnauth:', user);
          onAuthError?.('Некорректные данные авторизации');
        }
      },
    };

    // Добавляем обработчик ошибок загрузки скрипта
    script.onerror = () => {
      console.error('❌ Failed to load Telegram Login Widget script');
      onAuthError?.('Не удалось загрузить виджет авторизации Telegram');
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
      (window as any).TelegramLoginWidget = undefined;
    };
  }, [onAuthSuccess, onAuthError]);

  return (
    <div className={`telegram-login-widget ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">Войти через Telegram</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Нажмите кнопку ниже для авторизации через Telegram
        </p>
      </div>
      <div ref={widgetRef} className="flex justify-center"></div>
    </div>
  );
};

export default TelegramLoginWidget;
