import prisma from './prisma';
import { UserStatus, InterviewStatus } from '../types';
export class UserService {
    // Создание нового пользователя
    static async createUser(data) {
        return await prisma.user.create({
            data,
        });
    }
    // Получение пользователя по Telegram ID
    static async getUserByTelegramId(telegramId) {
        return await prisma.user.findUnique({
            where: { telegramId },
            include: {
                selectedProfessions: true,
            },
        });
    }
    // Получение пользователя по ID
    static async getUserById(id) {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                selectedProfessions: true,
            },
        });
    }
    // Добавление выбранной профессии пользователю
    static async addSelectedProfession(data) {
        return await prisma.selectedProfession.create({
            data,
            include: {
                user: true,
            },
        });
    }
    // Получение всех выбранных профессий пользователя
    static async getUserProfessions(userId) {
        return await prisma.selectedProfession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Удаление выбранной профессии
    static async removeSelectedProfession(id) {
        return await prisma.selectedProfession.delete({
            where: { id },
        });
    }
    // Обновление или создание пользователя
    static async upsertUser(data) {
        return await prisma.user.upsert({
            where: { telegramId: data.telegramId },
            update: {
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            create: data,
        });
    }
    // Обновление статуса пользователя по ID
    static async updateUserStatus(data) {
        return await prisma.user.update({
            where: { id: data.userId },
            data: { status: data.status },
            include: {
                selectedProfessions: true,
            },
        });
    }
    // Обновление статуса пользователя по Telegram ID
    static async updateUserStatusByTelegramId(data) {
        return await prisma.user.update({
            where: { telegramId: data.telegramId },
            data: { status: data.status },
            include: {
                selectedProfessions: true,
            },
        });
    }
    // Получение пользователей по статусу
    static async getUsersByStatus(status) {
        return await prisma.user.findMany({
            where: { status },
            include: {
                selectedProfessions: true,
            },
        });
    }
    // Создание интервью
    static async createInterview(data) {
        return await prisma.interview.create({
            data,
            include: {
                interviewer: true,
                candidate: true,
            },
        });
    }
    // Завершение интервью
    static async completeInterview(interviewId) {
        return await prisma.interview.update({
            where: { id: interviewId },
            data: { status: InterviewStatus.COMPLETED },
            include: {
                interviewer: true,
                candidate: true,
            },
        });
    }
    // Добавление обратной связи к интервью
    static async addInterviewFeedback(data) {
        const interview = await prisma.interview.update({
            where: { id: data.interviewId },
            data: {
                feedback: data.feedback,
                status: InterviewStatus.FEEDBACK_RECEIVED,
                feedbackReceivedAt: new Date(),
            },
            include: {
                interviewer: true,
                candidate: true,
            },
        });
        // Автоматически меняем статус интервьюера на кандидата
        await this.updateUserStatus({
            userId: interview.interviewerId,
            status: UserStatus.CANDIDATE,
        });
        return interview;
    }
    // Получение интервью пользователя
    static async getUserInterviews(userId) {
        return await prisma.interview.findMany({
            where: {
                OR: [{ interviewerId: userId }, { candidateId: userId }],
            },
            include: {
                interviewer: true,
                candidate: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Получение доступных кандидатов для интервью
    static async getAvailableCandidates(excludeUserId) {
        return await prisma.user.findMany({
            where: {
                status: UserStatus.CANDIDATE,
                ...(excludeUserId && { id: { not: excludeUserId } }),
            },
            include: {
                selectedProfessions: true,
            },
        });
    }
    // Получение доступных интервьюеров
    static async getAvailableInterviewers(excludeUserId) {
        return await prisma.user.findMany({
            where: {
                status: UserStatus.INTERVIEWER,
                ...(excludeUserId && { id: { not: excludeUserId } }),
            },
            include: {
                selectedProfessions: true,
            },
        });
    }
}
//# sourceMappingURL=userService.js.map