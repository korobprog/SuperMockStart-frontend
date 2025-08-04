import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserStatus() {
  try {
    // Обновляем статус пользователя на INTERVIEWER
    const updatedUser = await prisma.user.update({
      where: { telegramId: '1736594064' },
      data: { status: 'INTERVIEWER' },
    });

    console.log('✅ Пользователь обновлен:', updatedUser);
  } catch (error) {
    console.error('❌ Ошибка обновления пользователя:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserStatus();
