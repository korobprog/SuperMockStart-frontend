import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

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
  const navigate = useNavigate();
  const {
    user,
    loading,
    error,
    isAuthenticated,
    checkAuth,
    logout: logoutAction,
  } = useAuth();

  const checkAuthStatus = async () => {
    await checkAuth();
  };

  const login = () => {
    console.log('🔗 Перенаправление на страницу авторизации');
    navigate('/auth');
  };

  const logout = () => {
    console.log('🚪 Выход из системы');
    logoutAction();
  };

  useEffect(() => {
    console.log('🔄 useTelegramAuth: запуск checkAuthStatus');
    checkAuthStatus();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };
};
