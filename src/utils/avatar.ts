// Утилиты для работы с аватарками

// URL аватарки по умолчанию для dev режима
const DEFAULT_AVATAR_URL =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';

// URL аватарки для тестового пользователя
const TEST_USER_AVATAR_URL =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';

/**
 * Получает URL аватарки для пользователя
 * @param user - объект пользователя
 * @param isDevMode - флаг dev режима
 * @returns URL аватарки
 */
export const getUserAvatarUrl = (
  user: any,
  isDevMode: boolean = false
): string => {
  // Если есть фото из Telegram, используем его
  if (user?.photo_url) {
    return user.photo_url;
  }

  // В dev режиме используем аватарку по умолчанию
  if (isDevMode) {
    // Для тестового пользователя используем специальную аватарку
    if (user?.username === 'testuser' || user?.firstName === 'Test') {
      return TEST_USER_AVATAR_URL;
    }
    return DEFAULT_AVATAR_URL;
  }

  // В продакшене генерируем аватарку на основе имени
  if (user?.first_name || user?.firstName) {
    const name = user.first_name || user.firstName;
    const seed = encodeURIComponent(name);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  }

  // Fallback для неизвестного пользователя
  return DEFAULT_AVATAR_URL;
};

/**
 * Проверяет, является ли URL аватарки валидным
 * @param url - URL аватарки
 * @returns Promise<boolean>
 */
export const isValidAvatarUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Ошибка проверки аватарки:', error);
    return false;
  }
};

/**
 * Загружает аватарку из Telegram и возвращает URL
 * @param telegramUser - объект пользователя из Telegram
 * @returns Promise<string> - URL аватарки
 */
export const loadTelegramAvatar = async (
  telegramUser: any
): Promise<string> => {
  if (!telegramUser?.photo_url) {
    throw new Error('Фото пользователя не найдено в Telegram');
  }

  try {
    // Проверяем доступность аватарки
    const isValid = await isValidAvatarUrl(telegramUser.photo_url);
    if (!isValid) {
      throw new Error('Аватарка недоступна');
    }

    return telegramUser.photo_url;
  } catch (error) {
    console.error('Ошибка загрузки аватарки из Telegram:', error);
    throw error;
  }
};

/**
 * Генерирует аватарку на основе имени пользователя
 * @param name - имя пользователя
 * @returns URL сгенерированной аватарки
 */
export const generateAvatarFromName = (name: string): string => {
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

/**
 * Получает fallback текст для аватарки
 * @param user - объект пользователя
 * @returns строка для отображения в fallback аватарке
 */
export const getAvatarFallbackText = (user: any): string => {
  if (user?.first_name) {
    return user.first_name.charAt(0).toUpperCase();
  }
  if (user?.firstName) {
    return user.firstName.charAt(0).toUpperCase();
  }
  if (user?.username) {
    return user.username.charAt(0).toUpperCase();
  }
  return '?';
};

/**
 * Проверяет, находится ли приложение в dev режиме
 * @returns boolean
 */
export const isDevMode = (): boolean => {
  return import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';
};

/**
 * Создает объект пользователя с аватаркой
 * @param user - исходный объект пользователя
 * @param isDev - флаг dev режима
 * @returns объект пользователя с аватаркой
 */
export const createUserWithAvatar = (
  user: any,
  isDev: boolean = false
): any => {
  if (!user) return null;

  const avatarUrl = getUserAvatarUrl(user, isDev);

  return {
    ...user,
    photo_url: avatarUrl,
    avatarUrl, // Дублируем для совместимости
  };
};

