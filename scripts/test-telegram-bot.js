#!/usr/bin/env node

// Тестовый скрипт для проверки работы Telegram бота
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем переменные окружения
dotenv.config({ path: join(__dirname, '../backend/env.backend') });

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

    // Проверяем webhook информацию
    console.log('🔗 Проверка webhook...');
    const webhookInfo = await bot.getWebhookInfo();
    console.log('✅ Webhook информация:');
    console.log(`  - URL: ${webhookInfo.url || 'Не установлен'}`);
    console.log(
      `  - Ожидающие обновления: ${webhookInfo.pending_update_count}`
    );
    console.log(
      `  - Последняя ошибка: ${webhookInfo.last_error_message || 'Нет ошибок'}`
    );
    console.log('');

    // Проверяем команды бота
    console.log('📋 Проверка команд бота...');
    const commands = await bot.getMyCommands();
    console.log('✅ Команды бота:');
    commands.forEach((cmd) => {
      console.log(`  - /${cmd.command}: ${cmd.description}`);
    });
    console.log('');

    console.log('🎉 Тест завершен успешно!');
    console.log('');
    console.log('📝 Следующие шаги:');
    console.log('1. Отправьте боту команду /start');
    console.log('2. Проверьте, что бот отвечает');
    console.log('3. Протестируйте авторизацию на сайте');
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
