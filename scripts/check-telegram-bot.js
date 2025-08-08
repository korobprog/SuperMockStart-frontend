#!/usr/bin/env node

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const botToken = process.env.TELEGRAM_TOKEN;

if (!botToken) {
  console.error('❌ TELEGRAM_TOKEN не найден в переменных окружения');
  process.exit(1);
}

console.log('🔍 Проверка статуса Telegram бота...');
console.log(`📋 Токен: ${botToken.substring(0, 10)}...`);
console.log('');

// Создаем бота без polling для проверки
const bot = new TelegramBot(botToken, { polling: false });

async function checkBotStatus() {
  try {
    // Получаем информацию о боте
    console.log('📊 Получение информации о боте...');
    const botInfo = await bot.getMe();
    console.log('✅ Информация о боте получена:');
    console.log(`  - ID: ${botInfo.id}`);
    console.log(`  - Имя: ${botInfo.first_name}`);
    console.log(`  - Username: @${botInfo.username}`);
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
    if (commands && commands.length > 0) {
      commands.forEach((cmd) => {
        console.log(`  - /${cmd.command}: ${cmd.description}`);
      });
    } else {
      console.log('  - Команды не настроены');
    }
    console.log('');

    console.log('🎉 Проверка завершена успешно!');
    console.log('✅ Бот готов к работе');
  } catch (error) {
    console.error('❌ Ошибка при проверке бота:', error.message);
    if (error.code === 'ETELEGRAM') {
      console.error('🔍 Код ошибки Telegram:', error.code);
      console.error('📝 Описание:', error.description);
    }
    process.exit(1);
  }
}

checkBotStatus();
