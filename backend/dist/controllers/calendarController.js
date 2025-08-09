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
            console.log('🔍 CalendarController.getAvailableSlots called');
            console.log('🔍 req.params:', req.params);
            console.log('🔍 req.query:', req.query);
            const { profession } = req.params;
            const { date } = req.query;
            console.log('🔍 Extracted data:', { profession, date });
            if (!profession) {
                console.log('❌ Profession is required');
                return res.status(400).json({
                    success: false,
                    error: 'Profession is required',
                });
            }
            console.log('🔍 Calling CalendarService.getAvailableSlots with:', {
                profession,
                date,
            });
            const slots = await CalendarService.getAvailableSlots(profession, date ? new Date(date) : undefined);
            console.log('🔍 CalendarService.getAvailableSlots returned:', slots.length, 'slots');
            res.json({
                success: true,
                data: slots,
            });
        }
        catch (error) {
            console.error('❌ Error in CalendarController.getAvailableSlots:', error);
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
            const user = await prisma.users.findFirst({
                where: { id: userId },
                include: {
                    user_form_data: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                },
            });
            console.log('🔍 joinQueue - user found:', !!user);
            console.log('🔍 joinQueue - user.user_form_data:', user?.user_form_data);
            if (!user || !user.user_form_data[0]) {
                console.log('❌ joinQueue - User or user_form_data not found');
                return res.status(400).json({
                    success: false,
                    error: 'User language not found. Please complete the registration form first.',
                });
            }
            const userLanguage = user.user_form_data[0].language;
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
            console.log('🔍 CalendarController.getQueueStatus called');
            console.log('🔍 req.extendedUser:', req.extendedUser);
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            console.log('🔍 userId from extendedUser:', userId);
            if (!userId) {
                console.log('❌ User not authenticated');
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            console.log('🔍 Calling CalendarService.getQueueStatus with userId:', userId);
            const queueStatus = await CalendarService.getQueueStatus(userId);
            console.log('🔍 CalendarService.getQueueStatus returned:', queueStatus);
            res.json({
                success: true,
                data: queueStatus,
            });
        }
        catch (error) {
            console.error('❌ Error in CalendarController.getQueueStatus:', error);
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
            console.log('🔍 CalendarController.getUserSessions called');
            console.log('🔍 req.extendedUser:', req.extendedUser);
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            console.log('🔍 userId from extendedUser:', userId);
            if (!userId) {
                console.log('❌ User not authenticated');
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            console.log('🔍 Calling CalendarService.getUserSessions with userId:', userId);
            const sessions = await CalendarService.getUserSessions(userId);
            console.log('🔍 CalendarService.getUserSessions returned:', sessions.length, 'sessions');
            res.json({
                success: true,
                data: sessions,
            });
        }
        catch (error) {
            console.error('❌ Error in CalendarController.getUserSessions:', error);
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
            const session = await prisma.interview_sessions.findFirst({
                where: {
                    id: sessionId,
                    OR: [{ candidateId: userId }, { interviewerId: userId }],
                },
                include: {
                    users_interview_sessions_candidateIdTousers: {
                        select: {
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    },
                    users_interview_sessions_interviewerIdTousers: {
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