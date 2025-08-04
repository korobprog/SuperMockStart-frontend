import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface UseTelegramAuthReturn {
  user: TelegramUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useTelegramAuth = (): UseTelegramAuthReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // API URL - используем переменную окружения или fallback на продакшен
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

  const checkAuthStatus = useCallback(async () => {
    const savedToken = localStorage.getItem('telegram_token');

    console.log('🔍 Debug useTelegramAuth:');
    console.log(
      '🔑 Токен из localStorage:',
      savedToken ? 'найден' : 'не найден'
    );
    console.log('🌐 API_URL:', API_URL);

    if (!savedToken) {
      console.log('❌ Токен не найден, завершаем проверку');
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Проверяем токен на сервере...');
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${savedToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Ответ сервера:', response.status, response.statusText);

      const data = await response.json();
      console.log('📄 Данные ответа:', data);

      if (data.success && data.data) {
        console.log('✅ Токен валиден, устанавливаем пользователя');
        setUser(data.data);
        setError(null);
      } else {
        console.log('❌ Токен невалиден, удаляем из localStorage');
        localStorage.removeItem('telegram_token');
        setUser(null);
      }
    } catch (error) {
      console.error('💥 Ошибка проверки токена:', error);
      localStorage.removeItem('telegram_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const login = useCallback(() => {
    console.log('🔗 Перенаправление на страницу авторизации');
    navigate('/auth');
  }, [navigate]);

  const logout = useCallback(() => {
    console.log('🚪 Выход из системы');
    localStorage.removeItem('telegram_token');
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    console.log('🔄 useTelegramAuth: запуск checkAuthStatus');
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuthStatus,
  };
};
