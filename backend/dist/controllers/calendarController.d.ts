import { Request, Response } from 'express';
export declare class CalendarController {
    /**
     * Получить доступные слоты времени для профессии
     */
    static getAvailableSlots(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Добавить пользователя в очередь на собеседование
     */
    static joinQueue(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получить статус пользователя в очереди
     */
    static getQueueStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Отменить участие в очереди
     */
    static leaveQueue(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получить запланированные собеседования пользователя
     */
    static getUserSessions(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Отменить собеседование
     */
    static cancelSession(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Завершить собеседование
     */
    static completeSession(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получить информацию о сессии
     */
    static getSession(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=calendarController.d.ts.map