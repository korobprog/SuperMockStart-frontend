/**
 * Конфигурация Telegram ботов для разных окружений
 */

export interface TelegramBotConfig {
  username: string;
  token: string;
  isDev: boolean;
  environment: 'development' | 'production';
}

/**
 * Получает конфигурацию бота в зависимости от окружения
 */
export const getTelegramBotConfig = (): TelegramBotConfig => {
  // Проверяем production окружение
  const isProd =
    import.meta.env.VITE_NODE_ENV === 'production' ||
    import.meta.env.VITE_APP_ENV === 'production';

  // Если явно указан production, используем prod бота
  if (isProd) {
    return {
      username: 'SuperMock_bot',
      token:
        import.meta.env.VITE_TELEGRAM_TOKEN_PROD ||
        '8464088869:AAFcZb7HmYQJa6vaYjfTDCjfr187p9hhk2o',
      isDev: false,
      environment: 'production',
    };
  }

  // По умолчанию используем dev бота
  return {
    username: 'SuperMockTest_bot',
    token:
      import.meta.env.VITE_TELEGRAM_TOKEN_DEV ||
      '8213869730:AAHIR0oUPS-sfyMvwzStYapJYc7YH4lMlS4',
    isDev: true,
    environment: 'development',
  };
};

/**
 * Получает username бота для текущего окружения
 */
export const getBotUsername = (): string => {
  return getTelegramBotConfig().username;
};

/**
 * Проверяет, используется ли dev окружение
 */
export const isDevelopment = (): boolean => {
  return getTelegramBotConfig().isDev;
};

/**
 * Получает информацию о текущем боте
 */
export const getBotInfo = () => {
  const config = getTelegramBotConfig();
  return {
    username: config.username,
    environment: config.environment,
    isDev: config.isDev,
    apiUrl: import.meta.env.VITE_API_URL || 'https://api.supermock.ru',
  };
};

/**
 * Логирует информацию о текущей конфигурации
 */
export const logBotConfig = () => {
  const config = getTelegramBotConfig();
  console.log('🤖 Telegram Bot Configuration:', {
    username: config.username,
    environment: config.environment,
    isDev: config.isDev,
    apiUrl: import.meta.env.VITE_API_URL || 'https://api.supermock.ru',
    envVars: {
      DEV: import.meta.env.DEV,
      VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
      VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
    },
  });
};
