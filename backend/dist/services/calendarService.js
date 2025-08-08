import prisma from './prisma.js';
import pkg from '@prisma/client';
const { QueueType, QueueStatus, SessionStatus, NotificationType } = pkg;
import { v4 as uuidv4 } from 'uuid';
export class CalendarService {
    /**
     * Получить доступные слоты времени для профессии
     */
    static async getAvailableSlots(profession, date) {
        try {
            console.log('🔍 CalendarService.getAvailableSlots called with:', {
                profession,
                date,
            });
            // Проверяем подключение к базе данных
            console.log('🔍 Testing database connection...');
            await prisma.$queryRaw `SELECT 1`;
            console.log('✅ Database connection successful');
            const startDate = date || new Date();
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 14); // На 2 недели вперед
            console.log('🔍 Date range:', { startDate, endDate });
            // Получаем существующие сессии
            const existingSessions = await prisma.interview_sessions.findMany({
                where: {
                    profession,
                    scheduledDateTime: {
                        gte: startDate,
                        lte: endDate,
                    },
                    status: {
                        in: ['SCHEDULED', 'IN_PROGRESS'],
                    },
                },
                select: {
                    scheduledDateTime: true,
                },
            });
            console.log('🔍 Existing sessions found:', existingSessions.length);
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
                    const isOccupied = existingSessions.some((session) => Math.abs(session.scheduledDateTime.getTime() - current.getTime()) <
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
            console.log('🔍 Generated slots:', slots.length);
            return slots;
        }
        catch (error) {
            console.error('❌ Error in getAvailableSlots:', error);
            throw error;
        }
    }
    /**
     * Добавить пользователя в очередь
     */
    static async joinQueue(data) {
        // Сначала отменяем существующие записи в очереди
        await this.leaveQueue(data.userId);
        // Добавляем новую запись в очередь
        const queueEntry = await prisma.interview_queue.create({
            data: {
                id: uuidv4(),
                userId: data.userId,
                profession: data.profession,
                language: data.language,
                preferredDateTime: data.preferredDateTime,
                queueType: data.queueType,
                timeFlexibility: data.timeFlexibility || 30,
                status: QueueStatus.WAITING,
                updatedAt: new Date(),
            },
            include: {
                users: true,
            },
        });
        return queueEntry;
    }
    /**
     * Получить статус пользователя в очереди
     */
    static async getQueueStatus(userId) {
        const queueEntry = await prisma.interview_queue.findFirst({
            where: {
                userId,
                status: {
                    in: [
                        QueueStatus.WAITING,
                        QueueStatus.MATCHED,
                    ],
                },
            },
            include: {
                users: true,
                interview_sessions: {
                    include: {
                        users_interview_sessions_candidateIdTousers: true,
                        users_interview_sessions_interviewerIdTousers: true,
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
        if (queueEntry.interview_sessions) {
            return {
                id: queueEntry.id,
                status: 'MATCHED',
                profession: queueEntry.profession,
                language: queueEntry.language,
                preferredDateTime: queueEntry.preferredDateTime,
                matchedSession: {
                    id: queueEntry.interview_sessions.id,
                    scheduledDateTime: queueEntry.interview_sessions.scheduledDateTime,
                    meetingLink: queueEntry.interview_sessions.meetingLink,
                    profession: queueEntry.interview_sessions.profession,
                    language: queueEntry.interview_sessions.language,
                    candidate: queueEntry.interview_sessions
                        .users_interview_sessions_candidateIdTousers,
                    interviewer: queueEntry.interview_sessions
                        .users_interview_sessions_interviewerIdTousers,
                },
            };
        }
        // Проверяем количество пользователей в очереди с тем же языком
        const usersInQueueWithSameLanguage = await prisma.interview_queue.count({
            where: {
                language: queueEntry.language,
                status: QueueStatus.WAITING,
            },
        });
        return {
            id: queueEntry.id,
            status: 'WAITING',
            profession: queueEntry.profession,
            language: queueEntry.language,
            preferredDateTime: queueEntry.preferredDateTime,
            usersInQueueWithSameLanguage,
        };
    }
    /**
     * Покинуть очередь
     */
    static async leaveQueue(userId) {
        await prisma.interview_queue.updateMany({
            where: {
                userId,
                status: {
                    in: [
                        QueueStatus.WAITING,
                        QueueStatus.MATCHED,
                    ],
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
    static async createInterviewSession(match) {
        const meetingLink = this.generateMeetingLink();
        // Создаем Interview записи
        const candidateInterview = await prisma.interviews.create({
            data: {
                id: uuidv4(),
                candidateId: match.candidateEntry.userId,
                interviewerId: match.interviewerEntry.userId,
                updatedAt: new Date(),
            },
        });
        // Создаем InterviewSession
        const session = await prisma.interview_sessions.create({
            data: {
                id: uuidv4(),
                interviewId: candidateInterview.id,
                scheduledDateTime: match.scheduledDateTime,
                profession: match.candidateEntry.profession,
                language: match.candidateEntry.language,
                meetingLink,
                candidateId: match.candidateEntry.userId,
                interviewerId: match.interviewerEntry.userId,
                updatedAt: new Date(),
            },
            include: {
                users_interview_sessions_candidateIdTousers: true,
                users_interview_sessions_interviewerIdTousers: true,
            },
        });
        // Обновляем статус очередей
        await prisma.interview_queue.updateMany({
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
    static async getUserSessions(userId) {
        try {
            console.log('🔍 CalendarService.getUserSessions called with userId:', userId);
            // Проверяем подключение к базе данных
            console.log('🔍 Testing database connection...');
            await prisma.$queryRaw `SELECT 1`;
            console.log('✅ Database connection successful');
            const sessions = await prisma.interview_sessions.findMany({
                where: {
                    OR: [{ candidateId: userId }, { interviewerId: userId }],
                },
                include: {
                    users_interview_sessions_candidateIdTousers: true,
                    users_interview_sessions_interviewerIdTousers: true,
                    interviews: true,
                },
                orderBy: {
                    scheduledDateTime: 'asc',
                },
            });
            console.log('🔍 Found sessions:', sessions.length);
            return sessions;
        }
        catch (error) {
            console.error('❌ Error in getUserSessions:', error);
            throw error;
        }
    }
    /**
     * Отменить сессию
     */
    static async cancelSession(sessionId, userId) {
        const session = await prisma.interview_sessions.findFirst({
            where: {
                id: sessionId,
                OR: [{ candidateId: userId }, { interviewerId: userId }],
            },
        });
        if (!session) {
            throw new Error('Session not found or access denied');
        }
        await prisma.interview_sessions.update({
            where: { id: sessionId },
            data: { status: 'CANCELLED' },
        });
        // Создаем уведомления для обеих сторон
        const otherUserId = session.candidateId === userId
            ? session.interviewerId
            : session.candidateId;
        await prisma.notifications.create({
            data: {
                id: uuidv4(),
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
    static async completeSession(sessionId, userId) {
        const session = await prisma.interview_sessions.findFirst({
            where: {
                id: sessionId,
                OR: [{ candidateId: userId }, { interviewerId: userId }],
            },
        });
        if (!session) {
            throw new Error('Session not found or access denied');
        }
        await prisma.interview_sessions.update({
            where: { id: sessionId },
            data: { status: 'COMPLETED' },
        });
        // Очищаем статус очереди для обоих участников
        await prisma.interview_queue.updateMany({
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
    static async createFeedbackRequest(sessionId) {
        const session = await prisma.interview_sessions.findUnique({
            where: { id: sessionId },
            include: {
                users_interview_sessions_candidateIdTousers: true,
                users_interview_sessions_interviewerIdTousers: true,
            },
        });
        if (!session)
            return;
        // Создаем уведомления о запросе фидбека
        await prisma.notifications.createMany({
            data: [
                {
                    id: uuidv4(),
                    userId: session.candidateId,
                    sessionId: sessionId,
                    type: NotificationType.FEEDBACK_REQUEST,
                    title: 'Оставьте отзыв',
                    message: 'Пожалуйста, оставьте отзыв о прошедшем собеседовании.',
                },
                {
                    id: uuidv4(),
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
    static generateMeetingLink() {
        const meetingId = uuidv4();
        return `https://meet.jit.si/supermock-${meetingId}`;
    }
}
//# sourceMappingURL=calendarService.js.map