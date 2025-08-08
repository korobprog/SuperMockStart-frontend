import { Request, Response } from 'express';
export declare class AuthController {
    /**
     * Регистрация нового пользователя
     */
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Вход через email/password
     */
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Изменение пароля
     */
    static changePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Привязка Telegram аккаунта
     */
    static linkTelegram(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Аутентификация через Telegram Web App
     */
    static authenticateWithTelegram(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Аутентификация через Telegram Login Widget
     */
    static authenticateWithTelegramWidget(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Аутентификация через Telegram Login Widget (новый)
     */
    static authenticateWithTelegramLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получение тестового токена для разработки
     */
    static getTestToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Создание тестового токена для реального пользователя (без валидации)
     */
    static createTestTokenForUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Верификация JWT токена
     */
    static verifyToken(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
    /**
     * Верификация расширенного JWT токена
     */
    static verifyExtendedToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    /**
     * Session endpoint using cookies
     */
    static session(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Logout clears session cookie
     */
    static logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Валидация JWT токена
     */
    static validateToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Создание тестового пользователя для разработки
     */
    static createDevUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=authController.d.ts.map