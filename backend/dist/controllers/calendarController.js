import { CalendarService } from '../services/calendarService.js';
import { MatchingService } from '../services/matchingService.js';
import { NotificationService } from '../services/notificationService.js';
import prisma from '../services/prisma.js';
export class CalendarController {
    /**
     * Получить доступные слоты времени для профессии
     */
    static async getAvailableSlots(req, res) {
        try {
            const { profession } = req.params;
            const { date } = req.query;
            if (!profession) {
                return res.status(400).json({
                    success: false,
                    error: 'Profession is required',
                });
            }
            const slots = await CalendarService.getAvailableSlots(profession, date ? new Date(date) : undefined);
            res.json({
                success: true,
                data: slots,
            });
        }
        catch (error) {
            console.error('Error getting available slots:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get available slots',
            });
        }
    }
    /**
     * Добавить пользователя в очередь на собеседование
     */
    static async joinQueue(req, res) {
        try {
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            const { profession, preferredDateTime, queueType } = req.body;
            console.log('🔍 joinQueue - userId:', userId);
            console.log('🔍 joinQueue - profession:', profession);
            console.log('🔍 joinQueue - preferredDateTime:', preferredDateTime);
            console.log('🔍 joinQueue - queueType:', queueType);
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            if (!profession || !preferredDateTime || !queueType) {
                return res.status(400).json({
                    success: false,
                    error: 'Profession, preferredDateTime and queueType are required',
                });
            }
            // Получаем пользователя с его языком из последней формы
            const user = await prisma.user.findFirst({
                where: { id: userId },
                include: {
                    formData: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                },
            });
            console.log('🔍 joinQueue - user found:', !!user);
            console.log('🔍 joinQueue - user.formData:', user?.formData);
            if (!user || !user.formData[0]) {
                console.log('❌ joinQueue - User or formData not found');
                return res.status(400).json({
                    success: false,
                    error: 'User language not found. Please complete the registration form first.',
                });
            }
            const userLanguage = user.formData[0].language;
            // Добавляем в очередь с языком
            const queueEntry = await CalendarService.joinQueue({
                userId: user.id, // Используем id из базы данных
                profession,
                language: userLanguage,
                preferredDateTime: new Date(preferredDateTime),
                queueType,
            });
            // Попытаемся найти матч
            const match = await MatchingService.findMatch(queueEntry.id);
            if (match) {
                // Если нашли матч, создаем сессию
                const session = await CalendarService.createInterviewSession(match);
                // Отправляем уведомления
                await NotificationService.sendInterviewConfirmation(session);
                res.json({
                    success: true,
                    message: 'Match found and interview scheduled!',
                    data: {
                        queueEntry,
                        session,
                    },
                });
            }
            else {
                res.json({
                    success: true,
                    message: 'Added to queue, waiting for match...',
                    data: { queueEntry },
                });
            }
        }
        catch (error) {
            console.error('Error joining queue:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to join queue',
            });
        }
    }
    /**
     * Получить статус пользователя в очереди
     */
    static async getQueueStatus(req, res) {
        try {
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            const queueStatus = await CalendarService.getQueueStatus(userId);
            res.json({
                success: true,
                data: queueStatus,
            });
        }
        catch (error) {
            console.error('Error getting queue status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get queue status',
            });
        }
    }
    /**
     * Отменить участие в очереди
     */
    static async leaveQueue(req, res) {
        try {
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            await CalendarService.leaveQueue(userId);
            res.json({
                success: true,
                message: 'Successfully left the queue',
            });
        }
        catch (error) {
            console.error('Error leaving queue:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to leave queue',
            });
        }
    }
    /**
     * Получить запланированные собеседования пользователя
     */
    static async getUserSessions(req, res) {
        try {
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            const sessions = await CalendarService.getUserSessions(userId);
            res.json({
                success: true,
                data: sessions,
            });
        }
        catch (error) {
            console.error('Error getting user sessions:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get user sessions',
            });
        }
    }
    /**
     * Отменить собеседование
     */
    static async cancelSession(req, res) {
        try {
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            const { sessionId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            await CalendarService.cancelSession(sessionId, userId);
            res.json({
                success: true,
                message: 'Session cancelled successfully',
            });
        }
        catch (error) {
            console.error('Error cancelling session:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to cancel session',
            });
        }
    }
    /**
     * Завершить собеседование
     */
    static async completeSession(req, res) {
        try {
            console.log('🔍 CalendarController.completeSession вызван');
            console.log('🔍 req.extendedUser:', req.extendedUser);
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            const { sessionId } = req.params;
            console.log('🔍 userId из extendedUser:', userId);
            console.log('🔍 sessionId из params:', sessionId);
            if (!userId) {
                console.log('❌ userId не найден в extendedUser');
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            console.log('✅ Вызываем CalendarService.completeSession');
            await CalendarService.completeSession(sessionId, userId);
            console.log('✅ CalendarService.completeSession выполнен успешно');
            res.json({
                success: true,
                message: 'Session completed successfully',
            });
        }
        catch (error) {
            console.error('❌ Error completing session:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to complete session',
            });
        }
    }
    /**
     * Получить информацию о сессии
     */
    static async getSession(req, res) {
        try {
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            const { sessionId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            const session = await prisma.interviewSession.findFirst({
                where: {
                    id: sessionId,
                    OR: [{ candidateId: userId }, { interviewerId: userId }],
                },
                include: {
                    candidate: {
                        select: {
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                    interviewer: {
                        select: {
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                },
            });
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found or access denied',
                });
            }
            res.json({
                success: true,
                data: session,
            });
        }
        catch (error) {
            console.error('Error getting session:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get session',
            });
        }
    }
}
//# sourceMappingURL=calendarController.js.map