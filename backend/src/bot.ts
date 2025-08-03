import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { TelegramBotService } from './services/telegramBotService.js';

// Загружаем переменные окружения
dotenv.config();

const botToken = process.env.TELEGRAM_TOKEN;
const botUsername = process.env.BOT_USERNAME || 'SuperMock_bot';

if (!botToken) {
  console.error('TELEGRAM_TOKEN не найден в переменных окружения');
  process.exit(1);
}

// Инициализируем бота с polling
const bot = new TelegramBot(botToken, { polling: true });

console.log(`🤖 Запуск Telegram бота: @${botUsername}`);

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    const user = msg.from;

    if (!user) {
      await bot.sendMessage(
        chatId,
        'Ошибка: не удалось получить информацию о пользователе'
      );
      return;
    }

    // Проверяем, содержит ли команда параметры авторизации
    if (text.startsWith('/start auth_')) {
      const authParams = text.replace('/start auth_', '');
      const [userId, timestamp] = authParams.split('_');

      // Проверяем, что запрос не старше 5 минут
      const requestTime = parseInt(timestamp);
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (currentTime - requestTime > fiveMinutes) {
        await bot.sendMessage(
          chatId,
          'Ссылка для авторизации устарела. Попробуйте еще раз.'
        );
        return;
      }

      // Отправляем сообщение об успешной авторизации
      await bot.sendMessage(
        chatId,
        `✅ Авторизация успешна!\n\nДобро пожаловать, ${user.first_name}!\n\nТеперь вы можете использовать приложение SuperMock.`
      );

      console.log(`User ${user.id} (${user.first_name}) authenticated via bot`);
    } else {
      // Обычное приветствие
      await bot.sendMessage(
        chatId,
        `👋 Привет, ${user.first_name}!\n\nЭто бот для авторизации в приложении SuperMock.\n\nДля авторизации перейдите в приложение и нажмите кнопку "Войти через Telegram".`
      );
    }
  } catch (error) {
    console.error('Error handling start command:', error);
  }
});

// Обработчик команды /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(
    chatId,
    `🤖 Помощь по боту SuperMock\n\n` +
      `Команды:\n` +
      `/start - Начать работу с ботом\n` +
      `/help - Показать эту справку\n\n` +
      `Для авторизации в приложении:\n` +
      `1. Перейдите в приложение SuperMock\n` +
      `2. Нажмите кнопку "Войти через Telegram"\n` +
      `3. Выберите авторизацию через бота\n` +
      `4. Следуйте инструкциям`
  );
});

// Обработчик команды /info
bot.onText(/\/info/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;

  if (user) {
    await bot.sendMessage(
      chatId,
      `ℹ️ Информация о пользователе:\n\n` +
        `ID: ${user.id}\n` +
        `Имя: ${user.first_name} ${user.last_name || ''}\n` +
        `Username: @${user.username || 'не указан'}\n` +
        `Язык: ${user.language_code || 'не указан'}`
    );
  }
});

// Обработчик ошибок
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Получен SIGINT, останавливаем бота...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Получен SIGTERM, останавливаем бота...');
  bot.stopPolling();
  process.exit(0);
});

console.log('✅ Бот запущен и готов к работе!');
console.log('📱 Отправьте /start для начала работы');
