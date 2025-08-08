import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const botUsername = process.env.BOT_USERNAME;

console.log('🔧 Testing Telegram bot...');
console.log('Token length:', token ? token.length : 0);
console.log('Bot username:', botUsername);

if (!token) {
  console.error('❌ TELEGRAM_TOKEN not found in environment');
  process.exit(1);
}

// Создаем бота
const bot = new TelegramBot(token, { polling: true });

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

      // Отправляем кнопку авторизации
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: '🔐 Авторизоваться в приложении',
              login_url: {
                url: 'https://supermock.ru/auth-callback',
                forward_text: 'Авторизоваться в SuperMock',
                bot_username: botUsername,
                request_write_access: true,
              },
            },
          ],
          [
            {
              text: '📱 Открыть в Telegram',
              web_app: { url: 'https://supermock.ru/auth-callback' },
            },
          ],
        ],
      };

      await bot.sendMessage(
        msg.chat.id,
        '🔗 Нажмите кнопку ниже для авторизации:',
        { reply_markup: keyboard }
      );

      console.log('✅ Auth button sent successfully');
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
});

console.log('🤖 Bot started in polling mode');
console.log('Send /start to test the bot');
