import prisma from './prisma.js';
import { QueueType, QueueStatus } from '@prisma/client';
export class MatchingService {
    /**
     * Найти подходящий матч для пользователя в очереди
     */
    static async findMatch(queueEntryId) {
        const currentEntry = await prisma.interviewQueue.findUnique({
            where: { id: queueEntryId },
            include: { user: true },
        });
        if (!currentEntry) {
            throw new Error('Queue entry not found');
        }
        // Определяем тип партнера, которого ищем
        const targetQueueType = currentEntry.queueType === QueueType.CANDIDATE
            ? QueueType.INTERVIEWER
            : QueueType.CANDIDATE;
        // Ищем подходящих партнеров с тем же языком
        const potentialMatches = await prisma.interviewQueue.findMany({
            where: {
                profession: currentEntry.profession,
                language: currentEntry.language, // Добавлена проверка языка!
                queueType: targetQueueType,
                status: QueueStatus.WAITING,
                id: { not: currentEntry.id }, // Не матчим с самим собой
            },
            include: { user: true },
            orderBy: { createdAt: 'asc' }, // FIFO порядок
        });
        // Проверяем совместимость по времени
        for (const match of potentialMatches) {
            if (this.isTimeCompatible(currentEntry, match)) {
                // Находим оптимальное время
                const scheduledDateTime = this.calculateOptimalTime(currentEntry, match);
                // Возвращаем матч в правильном порядке (кандидат, интервьюер)
                if (currentEntry.queueType === QueueType.CANDIDATE) {
                    return {
                        candidateEntry: currentEntry,
                        interviewerEntry: match,
                        scheduledDateTime,
                    };
                }
                else {
                    return {
                        candidateEntry: match,
                        interviewerEntry: currentEntry,
                        scheduledDateTime,
                    };
                }
            }
        }
        return null; // Матч не найден
    }
    /**
     * Проверить совместимость времени двух участников
     */
    static isTimeCompatible(entry1, entry2) {
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
    static calculateOptimalTime(entry1, entry2) {
        // Находим среднее время между предпочтениями
        const time1 = entry1.preferredDateTime.getTime();
        const time2 = entry2.preferredDateTime.getTime();
        const averageTime = (time1 + time2) / 2;
        // Округляем до ближайшего получаса
        const optimalTime = new Date(averageTime);
        const minutes = optimalTime.getMinutes();
        if (minutes < 15) {
            optimalTime.setMinutes(0);
        }
        else if (minutes < 45) {
            optimalTime.setMinutes(30);
        }
        else {
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
    static async runBatchMatching() {
        const waitingEntries = await prisma.interviewQueue.findMany({
            where: { status: QueueStatus.WAITING },
            include: { user: true },
            orderBy: { createdAt: 'asc' },
        });
        const matches = [];
        const processedIds = new Set();
        for (const entry of waitingEntries) {
            if (processedIds.has(entry.id))
                continue;
            const match = await this.findMatch(entry.id);
            if (match) {
                matches.push(match);
                processedIds.add(match.candidateEntry.id);
                processedIds.add(match.interviewerEntry.id);
            }
        }
        return matches;
    }
    /**
     * Очистить просроченные записи в очереди
     */
    static async cleanExpiredEntries() {
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() - 2); // Очереди истекают через 2 часа
        await prisma.interviewQueue.updateMany({
            where: {
                status: QueueStatus.WAITING,
                createdAt: { lt: expirationTime },
            },
            data: {
                status: QueueStatus.EXPIRED,
            },
        });
    }
}
//# sourceMappingURL=matchingService.js.map