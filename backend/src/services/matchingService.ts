import prisma from './prisma.js';
import pkg from '@prisma/client';
const { QueueType, QueueStatus } = pkg;
import { MatchResult } from './calendarService.js';

export class MatchingService {
  /**
   * Найти подходящий матч для пользователя в очереди
   */
  static async findMatch(queueEntryId: string): Promise<MatchResult | null> {
    try {
      if (!prisma) {
        console.error('Prisma client is not initialized');
        return null;
      }

      const currentEntry = await prisma.interview_queue.findUnique({
        where: { id: queueEntryId },
        include: { users: true },
      });

      if (!currentEntry) {
        throw new Error('Queue entry not found');
      }

      // Определяем тип партнера, которого ищем
      const targetQueueType =
        currentEntry.queueType === QueueType.CANDIDATE
          ? QueueType.INTERVIEWER
          : QueueType.CANDIDATE;

      // Ищем подходящих партнеров с тем же языком
      const potentialMatches = await prisma.interview_queue.findMany({
        where: {
          profession: currentEntry.profession,
          language: currentEntry.language, // Добавлена проверка языка!
          queueType: targetQueueType,
          status: QueueStatus.WAITING,
          id: { not: currentEntry.id }, // Не матчим с самим собой
        },
        include: { users: true },
        orderBy: { createdAt: 'asc' }, // FIFO порядок
      });

      // Проверяем совместимость по времени
      for (const match of potentialMatches) {
        if (this.isTimeCompatible(currentEntry, match)) {
          // Находим оптимальное время
          const scheduledDateTime = this.calculateOptimalTime(
            currentEntry,
            match
          );

          // Возвращаем матч в правильном порядке (кандидат, интервьюер)
          if (currentEntry.queueType === QueueType.CANDIDATE) {
            return {
              candidateEntry: currentEntry,
              interviewerEntry: match,
              scheduledDateTime,
            };
          } else {
            return {
              candidateEntry: match,
              interviewerEntry: currentEntry,
              scheduledDateTime,
            };
          }
        }
      }

      return null; // Матч не найден
    } catch (error) {
      console.error('Error in findMatch:', error);
      return null;
    }
  }

  /**
   * Проверить совместимость времени двух участников
   */
  private static isTimeCompatible(entry1: any, entry2: any): boolean {
    const time1 = entry1.preferredDateTime.getTime();
    const time2 = entry2.preferredDateTime.getTime();
    const flexibility1 = entry1.timeFlexibility * 60 * 1000; // в миллисекундах
    const flexibility2 = entry2.timeFlexibility * 60 * 1000;

    // Проверяем, пересекаются ли временные окна
    const start1 = time1 - flexibility1;
    const end1 = time1 + flexibility1;
    const start2 = time2 - flexibility2;
    const end2 = time2 + flexibility2;

    return start1 <= end2 && start2 <= end1;
  }

  /**
   * Вычислить оптимальное время для встречи
   */
  private static calculateOptimalTime(entry1: any, entry2: any): Date {
    // Находим среднее время между предпочтениями
    const time1 = entry1.preferredDateTime.getTime();
    const time2 = entry2.preferredDateTime.getTime();
    const averageTime = (time1 + time2) / 2;

    // Округляем до ближайшего получаса
    const optimalTime = new Date(averageTime);
    const minutes = optimalTime.getMinutes();

    if (minutes < 15) {
      optimalTime.setMinutes(0);
    } else if (minutes < 45) {
      optimalTime.setMinutes(30);
    } else {
      optimalTime.setMinutes(0);
      optimalTime.setHours(optimalTime.getHours() + 1);
    }

    optimalTime.setSeconds(0);
    optimalTime.setMilliseconds(0);

    return optimalTime;
  }

  /**
   * Запустить автоматический матчинг для всех ожидающих
   */
  static async runBatchMatching(): Promise<MatchResult[]> {
    try {
      if (!prisma) {
        console.error('Prisma client is not initialized');
        return [];
      }

      const waitingEntries = await prisma.interview_queue.findMany({
        where: { status: QueueStatus.WAITING },
        include: { users: true },
        orderBy: { createdAt: 'asc' },
      });

      const matches: MatchResult[] = [];
      const processedIds = new Set<string>();

      for (const entry of waitingEntries) {
        if (processedIds.has(entry.id)) continue;

        const match = await this.findMatch(entry.id);
        if (match) {
          matches.push(match);
          processedIds.add(match.candidateEntry.id);
          processedIds.add(match.interviewerEntry.id);
        }
      }

      return matches;
    } catch (error) {
      console.error('Error in runBatchMatching:', error);
      return [];
    }
  }

  /**
   * Очистить просроченные записи в очереди
   */
  static async cleanExpiredEntries(): Promise<void> {
    try {
      if (!prisma) {
        console.error('Prisma client is not initialized');
        return;
      }

      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() - 2); // Очереди истекают через 2 часа

      await prisma.interview_queue.updateMany({
        where: {
          status: QueueStatus.WAITING,
          createdAt: { lt: expirationTime },
        },
        data: {
          status: QueueStatus.EXPIRED,
        },
      });
    } catch (error) {
      console.error('Error cleaning expired entries:', error);
    }
  }
}
