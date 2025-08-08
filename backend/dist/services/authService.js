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
    static async getTestToken() {
        try {
            // В продакшн режиме не выдаем тестовые токены
            if (process.env.NODE_ENV === 'production') {
                return {
                    success: false,
                    error: 'Test tokens are not available in production',
                };
            }
            // Создаем тестового пользователя в базе данных
            const userResult = await UserService.findOrCreateTelegramUser({
                id: 123456789,
                username: 'testuser',
                firstName: 'Test',
                lastName: 'User',
            });
            if (!userResult.success || !userResult.data) {
                return {
                    success: false,
                    error: userResult.error || 'Failed to create test user',
                };
            }
            // Генерируем JWT токен для созданного пользователя
            const token = JwtUtils.generateExtendedToken(userResult.data, 'telegram');
            return {
                success: true,
                data: {
                    token,
                    user: userResult.data,
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
            console.log('🔍 verifyExtendedToken called with token:', token.substring(0, 20) + '...');
            console.log('🔍 token length:', token.length);
            console.log('🔍 token format check:', {
                isJWT: token.split('.').length === 3,
                parts: token.split('.').length,
            });
            const payload = JwtUtils.verifyExtendedToken(token);
            console.log('🔍 JWT payload:', payload);
            if (!payload) {
                console.log('❌ JWT verification failed - no payload');
                return {
                    success: false,
                    error: 'Invalid or expired token',
                };
            }
            // Используем userDbId для всех типов авторизации, если он есть
            let userResult;
            if (payload.userDbId) {
                // Если есть userDbId, используем его для поиска пользователя
                console.log('🔍 Using userDbId:', payload.userDbId);
                userResult = await UserService.getUserById(payload.userDbId);
            }
            else if (payload.authType === 'email') {
                // Для email авторизации без userDbId (обратная совместимость)
                console.log('🔍 Using userId for email auth:', payload.userId);
                userResult = await UserService.getUserById(payload.userId);
            }
            else if (payload.authType === 'telegram') {
                // Для Telegram авторизации без userDbId (обратная совместимость)
                console.log('🔍 Using telegramId:', payload.userId);
                userResult = await UserService.getUserByTelegramId(payload.userId.toString());
            }
            else {
                console.log('❌ Invalid token format - no valid auth type or userDbId');
                return {
                    success: false,
                    error: 'Invalid token format',
                };
            }
            console.log('🔍 UserService result:', userResult);
            if (!userResult.success || !userResult.data) {
                console.log('❌ User not found:', userResult.error);
                console.log('❌ UserService response:', userResult);
                return {
                    success: false,
                    error: 'User not found',
                };
            }
            console.log('✅ User found:', userResult.data.id);
            return {
                success: true,
                data: userResult.data,
                message: 'Token verified successfully',
            };
        }
        catch (error) {
            console.error('❌ Extended token verification error:', error);
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
    /**
     * Создает тестового пользователя для разработки
     */
    static async createDevUser(data) {
        try {
            // Проверяем, что мы в режиме разработки
            if (process.env.NODE_ENV === 'production') {
                return {
                    success: false,
                    error: 'Dev user creation is not allowed in production',
                };
            }
            // Создаем пользователя через UserService
            const userResult = await UserService.findOrCreateTelegramUser({
                id: data.telegramId,
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
            });
            if (!userResult.success || !userResult.data) {
                return {
                    success: false,
                    error: userResult.error || 'Failed to create dev user',
                };
            }
            // Генерируем токен
            const token = JwtUtils.generateExtendedToken(userResult.data, 'telegram');
            return {
                success: true,
                data: {
                    token,
                    user: userResult.data,
                },
                message: 'Dev user created successfully',
            };
        }
        catch (error) {
            console.error('Create dev user error:', error);
            return {
                success: false,
                error: 'Failed to create dev user',
            };
        }
    }
}
//# sourceMappingURL=authService.js.map