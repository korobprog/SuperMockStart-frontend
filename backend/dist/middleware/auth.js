import { AuthService } from '../services/authService.js';
import { UserRole } from '../types/index.js';
/**
 * Middleware для проверки JWT токена
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access token required',
        });
    }
    const result = AuthService.verifyToken(token);
    if (!result.success || !result.data) {
        return res.status(401).json({
            success: false,
            error: result.error || 'Invalid token',
        });
    }
    req.user = result.data;
    next();
};
/**
 * Middleware для проверки Telegram Web App данных
 */
export const validateTelegramData = (req, res, next) => {
    const { initData } = req.body;
    if (!initData) {
        return res.status(400).json({
            success: false,
            error: 'Telegram initData is required',
        });
    }
    // Добавляем initData в request для использования в контроллере
    req.initData = initData;
    next();
};
/**
 * Middleware для проверки расширенного JWT токена
 */
export const authenticateExtendedToken = async (req, res, next) => {
    console.log('🔍 authenticateExtendedToken вызван');
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('🔍 authHeader:', authHeader);
    console.log('🔍 token:', token ? 'найден' : 'не найден');
    if (!token) {
        console.log('❌ Токен не найден в заголовке');
        return res.status(401).json({
            success: false,
            error: 'Access token required',
        });
    }
    try {
        console.log('🔍 Вызываем AuthService.verifyExtendedToken');
        const result = await AuthService.verifyExtendedToken(token);
        console.log('🔍 Результат верификации:', result);
        if (!result.success || !result.data) {
            console.log('❌ Верификация токена не удалась:', result.error);
            return res.status(401).json({
                success: false,
                error: result.error || 'Invalid token',
            });
        }
        console.log('✅ Токен верифицирован успешно');
        console.log('🔍 result.data:', result.data);
        req.extendedUser = result.data;
        req.user = result.data;
        next();
    }
    catch (error) {
        console.error('❌ Extended token authentication error:', error);
        return res.status(401).json({
            success: false,
            error: 'Token verification failed',
        });
    }
};
/**
 * Middleware для проверки роли администратора
 */
export const requireAdmin = (req, res, next) => {
    if (!req.extendedUser) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required',
        });
    }
    if (req.extendedUser.role !== UserRole.ADMIN) {
        return res.status(403).json({
            success: false,
            error: 'Admin access required',
        });
    }
    next();
};
/**
 * Middleware для проверки роли пользователя
 */
export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.extendedUser) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
        }
        // Администратор имеет доступ ко всем ролям
        if (req.extendedUser.role === UserRole.ADMIN) {
            return next();
        }
        if (req.extendedUser.role !== role) {
            return res.status(403).json({
                success: false,
                error: `Role ${role} required`,
            });
        }
        next();
    };
};
/**
 * Опциональная аутентификация (не блокирует запрос, если токен отсутствует)
 */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        const result = AuthService.verifyToken(token);
        if (result.success && result.data) {
            req.user = result.data;
        }
    }
    next();
};
/**
 * Опциональная расширенная аутентификация
 */
export const optionalExtendedAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        try {
            const result = await AuthService.verifyExtendedToken(token);
            if (result.success && result.data) {
                req.extendedUser = result.data;
                req.user = result.data;
            }
        }
        catch (error) {
            // Игнорируем ошибки для опциональной аутентификации
            console.warn('Optional extended auth failed:', error);
        }
    }
    next();
};
//# sourceMappingURL=auth.js.map