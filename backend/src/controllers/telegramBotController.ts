import { Request, Response } from 'express';
import { TelegramBotService } from '../services/telegramBotService.js';
import { AuthService } from '../services/authService.js';
import { ApiResponse } from '../types/index.js';

export class TelegramBotController {
  /**
   * Создает URL для авторизации через бота
   */
  static async createAuthUrl(req: Request, res: Response) {
    try {
      const { userId, redirectUrl } = req.body;

      if (!userId || !redirectUrl) {
        return res.status(400).json({
          success: false,
          error: 'userId and redirectUrl are required',
        } as ApiResponse);
      }

      const authUrl = TelegramBotService.createAuthUrl(userId, redirectUrl);

      res.json({
        success: true,
        data: { authUrl },
        message: 'Auth URL created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Create auth URL error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Проверяет авторизацию пользователя через бота
   */
  static async verifyUserAuth(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
        } as ApiResponse);
      }

      // Проверяем, может ли бот отправлять сообщения пользователю
      const canSendMessage = await TelegramBotService.canSendMessage(userId);

      if (!canSendMessage) {
        return res.status(403).json({
          success: false,
          error:
            'Bot cannot send messages to this user. User must start the bot first.',
        } as ApiResponse);
      }

      // Получаем базовую информацию о пользователе
      const userInfo = await TelegramBotService.getUserInfo(userId);

      if (!userInfo) {
        return res.status(404).json({
          success: false,
          error: 'User not found or bot cannot access user info',
        } as ApiResponse);
      }

      // Генерируем JWT токен
      const token = AuthService.generateTokenForUser(userInfo);

      res.json({
        success: true,
        data: {
          user: userInfo,
          token,
          canSendMessage,
        },
        message: 'User verified successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Verify user auth error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Получает информацию о боте
   */
  static async getBotInfo(req: Request, res: Response) {
    try {
      const result = await TelegramBotService.getBotInfo();
      res.json(result);
    } catch (error) {
      console.error('Get bot info error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Отправляет сообщение пользователю через бота
   */
  static async sendMessage(req: Request, res: Response) {
    try {
      const { userId, message, withButton } = req.body;

      if (!userId || !message) {
        return res.status(400).json({
          success: false,
          error: 'userId and message are required',
        } as ApiResponse);
      }

      let success: boolean;

      if (withButton) {
        // Отправляем сообщение с кнопкой проверки токена
        await TelegramBotService.sendCheckTokenButton(userId);
        success = true;
      } else {
        // Отправляем обычное сообщение
        success = await TelegramBotService.sendMessage(userId, message);
      }

      if (success) {
        res.json({
          success: true,
          message: 'Message sent successfully',
        } as ApiResponse);
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to send message',
        } as ApiResponse);
      }
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Получает информацию о пользователе через бота
   */
  static async getUserInfo(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
        } as ApiResponse);
      }

      const userInfo = await TelegramBotService.getUserInfo(parseInt(userId));

      if (!userInfo) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: userInfo,
        message: 'User info retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Get user info error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}
