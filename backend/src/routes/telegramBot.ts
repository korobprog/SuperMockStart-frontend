import express from 'express';
import { TelegramBotController } from '../controllers/telegramBotController.js';

const router = express.Router();

// Создание ссылки авторизации
router.post('/auth-url', TelegramBotController.createAuthUrl);

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
  const baseUrl = isProduction
    ? 'https://supermock.ru'
    : 'http://localhost:5173'; // Используем localhost для разработки

  const checkUrl = userId
    ? `${baseUrl}/token-check?userId=${userId}`
    : `${baseUrl}/token-check`;

  res.json({
    success: true,
    data: {
      checkUrl,
      environment: isProduction ? 'production' : 'development',
      userId: userId || null,
    },
  });
});

// Webhook для Telegram
router.post('/webhook', (req, res) => {
  // Обработка webhook от Telegram
  console.log('📥 Webhook received:', req.body);
  res.sendStatus(200);
});

export default router;
