import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');

    // Проверяем подключение
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Проверяем количество пользователей
    const userCount = await prisma.users.count();
    console.log(`📊 Total users in database: ${userCount}`);

    // Проверяем последних 5 пользователей
    const recentUsers = await prisma.users.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        telegramId: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    console.log('👥 Recent users:');
    recentUsers.forEach((user, index) => {
      console.log(
        `  ${index + 1}. ${user.firstName} ${user.lastName} (${
          user.telegramId
        }) - ${user.role}`
      );
    });

    // Проверяем пользователя по telegramId (если есть)
    if (recentUsers.length > 0) {
      const testUser = await prisma.users.findUnique({
        where: { telegramId: recentUsers[0].telegramId },
        select: {
          id: true,
          telegramId: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
        },
      });

      if (testUser) {
        console.log('✅ User lookup by telegramId successful:', testUser);
      } else {
        console.log('❌ User lookup by telegramId failed');
      }
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
