import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Создаем тестового пользователя
    const testUser = await prisma.user.upsert({
      where: { telegramId: '123456789' },
      update: {},
      create: {
        telegramId: '123456789',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        status: 'INTERVIEWER', // По умолчанию интервьюер
      },
    });

    console.log('Тестовый пользователь создан:', testUser);

    // Создаем еще одного пользователя для тестирования
    const candidateUser = await prisma.user.upsert({
      where: { telegramId: '987654321' },
      update: {},
      create: {
        telegramId: '987654321',
        username: 'candidateuser',
        firstName: 'Candidate',
        lastName: 'User',
        status: 'CANDIDATE',
      },
    });

    console.log('Пользователь-кандидат создан:', candidateUser);

    // Создаем тестовое интервью
    const testInterview = await prisma.interview.create({
      data: {
        interviewerId: testUser.id,
        candidateId: candidateUser.id,
        status: 'COMPLETED',
        feedback: 'Отличное интервью! Кандидат показал хорошие знания.',
        feedbackReceivedAt: new Date(),
      },
    });

    console.log('Тестовое интервью создано:', testInterview);
  } catch (error) {
    console.error('Ошибка создания тестовых данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
