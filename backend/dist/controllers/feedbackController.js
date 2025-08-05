import { FeedbackService } from '../services/feedbackService.js';
export class FeedbackController {
    /**
     * Оставить отзыв о собеседовании
     */
    static async submitFeedback(req, res) {
        try {
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            const { sessionId } = req.params;
            const { rating, comment, skills } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    error: 'Rating must be between 1 and 5',
                });
            }
            const feedback = await FeedbackService.submitFeedback({
                sessionId,
                fromUserId: userId,
                rating,
                comment,
                skills,
            });
            res.json({
                success: true,
                data: feedback,
                message: 'Feedback submitted successfully',
            });
        }
        catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to submit feedback',
            });
        }
    }
    /**
     * Получить отзывы пользователя
     */
    static async getUserFeedback(req, res) {
        try {
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            const { type } = req.query; // 'given' или 'received'
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            const feedback = await FeedbackService.getUserFeedback(userId, type);
            res.json({
                success: true,
                data: feedback,
            });
        }
        catch (error) {
            console.error('Error getting user feedback:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get user feedback',
            });
        }
    }
    /**
     * Получить отзывы о сессии
     */
    static async getSessionFeedback(req, res) {
        try {
            // Используем extendedUser.id (userDbId) из расширенного токена
            const userId = req.extendedUser?.id;
            const { sessionId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
            }
            const feedback = await FeedbackService.getSessionFeedback(sessionId, userId);
            res.json({
                success: true,
                data: feedback,
            });
        }
        catch (error) {
            console.error('Error getting session feedback:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get session feedback',
            });
        }
    }
}
//# sourceMappingURL=feedbackController.js.map