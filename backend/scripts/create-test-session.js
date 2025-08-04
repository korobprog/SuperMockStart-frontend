import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestSession() {
  try {
    // Создаем тестовых пользователей, если их нет
    const testUser = await prisma.user.upsert({
      where: { telegramId: '123456789' },
      update: {},
      create: {
        telegramId: '123456789',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        status: 'INTERVIEWER',
      },
    });

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

    console.log('Тестовые пользователи созданы:', { testUser, candidateUser });

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

    // Создаем тестовую сессию с фиксированным ID
    const testSession = await prisma.interviewSession.create({
      data: {
        id: 'test-session-1', // Фиксированный ID для тестирования
        interviewId: testInterview.id,
        scheduledDateTime: new Date(),
        profession: 'Frontend Developer',
        language: 'ru',
        meetingLink: 'https://meet.google.com/test-session',
        status: 'COMPLETED',
        candidateId: candidateUser.id,
        interviewerId: testUser.id,
      },
    });

    console.log('Тестовая сессия создана:', testSession);

    // Создаем тестовый отзыв
    const testFeedback = await prisma.feedback.create({
      data: {
        sessionId: testSession.id,
        fromUserId: testUser.id,
        toUserId: candidateUser.id,
        rating: 5,
        comment: 'Отличный кандидат! Очень хорошо подготовлен.',
      },
    });

    console.log('Тестовый отзыв создан:', testFeedback);
  } catch (error) {
    console.error('Ошибка создания тестовой сессии:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSession();
