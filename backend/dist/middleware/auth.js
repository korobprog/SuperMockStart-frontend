import { AuthService } from '../services/authService.js';
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
//# sourceMappingURL=auth.js.map