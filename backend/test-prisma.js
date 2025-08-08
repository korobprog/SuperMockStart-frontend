import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log('🔍 Тестирование Prisma Client...');

    // Проверяем подключение к базе данных
    const userCount = await prisma.users.count();
    console.log(`✅ Подключение успешно! Пользователей: ${userCount}`);

    // Проверяем структуру таблицы
    const user = await prisma.users.findFirst();
    if (user) {
      console.log('✅ Таблица users доступна и содержит данные');
    } else {
      console.log('ℹ️  Таблица users пуста (это нормально)');
    }

    await prisma.$disconnect();
    console.log('✅ Тест завершен успешно');
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testPrisma();
