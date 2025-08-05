import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';
import { JwtUtils } from '../utils/jwt.js';
export class AuthController {
    /**
     * Регистрация нового пользователя
     */
    static async register(req, res) {
        try {
            const { email, password, firstName, lastName, username } = req.body;
            if (!email || !password || !firstName) {
                return res.status(400).json({
                    success: false,
                    error: 'Email, пароль и имя обязательны',
                });
            }
            const result = await AuthService.registerUser({
                email,
                password,
                firstName,
                lastName,
                username,
            });
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.status(201).json(result);
        }
        catch (error) {
            console.error('Registration controller error:', error);
            res.status(500).json({
                success: false,
                error: 'Внутренняя ошибка сервера',
            });
        }
    }
    /**
     * Вход через email/password
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Email и пароль обязательны',
                });
            }
            const result = await AuthService.loginWithEmail({ email, password });
            if (!result.success) {
                return res.status(401).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Login controller error:', error);
            res.status(500).json({
                success: false,
                error: 'Внутренняя ошибка сервера',
            });
        }
    }
    /**
     * Изменение пароля
     */
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    error: 'Текущий пароль и новый пароль обязательны',
                });
            }
            if (!req.extendedUser) {
                return res.status(401).json({
                    success: false,
                    error: 'Пользователь не аутентифицирован',
                });
            }
            const result = await UserService.updatePassword(req.extendedUser.id, currentPassword, newPassword);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Change password controller error:', error);
            res.status(500).json({
                success: false,
                error: 'Внутренняя ошибка сервера',
            });
        }
    }
    /**
     * Привязка Telegram аккаунта
     */
    static async linkTelegram(req, res) {
        try {
            const { telegramId, username, firstName, lastName } = req.body;
            if (!telegramId || !firstName) {
                return res.status(400).json({
                    success: false,
                    error: 'Telegram ID и имя обязательны',
                });
            }
            if (!req.extendedUser) {
                return res.status(401).json({
                    success: false,
                    error: 'Пользователь не аутентифицирован',
                });
            }
            const result = await UserService.linkTelegramAccount(req.extendedUser.id, telegramId.toString(), { username, firstName, lastName });
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Link Telegram controller error:', error);
            res.status(500).json({
                success: false,
                error: 'Внутренняя ошибка сервера',
            });
        }
    }
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
     * Аутентификация через Telegram Login Widget
     */
    static async authenticateWithTelegramWidget(req, res) {
        try {
            const { id, first_name, last_name, username, photo_url, auth_date, hash, } = req.body;
            if (!id || !first_name || !auth_date || !hash) {
                return res.status(400).json({
                    success: false,
                    error: 'Required fields are missing',
                });
            }
            const result = await AuthService.authenticateWithTelegramWidget({
                id: parseInt(id),
                first_name,
                last_name,
                username,
                photo_url,
                auth_date: parseInt(auth_date),
                hash,
            });
            if (!result.success) {
                return res.status(401).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Telegram Widget authentication error:', error);
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
     * Создание тестового токена для реального пользователя (без валидации)
     */
    static async createTestTokenForUser(req, res) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'userId is required',
                });
            }
            // Создаем тестового пользователя
            const testUser = {
                id: parseInt(userId),
                first_name: 'Test',
                last_name: 'User',
                username: `test_${userId}`,
            };
            // Находим или создаем пользователя в БД
            const userResult = await UserService.findOrCreateTelegramUser({
                id: parseInt(userId),
                username: testUser.username,
                firstName: testUser.first_name,
                lastName: testUser.last_name,
            });
            if (!userResult.success || !userResult.data) {
                return res.status(500).json({
                    success: false,
                    error: userResult.error || 'Failed to create/find user',
                });
            }
            // Генерируем JWT токен
            const token = JwtUtils.generateExtendedToken(userResult.data, 'telegram');
            res.json({
                success: true,
                data: {
                    token,
                    user: userResult.data,
                },
                message: 'Test token created successfully',
            });
        }
        catch (error) {
            console.error('Create test token error:', error);
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
     * Верификация расширенного JWT токена
     */
    static async verifyExtendedToken(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'Token is required',
                });
            }
            const result = await AuthService.verifyExtendedToken(token);
            res.json(result);
        }
        catch (error) {
            console.error('Extended token verification error:', error);
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
            const result = await AuthService.refreshUserInfo(parseInt(req.user.id.toString()));
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
            if (!req.extendedUser) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            return res.status(200).json({
                success: true,
                data: req.extendedUser,
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
                    data: {
                        authenticated: false,
                        user: null,
                    },
                    message: 'No token provided',
                });
            }
            // Проверяем, есть ли расширенный пользователь (установлен optionalExtendedAuth middleware)
            if (req.extendedUser) {
                return res.status(200).json({
                    success: true,
                    data: {
                        authenticated: true,
                        user: req.extendedUser,
                    },
                    message: 'User is authenticated',
                });
            }
            // Fallback к старому методу для обратной совместимости
            const isValid = AuthService.isTokenValid(token);
            return res.status(200).json({
                success: true,
                data: {
                    authenticated: isValid,
                    user: isValid ? req.user || null : null,
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
    /**
     * Валидация JWT токена
     */
    static async validateToken(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided',
                });
            }
            // Проверяем валидность токена
            const isValid = AuthService.isTokenValid(token);
            if (isValid) {
                return res.status(200).json({
                    success: true,
                    message: 'Token is valid',
                });
            }
            else {
                return res.status(401).json({
                    success: false,
                    error: 'Token is invalid or expired',
                });
            }
        }
        catch (error) {
            console.error('Token validation error:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
//# sourceMappingURL=authController.js.map