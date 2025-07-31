import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { TelegramUser } from '../types/index.js';

// Расширяем интерфейс Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: TelegramUser;
    }
  }
}

/**
 * Middleware для проверки JWT токена
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const validateTelegramData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({
      success: false,
      error: 'Telegram initData is required',
    });
  }

  // Добавляем initData в request для использования в контроллере
  (req as any).initData = initData;
  next();
};

/**
 * Опциональная аутентификация (не блокирует запрос, если токен отсутствует)
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
