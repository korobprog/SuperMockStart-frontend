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
  isInTelegram: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function getSessionUser(): Promise<TelegramUser | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/session`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.success === false) return null;
    if (data?.data?.authenticated && data?.data?.user) return data.data.user as TelegramUser;
    return null;
  } catch (error) {
    console.warn('Failed to get session user:', error);
    return null;
  }
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

// Check if we're inside Telegram Mini App
function isInTelegramMiniApp(): boolean {
  try {
    return !!(
      window.Telegram?.WebApp &&
      window.Telegram.WebApp.initData &&
      window.Telegram.WebApp.initData.length > 0
    );
  } catch {
    return false;
  }
}

// Opens Telegram to start the login process when not inside the Mini App
function openTelegramAuthDeepLink() {
  const bot = getBotUsername() || 'SuperMock_bot';
  const returnUrl = window.location.href;

  // First try the deep link for the Telegram app
  const tgDeepLink = `tg://resolve?domain=${bot}&start=${encodeURIComponent(returnUrl)}`;
  
  try {
    // For mobile browsers, try opening the deep link
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.location.href = tgDeepLink;
      
      // Fallback to web version after a short delay
      setTimeout(() => {
        const webLink = `https://t.me/${bot}?start=${encodeURIComponent(returnUrl)}`;
        window.open(webLink, '_blank');
      }, 2000);
    } else {
      // For desktop, use web version directly
      const webLink = `https://t.me/${bot}?start=${encodeURIComponent(returnUrl)}`;
      window.open(webLink, '_blank');
    }
  } catch (error) {
    console.error('Failed to open Telegram link:', error);
    // Ultimate fallback - redirect to login page
    window.location.href = '/login';
  }
}

export const useTelegramAuth = (): UseTelegramAuthReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInTelegram, setIsInTelegram] = useState<boolean>(false);
  const checkingRef = useRef<boolean>(false);

  const setAuth = useCallback((nextUser: TelegramUser) => {
    setUser(nextUser);
    setIsAuthenticated(true);
    setError(null);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const trySilentTelegramLogin = useCallback(async () => {
    const tg = (window as any)?.Telegram?.WebApp;
    const initData: string | undefined = tg?.initData;
    
    if (!tg || !initData || initData.length === 0) {
      console.log('No Telegram WebApp data available for silent login');
      return false;
    }

    try {
      console.log('Attempting silent Telegram login...');
      const u = await exchangeTelegramInitData(initData);
      setAuth(u);
      console.log('Silent Telegram login successful');
      return true;
    } catch (error) {
      console.warn('Silent Telegram login failed:', error);
      return false;
    }
  }, [setAuth]);

  const checkAuthStatus = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Check if we're in Telegram Mini App
      const inTelegram = isInTelegramMiniApp();
      setIsInTelegram(inTelegram);

      // First check for existing session
      const u = await getSessionUser();
      if (u) {
        setAuth(u);
      } else if (inTelegram) {
        // If in Telegram Mini App, attempt silent login
        const didLogin = await trySilentTelegramLogin();
        if (!didLogin) {
          clearAuth();
        }
      } else {
        clearAuth();
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
      const inTelegram = isInTelegramMiniApp();
      
      if (inTelegram) {
        // If we're in Telegram Mini App, try silent login
        const didLogin = await trySilentTelegramLogin();
        if (!didLogin) {
          throw new Error('Не удалось авторизоваться через Telegram Mini App. Попробуйте перезапустить приложение.');
        }
      } else {
        // If we're in a browser, guide user to Telegram
        openTelegramAuthDeepLink();
        throw new Error('Для входа откройте приложение в Telegram или используйте страницу входа');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Login failed';
      setError(errorMessage);
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
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
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
    isInTelegram,
    login,
    logout,
    checkAuthStatus,
  };
};
