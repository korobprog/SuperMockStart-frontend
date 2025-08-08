import express from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/authController.js';
import {
  authenticateToken,
  authenticateExtendedToken,
  optionalExtendedAuth,
} from '../middleware/auth.js';
import { validateTelegramData } from '../middleware/auth.js';

const router: express.Router = express.Router();

// Специальный rate limiter для test-token с более строгими ограничениями
const testTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // максимум 10 запросов за 15 минут
  message: {
    success: false,
    error: 'Too many test token requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

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
      'telegram-widget': '/api/auth/telegram-widget',
    },
  });
});

/**
 * @route POST /api/auth/register
 * @desc Регистрация нового пользователя
 * @access Public
 */
router.post('/register', AuthController.register);

/**
 * @route POST /api/auth/login
 * @desc Вход через email/password
 * @access Public
 */
router.post('/login', AuthController.login);

/**
 * @route POST /api/auth/change-password
 * @desc Изменение пароля
 * @access Private
 */
router.post(
  '/change-password',
  authenticateExtendedToken,
  AuthController.changePassword
);

/**
 * @route POST /api/auth/telegram
 * @desc Аутентификация через Telegram Web App
 * @access Public
 */
router.post(
  '/telegram',
  validateTelegramData,
  AuthController.authenticateWithTelegram
);

/**
 * @route POST /api/auth/telegram-widget
 * @desc Аутентификация через Telegram Login Widget
 * @access Public
 */
router.post('/telegram-widget', AuthController.authenticateWithTelegramWidget);

/**
 * @route POST /api/auth/telegram-login
 * @desc Аутентификация через Telegram Login Widget (новый)
 * @access Public
 */
router.post('/telegram-login', AuthController.authenticateWithTelegramLogin);

/**
 * @route POST /api/auth/telegram
 * @desc Аутентификация через Telegram Login Widget (новый формат)
 * @access Public
 */
router.post('/telegram', AuthController.authenticateWithTelegramLoginWidget);

/**
 * @route GET /api/auth/test-token
 * @desc Получение тестового токена для разработки
 * @access Public
 */
router.get('/test-token', testTokenLimiter, AuthController.getTestToken);

/**
 * @route POST /api/auth/test-token-user
 * @desc Создание тестового токена для реального пользователя
 * @access Public
 */
router.post('/test-token-user', AuthController.createTestTokenForUser);

/**
 * @route POST /api/auth/verify
 * @desc Верификация JWT токена
 * @access Public
 */
router.post('/verify', AuthController.verifyToken);

/**
 * @route POST /api/auth/verify-extended-token
 * @desc Верификация расширенного JWT токена
 * @access Public
 */
router.post('/verify-extended-token', AuthController.verifyExtendedToken);

/**
 * @route POST /api/auth/validate-token
 * @desc Валидация JWT токена
 * @access Public
 */
router.post('/validate-token', AuthController.validateToken);

/**
 * @route GET /api/auth/profile
 * @desc Получение профиля текущего пользователя
 * @access Private
 */
router.get('/profile', authenticateExtendedToken, AuthController.getProfile);

/**
 * @route PUT /api/auth/refresh-user-info
 * @desc Обновление информации о пользователе через Telegram API
 * @access Private
 */
router.put(
  '/refresh-user-info',
  authenticateToken,
  AuthController.refreshUserInfo
);

/**
 * @route GET /api/auth/status
 * @desc Проверка статуса аутентификации
 * @access Public
 */
router.get('/status', optionalExtendedAuth, AuthController.checkAuthStatus);

/**
 * @route POST /api/auth/link-telegram
 * @desc Привязка Telegram аккаунта к существующему пользователю
 * @access Private
 */
router.post(
  '/link-telegram',
  authenticateExtendedToken,
  AuthController.linkTelegram
);

/**
 * @route POST /api/auth/dev-user
 * @desc Создание тестового пользователя для разработки
 * @access Public (только в dev режиме)
 */
router.post('/dev-user', AuthController.createDevUser);

export default router;
