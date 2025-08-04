import { Router } from 'express';
import { CalendarController } from '../controllers/calendarController.js';
import { authenticateExtendedToken } from '../middleware/auth.js';

const router = Router();

// Все роуты календаря требуют расширенной аутентификации
router.use(authenticateExtendedToken);

// Получить доступные слоты времени для профессии
router.get('/slots/:profession', CalendarController.getAvailableSlots);

// Добавить пользователя в очередь на собеседование
router.post('/queue', CalendarController.joinQueue);

// Получить статус пользователя в очереди
router.get('/queue/status', CalendarController.getQueueStatus);

// Отменить участие в очереди
router.delete('/queue', CalendarController.leaveQueue);

// Получить запланированные собеседования пользователя
router.get('/sessions', CalendarController.getUserSessions);

// Получить информацию о конкретной сессии
router.get('/sessions/:sessionId', CalendarController.getSession);

// Отменить собеседование
router.patch('/sessions/:sessionId/cancel', CalendarController.cancelSession);

// Завершить собеседование
router.patch(
  '/sessions/:sessionId/complete',
  CalendarController.completeSession
);

export default router;
