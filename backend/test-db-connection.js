import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');

    // Проверяем подключение
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Проверяем, что таблицы существуют
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Available tables:', tables);

    // Проверяем таблицу пользователей
    const userCount = await prisma.users.count();
    console.log('👥 Users in database:', userCount);

    // Проверяем таблицу очереди
    const queueCount = await prisma.interview_queue.count();
    console.log('📋 Queue entries in database:', queueCount);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
