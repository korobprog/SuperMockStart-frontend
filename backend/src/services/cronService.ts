import * as cron from 'node-cron';
import { NotificationService } from './notificationService.js';
import { MatchingService } from './matchingService.js';
import { CalendarService } from './calendarService.js';

export class CronService {
  private static tasks: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Запустить все cron задачи
   */
  static startAll() {
    console.log('🕒 Starting all cron tasks...');

    this.startNotificationSender();
    this.startBatchMatching();
    this.startQueueCleaner();
    this.startFeedbackReminders();

    console.log('🕒 All cron tasks started');
  }

  /**
   * Остановить все cron задачи
   */
  static stopAll() {
    this.tasks.forEach((task, name) => {
      task.destroy();
      console.log(`⏹️  Stopped cron task: ${name}`);
    });
    this.tasks.clear();
  }

  /**
   * Отправка запланированных уведомлений (каждую минуту)
   */
  private static startNotificationSender() {
    const task = cron.schedule(
      '* * * * *',
      async () => {
        try {
          await NotificationService.sendScheduledNotifications();
        } catch (error) {
          console.error('Error in notification sender cron:', error);
        }
      },
      {
        timezone: 'Europe/Moscow',
      }
    );

    this.tasks.set('notificationSender', task);
    console.log('📨 Started notification sender (every minute)');
  }

  /**
   * Автоматический матчинг пользователей (каждые 30 секунд)
   */
  private static startBatchMatching() {
    const task = cron.schedule('*/30 * * * * *', async () => {
      try {
        const matches = await MatchingService.runBatchMatching();

        if (matches.length > 0) {
          console.log(`🎯 Found ${matches.length} matches`);

          // Создаем сессии для каждого матча
          for (const match of matches) {
            try {
              const session = await CalendarService.createInterviewSession(
                match
              );
              await NotificationService.sendInterviewConfirmation(session);
            } catch (error) {
              console.error('Error creating session for match:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error in batch matching cron:', error);
      }
    });

    this.tasks.set('batchMatching', task);
    console.log('🔄 Started batch matching (every 30 seconds)');
  }

  /**
   * Очистка просроченных записей в очереди (каждый час)
   */
  private static startQueueCleaner() {
    const task = cron.schedule('0 * * * *', async () => {
      try {
        await MatchingService.cleanExpiredEntries();
        console.log('🧹 Cleaned expired queue entries');
      } catch (error) {
        console.error('Error in queue cleaner cron:', error);
      }
    });

    this.tasks.set('queueCleaner', task);
    console.log('🧹 Started queue cleaner (every hour)');
  }

  /**
   * Напоминания о незаполненной обратной связи (каждые 6 часов)
   */
  private static startFeedbackReminders() {
    const task = cron.schedule('0 */6 * * *', async () => {
      try {
        await NotificationService.sendFeedbackReminders();
        console.log('📝 Sent feedback reminders');
      } catch (error) {
        console.error('Error in feedback reminders cron:', error);
      }
    });

    this.tasks.set('feedbackReminders', task);
    console.log('📝 Started feedback reminders (every 6 hours)');
  }

  /**
   * Получить статус всех задач
   */
  static getTasksStatus() {
    const status: Record<string, boolean> = {};

    this.tasks.forEach((task, name) => {
      status[name] = task.getStatus() === 'scheduled';
    });

    return status;
  }

  /**
   * Запустить конкретную задачу
   */
  static startTask(taskName: string) {
    const task = this.tasks.get(taskName);
    if (task) {
      task.start();
      console.log(`▶️  Started task: ${taskName}`);
    } else {
      console.warn(`Task not found: ${taskName}`);
    }
  }

  /**
   * Остановить конкретную задачу
   */
  static stopTask(taskName: string) {
    const task = this.tasks.get(taskName);
    if (task) {
      task.stop();
      console.log(`⏸️  Stopped task: ${taskName}`);
    } else {
      console.warn(`Task not found: ${taskName}`);
    }
  }
}
