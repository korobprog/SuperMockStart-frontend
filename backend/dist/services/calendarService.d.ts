import pkg from '@prisma/client';
declare const QueueType: {
    CANDIDATE: "CANDIDATE";
    INTERVIEWER: "INTERVIEWER";
}, QueueStatus: {
    WAITING: "WAITING";
    MATCHED: "MATCHED";
    CANCELLED: "CANCELLED";
    EXPIRED: "EXPIRED";
};
export interface JoinQueueData {
    userId: string;
    profession: string;
    language: string;
    preferredDateTime: Date;
    queueType: (typeof QueueType)[keyof typeof QueueType];
    timeFlexibility?: number;
}
export interface MatchResult {
    candidateEntry: any;
    interviewerEntry: any;
    scheduledDateTime: Date;
}
export declare class CalendarService {
    /**
     * Получить доступные слоты времени для профессии
     */
    static getAvailableSlots(profession: string, date?: Date): Promise<{
        datetime: Date;
        available: boolean;
    }[]>;
    /**
     * Добавить пользователя в очередь
     */
    static joinQueue(data: JoinQueueData): Promise<{
        users: {
            id: string;
            username: string | null;
            role: pkg.$Enums.UserRole;
            createdAt: Date;
            status: pkg.$Enums.UserStatus;
            updatedAt: Date;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        profession: string;
        status: pkg.$Enums.QueueStatus;
        updatedAt: Date;
        language: string;
        preferredDateTime: Date;
        timeFlexibility: number;
        queueType: pkg.$Enums.QueueType;
        matchedSessionId: string | null;
    }>;
    /**
     * Получить статус пользователя в очереди
     */
    static getQueueStatus(userId: string): Promise<{
        id: string;
        status: (typeof QueueStatus)[keyof typeof QueueStatus];
        profession: string;
        language: string;
        preferredDateTime: Date;
        matchedSession: {
            id: string;
            scheduledDateTime: Date;
            meetingLink: string;
            profession: string;
            language: string;
            candidate: {
                id: string;
                username: string | null;
                role: pkg.$Enums.UserRole;
                createdAt: Date;
                status: pkg.$Enums.UserStatus;
                updatedAt: Date;
                telegramId: string;
                firstName: string | null;
                lastName: string | null;
            };
            interviewer: {
                id: string;
                username: string | null;
                role: pkg.$Enums.UserRole;
                createdAt: Date;
                status: pkg.$Enums.UserStatus;
                updatedAt: Date;
                telegramId: string;
                firstName: string | null;
                lastName: string | null;
            };
        };
        usersInQueueWithSameLanguage?: undefined;
    } | {
        id: string;
        status: (typeof QueueStatus)[keyof typeof QueueStatus];
        profession: string;
        language: string;
        preferredDateTime: Date;
        usersInQueueWithSameLanguage: number;
        matchedSession?: undefined;
    } | null>;
    /**
     * Покинуть очередь
     */
    static leaveQueue(userId: string): Promise<void>;
    /**
     * Создать сессию собеседования из матча
     */
    static createInterviewSession(match: MatchResult): Promise<{
        users_interview_sessions_candidateIdTousers: {
            id: string;
            username: string | null;
            role: pkg.$Enums.UserRole;
            createdAt: Date;
            status: pkg.$Enums.UserStatus;
            updatedAt: Date;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
        };
        users_interview_sessions_interviewerIdTousers: {
            id: string;
            username: string | null;
            role: pkg.$Enums.UserRole;
            createdAt: Date;
            status: pkg.$Enums.UserStatus;
            updatedAt: Date;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        interviewId: string;
        scheduledDateTime: Date;
        profession: string;
        meetingLink: string;
        status: pkg.$Enums.SessionStatus;
        candidateId: string;
        interviewerId: string;
        updatedAt: Date;
        language: string;
    }>;
    /**
     * Получить сессии пользователя
     */
    static getUserSessions(userId: string): Promise<({
        users_interview_sessions_candidateIdTousers: {
            id: string;
            username: string | null;
            role: pkg.$Enums.UserRole;
            createdAt: Date;
            status: pkg.$Enums.UserStatus;
            updatedAt: Date;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
        };
        interviews: {
            id: string;
            createdAt: Date;
            status: pkg.$Enums.InterviewStatus;
            candidateId: string;
            interviewerId: string;
            updatedAt: Date;
            feedback: string | null;
            feedbackReceivedAt: Date | null;
        };
        users_interview_sessions_interviewerIdTousers: {
            id: string;
            username: string | null;
            role: pkg.$Enums.UserRole;
            createdAt: Date;
            status: pkg.$Enums.UserStatus;
            updatedAt: Date;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        interviewId: string;
        scheduledDateTime: Date;
        profession: string;
        meetingLink: string;
        status: pkg.$Enums.SessionStatus;
        candidateId: string;
        interviewerId: string;
        updatedAt: Date;
        language: string;
    })[]>;
    /**
     * Отменить сессию
     */
    static cancelSession(sessionId: string, userId: string): Promise<void>;
    /**
     * Завершить сессию
     */
    static completeSession(sessionId: string, userId: string): Promise<void>;
    /**
     * Создать запрос на обратную связь
     */
    static createFeedbackRequest(sessionId: string): Promise<void>;
    /**
     * Генерировать ссылку на встречу
     */
    private static generateMeetingLink;
}
export {};
//# sourceMappingURL=calendarService.d.ts.map