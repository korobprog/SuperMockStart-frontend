import prisma from './prisma.js';
import { NotificationService } from './notificationService.js';
import crypto from 'crypto';
export class FeedbackService {
    /**
     * Оставить отзыв о собеседовании
     */
    static async submitFeedback(data) {
        // Получаем информацию о сессии
        const session = await prisma.interview_sessions.findUnique({
            where: { id: data.sessionId },
            include: {
                users_interview_sessions_candidateIdTousers: true,
                users_interview_sessions_interviewerIdTousers: true,
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
                id: crypto.randomUUID(),
                sessionId: data.sessionId,
                fromUserId: data.fromUserId,
                toUserId,
                rating: data.rating,
                comment: data.comment,
                skills: data.skills,
            },
            include: {
                users_feedback_fromUserIdTousers: true,
                users_feedback_toUserIdTousers: true,
                interview_sessions: true,
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
                users_feedback_fromUserIdTousers: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
                users_feedback_toUserIdTousers: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
                interview_sessions: {
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
        const session = await prisma.interview_sessions.findUnique({
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
                users_feedback_fromUserIdTousers: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
                users_feedback_toUserIdTousers: {
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
            prisma.users.findUnique({ where: { id: candidateId } }),
            prisma.users.findUnique({ where: { id: interviewerId } }),
        ]);
        if (!candidate || !interviewer) {
            throw new Error('Users not found');
        }
        // Меняем роли: кандидат становится интервьюером, интервьюер становится кандидатом
        await Promise.all([
            prisma.users.update({
                where: { id: candidateId },
                data: { status: 'INTERVIEWER' },
            }),
            prisma.users.update({
                where: { id: interviewerId },
                data: { status: 'CANDIDATE' },
            }),
        ]);
        console.log(`🔄 Swapped roles: ${candidateId} (CANDIDATE -> INTERVIEWER) <-> ${interviewerId} (INTERVIEWER -> CANDIDATE)`);
    }
}
//# sourceMappingURL=feedbackService.js.map