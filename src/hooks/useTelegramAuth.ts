import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  setStoredUser,
  getStoredUser,
} from '../utils/auth';
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

async function verifyTokenOnServer(token: string) {
  const response = await fetch(`${API_URL}/api/auth/verify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || 'Token verification failed');
  }
  const user = data?.data || data?.user || null;
  return user as TelegramUser | null;
}

async function exchangeTelegramInitData(initData: string) {
  const response = await fetch(`${API_URL}/api/auth/telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || 'Telegram authentication failed');
  }
  const token = data?.data?.token || data?.token;
  const user = data?.data?.user || data?.user;
  if (!token || !user) {
    throw new Error('Invalid auth response');
  }
  return { token, user } as { token: string; user: TelegramUser };
}

// Opens Telegram to start the login process when not inside the Mini App
function openTelegramAuthDeepLink() {
  const bot = getBotUsername() || 'SuperMock_bot';
  const returnUrl = window.location.href;

  // Prefer deep link for installed Telegram apps, fallback to web link
  const tgDeepLink = `tg://resolve?domain=${bot}&start=${encodeURIComponent(returnUrl)}`;
  const webLink = `https://t.me/${bot}?start=${encodeURIComponent(returnUrl)}`;

  // Try to open the deep link first; if blocked or no handler, open web link
  const opened = window.open(tgDeepLink, '_blank');
  if (!opened) {
    window.open(webLink, '_blank');
  }
}

export const useTelegramAuth = (): UseTelegramAuthReturn => {
  const [user, setUser] = useState<TelegramUser | null>(() => getStoredUser());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!getStoredToken()
  );
  const checkingRef = useRef<boolean>(false);

  const setAuth = useCallback((token: string, nextUser: TelegramUser) => {
    setStoredToken(token);
    setStoredUser(nextUser);
    setUser(nextUser);
    setIsAuthenticated(true);
  }, []);

  const clearAuth = useCallback(() => {
    removeStoredToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const trySilentTelegramLogin = useCallback(async () => {
    // Works only inside Telegram WebApp
    const tg = (window as any)?.Telegram?.WebApp;
    const initData: string | undefined = tg?.initData;
    if (!tg || !initData || initData.length === 0) return false;

    const { token, user } = await exchangeTelegramInitData(initData);
    setAuth(token, user);
    return true;
  }, [setAuth]);

  const checkAuthStatus = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const token = getStoredToken();
      if (token) {
        // Verify existing token
        const verifiedUser = await verifyTokenOnServer(token);
        if (verifiedUser) {
          setUser(verifiedUser);
          setIsAuthenticated(true);
          setLoading(false);
          checkingRef.current = false;
          return;
        }
      }

      // No token or invalid → attempt silent Telegram login
      const didLogin = await trySilentTelegramLogin();
      if (!didLogin) {
        clearAuth();
      }
    } catch (e) {
      console.warn('Auth check failed, clearing auth and waiting for user action', e);
      clearAuth();
      setError(e instanceof Error ? e.message : 'Auth check failed');
    } finally {
      setLoading(false);
      checkingRef.current = false;
    }
  }, [clearAuth, trySilentTelegramLogin]);

  const login = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First try silent login (Mini App)
      const didLogin = await trySilentTelegramLogin();
      if (!didLogin) {
        // Fallback: open Telegram bot to start login flow
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

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  // Initial check on mount and when Telegram confirms user (Mini App returns focus)
  useEffect(() => {
    checkAuthStatus();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Re-check when returning to the app after Telegram confirmation
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
