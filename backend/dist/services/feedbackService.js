import prisma from './prisma.js';
import { NotificationService } from './notificationService.js';
export class FeedbackService {
    /**
     * Оставить отзыв о собеседовании
     */
    static async submitFeedback(data) {
        // Получаем информацию о сессии
        const session = await prisma.interviewSession.findUnique({
            where: { id: data.sessionId },
            include: {
                candidate: true,
                interviewer: true,
            },
        });
        if (!session) {
            throw new Error('Session not found');
        }
        // Проверяем, что пользователь участвовал в этой сессии
        if (session.candidateId !== data.fromUserId &&
            session.interviewerId !== data.fromUserId) {
            throw new Error('Access denied: You did not participate in this session');
        }
        // Определяем получателя отзыва
        const toUserId = session.candidateId === data.fromUserId
            ? session.interviewerId
            : session.candidateId;
        // Проверяем, не оставлял ли уже пользователь отзыв
        const existingFeedback = await prisma.feedback.findUnique({
            where: {
                sessionId_fromUserId: {
                    sessionId: data.sessionId,
                    fromUserId: data.fromUserId,
                },
            },
        });
        if (existingFeedback) {
            throw new Error('You have already submitted feedback for this session');
        }
        // Создаем отзыв
        const feedback = await prisma.feedback.create({
            data: {
                sessionId: data.sessionId,
                fromUserId: data.fromUserId,
                toUserId,
                rating: data.rating,
                comment: data.comment,
                skills: data.skills,
            },
            include: {
                fromUser: true,
                toUser: true,
                session: true,
            },
        });
        // Проверяем, оставили ли оба участника отзывы
        const allFeedbacks = await prisma.feedback.findMany({
            where: { sessionId: data.sessionId },
        });
        if (allFeedbacks.length === 2) {
            // Оба оставили отзывы - меняем роли
            await this.swapUserRoles(session.candidateId, session.interviewerId);
            // Уведомляем о смене ролей
            await NotificationService.notifyRoleChange(session.candidateId, 'Интервьюер');
            await NotificationService.notifyRoleChange(session.interviewerId, 'Кандидат');
        }
        return feedback;
    }
    /**
     * Получить отзывы пользователя
     */
    static async getUserFeedback(userId, type = 'received') {
        const where = type === 'given' ? { fromUserId: userId } : { toUserId: userId };
        const feedback = await prisma.feedback.findMany({
            where,
            include: {
                fromUser: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
                toUser: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
                session: {
                    select: {
                        profession: true,
                        scheduledDateTime: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return feedback;
    }
    /**
     * Получить отзывы о сессии
     */
    static async getSessionFeedback(sessionId, userId) {
        // Проверяем доступ к сессии
        const session = await prisma.interviewSession.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new Error('Session not found');
        }
        if (session.candidateId !== userId && session.interviewerId !== userId) {
            throw new Error('Access denied');
        }
        // Получаем отзывы
        const feedback = await prisma.feedback.findMany({
            where: { sessionId },
            include: {
                fromUser: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
                toUser: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
            },
        });
        return feedback;
    }
    /**
     * Поменять роли пользователей местами
     */
    static async swapUserRoles(candidateId, interviewerId) {
        // Получаем текущие статусы
        const [candidate, interviewer] = await Promise.all([
            prisma.user.findUnique({ where: { id: candidateId } }),
            prisma.user.findUnique({ where: { id: interviewerId } }),
        ]);
        if (!candidate || !interviewer) {
            throw new Error('Users not found');
        }
        // Меняем роли: кандидат становится интервьюером, интервьюер становится кандидатом
        await Promise.all([
            prisma.user.update({
                where: { id: candidateId },
                data: { status: 'INTERVIEWER' },
            }),
            prisma.user.update({
                where: { id: interviewerId },
                data: { status: 'CANDIDATE' },
            }),
        ]);
        console.log(`🔄 Swapped roles: ${candidateId} (CANDIDATE -> INTERVIEWER) <-> ${interviewerId} (INTERVIEWER -> CANDIDATE)`);
    }
}
//# sourceMappingURL=feedbackService.js.map