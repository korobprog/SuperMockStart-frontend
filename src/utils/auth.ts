// Утилиты для работы с аутентификацией

export const AUTH_TOKEN_KEY = 'authToken';
export const TELEGRAM_TOKEN_KEY = 'telegram_token';
export const USER_KEY = 'user';
export const USER_ID_KEY = 'userId';

/**
 * Получает токен из localStorage
 */
export const getStoredToken = (): string | null => {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem(TELEGRAM_TOKEN_KEY)
  );
};

/**
 * Сохраняет токен в localStorage
 */
export const setStoredToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(TELEGRAM_TOKEN_KEY, token); // Для совместимости
};

/**
 * Удаляет токен из localStorage
 */
export const removeStoredToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(TELEGRAM_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

/**
 * Получает пользователя из localStorage
 */
export const getStoredUser = (): any | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Сохраняет пользователя в localStorage
 */
export const setStoredUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (user.id) {
    localStorage.setItem(USER_ID_KEY, user.id.toString());
  }
};

/**
 * Проверяет, есть ли валидный токен
 */
export const hasValidToken = (): boolean => {
  return !!getStoredToken();
};

/**
 * Получает заголовки для авторизованных запросов
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Очищает все данные аутентификации
 */
export const clearAuthData = (): void => {
  removeStoredToken();
};

/**
 * Проверяет, истек ли токен (базовая проверка)
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // конвертируем в миллисекунды
    return Date.now() >= exp;
  } catch {
    return true; // если не можем декодировать, считаем истекшим
  }
};

// Debounce функция для предотвращения множественных одновременных запросов
let testTokenRequestPromise: Promise<any> | null = null;

export const debouncedGetTestToken = async (
  getTestTokenFn: () => Promise<any>
) => {
  // Если уже есть активный запрос, возвращаем его
  if (testTokenRequestPromise) {
    return testTokenRequestPromise;
  }

  // Создаем новый запрос
  testTokenRequestPromise = getTestTokenFn().finally(() => {
    // Очищаем ссылку после завершения запроса
    testTokenRequestPromise = null;
  });

  return testTokenRequestPromise;
};
