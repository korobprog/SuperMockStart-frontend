import { Router } from 'express';
import { UserStatusController } from '../controllers/userStatusController.js';
import { authenticateToken } from '../middleware/auth.js';

const router: Router = Router();

// Все роуты требуют аутентификации
router.use(authenticateToken);

// Получение статуса пользователя
router.get('/status', UserStatusController.getUserStatus);

// Обновление статуса (для тестирования)
router.put('/status', UserStatusController.updateUserStatus);

// Создание интервью
router.post('/interviews', UserStatusController.createInterview);

// Завершение интервью
router.put(
  '/interviews/:interviewId/complete',
  UserStatusController.completeInterview
);

// Добавление обратной связи
router.post(
  '/interviews/:interviewId/feedback',
  UserStatusController.addFeedback
);

// Получение доступных кандидатов
router.get('/candidates', UserStatusController.getAvailableCandidates);

// Получение интервью пользователя
router.get('/interviews', UserStatusController.getUserInterviews);

export default router;
