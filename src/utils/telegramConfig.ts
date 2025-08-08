/**
 * Конфигурация Telegram ботов для разных окружений
 */

export interface TelegramBotConfig {
  username: string;
  token: string;
  isDev: boolean;
  environment: 'development' | 'production';
}

export const getTelegramBotConfig = (): TelegramBotConfig => {
  const isProd =
    import.meta.env.VITE_NODE_ENV === 'production' ||
    import.meta.env.VITE_APP_ENV === 'production' ||
    import.meta.env.MODE === 'production';

  const username =
    import.meta.env.VITE_TELEGRAM_BOT_USERNAME ||
    (isProd ? 'YOUR_PROD_BOT_USERNAME' : 'YOUR_DEV_BOT_USERNAME');

  const token =
    import.meta.env.VITE_TELEGRAM_TOKEN ||
    (isProd ? '' : '');

  return {
    username,
    token,
    isDev: !isProd,
    environment: isProd ? 'production' : 'development',
  };
};

export const getBotUsername = (): string => {
  return getTelegramBotConfig().username;
};

export const isDevelopment = (): boolean => {
  return getTelegramBotConfig().isDev;
};

export const getBotInfo = () => {
  const config = getTelegramBotConfig();
  return {
    username: config.username,
    environment: config.environment,
    isDev: config.isDev,
    apiUrl: import.meta.env.VITE_API_URL || 'https://api.supermock.ru',
  };
};

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
      MODE: import.meta.env.MODE,
    },
  });
};
