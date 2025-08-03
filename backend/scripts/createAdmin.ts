#!/usr/bin/env tsx

/**
 * Скрипт для создания администратора по умолчанию
 * Использование: npm run create-admin
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
  telegramId: '123456789', // Тестовый Telegram ID
  username: 'admin',
  firstName: 'Admin',
  lastName: 'User',
};

async function createAdmin() {
  try {
    console.log('🚀 Создание администратора по умолчанию...');

    // Проверяем, существует ли уже администратор
    const existingAdmin = await prisma.user.findUnique({
      where: { telegramId: DEFAULT_ADMIN.telegramId },
    });

    if (existingAdmin) {
      console.log(
        '⚠️  Администратор с Telegram ID',
        DEFAULT_ADMIN.telegramId,
        'уже существует'
      );
      console.log('✅ Пользователь уже существует');
      return;
    }

    // Создаем нового администратора
    const admin = await prisma.user.create({
      data: {
        telegramId: DEFAULT_ADMIN.telegramId,
        username: DEFAULT_ADMIN.username,
        firstName: DEFAULT_ADMIN.firstName,
        lastName: DEFAULT_ADMIN.lastName,
        status: 'INTERVIEWER', // По умолчанию INTERVIEWER
      },
    });

    console.log('✅ Администратор успешно создан!');
    console.log('📱 Telegram ID:', admin.telegramId);
    console.log('👤 Username:', admin.username);
    console.log('👤 Имя:', admin.firstName, admin.lastName);
    console.log('🆔 ID:', admin.id);
    console.log('📅 Создан:', admin.createdAt);
    console.log('');
    console.log(
      '⚠️  ВАЖНО: Это тестовый администратор. Для продакшена используйте реальный Telegram ID!'
    );
  } catch (error) {
    console.error('❌ Неожиданная ошибка:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function createAdminInteractive() {
  console.log('🔧 Интерактивное создание администратора');
  console.log('');

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  try {
    const telegramId = await question('📱 Telegram ID администратора: ');
    const username = await question(
      '👤 Username администратора (необязательно): '
    );
    const firstName = await question('👤 Имя администратора: ');
    const lastName = await question(
      '👤 Фамилия администратора (необязательно): '
    );

    if (!telegramId || !firstName) {
      console.error('❌ Telegram ID и имя обязательны');
      process.exit(1);
    }

    // Проверяем, существует ли уже пользователь с таким Telegram ID
    const existingUser = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (existingUser) {
      console.log('⚠️  Пользователь с таким Telegram ID уже существует');
      console.log('👤 Имя:', existingUser.firstName, existingUser.lastName);
      console.log('🆔 ID:', existingUser.id);
      return;
    }

    const admin = await prisma.user.create({
      data: {
        telegramId,
        username: username || undefined,
        firstName,
        lastName: lastName || undefined,
        status: 'INTERVIEWER',
      },
    });

    console.log('✅ Администратор успешно создан!');
    console.log('📱 Telegram ID:', admin.telegramId);
    console.log('👤 Username:', admin.username);
    console.log('👤 Имя:', admin.firstName, admin.lastName);
    console.log('🆔 ID:', admin.id);
    console.log('📅 Создан:', admin.createdAt);
  } catch (error) {
    console.error('❌ Неожиданная ошибка:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

async function checkAdminExists() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log('👑 Найдено пользователей:', users.length);

    if (users.length > 0) {
      console.log('');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName || ''}`);
        console.log(`   📱 Telegram ID: ${user.telegramId}`);
        console.log(`   👤 Username: ${user.username || 'не указан'}`);
        console.log(`   🆔 ID: ${user.id}`);
        console.log(`   📊 Статус: ${user.status}`);
        console.log(`   📅 Создан: ${user.createdAt.toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('❌ Пользователи не найдены');
    }
  } catch (error) {
    console.error('❌ Ошибка при проверке пользователей:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Парсим аргументы командной строки
const command = process.argv[2];

switch (command) {
  case 'interactive':
  case '-i':
    createAdminInteractive();
    break;
  case 'check':
  case '-c':
    checkAdminExists();
    break;
  case 'help':
  case '-h':
    console.log('🔧 Скрипт для управления администраторами');
    console.log('');
    console.log('Использование:');
    console.log(
      '  npm run create-admin                  - Создать администратора по умолчанию'
    );
    console.log(
      '  npm run create-admin interactive      - Интерактивное создание администратора'
    );
    console.log(
      '  npm run create-admin check            - Проверить существующих пользователей'
    );
    console.log(
      '  npm run create-admin help             - Показать эту справку'
    );
    break;
  default:
    createAdmin();
}
