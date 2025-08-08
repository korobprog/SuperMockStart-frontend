import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { TelegramUser, User, UserRole } from '../types/index.js';

// Расширяем интерфейс Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: TelegramUser | User;
      extendedUser?: User;
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
 * Middleware для проверки расширенного JWT токена
 */
export const authenticateExtendedToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('🔍 authenticateExtendedToken called');
    console.log(
      '🔍 Authorization header:',
      req.headers.authorization ? 'present' : 'missing'
    );

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid Authorization header');
      return res.status(401).json({
        success: false,
        error: 'No valid authorization header',
      });
    }

    const token = authHeader.substring(7);
    console.log('🔍 Token extracted:', token.substring(0, 20) + '...');
    console.log('🔍 Token length:', token.length);
    console.log('🔍 Token format check:', {
      isJWT: token.split('.').length === 3,
      parts: token.split('.').length,
    });

    const result = await AuthService.verifyExtendedToken(token);

    console.log('🔍 AuthService.verifyExtendedToken result:', {
      success: result.success,
      error: result.error,
      userId: result.data?.id,
    });

    if (!result.success || !result.data) {
      console.log('❌ Token verification failed:', result.error);
      return res.status(401).json({
        success: false,
        error: result.error || 'Invalid token',
      });
    }

    console.log('✅ Token verified successfully, user ID:', result.data.id);

    // Добавляем пользователя в объект запроса
    req.extendedUser = result.data;
    next();
  } catch (error) {
    console.error('❌ authenticateExtendedToken error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

/**
 * Middleware для проверки роли администратора
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
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

/**
 * Опциональная расширенная аутентификация
 */
export const optionalExtendedAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const result = await AuthService.verifyExtendedToken(token);
      if (result.success && result.data) {
        req.extendedUser = result.data;
        req.user = result.data;
      }
    } catch (error) {
      // Игнорируем ошибки для опциональной аутентификации
      console.warn('Optional extended auth failed:', error);
    }
  }

  next();
};
