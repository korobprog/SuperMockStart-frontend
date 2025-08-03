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

  // API URL - используем переменную окружения или fallback
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const checkAuthStatus = useCallback(async () => {
    const savedToken = localStorage.getItem('telegram_token');

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${savedToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data);
        setError(null);
      } else {
        localStorage.removeItem('telegram_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('telegram_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const login = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('telegram_token');
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
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
