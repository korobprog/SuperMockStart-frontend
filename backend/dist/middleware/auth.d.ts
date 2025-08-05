import { Request, Response, NextFunction } from 'express';
import { TelegramUser, User, UserRole } from '../types/index.js';
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
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware для проверки Telegram Web App данных
 */
export declare const validateTelegramData: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware для проверки расширенного JWT токена
 */
export declare const authenticateExtendedToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Middleware для проверки роли администратора
 */
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware для проверки роли пользователя
 */
export declare const requireRole: (role: UserRole) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Опциональная аутентификация (не блокирует запрос, если токен отсутствует)
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Опциональная расширенная аутентификация
 */
export declare const optionalExtendedAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map