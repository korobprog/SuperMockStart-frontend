import { Request, Response, NextFunction } from 'express';
import { TelegramUser } from '../types/index.js';
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
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware для проверки Telegram Web App данных
 */
export declare const validateTelegramData: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Опциональная аутентификация (не блокирует запрос, если токен отсутствует)
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map