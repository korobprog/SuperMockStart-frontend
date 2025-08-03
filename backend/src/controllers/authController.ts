import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';
import { ApiResponse } from '../types/index.js';

export class AuthController {
  /**
   * Аутентификация через Telegram Web App
   */
  static async authenticateWithTelegram(req: Request, res: Response) {
    try {
      const { initData } = req.body;

      if (!initData) {
        return res.status(400).json({
          success: false,
          error: 'Telegram initData is required',
        } as ApiResponse);
      }

      const result = await AuthService.authenticateWithTelegram(initData);

      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Аутентификация через Telegram Login Widget
   */
  static async authenticateWithTelegramWidget(req: Request, res: Response) {
    try {
      const {
        id,
        first_name,
        last_name,
        username,
        photo_url,
        auth_date,
        hash,
      } = req.body;

      if (!id || !first_name || !auth_date || !hash) {
        return res.status(400).json({
          success: false,
          error: 'Required fields are missing',
        } as ApiResponse);
      }

      const result = await AuthService.authenticateWithTelegramWidget({
        id: parseInt(id),
        first_name,
        last_name,
        username,
        photo_url,
        auth_date: parseInt(auth_date),
        hash,
      });

      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Telegram Widget authentication error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Получение тестового токена для разработки
   */
  static async getTestToken(req: Request, res: Response) {
    try {
      const result = AuthService.getTestToken();

      if (!result.success) {
        return res.status(500).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Test token generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Проверка валидности токена
   */
  static async verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token is required',
        } as ApiResponse);
      }

      const result = AuthService.verifyToken(token);
      res.json(result);
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Обновление информации о пользователе
   */
  static async refreshUserInfo(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const result = await AuthService.refreshUserInfo(req.user.id);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('User info refresh controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Получение профиля текущего пользователя
   */
  static async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      return res.status(200).json({
        success: true,
        data: req.user,
        message: 'Profile retrieved successfully',
      });
    } catch (error) {
      console.error('Get profile controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Проверка статуса аутентификации
   */
  static async checkAuthStatus(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(200).json({
          success: true,
          data: { authenticated: false },
          message: 'No token provided',
        });
      }

      const isValid = AuthService.isTokenValid(token);

      return res.status(200).json({
        success: true,
        data: {
          authenticated: isValid,
          token: isValid ? token : null,
        },
        message: isValid ? 'Token is valid' : 'Token is invalid or expired',
      });
    } catch (error) {
      console.error('Auth status check error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
