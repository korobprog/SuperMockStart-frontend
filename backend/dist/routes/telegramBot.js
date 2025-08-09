import express from 'express';
import { TelegramBotController } from '../controllers/telegramBotController.js';
const router = express.Router();
// Создание ссылки авторизации
router.post('/auth-url', TelegramBotController.createAuthUrl);
// Создание LoginUrl объекта для Telegram Login Widget
router.post('/login-url', TelegramBotController.createLoginUrl);
// Проверка авторизации пользователя
router.post('/verify-user', TelegramBotController.verifyUserAuth);
// Получение информации о боте
router.get('/info', TelegramBotController.getBotInfo);
// Отправка сообщения пользователю
router.post('/send-message', TelegramBotController.sendMessage);
// Получение URL для проверки токена
router.get('/check-url', (req, res) => {
    const { userId } = req.query;
    const isProduction = process.env.NODE_ENV === 'production';
    // Telegram не принимает localhost URLs
    const baseUrl = isProduction
        ? 'https://supermock.ru'
        : process.env.FRONTEND_URL || 'http://localhost:5173'; // Только для внутреннего использования
    const checkUrl = userId
        ? `${baseUrl}/token-check?userId=${userId}`
        : `${baseUrl}/token-check`;
    res.json({
        success: true,
        data: {
            checkUrl,
            environment: isProduction ? 'production' : 'development',
            userId: userId || null,
            isTelegramCompatible: isProduction, // Флаг для фронтенда
        },
    });
});
// Webhook для Telegram
router.post('/webhook', async (req, res) => {
    try {
        // Обработка webhook от Telegram
        console.log('📥 Webhook received:', req.body);
        const update = req.body;
        // Обрабатываем сообщения
        if (update.message) {
            const { TelegramBotService } = await import('../services/telegramBotService.js');
            // Обрабатываем команду /start
            if (update.message.text && update.message.text.startsWith('/start')) {
                await TelegramBotService.handleStartCommand(update.message);
            }
        }
        // Обрабатываем callback queries
        if (update.callback_query) {
            console.log('📥 Callback query received:', update.callback_query);
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.error('❌ Webhook error:', error);
        res.sendStatus(500);
    }
});
export default router;
//# sourceMappingURL=telegramBot.js.map