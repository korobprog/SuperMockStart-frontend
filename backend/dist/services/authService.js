import { TelegramUtils } from '../utils/telegram.js';
import { JwtUtils } from '../utils/jwt.js';
import { UserService } from './userService.js';
export class AuthService {
    /**
     * Регистрирует нового пользователя
     */
    static async registerUser(data) {
        try {
            const userResult = await UserService.createUser(data);
            if (!userResult.success || !userResult.data) {
                return {
                    success: false,
                    error: userResult.error,
                };
            }
            const token = JwtUtils.generateExtendedToken(userResult.data, 'email');
            return {
                success: true,
                data: {
                    token,
                    user: userResult.data,
                },
                message: 'Регистрация прошла успешно',
            };
        }
        catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: 'Ошибка при регистрации',
            };
        }
    }
    /**
     * Аутентифицирует пользователя через email/password
     */
    static async loginWithEmail(credentials) {
        try {
            const userResult = await UserService.authenticateUser(credentials);
            if (!userResult.success || !userResult.data) {
                return {
                    success: false,
                    error: userResult.error,
                };
            }
            const token = JwtUtils.generateExtendedToken(userResult.data, 'email');
            return {
                success: true,
                data: {
                    token,
                    user: userResult.data,
                },
                message: 'Аутентификация успешна',
            };
        }
        catch (error) {
            console.error('Email login error:', error);
            return {
                success: false,
                error: 'Ошибка при аутентификации',
            };
        }
    }
    /**
     * Аутентифицирует пользователя через Telegram Web App
     */
    static async authenticateWithTelegram(initData) {
        try {
            // Валидируем данные от Telegram
            const webAppData = TelegramUtils.validateWebAppData(initData);
            if (!webAppData) {
                return {
                    success: false,
                    error: 'Invalid Telegram Web App data',
                };
            }
            // Проверяем, не устарели ли данные
            if (TelegramUtils.isDataExpired(webAppData.auth_date)) {
                return {
                    success: false,
                    error: 'Telegram data has expired',
                };
            }
            const telegramUser = webAppData.user;
            // Проверяем, что пользователь не бот
            if (telegramUser.is_bot) {
                return {
                    success: false,
                    error: 'Bots are not allowed to authenticate',
                };
            }
            // Находим или создаем пользователя в БД
            const userResult = await UserService.findOrCreateTelegramUser({
                id: telegramUser.id,
                username: telegramUser.username,
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name,
            });
            if (!userResult.success || !userResult.data) {
                return {
                    success: false,
                    error: userResult.error || 'Failed to create/find user',
                };
            }
            // Генерируем JWT токен
            const token = JwtUtils.generateExtendedToken(userResult.data, 'telegram');
            return {
                success: true,
                data: {
                    token,
                    user: userResult.data,
                },
                message: 'Authentication successful',
            };
        }
        catch (error) {
            console.error('Authentication error:', error);
            return {
                success: false,
                error: 'Authentication failed',
            };
        }
    }
    /**
     * Аутентифицирует пользователя через Telegram Login Widget
     */
    static async authenticateWithTelegramWidget(widgetData) {
        try {
            // Валидируем данные от Telegram Widget
            const isValid = TelegramUtils.validateWidgetData(widgetData);
            if (!isValid) {
                return {
                    success: false,
                    error: 'Invalid Telegram Widget data',
                };
            }
            // Проверяем, не устарели ли данные (5 минут)
            const currentTime = Math.floor(Date.now() / 1000);
            const fiveMinutes = 5 * 60;
            if (currentTime - widgetData.auth_date > fiveMinutes) {
                return {
                    success: false,
                    error: 'Telegram data has expired',
                };
            }
            // Находим или создаем пользователя в БД
            const userResult = await UserService.findOrCreateTelegramUser({
                id: widgetData.id,
                username: widgetData.username,
                firstName: widgetData.first_name,
                lastName: widgetData.last_name,
            });
            if (!userResult.success || !userResult.data) {
                return {
                    success: false,
                    error: userResult.error || 'Failed to create/find user',
                };
            }
            // Генерируем JWT токен
            const token = JwtUtils.generateExtendedToken(userResult.data, 'telegram');
            return {
                success: true,
                data: {
                    token,
                    user: userResult.data,
                },
                message: 'Authentication successful',
            };
        }
        catch (error) {
            console.error('Telegram Widget authentication error:', error);
            return {
                success: false,
                error: 'Authentication failed',
            };
        }
    }
    /**
     * Получает тестовый токен для разработки
     */
    static getTestToken() {
        try {
            const token = JwtUtils.generateTestToken();
            const testUser = {
                id: 123456789,
                is_bot: false,
                first_name: 'Test',
                last_name: 'User',
                username: 'testuser',
            };
            return {
                success: true,
                data: {
                    token,
                    user: testUser,
                },
                message: 'Test token generated successfully',
            };
        }
        catch (error) {
            console.error('Test token generation error:', error);
            return {
                success: false,
                error: 'Failed to generate test token',
            };
        }
    }
    /**
     * Верифицирует JWT токен и возвращает данные пользователя
     */
    static verifyToken(token) {
        try {
            const payload = JwtUtils.verifyToken(token);
            if (!payload) {
                return {
                    success: false,
                    error: 'Invalid or expired token',
                };
            }
            const user = {
                id: payload.userId,
                is_bot: false,
                first_name: payload.firstName,
                last_name: payload.lastName,
                username: payload.username,
            };
            return {
                success: true,
                data: user,
                message: 'Token verified successfully',
            };
        }
        catch (error) {
            console.error('Token verification error:', error);
            return {
                success: false,
                error: 'Token verification failed',
            };
        }
    }
    /**
     * Верифицирует расширенный JWT токен и возвращает данные пользователя
     */
    static async verifyExtendedToken(token) {
        try {
            const payload = JwtUtils.verifyExtendedToken(token);
            if (!payload) {
                return {
                    success: false,
                    error: 'Invalid or expired token',
                };
            }
            // Используем userDbId для всех типов авторизации, если он есть
            let userResult;
            if (payload.userDbId) {
                // Если есть userDbId, используем его для поиска пользователя
                userResult = await UserService.getUserById(payload.userDbId);
            }
            else if (payload.authType === 'email') {
                // Для email авторизации без userDbId (обратная совместимость)
                userResult = await UserService.getUserById(payload.userId);
            }
            else if (payload.authType === 'telegram') {
                // Для Telegram авторизации без userDbId (обратная совместимость)
                userResult = await UserService.getUserByTelegramId(payload.userId.toString());
            }
            else {
                return {
                    success: false,
                    error: 'Invalid token format',
                };
            }
            if (!userResult.success || !userResult.data) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }
            return {
                success: true,
                data: userResult.data,
                message: 'Token verified successfully',
            };
        }
        catch (error) {
            console.error('Extended token verification error:', error);
            return {
                success: false,
                error: 'Token verification failed',
            };
        }
    }
    /**
     * Обновляет информацию о пользователе через Telegram API
     */
    static async refreshUserInfo(userId) {
        try {
            const userInfo = await TelegramUtils.getUserInfo(userId);
            if (!userInfo) {
                return {
                    success: false,
                    error: 'Failed to fetch user info from Telegram',
                };
            }
            return {
                success: true,
                data: userInfo,
                message: 'User info refreshed successfully',
            };
        }
        catch (error) {
            console.error('User info refresh error:', error);
            return {
                success: false,
                error: 'Failed to refresh user info',
            };
        }
    }
    /**
     * Генерирует JWT токен для пользователя
     */
    static generateTokenForUser(user) {
        return JwtUtils.generateToken(user);
    }
    /**
     * Проверяет, действителен ли токен
     */
    static isTokenValid(token) {
        return !JwtUtils.isTokenExpired(token);
    }
}
//# sourceMappingURL=authService.js.map