import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController.js';
import { authenticateExtendedToken } from '../middleware/auth.js';
const router = Router();
// Все роуты фидбека требуют аутентификации
router.use(authenticateExtendedToken);
// Оставить отзыв о собеседовании
router.post('/sessions/:sessionId', FeedbackController.submitFeedback);
// Получить отзывы пользователя
router.get('/user', FeedbackController.getUserFeedback);
// Получить отзывы о сессии
router.get('/sessions/:sessionId', FeedbackController.getSessionFeedback);
export default router;
//# sourceMappingURL=feedback.js.map