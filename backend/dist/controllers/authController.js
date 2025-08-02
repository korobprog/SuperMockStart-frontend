import { AuthService } from '../services/authService.js';
export class AuthController {
    /**
     * Аутентификация через Telegram Web App
     */
    static async authenticateWithTelegram(req, res) {
        try {
            const { initData } = req.body;
            if (!initData) {
                return res.status(400).json({
                    success: false,
                    error: 'Telegram initData is required',
                });
            }
            const result = await AuthService.authenticateWithTelegram(initData);
            if (!result.success) {
                return res.status(401).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Authentication error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Получение тестового токена для разработки
     */
    static async getTestToken(req, res) {
        try {
            const result = AuthService.getTestToken();
            if (!result.success) {
                return res.status(500).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Test token generation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Проверка валидности токена
     */
    static async verifyToken(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'Token is required',
                });
            }
            const result = AuthService.verifyToken(token);
            res.json(result);
        }
        catch (error) {
            console.error('Token verification error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Обновление информации о пользователе
     */
    static async refreshUserInfo(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            const result = await AuthService.refreshUserInfo(req.user.id);
            return res.status(result.success ? 200 : 400).json(result);
        }
        catch (error) {
            console.error('User info refresh controller error:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Получение профиля текущего пользователя
     */
    static async getProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            return res.status(200).json({
                success: true,
                data: req.user,
                message: 'Profile retrieved successfully',
            });
        }
        catch (error) {
            console.error('Get profile controller error:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Проверка статуса аутентификации
     */
    static async checkAuthStatus(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(200).json({
                    success: true,
                    data: { authenticated: false },
                    message: 'No token provided',
                });
            }
            const isValid = AuthService.isTokenValid(token);
            return res.status(200).json({
                success: true,
                data: {
                    authenticated: isValid,
                    token: isValid ? token : null,
                },
                message: isValid ? 'Token is valid' : 'Token is invalid or expired',
            });
        }
        catch (error) {
            console.error('Auth status check error:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
//# sourceMappingURL=authController.js.map