import { UserService } from '../services/userService.js';
import { UserStatus } from '../types';
export class UserStatusController {
    // Получение текущего статуса пользователя
    static async getUserStatus(req, res) {
        try {
            const telegramId = req.user?.id?.toString();
            if (!telegramId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                });
            }
            const user = await UserService.getUserByTelegramId(telegramId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
            }
            res.json({
                success: true,
                data: { status: user.status },
            });
        }
        catch (error) {
            console.error('Error in getUserStatus:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Обновление статуса пользователя (для тестирования)
    static async updateUserStatus(req, res) {
        try {
            const { userId, status } = req.body;
            if (!userId || !status || !Object.values(UserStatus).includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid parameters',
                });
            }
            // Проверяем, является ли userId Telegram ID или ID из базы данных
            let updatedUser;
            // Сначала пробуем найти пользователя по Telegram ID
            const userByTelegramId = await UserService.getUserByTelegramId(userId);
            if (userByTelegramId) {
                // Если найден по Telegram ID, обновляем по Telegram ID
                updatedUser = await UserService.updateUserStatusByTelegramId({
                    telegramId: userId,
                    status,
                });
            }
            else {
                // Если не найден по Telegram ID, пробуем обновить по ID из базы данных
                updatedUser = await UserService.updateUserStatus({
                    userId,
                    status,
                });
            }
            res.json({
                success: true,
                data: updatedUser,
            });
        }
        catch (error) {
            console.error('Error in updateUserStatus:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Создание интервью
    static async createInterview(req, res) {
        try {
            const { candidateId } = req.body;
            const interviewerTelegramId = req.user?.id?.toString();
            if (!interviewerTelegramId || !candidateId) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required parameters',
                });
            }
            // Получаем пользователя-интервьюера по Telegram ID
            const interviewer = await UserService.getUserByTelegramId(interviewerTelegramId);
            if (!interviewer) {
                return res.status(404).json({
                    success: false,
                    error: 'Interviewer not found',
                });
            }
            const interview = await UserService.createInterview({
                interviewerId: interviewer.id,
                candidateId,
            });
            res.json({
                success: true,
                data: interview,
            });
        }
        catch (error) {
            console.error('Error in createInterview:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Завершение интервью
    static async completeInterview(req, res) {
        try {
            const { interviewId } = req.params;
            const userId = req.user?.id?.toString();
            if (!userId || !interviewId) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required parameters',
                });
            }
            const interview = await UserService.completeInterview(interviewId);
            res.json({
                success: true,
                data: interview,
            });
        }
        catch (error) {
            console.error('Error in completeInterview:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Добавление обратной связи
    static async addFeedback(req, res) {
        try {
            const { interviewId } = req.params;
            const { feedback } = req.body;
            const userId = req.user?.id?.toString();
            if (!userId || !interviewId || !feedback) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required parameters',
                });
            }
            const interview = await UserService.addInterviewFeedback({
                interviewId,
                feedback,
            });
            res.json({
                success: true,
                data: interview,
            });
        }
        catch (error) {
            console.error('Error in addFeedback:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Получение доступных кандидатов
    static async getAvailableCandidates(req, res) {
        try {
            const currentUserTelegramId = req.user?.id?.toString();
            let excludeUserId;
            if (currentUserTelegramId) {
                const currentUser = await UserService.getUserByTelegramId(currentUserTelegramId);
                if (currentUser) {
                    excludeUserId = currentUser.id;
                }
            }
            const candidates = await UserService.getAvailableCandidates(excludeUserId);
            res.json({
                success: true,
                data: candidates,
            });
        }
        catch (error) {
            console.error('Error in getAvailableCandidates:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    // Получение интервью пользователя
    static async getUserInterviews(req, res) {
        try {
            const telegramId = req.user?.id?.toString();
            if (!telegramId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                });
            }
            const user = await UserService.getUserByTelegramId(telegramId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
            }
            const interviews = await UserService.getUserInterviews(user.id);
            res.json({
                success: true,
                data: interviews,
            });
        }
        catch (error) {
            console.error('Error in getUserInterviews:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
//# sourceMappingURL=userStatusController.js.map