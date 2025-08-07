// Утилиты для работы с аутентификацией

export const AUTH_TOKEN_KEY = 'authToken';
export const TELEGRAM_TOKEN_KEY = 'telegram_token';
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
 * Получает токен из localStorage
 */
export const getStoredToken = (): string | null => {
  try {
    const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const telegramToken = localStorage.getItem(TELEGRAM_TOKEN_KEY);

    // Проверяем, что токен не является 'undefined' или 'null'
    if (authToken && authToken !== 'undefined' && authToken !== 'null') {
      return authToken;
    }

    if (
      telegramToken &&
      telegramToken !== 'undefined' &&
      telegramToken !== 'null'
    ) {
      return telegramToken;
    }

    return null;
  } catch (error) {
    console.error('Ошибка при получении токена из localStorage:', error);
    return null;
  }
};

/**
 * Сохраняет токен в localStorage
 */
export const setStoredToken = (token: string): void => {
  try {
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(TELEGRAM_TOKEN_KEY, token); // Для совместимости
    } else {
      // Если токен некорректный, удаляем из localStorage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(TELEGRAM_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Ошибка при сохранении токена в localStorage:', error);
    // Очищаем некорректные данные
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(TELEGRAM_TOKEN_KEY);
  }
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
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }

    const parsedUser = JSON.parse(userStr);

    // Дополнительная проверка на валидность объекта пользователя
    if (!parsedUser || typeof parsedUser !== 'object') {
      console.error('Некорректный объект пользователя:', parsedUser);
      localStorage.removeItem(USER_KEY);
      return null;
    }

    // Проверяем наличие обязательных полей
    if (!parsedUser.id || !parsedUser.first_name) {
      console.error(
        'Объект пользователя не содержит обязательные поля:',
        parsedUser
      );
      localStorage.removeItem(USER_KEY);
      return null;
    }

    return parsedUser;
  } catch (error) {
    console.error('Ошибка при парсинге пользователя из localStorage:', error);
    // Очищаем некорректные данные
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

/**
 * Сохраняет пользователя в localStorage
 */
export const setStoredUser = (user: any): void => {
  try {
    if (user && user !== undefined && user !== null) {
      // Проверяем валидность объекта пользователя
      if (typeof user !== 'object') {
        console.error('Некорректный тип пользователя:', typeof user);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_ID_KEY);
        return;
      }

      // Проверяем наличие обязательных полей
      if (!user.id || !user.first_name) {
        console.error(
          'Объект пользователя не содержит обязательные поля:',
          user
        );
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_ID_KEY);
        return;
      }

      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (user.id) {
        localStorage.setItem(USER_ID_KEY, user.id.toString());
      }
    } else {
      // Если пользователь null или undefined, удаляем из localStorage
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(USER_ID_KEY);
    }
  } catch (error) {
    console.error('Ошибка при сохранении пользователя в localStorage:', error);
    // Очищаем некорректные данные
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_ID_KEY);
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
