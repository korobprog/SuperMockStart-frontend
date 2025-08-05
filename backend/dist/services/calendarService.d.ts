import { QueueType, QueueStatus } from '@prisma/client';
export interface JoinQueueData {
    userId: string;
    profession: string;
    language: string;
    preferredDateTime: Date;
    queueType: QueueType;
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
        user: {
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
        userId: string;
        createdAt: Date;
        profession: string;
        language: string;
        status: import("@prisma/client").$Enums.QueueStatus;
        updatedAt: Date;
        preferredDateTime: Date;
        timeFlexibility: number;
        queueType: import("@prisma/client").$Enums.QueueType;
        matchedSessionId: string | null;
    }>;
    /**
     * Получить статус пользователя в очереди
     */
    static getQueueStatus(userId: string): Promise<{
        id: string;
        status: QueueStatus;
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
                role: import("@prisma/client").$Enums.UserRole;
                createdAt: Date;
                status: import("@prisma/client").$Enums.UserStatus;
                updatedAt: Date;
                telegramId: string;
                firstName: string | null;
                lastName: string | null;
            };
            interviewer: {
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
        };
        usersInQueueWithSameLanguage?: undefined;
    } | {
        id: string;
        status: QueueStatus;
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
        candidate: {
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
        interviewer: {
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
        createdAt: Date;
        interviewId: string;
        scheduledDateTime: Date;
        profession: string;
        language: string;
        meetingLink: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        candidateId: string;
        interviewerId: string;
        updatedAt: Date;
    }>;
    /**
     * Получить сессии пользователя
     */
    static getUserSessions(userId: string): Promise<({
        interview: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.InterviewStatus;
            candidateId: string;
            interviewerId: string;
            updatedAt: Date;
            feedback: string | null;
            feedbackReceivedAt: Date | null;
        };
        candidate: {
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
        interviewer: {
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
        createdAt: Date;
        interviewId: string;
        scheduledDateTime: Date;
        profession: string;
        language: string;
        meetingLink: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        candidateId: string;
        interviewerId: string;
        updatedAt: Date;
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
//# sourceMappingURL=calendarService.d.ts.map