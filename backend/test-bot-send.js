import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const token = '8464088869:AAFcZb7HmYQJa6vaYjfTDCjfr187p9hhk2o';
const testUserId = 250932; // Ваш ID пользователя

console.log('🤖 Testing bot message sending...');
console.log(`Token length: ${token ? token.length : 0}`);
console.log(`Test user ID: ${testUserId}`);

// Создаем бота без polling
const bot = new TelegramBot(token, {
  polling: false,
  webHook: false,
});

async function testSendMessage() {
  try {
    console.log('📤 Attempting to send test message...');

    const result = await bot.sendMessage(
      testUserId,
      '🧪 Тестовое сообщение от бота SuperMock\n\nЭто сообщение отправлено для проверки работы бота.'
    );

    console.log('✅ Message sent successfully!');
    console.log('Message ID:', result.message_id);
    console.log('Chat ID:', result.chat.id);
  } catch (error) {
    console.error('❌ Error sending message:', error.message);

    if (error.code === 'ETELEGRAM') {
      console.error('Telegram API Error Details:', error.response);
    }
  }
}

testSendMessage();
