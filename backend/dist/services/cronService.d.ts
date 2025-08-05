export declare class CronService {
    private static tasks;
    /**
     * Запустить все cron задачи
     */
    static startAll(): void;
    /**
     * Остановить все cron задачи
     */
    static stopAll(): void;
    /**
     * Отправка запланированных уведомлений (каждую минуту)
     */
    private static startNotificationSender;
    /**
     * Автоматический матчинг пользователей (каждые 30 секунд)
     */
    private static startBatchMatching;
    /**
     * Очистка просроченных записей в очереди (каждый час)
     */
    private static startQueueCleaner;
    /**
     * Напоминания о незаполненной обратной связи (каждые 6 часов)
     */
    private static startFeedbackReminders;
    /**
     * Получить статус всех задач
     */
    static getTasksStatus(): Record<string, boolean>;
    /**
     * Запустить конкретную задачу
     */
    static startTask(taskName: string): void;
    /**
     * Остановить конкретную задачу
     */
    static stopTask(taskName: string): void;
}
//# sourceMappingURL=cronService.d.ts.map