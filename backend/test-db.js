import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');

    // Проверяем подключение
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Проверяем таблицу пользователей
    const userCount = await prisma.users.count();
    console.log(`📊 Users in database: ${userCount}`);

    // Пробуем создать тестового пользователя
    const testUser = await prisma.users.upsert({
      where: { telegramId: '999999999' },
      update: {},
      create: {
        id: 'test-user-999',
        telegramId: '999999999',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        status: 'INTERVIEWER',
        updatedAt: new Date(),
      },
    });

    console.log('✅ Test user created/updated:', testUser);

    // Удаляем тестового пользователя
    await prisma.users.delete({
      where: { telegramId: '999999999' },
    });

    console.log('✅ Test user deleted');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
