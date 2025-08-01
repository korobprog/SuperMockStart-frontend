import { Request, Response } from 'express';
export declare class AuthController {
    /**
     * Аутентификация через Telegram Web App
     */
    static authenticate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Верификация токена
     */
    static verifyToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
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