export interface SubmitFeedbackData {
    sessionId: string;
    fromUserId: string;
    rating: number;
    comment?: string;
    skills?: any;
}
export declare class FeedbackService {
    /**
     * Оставить отзыв о собеседовании
     */
    static submitFeedback(data: SubmitFeedbackData): Promise<{
        id: string;
        sessionId: string;
        createdAt: Date;
        fromUserId: string;
        toUserId: string;
        rating: number;
        comment: string | null;
        skills: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Получить отзывы пользователя
     */
    static getUserFeedback(userId: string, type?: 'given' | 'received'): Promise<{
        id: string;
        sessionId: string;
        createdAt: Date;
        fromUserId: string;
        toUserId: string;
        rating: number;
        comment: string | null;
        skills: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    /**
     * Получить отзывы о сессии
     */
    static getSessionFeedback(sessionId: string, userId: string): Promise<{
        id: string;
        sessionId: string;
        createdAt: Date;
        fromUserId: string;
        toUserId: string;
        rating: number;
        comment: string | null;
        skills: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    /**
     * Поменять роли пользователей местами
     */
    private static swapUserRoles;
}
//# sourceMappingURL=feedbackService.d.ts.map