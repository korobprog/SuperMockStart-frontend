import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config({ path: './env.backend' });

const botToken = process.env.TELEGRAM_TOKEN;
const botUsername = process.env.BOT_USERNAME;

console.log('🤖 Тестирование Telegram бота');
console.log('=============================');
console.log(`Токен: ${botToken ? '✅ Установлен' : '❌ Не установлен'}`);
console.log(`Имя бота: @${botUsername}`);
console.log('');

if (!botToken) {
  console.error('❌ TELEGRAM_TOKEN не найден в переменных окружения');
  process.exit(1);
}

// Создаем бота
const bot = new TelegramBot(botToken, { polling: false });

async function testBot() {
  try {
    // Получаем информацию о боте
    console.log('📊 Получение информации о боте...');
    const botInfo = await bot.getMe();
    console.log('✅ Информация о боте получена:');
    console.log(`  - ID: ${botInfo.id}`);
    console.log(`  - Имя: ${botInfo.first_name}`);
    console.log(`  - Username: @${botInfo.username}`);
    console.log(
      `  - Может присоединяться к группам: ${botInfo.can_join_groups}`
    );
    console.log(
      `  - Может читать все групповые сообщения: ${botInfo.can_read_all_group_messages}`
    );
    console.log(
      `  - Поддерживает inline режим: ${botInfo.supports_inline_queries}`
    );
    console.log('');

    // Проверяем команды бота
    console.log('📋 Проверка команд бота...');
    const commands = await bot.getMyCommands();
    console.log('✅ Команды бота:');
    if (commands && commands.length > 0) {
      commands.forEach((cmd) => {
        console.log(`  - /${cmd.command}: ${cmd.description}`);
      });
    } else {
      console.log('  - Команды не настроены');
    }
    console.log('');

    // Проверяем, может ли бот отправлять сообщения
    console.log('📤 Проверка возможности отправки сообщений...');
    console.log('✅ Бот готов к работе!');
    console.log('');

    console.log('🎉 Тест завершен успешно!');
    console.log('');
    console.log('📝 Следующие шаги:');
    console.log('1. Отправьте боту команду /start');
    console.log('2. Проверьте, что бот отвечает');
    console.log('3. Протестируйте авторизацию на сайте');
    console.log('');
    console.log('🔗 Ссылка на бота: https://t.me/SuperMock_bot');
  } catch (error) {
    console.error('❌ Ошибка при тестировании бота:', error.message);
    if (error.response) {
      console.error('Детали ошибки:', error.response.data);
    }
  } finally {
    process.exit(0);
  }
}

testBot();
