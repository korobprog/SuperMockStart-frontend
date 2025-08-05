import { Request, Response } from 'express';
export declare class TelegramBotController {
    /**
     * Создает URL для авторизации через бота
     */
    static createAuthUrl(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Проверяет авторизацию пользователя через бота
     */
    static verifyUserAuth(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получает информацию о боте
     */
    static getBotInfo(req: Request, res: Response): Promise<void>;
    /**
     * Отправляет сообщение пользователю через бота
     */
    static sendMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получает информацию о пользователе через бота
     */
    static getUserInfo(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=telegramBotController.d.ts.map