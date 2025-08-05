import { Request, Response } from 'express';
export declare class FeedbackController {
    /**
     * Оставить отзыв о собеседовании
     */
    static submitFeedback(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получить отзывы пользователя
     */
    static getUserFeedback(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Получить отзывы о сессии
     */
    static getSessionFeedback(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=feedbackController.d.ts.map