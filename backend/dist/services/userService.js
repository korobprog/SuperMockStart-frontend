import prisma from './prisma.js';
import { UserStatus } from '../types/index.js';
export class UserService {
    /**
     * Находит или создает пользователя по Telegram ID
     */
    static async findOrCreateTelegramUser(telegramData) {
        try {
            const telegramId = telegramData.id.toString();
            // Ищем существующего пользователя
            let user = await prisma.users.findUnique({
                where: { telegramId },
            });
            if (user) {
                // Обновляем данные пользователя
                user = await prisma.users.update({
                    where: { id: user.id },
                    data: {
                        username: telegramData.username || user.username,
                        firstName: telegramData.firstName || user.firstName,
                        lastName: telegramData.lastName || user.lastName,
                    },
                });
                const userResponse = {
                    id: user.id,
                    telegramId: user.telegramId,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    status: user.status,
                    role: user.role,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
                return {
                    success: true,
                    data: userResponse,
                    message: 'Пользователь найден',
                };
            }
            // Создаем нового пользователя
            const newUser = await prisma.users.create({
                data: {
                    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    telegramId,
                    username: telegramData.username,
                    firstName: telegramData.firstName,
                    lastName: telegramData.lastName,
                    status: UserStatus.INTERVIEWER,
                    updatedAt: new Date(),
                },
            });
            const userResponse = {
                id: newUser.id,
                telegramId: newUser.telegramId,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                status: newUser.status,
                role: newUser.role,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            };
            return {
                success: true,
                data: userResponse,
                message: 'Пользователь создан',
            };
        }
        catch (error) {
            console.error('Telegram user find/create error:', error);
            return {
                success: false,
                error: 'Ошибка при работе с пользователем Telegram',
            };
        }
    }
    /**
     * Получает пользователя по ID
     */
    static async getUserById(id) {
        try {
            console.log('🔍 getUserById called with id:', id);
            console.log('🔍 id type:', typeof id);
            console.log('🔍 id.toString():', id.toString());
            const user = await prisma.users.findUnique({
                where: { id: id.toString() },
            });
            console.log('🔍 Database query result:', user);
            if (!user) {
                console.log('❌ User not found in database');
                return {
                    success: false,
                    error: 'Пользователь не найден',
                };
            }
            const userResponse = {
                id: user.id,
                telegramId: user.telegramId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                status: user.status,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            console.log('✅ User found and converted:', userResponse);
            return {
                success: true,
                data: userResponse,
            };
        }
        catch (error) {
            console.error('❌ Get user by ID error:', error);
            return {
                success: false,
                error: 'Ошибка при получении пользователя',
            };
        }
    }
    /**
     * Получает пользователя по Telegram ID
     */
    static async getUserByTelegramId(telegramId) {
        try {
            const user = await prisma.users.findUnique({
                where: { telegramId },
            });
            if (!user) {
                return {
                    success: false,
                    error: 'Пользователь не найден',
                };
            }
            const userResponse = {
                id: user.id,
                telegramId: user.telegramId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                status: user.status,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            return {
                success: true,
                data: userResponse,
            };
        }
        catch (error) {
            console.error('Get user by Telegram ID error:', error);
            return {
                success: false,
                error: 'Ошибка при получении пользователя',
            };
        }
    }
    /**
     * Обновляет статус пользователя
     */
    static async updateUserStatus(userId, status) {
        try {
            const user = await prisma.users.update({
                where: { id: userId },
                data: { status },
            });
            const userResponse = {
                id: user.id,
                telegramId: user.telegramId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                status: user.status,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            return {
                success: true,
                data: userResponse,
                message: 'Статус пользователя обновлен',
            };
        }
        catch (error) {
            console.error('Update user status error:', error);
            return {
                success: false,
                error: 'Ошибка при обновлении статуса пользователя',
            };
        }
    }
    /**
     * Обновляет статус пользователя по Telegram ID
     */
    static async updateUserStatusByTelegramId({ telegramId, status, }) {
        try {
            const user = await prisma.users.update({
                where: { telegramId },
                data: { status },
            });
            const userResponse = {
                id: user.id,
                telegramId: user.telegramId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                status: user.status,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            return {
                success: true,
                data: userResponse,
                message: 'Статус пользователя обновлен',
            };
        }
        catch (error) {
            console.error('Update user status by Telegram ID error:', error);
            return {
                success: false,
                error: 'Ошибка при обновлении статуса пользователя',
            };
        }
    }
    /**
     * Получает всех пользователей
     */
    static async getAllUsers() {
        try {
            const users = await prisma.users.findMany({
                orderBy: { createdAt: 'desc' },
            });
            const usersResponse = users.map((user) => ({
                id: user.id,
                telegramId: user.telegramId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                status: user.status,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));
            return {
                success: true,
                data: usersResponse,
            };
        }
        catch (error) {
            console.error('Get all users error:', error);
            return {
                success: false,
                error: 'Ошибка при получении пользователей',
            };
        }
    }
    /**
     * Удаляет пользователя
     */
    static async deleteUser(userId) {
        try {
            await prisma.users.delete({
                where: { id: userId },
            });
            return {
                success: true,
                data: true,
                message: 'Пользователь удален',
            };
        }
        catch (error) {
            console.error('Delete user error:', error);
            return {
                success: false,
                error: 'Ошибка при удалении пользователя',
            };
        }
    }
    /**
     * Создает нового пользователя
     */
    static async createUser(userData) {
        try {
            // This is a placeholder implementation
            // You'll need to implement actual user creation logic
            return {
                success: false,
                error: 'User creation not implemented',
            };
        }
        catch (error) {
            console.error('Create user error:', error);
            return {
                success: false,
                error: 'Ошибка при создании пользователя',
            };
        }
    }
    /**
     * Аутентифицирует пользователя
     */
    static async authenticateUser(credentials) {
        try {
            // This is a placeholder implementation
            // You'll need to implement actual authentication logic
            return {
                success: false,
                error: 'Authentication not implemented',
            };
        }
        catch (error) {
            console.error('Authenticate user error:', error);
            return {
                success: false,
                error: 'Ошибка при аутентификации',
            };
        }
    }
    /**
     * Обновляет пароль пользователя
     */
    static async updatePassword(userId, oldPassword, newPassword) {
        try {
            // This is a placeholder implementation
            // You'll need to implement actual password update logic
            return {
                success: false,
                error: 'Password update not implemented',
            };
        }
        catch (error) {
            console.error('Update password error:', error);
            return {
                success: false,
                error: 'Ошибка при обновлении пароля',
            };
        }
    }
    /**
     * Связывает аккаунт с Telegram
     */
    static async linkTelegramAccount(userId, telegramId, userData) {
        try {
            const user = await prisma.users.update({
                where: { id: userId },
                data: { telegramId },
            });
            const userResponse = {
                id: user.id,
                telegramId: user.telegramId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                status: user.status,
                role: user.role, // Add role property
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            return {
                success: true,
                data: userResponse,
                message: 'Telegram аккаунт связан',
            };
        }
        catch (error) {
            console.error('Link Telegram account error:', error);
            return {
                success: false,
                error: 'Ошибка при связывании Telegram аккаунта',
            };
        }
    }
    /**
     * Создает интервью
     */
    static async createInterview(interviewerId, candidateId) {
        try {
            // This is a placeholder implementation
            // You'll need to implement actual interview creation logic
            return {
                success: false,
                error: 'Interview creation not implemented',
            };
        }
        catch (error) {
            console.error('Create interview error:', error);
            return {
                success: false,
                error: 'Ошибка при создании интервью',
            };
        }
    }
    /**
     * Завершает интервью
     */
    static async completeInterview(interviewId) {
        try {
            // This is a placeholder implementation
            // You'll need to implement actual interview completion logic
            return {
                success: false,
                error: 'Interview completion not implemented',
            };
        }
        catch (error) {
            console.error('Complete interview error:', error);
            return {
                success: false,
                error: 'Ошибка при завершении интервью',
            };
        }
    }
    /**
     * Добавляет отзыв к интервью
     */
    static async addInterviewFeedback(interviewId, feedback) {
        try {
            // This is a placeholder implementation
            // You'll need to implement actual feedback logic
            return {
                success: false,
                error: 'Feedback not implemented',
            };
        }
        catch (error) {
            console.error('Add interview feedback error:', error);
            return {
                success: false,
                error: 'Ошибка при добавлении отзыва',
            };
        }
    }
    /**
     * Получает доступных кандидатов
     */
    static async getAvailableCandidates() {
        try {
            const candidates = await prisma.users.findMany({
                where: { status: UserStatus.CANDIDATE },
                orderBy: { createdAt: 'desc' },
            });
            const candidatesResponse = candidates.map((user) => ({
                id: user.id,
                telegramId: user.telegramId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                status: user.status,
                role: user.role, // Add role property
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));
            return {
                success: true,
                data: candidatesResponse,
            };
        }
        catch (error) {
            console.error('Get available candidates error:', error);
            return {
                success: false,
                error: 'Ошибка при получении кандидатов',
            };
        }
    }
    /**
     * Получает интервью пользователя
     */
    static async getUserInterviews(userId) {
        try {
            // This is a placeholder implementation
            // You'll need to implement actual interview retrieval logic
            return {
                success: false,
                error: 'Get user interviews not implemented',
            };
        }
        catch (error) {
            console.error('Get user interviews error:', error);
            return {
                success: false,
                error: 'Ошибка при получении интервью пользователя',
            };
        }
    }
}
//# sourceMappingURL=userService.js.map