import { TelegramBotService } from '../services/telegramBotService.js';
import { AuthService } from '../services/authService.js';
export class TelegramBotController {
    /**
     * Создает URL для авторизации через бота
     */
    static async createAuthUrl(req, res) {
        try {
            const { userId, redirectUrl } = req.body;
            if (!userId || !redirectUrl) {
                return res.status(400).json({
                    success: false,
                    error: 'userId and redirectUrl are required',
                });
            }
            const authUrl = TelegramBotService.createAuthUrl(userId, redirectUrl);
            res.json({
                success: true,
                data: { authUrl },
                message: 'Auth URL created successfully',
            });
        }
        catch (error) {
            console.error('Create auth URL error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Проверяет авторизацию пользователя через бота
     */
    static async verifyUserAuth(req, res) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'userId is required',
                });
            }
            // Проверяем, может ли бот отправлять сообщения пользователю
            const canSendMessage = await TelegramBotService.canSendMessage(userId);
            if (!canSendMessage) {
                return res.status(403).json({
                    success: false,
                    error: 'Bot cannot send messages to this user. User must start the bot first.',
                });
            }
            // Получаем базовую информацию о пользователе
            const userInfo = await TelegramBotService.getUserInfo(userId);
            if (!userInfo) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found or bot cannot access user info',
                });
            }
            // Генерируем JWT токен
            const token = AuthService.generateTokenForUser(userInfo);
            res.json({
                success: true,
                data: {
                    user: userInfo,
                    token,
                    canSendMessage,
                },
                message: 'User verified successfully',
            });
        }
        catch (error) {
            console.error('Verify user auth error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Получает информацию о боте
     */
    static async getBotInfo(req, res) {
        try {
            const result = await TelegramBotService.getBotInfo();
            res.json(result);
        }
        catch (error) {
            console.error('Get bot info error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Отправляет сообщение пользователю через бота
     */
    static async sendMessage(req, res) {
        try {
            const { userId, message, withButton } = req.body;
            if (!userId || !message) {
                return res.status(400).json({
                    success: false,
                    error: 'userId and message are required',
                });
            }
            let success;
            if (withButton) {
                // Отправляем сообщение с кнопкой проверки токена
                await TelegramBotService.sendCheckTokenButton(userId);
                success = true;
            }
            else {
                // Отправляем обычное сообщение
                success = await TelegramBotService.sendMessage(userId, message);
            }
            if (success) {
                res.json({
                    success: true,
                    message: 'Message sent successfully',
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to send message',
                });
            }
        }
        catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Получает информацию о пользователе через бота
     */
    static async getUserInfo(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'userId is required',
                });
            }
            const userInfo = await TelegramBotService.getUserInfo(parseInt(userId));
            if (!userInfo) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
            }
            res.json({
                success: true,
                data: userInfo,
                message: 'User info retrieved successfully',
            });
        }
        catch (error) {
            console.error('Get user info error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
//# sourceMappingURL=telegramBotController.js.map