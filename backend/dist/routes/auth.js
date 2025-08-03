import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken, validateTelegramData, optionalAuth, } from '../middleware/auth.js';
const router = Router();
/**
 * @route GET /api/auth/test
 * @desc Тестовый эндпоинт для проверки подключения
 * @access Public
 */
router.get('/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Auth API доступен',
        timestamp: new Date().toISOString(),
        endpoints: {
            telegram: '/api/auth/telegram',
            verify: '/api/auth/verify',
            profile: '/api/auth/profile',
            status: '/api/auth/status',
        },
    });
});
/**
 * @route POST /api/auth/telegram
 * @desc Аутентификация через Telegram Web App
 * @access Public
 */
router.post('/telegram', validateTelegramData, AuthController.authenticateWithTelegram);
/**
 * @route GET /api/auth/test-token
 * @desc Получение тестового токена для разработки
 * @access Public
 */
router.get('/test-token', AuthController.getTestToken);
/**
 * @route POST /api/auth/verify
 * @desc Верификация JWT токена
 * @access Public
 */
router.post('/verify', AuthController.verifyToken);
/**
 * @route GET /api/auth/profile
 * @desc Получение профиля текущего пользователя
 * @access Private
 */
router.get('/profile', authenticateToken, AuthController.getProfile);
/**
 * @route PUT /api/auth/refresh-user-info
 * @desc Обновление информации о пользователе через Telegram API
 * @access Private
 */
router.put('/refresh-user-info', authenticateToken, AuthController.refreshUserInfo);
/**
 * @route GET /api/auth/status
 * @desc Проверка статуса аутентификации
 * @access Public
 */
router.get('/status', optionalAuth, AuthController.checkAuthStatus);
export default router;
//# sourceMappingURL=auth.js.map