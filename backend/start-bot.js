import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Загружаем переменные окружения в зависимости от режима
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  dotenv.config({ path: './env.backend' });
  console.log('🔧 Starting DEVELOPMENT bot...');
} else {
  dotenv.config({ path: './env.prod' });
  console.log('🔧 Starting PRODUCTION bot...');
}

const token = process.env.TELEGRAM_TOKEN;
const botUsername = process.env.BOT_USERNAME;

console.log('🤖 Bot Configuration:');
console.log('  - Environment:', process.env.NODE_ENV || 'development');
console.log('  - Token length:', token ? token.length : 0);
console.log('  - Bot username:', botUsername);

if (!token) {
  console.error('❌ TELEGRAM_TOKEN not found in environment');
  process.exit(1);
}

// Создаем бота с улучшенной обработкой
const bot = new TelegramBot(token, {
  polling: isDevelopment, // polling только в development
  webHook: !isDevelopment
    ? {
        port: 8443,
        host: '0.0.0.0',
      }
    : false,
  polling_options: isDevelopment
    ? {
        timeout: 10,
        limit: 100,
        allowed_updates: ['message'],
      }
    : undefined,
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
      const chatId = msg.chat.id;
      const user = msg.from;
      const userName = user?.first_name || user?.username || 'пользователь';
      const text = msg.text || '';

      // Проверяем, содержит ли команда параметры авторизации
      if (text.startsWith('/start auth_')) {
        const authId = text.replace('/start auth_', '');
        console.log(`🔐 Processing auth request with ID: ${authId}`);

        // Отправляем сообщение об успешной авторизации
        await bot.sendMessage(
          chatId,
          `✅ Авторизация успешна!\n\nДобро пожаловать, ${userName}!\n\nТеперь вы можете использовать приложение SuperMock.\n\n🌐 Среда: ${
            isDevelopment ? 'development' : 'production'
          }\n${
            isDevelopment
              ? '⚠️ Используйте тестовые токены'
              : '✅ Безопасная авторизация'
          }`
        );

        console.log(`User ${user.id} (${userName}) authenticated via bot`);
      } else {
        // Обычное приветствие
        await bot.sendMessage(
          chatId,
          `👋 Привет, ${userName}!\n\nЭто бот для авторизации в приложении SuperMock.\n\nДля авторизации перейдите в приложение и нажмите кнопку "Войти через Telegram".\n\n🌐 Среда: ${
            isDevelopment ? 'development' : 'production'
          }\n${
            isDevelopment
              ? '⚠️ Используйте тестовые токены'
              : '✅ Безопасная авторизация'
          }`
        );
      }

      // ВСЕГДА отправляем кнопку для авторизации
      console.log('🔗 Sending auth button to chat:', chatId);

      if (isDevelopment) {
        // В режиме разработки отправляем ссылку на bot-auth
        const devUrl = `http://localhost:5173/bot-auth?userId=${chatId}`;

        await bot.sendMessage(
          chatId,
          `🔗 Для авторизации в режиме разработки:\n\n1️⃣ Откройте приложение: http://localhost:5173\n2️⃣ Перейдите на страницу: ${devUrl}\n\n🌐 Среда: development\n⚠️ В режиме разработки используйте тестовые токены`
        );
      } else {
        // В продакшне отправляем кнопку для авторизации через Login Widget
        const baseUrl = 'https://supermock.ru';
        const authUrl = `${baseUrl}/auth-callback`;

        // Создаем inline keyboard с LoginUrl объектом
        const keyboard = {
          inline_keyboard: [
            [
              {
                text: '🔐 Авторизоваться в приложении',
                login_url: {
                  url: authUrl,
                  forward_text: 'Авторизоваться в SuperMock',
                  bot_username: botUsername,
                  request_write_access: true,
                },
              },
            ],
            [
              {
                text: '📱 Открыть в Telegram',
                web_app: { url: authUrl },
              },
            ],
          ],
        };

        await bot.sendMessage(
          chatId,
          `🔗 Добро пожаловать в SuperMock!\n\nНажмите кнопку ниже для авторизации в приложении:\n\n🌐 Среда: production\n✅ Безопасная авторизация через Telegram`,
          { reply_markup: keyboard }
        );
      }

      console.log('✅ Auth button sent successfully to chat:', chatId);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Попробуем отправить простое сообщение без кнопки
      try {
        await bot.sendMessage(
          msg.chat.id,
          '🔗 Для авторизации перейдите в приложение SuperMock и нажмите кнопку "Войти через Telegram".'
        );
      } catch (fallbackError) {
        console.error('❌ Error sending fallback message:', fallbackError);
      }
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

console.log('🤖 Bot started successfully!');
console.log(
  `🌐 Mode: ${isDevelopment ? 'Development (polling)' : 'Production (webhook)'}`
);
console.log('📋 To test:');
if (isDevelopment) {
  console.log('1. Go to http://localhost:5173/bot-auth-test');
  console.log('2. Click "Войти через Telegram бота"');
  console.log('3. Send /start to the bot');
  console.log('4. Check if the bot sends an auth message');
} else {
  console.log('1. Go to https://supermock.ru/bot-auth-test');
  console.log('2. Click "Войти через Telegram бота"');
  console.log('3. Send /start to the bot');
  console.log('4. Check if the bot sends an auth button');
}
