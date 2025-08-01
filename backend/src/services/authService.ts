import { TelegramUtils } from '../utils/telegram.js';
import { JwtUtils } from '../utils/jwt.js';
import {
  TelegramUser,
  TelegramWebAppData,
  ApiResponse,
} from '../types/index.js';

export class AuthService {
  /**
   * Аутентифицирует пользователя через Telegram Web App
   */
  static async authenticateWithTelegram(
    initData: string
  ): Promise<ApiResponse<{ token: string; user: TelegramUser }>> {
    try {
      // Валидируем данные от Telegram
      const webAppData = TelegramUtils.validateWebAppData(initData);

      if (!webAppData) {
        return {
          success: false,
          error: 'Invalid Telegram Web App data',
        };
      }

      // Проверяем, не устарели ли данные
      if (TelegramUtils.isDataExpired(webAppData.auth_date)) {
        return {
          success: false,
          error: 'Telegram data has expired',
        };
      }

      const user = webAppData.user;

      // Проверяем, что пользователь не бот
      if (user.is_bot) {
        return {
          success: false,
          error: 'Bots are not allowed to authenticate',
        };
      }

      // Генерируем JWT токен
      const token = JwtUtils.generateToken(user);

      return {
        success: true,
        data: {
          token,
          user,
        },
        message: 'Authentication successful',
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }

  /**
   * Получает тестовый токен для разработки
   */
  static getTestToken(): ApiResponse<{ token: string; user: TelegramUser }> {
    try {
      const token = JwtUtils.generateTestToken();
      const testUser: TelegramUser = {
        id: 123456789,
        is_bot: false,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
      };

      return {
        success: true,
        data: {
          token,
          user: testUser,
        },
        message: 'Test token generated successfully',
      };
    } catch (error) {
      console.error('Test token generation error:', error);
      return {
        success: false,
        error: 'Failed to generate test token',
      };
    }
  }

  /**
   * Верифицирует JWT токен и возвращает данные пользователя
   */
  static verifyToken(token: string): ApiResponse<TelegramUser> {
    try {
      const payload = JwtUtils.verifyToken(token);

      if (!payload) {
        return {
          success: false,
          error: 'Invalid or expired token',
        };
      }

      const user: TelegramUser = {
        id: payload.userId,
        is_bot: false,
        first_name: payload.firstName,
        last_name: payload.lastName,
        username: payload.username,
      };

      return {
        success: true,
        data: user,
        message: 'Token verified successfully',
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        error: 'Token verification failed',
      };
    }
  }

  /**
   * Обновляет информацию о пользователе через Telegram API
   */
  static async refreshUserInfo(
    userId: number
  ): Promise<ApiResponse<TelegramUser>> {
    try {
      const userInfo = await TelegramUtils.getUserInfo(userId);

      if (!userInfo) {
        return {
          success: false,
          error: 'Failed to fetch user info from Telegram',
        };
      }

      return {
        success: true,
        data: userInfo,
        message: 'User info refreshed successfully',
      };
    } catch (error) {
      console.error('User info refresh error:', error);
      return {
        success: false,
        error: 'Failed to refresh user info',
      };
    }
  }

  /**
   * Проверяет, действителен ли токен
   */
  static isTokenValid(token: string): boolean {
    return !JwtUtils.isTokenExpired(token);
  }
}
