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

console.log('🔄 Сброс Telegram бота...');
console.log(`📋 Токен: ${botToken.substring(0, 10)}...`);
console.log('');

// Создаем бота без polling для проверки
const bot = new TelegramBot(botToken, { polling: false });

async function resetBot() {
  try {
    // Получаем информацию о боте
    console.log('📊 Получение информации о боте...');
    const botInfo = await bot.getMe();
    console.log('✅ Информация о боте получена:');
    console.log(`  - ID: ${botInfo.id}`);
    console.log(`  - Имя: ${botInfo.first_name}`);
    console.log(`  - Username: @${botInfo.username}`);
    console.log('');

    // Очищаем webhook
    console.log('🧹 Очистка webhook...');
    try {
      await bot.deleteWebhook({ drop_pending_updates: true });
      console.log('✅ Webhook очищен');
    } catch (webhookError) {
      console.log('⚠️ Не удалось очистить webhook:', webhookError.message);
    }
    console.log('');

    console.log('🎉 Сброс завершен успешно!');
    console.log('✅ Бот готов к перезапуску');
  } catch (error) {
    console.error('❌ Ошибка при сбросе бота:', error.message);
    if (error.code === 'ETELEGRAM') {
      console.error('🔍 Код ошибки Telegram:', error.code);
      console.error('📝 Описание:', error.description);
    }
    process.exit(1);
  }
}

resetBot();
