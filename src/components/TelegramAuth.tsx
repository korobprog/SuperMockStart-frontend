import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramAuthProps {
  onAuthSuccess?: (user: TelegramUser, token: string) => void;
  onAuthError?: (error: string) => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({
  onAuthSuccess,
  onAuthError,
}) => {
  const { user, loading, error, token, login, checkAuth } = useAuth();

  // API URL - используем переменную окружения или fallback на продакшен
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

  useEffect(() => {
    const initTelegramAuth = async () => {
      try {
        // Проверяем, что мы в Telegram Web App
        if (!window.Telegram?.WebApp) {
          onAuthError?.('Telegram Web App не доступен');
          return;
        }

        const tg = window.Telegram.WebApp;

        // Инициализируем Telegram Web App
        tg.ready();
        tg.expand();

        // Получаем данные пользователя из Telegram
        const initData = tg.initData;

        if (!initData) {
          onAuthError?.('Данные инициализации Telegram не найдены');
          return;
        }

        // Аутентифицируемся с нашим бэкендом через auth slice
        const result = await login(initData);

        if (result.meta.requestStatus === 'fulfilled') {
          const { user: userData, token: authToken } = result.payload;
          onAuthSuccess?.(userData, authToken);
        } else {
          const errorMessage = result.error?.message || 'Ошибка аутентификации';
          onAuthError?.(errorMessage);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Неизвестная ошибка';
        onAuthError?.(errorMessage);
      }
    };

    // Если токена нет, инициализируем аутентификацию
    if (!token) {
      initTelegramAuth();
    } else {
      // Если токен есть, проверяем его валидность
      checkAuth();
    }
  }, [API_URL, onAuthSuccess, onAuthError, login, checkAuth, token]);

  // Проверяем сохраненный токен при загрузке
  useEffect(() => {
    if (token && !user) {
      checkAuth();
    }
  }, [token, user, checkAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
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
              Ошибка аутентификации
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user && token) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
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
              Аутентификация успешна
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Добро пожаловать, {user.first_name}!</p>
              {user.username && (
                <p className="text-xs text-green-600">@{user.username}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Требуется аутентификация
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Откройте это приложение в Telegram для аутентификации.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramAuth;
