import React, { useEffect, useRef } from 'react';

// Extend Window interface to include telegramDevAuth
declare global {
  interface Window {
    telegramDevAuth?: () => void;
  }
}

interface TelegramLoginWidgetProps {
  botName: string;
  dataAuthUrl: string;
  onAuthSuccess?: (user: any) => void;
  onAuthError?: (error: string) => void;
  className?: string;
  size?: 'large' | 'medium' | 'small';
  requestAccess?: 'write' | 'read';
  usePic?: boolean;
  cornerRadius?: number;
  lang?: string;
}

const TelegramLoginWidget: React.FC<TelegramLoginWidgetProps> = ({
  botName,
  dataAuthUrl,
  onAuthSuccess,
  onAuthError,
  className = '',
  size = 'large',
  requestAccess = 'write',
  usePic = true,
  cornerRadius = 8,
  lang = 'ru',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Очищаем контейнер
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // В режиме разработки используем альтернативный виджет только если включен dev режим
    if (import.meta.env.DEV && import.meta.env.VITE_USE_DEV_WIDGET === 'true') {
      const devWidget = document.createElement('div');
      devWidget.className = 'telegram-login-widget-dev';
      devWidget.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #0088cc 0%, #0077b3 100%);
          color: white;
          padding: 12px 24px;
          border-radius: ${cornerRadius}px;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(0, 136, 204, 0.3);
          transition: all 0.2s ease;
          user-select: none;
        " onclick="window.telegramDevAuth && window.telegramDevAuth()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Войти через Telegram (Dev)
        </div>
      `;

      // Добавляем обработчик для dev авторизации
      window.telegramDevAuth = () => {
        console.log('Dev авторизация через Telegram');
        // Симулируем успешную авторизацию с параметрами как у настоящего Telegram
        const mockUser = {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
          photo_url: 'https://t.me/i/userpic/320/testuser.jpg',
          auth_date: Math.floor(Date.now() / 1000),
          hash: 'dev_hash_' + Math.random().toString(36).substr(2, 9),
        };

        // Создаем URL с параметрами как у настоящего Telegram Login Widget
        const params = new URLSearchParams({
          id: mockUser.id.toString(),
          first_name: mockUser.first_name,
          last_name: mockUser.last_name || '',
          username: mockUser.username || '',
          photo_url: mockUser.photo_url || '',
          auth_date: mockUser.auth_date.toString(),
          hash: mockUser.hash,
        });

        // Перенаправляем на callback URL с параметрами
        const callbackUrl = `${dataAuthUrl}?${params.toString()}`;
        console.log('Перенаправление на:', callbackUrl);
        window.location.href = callbackUrl;
      };

      if (containerRef.current) {
        containerRef.current.appendChild(devWidget);
      }

      return () => {
        delete window.telegramDevAuth;
      };
    }

    // Создаем скрипт для Telegram Login Widget (только для продакшена)
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', size);
    script.setAttribute('data-auth-url', dataAuthUrl);
    script.setAttribute('data-request-access', requestAccess);
    script.setAttribute('data-use-pic', usePic.toString());
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-lang', lang);

    // Добавляем обработчики событий
    script.onload = () => {
      console.log('Telegram Login Widget загружен');
    };

    script.onerror = () => {
      console.error('Ошибка загрузки Telegram Login Widget');
      onAuthError?.('Не удалось загрузить виджет авторизации');

      // В случае ошибки загрузки виджета, показываем dev виджет
      if (import.meta.env.DEV) {
        console.log('🔄 Переключаемся на dev виджет из-за ошибки загрузки');
        const devWidget = document.createElement('div');
        devWidget.className = 'telegram-login-widget-dev';
        devWidget.innerHTML = `
          <div style="
            background: linear-gradient(135deg, #0088cc 0%, #0077b3 100%);
            color: white;
            padding: 12px 24px;
            border-radius: ${cornerRadius}px;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(0, 136, 204, 0.3);
            transition: all 0.2s ease;
            user-select: none;
          " onclick="window.telegramDevAuth && window.telegramDevAuth()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Войти через Telegram (Dev - Fallback)
          </div>
        `;

        // Добавляем обработчик для dev авторизации
        window.telegramDevAuth = () => {
          console.log('Dev авторизация через Telegram (fallback)');
          const mockUser = {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            photo_url: 'https://t.me/i/userpic/320/testuser.jpg',
            auth_date: Math.floor(Date.now() / 1000),
            hash: 'dev_hash_' + Math.random().toString(36).substr(2, 9),
          };

          const params = new URLSearchParams({
            id: mockUser.id.toString(),
            first_name: mockUser.first_name,
            last_name: mockUser.last_name || '',
            username: mockUser.username || '',
            photo_url: mockUser.photo_url || '',
            auth_date: mockUser.auth_date.toString(),
            hash: mockUser.hash,
          });

          const callbackUrl = `${dataAuthUrl}?${params.toString()}`;
          console.log('Перенаправление на:', callbackUrl);
          window.location.href = callbackUrl;
        };

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(devWidget);
        }
      }
    };

    // Добавляем скрипт в контейнер
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Очистка при размонтировании
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [
    botName,
    dataAuthUrl,
    size,
    requestAccess,
    usePic,
    cornerRadius,
    lang,
    onAuthError,
    onAuthSuccess,
  ]);

  return (
    <div
      ref={containerRef}
      className={`telegram-login-widget ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    />
  );
};

export default TelegramLoginWidget;
