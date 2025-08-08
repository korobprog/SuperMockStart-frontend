// Константы для ключей localStorage
export const AUTH_TOKEN_KEY = 'authToken';
export const TELEGRAM_TOKEN_KEY = 'telegram_token';
export const EXTENDED_TOKEN_KEY = 'extended_token';
export const USER_KEY = 'user';
export const USER_ID_KEY = 'userId';

/**
 * Очищает некорректные данные из localStorage
 */
export const cleanupInvalidData = (): void => {
  try {
    const keys = [AUTH_TOKEN_KEY, TELEGRAM_TOKEN_KEY, USER_KEY, USER_ID_KEY];
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value === 'undefined' || value === 'null') {
        localStorage.removeItem(key);
        console.log(`Очищен некорректный ключ: ${key}`);
      }
    });
  } catch (error) {
    console.error('Ошибка при очистке некорректных данных:', error);
  }
};

/**
 * Получает токен из localStorage с приоритетом extended_token
 */
export const getStoredToken = (): string | null => {
  try {
    // Приоритет: extended_token > telegram_token > authToken > token
    const tokens = [
      { key: EXTENDED_TOKEN_KEY, name: 'extended_token' },
      { key: TELEGRAM_TOKEN_KEY, name: 'telegram_token' },
      { key: AUTH_TOKEN_KEY, name: 'authToken' },
      { key: 'token', name: 'token' },
    ];

    for (const { key, name } of tokens) {
      const token = localStorage.getItem(key);
      if (
        token &&
        token !== 'undefined' &&
        token !== 'null' &&
        token.trim() !== ''
      ) {
        console.log(`✅ Found valid ${name}:`, token.substring(0, 20) + '...');
        return token;
      }
    }

    console.log('❌ No valid token found in localStorage');
    return null;
  } catch (error) {
    console.error('Ошибка при получении токена из localStorage:', error);
    return null;
  }
};

/**
 * Сохраняет токен в localStorage во все ключи для совместимости
 */
export const setStoredToken = (token: string): void => {
  try {
    console.log(
      '🔍 setStoredToken called with token:',
      token.substring(0, 20) + '...'
    );
    console.log('🔍 token length:', token.length);
    console.log('🔍 token format check:', {
      isJWT: token.split('.').length === 3,
      parts: token.split('.').length,
    });

    if (
      token &&
      token !== 'undefined' &&
      token !== 'null' &&
      token.trim() !== ''
    ) {
      // Сохраняем во все ключи для максимальной совместимости
      localStorage.setItem(EXTENDED_TOKEN_KEY, token);
      localStorage.setItem(TELEGRAM_TOKEN_KEY, token);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem('token', token);
      console.log('✅ Token saved to all localStorage keys');
    } else {
      // Если токен некорректный, удаляем из localStorage
      removeStoredToken();
      console.log('❌ Invalid token, removed from localStorage');
    }
  } catch (error) {
    console.error('Ошибка при сохранении токена в localStorage:', error);
    removeStoredToken();
  }
};

/**
 * Удаляет токен из localStorage
 */
export const removeStoredToken = (): void => {
  localStorage.removeItem(EXTENDED_TOKEN_KEY);
  localStorage.removeItem(TELEGRAM_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_ID_KEY);
  console.log('✅ All tokens removed from localStorage');
};

/**
 * Проверяет валидность токена
 */
export const isValidToken = (token: string): boolean => {
  if (
    !token ||
    token === 'undefined' ||
    token === 'null' ||
    token.trim() === ''
  ) {
    return false;
  }

  // Проверяем формат JWT токена
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  return true;
};

/**
 * Получает пользователя из localStorage
 */
export const getStoredUser = (): any => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error('Ошибка при получении пользователя из localStorage:', error);
    return null;
  }
};

/**
 * Сохраняет пользователя в localStorage
 */
export const setStoredUser = (user: any): void => {
  try {
    if (user && typeof user === 'object') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (user.id) {
        localStorage.setItem(USER_ID_KEY, user.id.toString());
      }
      console.log('✅ User saved to localStorage');
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(USER_ID_KEY);
      console.log('❌ Invalid user, removed from localStorage');
    }
  } catch (error) {
    console.error('Ошибка при сохранении пользователя в localStorage:', error);
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
  console.warn('getAuthHeaders is deprecated. Using cookie-based auth; include credentials in fetch instead.');
  return {};
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
