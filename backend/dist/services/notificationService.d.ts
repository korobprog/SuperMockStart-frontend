export declare class NotificationService {
    /**
     * Отправить уведомление о подтвержденном собеседовании
     */
    static sendInterviewConfirmation(session: any): Promise<void>;
    /**
     * Запланировать напоминания за 30 минут до встречи
     */
    static scheduleReminders(session: any): Promise<void>;
    /**
     * Отправить запланированные уведомления
     */
    static sendScheduledNotifications(): Promise<void>;
    /**
     * Отправить уведомление о просьбе обратной связи
     */
    static sendFeedbackRequest(sessionId: string): Promise<void>;
    /**
     * Отправить напоминание о незаполненной обратной связи
     */
    static sendFeedbackReminders(): Promise<void>;
    /**
     * Уведомить о смене ролей
     */
    static notifyRoleChange(userId: string, newRole: string): Promise<void>;
    /**
     * Отправить уведомление через Telegram
     */
    private static sendTelegramNotification;
    /**
     * Форматировать дату и время для отображения
     */
    private static formatDateTime;
    /**
     * Получить уведомления пользователя
     */
    static getUserNotifications(userId: string, limit?: number): Promise<({
        session: ({
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
        }) | null;
    } & {
        message: string;
        id: string;
        userId: string;
        sessionId: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        scheduled: Date | null;
        sent: boolean;
        sentAt: Date | null;
        createdAt: Date;
    })[]>;
    /**
     * Отметить уведомления как прочитанные
     */
    static markNotificationsAsRead(userId: string, notificationIds: string[]): Promise<void>;
}
//# sourceMappingURL=notificationService.d.ts.map