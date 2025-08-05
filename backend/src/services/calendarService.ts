import prisma from './prisma.js';
import {
  QueueType,
  QueueStatus,
  SessionStatus,
  NotificationType,
} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface JoinQueueData {
  userId: string;
  profession: string;
  language: string;
  preferredDateTime: Date;
  queueType: QueueType;
  timeFlexibility?: number;
}

export interface MatchResult {
  candidateEntry: any;
  interviewerEntry: any;
  scheduledDateTime: Date;
}

export class CalendarService {
  /**
   * Получить доступные слоты времени для профессии
   */
  static async getAvailableSlots(profession: string, date?: Date) {
    const startDate = date || new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14); // На 2 недели вперед

    // Получаем существующие сессии
    const existingSessions = await prisma.interviewSession.findMany({
      where: {
        profession,
        scheduledDateTime: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: [SessionStatus.SCHEDULED, SessionStatus.IN_PROGRESS],
        },
      },
      select: {
        scheduledDateTime: true,
      },
    });

    // Генерируем доступные слоты (каждый час 24/7)
    const slots = [];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    while (current <= endDate) {
      // Убираем ограничение на выходные - доступно 7 дней в неделю
      // Убираем ограничение на рабочее время - доступно 24 часа в сутки
      for (let hour = 0; hour < 24; hour++) {
        current.setHours(hour, 0, 0, 0);

        // Проверяем, что слот не занят
        const isOccupied = existingSessions.some(
          (session) =>
            Math.abs(session.scheduledDateTime.getTime() - current.getTime()) <
            60 * 60 * 1000 // В пределах часа
        );

        if (!isOccupied) {
          slots.push({
            datetime: new Date(current),
            available: true,
          });
        }
      }

      // Переходим к следующему дню
      current.setDate(current.getDate() + 1);
    }

    return slots;
  }

  /**
   * Добавить пользователя в очередь
   */
  static async joinQueue(data: JoinQueueData) {
    // Сначала отменяем существующие записи в очереди
    await this.leaveQueue(data.userId);

    // Добавляем новую запись в очередь
    const queueEntry = await prisma.interviewQueue.create({
      data: {
        userId: data.userId,
        profession: data.profession,
        language: data.language,
        preferredDateTime: data.preferredDateTime,
        queueType: data.queueType,
        timeFlexibility: data.timeFlexibility || 30,
        status: QueueStatus.WAITING,
      },
      include: {
        user: true,
      },
    });

    return queueEntry;
  }

  /**
   * Получить статус пользователя в очереди
   */
  static async getQueueStatus(userId: string) {
    const queueEntry = await prisma.interviewQueue.findFirst({
      where: {
        userId,
        status: {
          in: [QueueStatus.WAITING, QueueStatus.MATCHED],
        },
      },
      include: {
        matchedSession: {
          include: {
            candidate: true,
            interviewer: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!queueEntry) {
      return null;
    }

    // Если есть матч, возвращаем информацию о сессии
    if (queueEntry.matchedSession) {
      return {
        id: queueEntry.id,
        status: 'MATCHED' as QueueStatus,
        profession: queueEntry.profession,
        language: queueEntry.language,
        preferredDateTime: queueEntry.preferredDateTime,
        matchedSession: {
          id: queueEntry.matchedSession.id,
          scheduledDateTime: queueEntry.matchedSession.scheduledDateTime,
          meetingLink: queueEntry.matchedSession.meetingLink,
          profession: queueEntry.matchedSession.profession,
          language: queueEntry.matchedSession.language,
          candidate: queueEntry.matchedSession.candidate,
          interviewer: queueEntry.matchedSession.interviewer,
        },
      };
    }

    // Проверяем количество пользователей в очереди с тем же языком
    const usersInQueueWithSameLanguage = await prisma.interviewQueue.count({
      where: {
        language: queueEntry.language,
        status: QueueStatus.WAITING,
      },
    });

    return {
      id: queueEntry.id,
      status: 'WAITING' as QueueStatus,
      profession: queueEntry.profession,
      language: queueEntry.language,
      preferredDateTime: queueEntry.preferredDateTime,
      usersInQueueWithSameLanguage,
    };
  }

  /**
   * Покинуть очередь
   */
  static async leaveQueue(userId: string) {
    await prisma.interviewQueue.updateMany({
      where: {
        userId,
        status: {
          in: [QueueStatus.WAITING, QueueStatus.MATCHED],
        },
      },
      data: {
        status: QueueStatus.CANCELLED,
      },
    });
  }

  /**
   * Создать сессию собеседования из матча
   */
  static async createInterviewSession(match: MatchResult) {
    const meetingLink = this.generateMeetingLink();

    // Создаем Interview записи
    const candidateInterview = await prisma.interview.create({
      data: {
        candidateId: match.candidateEntry.userId,
        interviewerId: match.interviewerEntry.userId,
      },
    });

    // Создаем InterviewSession
    const session = await prisma.interviewSession.create({
      data: {
        interviewId: candidateInterview.id,
        scheduledDateTime: match.scheduledDateTime,
        profession: match.candidateEntry.profession,
        language: match.candidateEntry.language,
        meetingLink,
        candidateId: match.candidateEntry.userId,
        interviewerId: match.interviewerEntry.userId,
      },
      include: {
        candidate: true,
        interviewer: true,
      },
    });

    // Обновляем статус очередей
    await prisma.interviewQueue.updateMany({
      where: {
        id: {
          in: [match.candidateEntry.id, match.interviewerEntry.id],
        },
      },
      data: {
        status: QueueStatus.MATCHED,
        matchedSessionId: session.id,
      },
    });

    return session;
  }

  /**
   * Получить сессии пользователя
   */
  static async getUserSessions(userId: string) {
    const sessions = await prisma.interviewSession.findMany({
      where: {
        OR: [{ candidateId: userId }, { interviewerId: userId }],
      },
      include: {
        candidate: true,
        interviewer: true,
        interview: true,
      },
      orderBy: {
        scheduledDateTime: 'asc',
      },
    });

    return sessions;
  }

  /**
   * Отменить сессию
   */
  static async cancelSession(sessionId: string, userId: string) {
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        OR: [{ candidateId: userId }, { interviewerId: userId }],
      },
    });

    if (!session) {
      throw new Error('Session not found or access denied');
    }

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: SessionStatus.CANCELLED },
    });

    // Создаем уведомления для обеих сторон
    const otherUserId =
      session.candidateId === userId
        ? session.interviewerId
        : session.candidateId;

    await prisma.notification.create({
      data: {
        userId: otherUserId,
        sessionId: sessionId,
        type: NotificationType.INTERVIEW_CANCELLED,
        title: 'Собеседование отменено',
        message: 'Ваше собеседование было отменено другой стороной.',
      },
    });
  }

  /**
   * Завершить сессию
   */
  static async completeSession(sessionId: string, userId: string) {
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        OR: [{ candidateId: userId }, { interviewerId: userId }],
      },
    });

    if (!session) {
      throw new Error('Session not found or access denied');
    }

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: SessionStatus.COMPLETED },
    });

    // Очищаем статус очереди для обоих участников
    await prisma.interviewQueue.updateMany({
      where: {
        OR: [
          { userId: session.candidateId },
          { userId: session.interviewerId },
        ],
        status: QueueStatus.MATCHED,
        matchedSessionId: sessionId,
      },
      data: {
        status: QueueStatus.CANCELLED,
        matchedSessionId: null,
      },
    });

    // Создаем запрос на обратную связь для обеих сторон
    await this.createFeedbackRequest(sessionId);
  }

  /**
   * Создать запрос на обратную связь
   */
  static async createFeedbackRequest(sessionId: string) {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        candidate: true,
        interviewer: true,
      },
    });

    if (!session) return;

    // Создаем уведомления о запросе фидбека
    await prisma.notification.createMany({
      data: [
        {
          userId: session.candidateId,
          sessionId: sessionId,
          type: NotificationType.FEEDBACK_REQUEST,
          title: 'Оставьте отзыв',
          message: 'Пожалуйста, оставьте отзыв о прошедшем собеседовании.',
        },
        {
          userId: session.interviewerId,
          sessionId: sessionId,
          type: NotificationType.FEEDBACK_REQUEST,
          title: 'Оставьте отзыв',
          message: 'Пожалуйста, оставьте отзыв о прошедшем собеседовании.',
        },
      ],
    });
  }

  /**
   * Генерировать ссылку на встречу
   */
  private static generateMeetingLink(): string {
    const meetingId = uuidv4();
    return `https://meet.jit.si/supermock-${meetingId}`;
  }
}
