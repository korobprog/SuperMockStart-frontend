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
        interview_sessions: {
            id: string;
            createdAt: Date;
            interviewId: string;
            scheduledDateTime: Date;
            profession: string;
            meetingLink: string;
            status: import("@prisma/client").$Enums.SessionStatus;
            candidateId: string;
            interviewerId: string;
            updatedAt: Date;
            language: string;
        };
        users_feedback_fromUserIdTousers: {
            id: string;
            username: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
            updatedAt: Date;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
        };
        users_feedback_toUserIdTousers: {
            id: string;
            username: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
            updatedAt: Date;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
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
    static getUserFeedback(userId: string, type?: 'given' | 'received'): Promise<({
        interview_sessions: {
            scheduledDateTime: Date;
            profession: string;
        };
        users_feedback_fromUserIdTousers: {
            username: string | null;
            firstName: string | null;
            lastName: string | null;
        };
        users_feedback_toUserIdTousers: {
            username: string | null;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        sessionId: string;
        createdAt: Date;
        fromUserId: string;
        toUserId: string;
        rating: number;
        comment: string | null;
        skills: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    /**
     * Получить отзывы о сессии
     */
    static getSessionFeedback(sessionId: string, userId: string): Promise<({
        users_feedback_fromUserIdTousers: {
            username: string | null;
            firstName: string | null;
            lastName: string | null;
        };
        users_feedback_toUserIdTousers: {
            username: string | null;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        sessionId: string;
        createdAt: Date;
        fromUserId: string;
        toUserId: string;
        rating: number;
        comment: string | null;
        skills: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    /**
     * Поменять роли пользователей местами
     */
    private static swapUserRoles;
}
//# sourceMappingURL=feedbackService.d.ts.map