import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const botUsername = process.env.BOT_USERNAME;

console.log('🔧 Fixing bot authentication...');
console.log('Token length:', token ? token.length : 0);
console.log('Bot username:', botUsername);

if (!token) {
  console.error('❌ TELEGRAM_TOKEN not found in environment');
  process.exit(1);
}

// Создаем бота с улучшенной обработкой
const bot = new TelegramBot(token, {
  polling: true,
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
          `✅ Авторизация успешна!\n\nДобро пожаловать, ${userName}!\n\nТеперь вы можете использовать приложение SuperMock.\n\n🌐 Среда: development\n⚠️ Используйте тестовые токены`
        );

        console.log(`User ${user.id} (${userName}) authenticated via bot`);
      } else {
        // Обычное приветствие
        await bot.sendMessage(
          chatId,
          `👋 Привет, ${userName}!\n\nЭто бот для авторизации в приложении SuperMock.\n\nДля авторизации перейдите в приложение и нажмите кнопку "Войти через Telegram".\n\n🌐 Среда: development\n⚠️ Используйте тестовые токены`
        );
      }

      // ВСЕГДА отправляем кнопку для авторизации
      console.log('🔗 Sending auth button to chat:', chatId);

      // В режиме разработки отправляем ссылку на bot-auth
      const devUrl = `http://localhost:5173/bot-auth?userId=${chatId}`;

      await bot.sendMessage(
        chatId,
        `🔗 Для авторизации в режиме разработки:\n\n1️⃣ Откройте приложение: http://localhost:5173\n2️⃣ Перейдите на страницу: ${devUrl}\n\n🌐 Среда: development\n⚠️ В режиме разработки используйте тестовые токены`
      );

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

console.log('🤖 Bot started in polling mode');
console.log('Send /start to test the bot');
console.log('To test auth:');
console.log('1. Go to http://localhost:5173/bot-auth-test');
console.log('2. Click "Войти через Telegram бота"');
console.log('3. Send /start to the bot');
console.log('4. Check if the bot sends an auth message');
