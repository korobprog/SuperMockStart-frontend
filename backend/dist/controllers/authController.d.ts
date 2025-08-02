import { Request, Response } from 'express';
export declare class AuthController {
    /**
     * Аутентификация через Telegram Web App
     */
    static authenticateWithTelegram(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получение тестового токена для разработки
     */
    static getTestToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Проверка валидности токена
     */
    static verifyToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Обновление информации о пользователе
     */
    static refreshUserInfo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Получение профиля текущего пользователя
     */
    static getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Проверка статуса аутентификации
     */
    static checkAuthStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=authController.d.ts.map