import { useCallback, useEffect, useRef, useState } from 'react';
import { getBotUsername } from '../utils/telegramConfig';

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
  login: () => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function getSessionUser(): Promise<TelegramUser | null> {
  const response = await fetch(`${API_URL}/api/auth/session`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) return null;
  if (data?.data?.authenticated && data?.data?.user) return data.data.user as TelegramUser;
  return null;
}

async function exchangeTelegramInitData(initData: string) {
  const response = await fetch(`${API_URL}/api/auth/telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ initData }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || 'Telegram authentication failed');
  }
  // Cookie is set by server; return session user
  const user = await getSessionUser();
  if (!user) throw new Error('Failed to establish session');
  return user;
}

// Opens Telegram to start the login process when not inside the Mini App
function openTelegramAuthDeepLink() {
  const bot = getBotUsername() || 'SuperMock_bot';
  const returnUrl = window.location.href;

  const tgDeepLink = `tg://resolve?domain=${bot}&start=${encodeURIComponent(returnUrl)}`;
  const webLink = `https://t.me/${bot}?start=${encodeURIComponent(returnUrl)}`;

  const opened = window.open(tgDeepLink, '_blank');
  if (!opened) {
    window.open(webLink, '_blank');
  }
}

export const useTelegramAuth = (): UseTelegramAuthReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const checkingRef = useRef<boolean>(false);

  const setAuth = useCallback((nextUser: TelegramUser) => {
    setUser(nextUser);
    setIsAuthenticated(true);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const trySilentTelegramLogin = useCallback(async () => {
    const tg = (window as any)?.Telegram?.WebApp;
    const initData: string | undefined = tg?.initData;
    if (!tg || !initData || initData.length === 0) return false;

    const u = await exchangeTelegramInitData(initData);
    setAuth(u);
    return true;
  }, [setAuth]);

  const checkAuthStatus = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const u = await getSessionUser();
      if (u) {
        setAuth(u);
      } else {
        // Attempt silent login if inside Mini App
        const didLogin = await trySilentTelegramLogin();
        if (!didLogin) {
          clearAuth();
        }
      }
    } catch (e) {
      console.warn('Auth check failed', e);
      clearAuth();
      setError(e instanceof Error ? e.message : 'Auth check failed');
    } finally {
      setLoading(false);
      checkingRef.current = false;
    }
  }, [clearAuth, trySilentTelegramLogin, setAuth]);

  const login = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const didLogin = await trySilentTelegramLogin();
      if (!didLogin) {
        openTelegramAuthDeepLink();
        throw new Error('Откройте бота Telegram для входа через Mini App');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [trySilentTelegramLogin]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    clearAuth();
  }, [clearAuth]);

  useEffect(() => {
    checkAuthStatus();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAuthStatus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [checkAuthStatus]);

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
