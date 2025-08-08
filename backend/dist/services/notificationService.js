import { PrismaClient } from '@prisma/client';
import pkg from '@prisma/client';
const { NotificationType } = pkg;
import { TelegramBotService } from './telegramBotService.js';
const prisma = new PrismaClient();
export class NotificationService {
    /**
     * Отправить уведомление о подтвержденном собеседовании
     */
    static async sendInterviewConfirmation(session) {
        const notifications = [
            {
                userId: session.candidateId,
                sessionId: session.id,
                type: NotificationType.INTERVIEW_CONFIRMED,
                title: 'Собеседование подтверждено!',
                message: `Ваше собеседование по профессии "${session.profession}" назначено на ${this.formatDateTime(session.scheduledDateTime)}. Ссылка для подключения: ${session.meetingLink}`,
            },
            {
                userId: session.interviewerId,
                sessionId: session.id,
                type: NotificationType.INTERVIEW_CONFIRMED,
                title: 'Собеседование подтверждено!',
                message: `Ваше собеседование по профессии "${session.profession}" назначено на ${this.formatDateTime(session.scheduledDateTime)}. Ссылка для подключения: ${session.meetingLink}`,
            },
        ];
        // Сохраняем уведомления в БД
        await prisma.notifications.createMany({
            data: notifications,
        });
        // Отправляем через Telegram
        for (const notification of notifications) {
            await this.sendTelegramNotification(notification.userId, notification.title, notification.message);
        }
        // Планируем напоминания за 30 минут
        await this.scheduleReminders(session);
    }
    /**
     * Запланировать напоминания за 30 минут до встречи
     */
    static async scheduleReminders(session) {
        const reminderTime = new Date(session.scheduledDateTime);
        reminderTime.setMinutes(reminderTime.getMinutes() - 30);
        // Только если время напоминания в будущем
        if (reminderTime > new Date()) {
            const reminderNotifications = [
                {
                    userId: session.candidateId,
                    sessionId: session.id,
                    type: NotificationType.INTERVIEW_REMINDER,
                    title: 'Напоминание о собеседовании',
                    message: `Через 30 минут у вас собеседование! Проверьте камеру, микрофон и интернет-соединение. Ссылка: ${session.meetingLink}`,
                    scheduled: reminderTime,
                },
                {
                    userId: session.interviewerId,
                    sessionId: session.id,
                    type: NotificationType.INTERVIEW_REMINDER,
                    title: 'Напоминание о собеседовании',
                    message: `Через 30 минут у вас собеседование! Проверьте камеру, микрофон и интернет-соединение. Ссылка: ${session.meetingLink}`,
                    scheduled: reminderTime,
                },
            ];
            await prisma.notifications.createMany({
                data: reminderNotifications,
            });
        }
    }
    /**
     * Отправить запланированные уведомления
     */
    static async sendScheduledNotifications() {
        const now = new Date();
        const notifications = await prisma.notifications.findMany({
            where: {
                scheduled: { lte: now },
                sent: false,
            },
            include: {
                user: true,
            },
        });
        for (const notification of notifications) {
            try {
                await this.sendTelegramNotification(notification.userId, notification.title, notification.message);
                await prisma.notifications.update({
                    where: { id: notification.id },
                    data: {
                        sent: true,
                        sentAt: now,
                    },
                });
            }
            catch (error) {
                console.error(`Failed to send notification ${notification.id}:`, error);
            }
        }
    }
    /**
     * Отправить уведомление о просьбе обратной связи
     */
    static async sendFeedbackRequest(sessionId) {
        const session = await prisma.interview_sessions.findUnique({
            where: { id: sessionId },
            include: {
                candidate: true,
                interviewer: true,
            },
        });
        if (!session)
            return;
        const notifications = [
            {
                userId: session.candidateId,
                sessionId: session.id,
                type: NotificationType.FEEDBACK_REQUEST,
                title: 'Оставьте отзыв о собеседовании',
                message: 'Пожалуйста, поделитесь своим опытом прошедшего собеседования. Ваш отзыв поможет улучшить систему.',
            },
            {
                userId: session.interviewerId,
                sessionId: session.id,
                type: NotificationType.FEEDBACK_REQUEST,
                title: 'Оставьте отзыв о собеседовании',
                message: 'Пожалуйста, поделитесь своим опытом прошедшего собеседования. Ваш отзыв поможет улучшить систему.',
            },
        ];
        await prisma.notifications.createMany({
            data: notifications,
        });
        for (const notification of notifications) {
            await this.sendTelegramNotification(notification.userId, notification.title, notification.message);
        }
    }
    /**
     * Отправить напоминание о незаполненной обратной связи
     */
    static async sendFeedbackReminders() {
        // Находим завершенные сессии без обратной связи старше 24 часов
        const sessionsNeedingFeedback = await prisma.interview_sessions.findMany({
            where: {
                status: 'COMPLETED',
                updatedAt: {
                    lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 часа назад
                },
            },
            include: {
                feedbacks: true,
                candidate: true,
                interviewer: true,
            },
        });
        for (const session of sessionsNeedingFeedback) {
            const candidateGaveFeedback = session.feedbacks.some((f) => f.fromUserId === session.candidateId);
            const interviewerGaveFeedback = session.feedbacks.some((f) => f.fromUserId === session.interviewerId);
            if (!candidateGaveFeedback) {
                await this.sendTelegramNotification(session.candidateId, 'Напоминание об отзыве', 'Вы еще не оставили отзыв о прошедшем собеседовании. Пожалуйста, поделитесь своим опытом.');
            }
            if (!interviewerGaveFeedback) {
                await this.sendTelegramNotification(session.interviewerId, 'Напоминание об отзыве', 'Вы еще не оставили отзыв о прошедшем собеседовании. Пожалуйста, поделитесь своим опытом.');
            }
        }
    }
    /**
     * Уведомить о смене ролей
     */
    static async notifyRoleChange(userId, newRole) {
        await prisma.notifications.create({
            data: {
                userId,
                type: NotificationType.ROLE_CHANGED,
                title: 'Роль изменена',
                message: `Ваша роль изменена на: ${newRole}. Теперь вы можете участвовать в собеседованиях в новой роли.`,
            },
        });
        await this.sendTelegramNotification(userId, 'Роль изменена', `Ваша роль изменена на: ${newRole}. Теперь вы можете участвовать в собеседованиях в новой роли.`);
    }
    /**
     * Отправить уведомление через Telegram
     */
    static async sendTelegramNotification(userId, title, message) {
        try {
            const user = await prisma.users.findUnique({
                where: { id: userId },
            });
            if (user?.telegramId) {
                await TelegramBotService.sendMessage(parseInt(user.telegramId), `🔔 *${title}*\n\n${message}`);
            }
        }
        catch (error) {
            console.error('Failed to send Telegram notification:', error);
        }
    }
    /**
     * Форматировать дату и время для отображения
     */
    static formatDateTime(date) {
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Moscow',
        });
    }
    /**
     * Получить уведомления пользователя
     */
    static async getUserNotifications(userId, limit = 50) {
        return await prisma.notifications.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                session: {
                    include: {
                        candidate: true,
                        interviewer: true,
                    },
                },
            },
        });
    }
    /**
     * Отметить уведомления как прочитанные
     */
    static async markNotificationsAsRead(userId, notificationIds) {
        await prisma.notifications.updateMany({
            where: {
                id: { in: notificationIds },
                userId,
            },
            data: {
                sent: true,
                sentAt: new Date(),
            },
        });
    }
}
//# sourceMappingURL=notificationService.js.map