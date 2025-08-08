import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;

console.log('🔧 Testing Telegram bot...');
console.log('Token length:', token ? token.length : 0);

if (!token) {
  console.error('❌ TELEGRAM_TOKEN not found in environment');
  process.exit(1);
}

// Создаем бота с обработкой конфликтов
const bot = new TelegramBot(token, {
  polling: true,
  // Добавляем параметры для избежания конфликтов
  polling_options: {
    timeout: 10,
    limit: 100,
    allowed_updates: ['message'],
  },
});

// Обработчик сообщений
bot.on('message', async (msg) => {
  console.log('📱 Received message:', {
    chatId: msg.chat.id,
    userId: msg.from?.id,
    username: msg.from?.username,
    firstName: msg.from?.first_name,
    text: msg.text,
  });

  if (msg.text && msg.text.startsWith('/start')) {
    console.log('🔐 Processing /start command');

    try {
      // Отправляем приветственное сообщение
      await bot.sendMessage(
        msg.chat.id,
        `👋 Привет, ${
          msg.from?.first_name || 'пользователь'
        }!\n\nЭто тестовый бот для отладки.`
      );

      // Отправляем простое сообщение с инструкцией
      await bot.sendMessage(
        msg.chat.id,
        '🔗 Для авторизации перейдите в приложение SuperMock и нажмите кнопку "Войти через Telegram".'
      );

      console.log('✅ Messages sent successfully');
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  }
});

// Обработчик ошибок
bot.on('error', (error) => {
  console.error('🤖 Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('🤖 Polling error:', error);

  // При конфликте 409, останавливаем бота
  if (error.code === 'ETELEGRAM' && error.message.includes('409')) {
    console.log('🤖 Conflict detected, stopping bot...');
    bot.stopPolling();
    process.exit(0);
  }
});

console.log('🤖 Bot started in polling mode');
console.log('Send /start to test the bot');

// Останавливаем бота через 30 секунд
setTimeout(() => {
  console.log('🛑 Stopping bot...');
  bot.stopPolling();
  process.exit(0);
}, 30000);
