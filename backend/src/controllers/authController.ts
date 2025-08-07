import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';
import { ValidationUtils } from '../utils/validation.js';
import { ApiResponse, LoginCredentials, RegisterData } from '../types/index.js';
import { JwtUtils } from '../utils/jwt.js';

export class AuthController {
  /**
   * Регистрация нового пользователя
   */
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, username }: RegisterData =
        req.body;

      if (!email || !password || !firstName) {
        return res.status(400).json({
          success: false,
          error: 'Email, пароль и имя обязательны',
        } as ApiResponse);
      }

      const result = await AuthService.registerUser({
        email,
        password,
        firstName,
        lastName,
        username,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Registration controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера',
      } as ApiResponse);
    }
  }

  /**
   * Вход через email/password
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginCredentials = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email и пароль обязательны',
        } as ApiResponse);
      }

      const result = await AuthService.loginWithEmail({ email, password });

      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера',
      } as ApiResponse);
    }
  }

  /**
   * Изменение пароля
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Текущий пароль и новый пароль обязательны',
        } as ApiResponse);
      }

      if (!req.extendedUser) {
        return res.status(401).json({
          success: false,
          error: 'Пользователь не аутентифицирован',
        } as ApiResponse);
      }

      const result = await UserService.updatePassword(
        req.extendedUser.id,
        currentPassword,
        newPassword
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Change password controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера',
      } as ApiResponse);
    }
  }

  /**
   * Привязка Telegram аккаунта
   */
  static async linkTelegram(req: Request, res: Response) {
    try {
      const { telegramId, username, firstName, lastName } = req.body;

      if (!telegramId || !firstName) {
        return res.status(400).json({
          success: false,
          error: 'Telegram ID и имя обязательны',
        } as ApiResponse);
      }

      if (!req.extendedUser) {
        return res.status(401).json({
          success: false,
          error: 'Пользователь не аутентифицирован',
        } as ApiResponse);
      }

      const result = await UserService.linkTelegramAccount(
        req.extendedUser.id,
        telegramId.toString(),
        { username, firstName, lastName }
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Link Telegram controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера',
      } as ApiResponse);
    }
  }

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
      console.log('📥 Telegram Widget auth request body:', req.body);

      const {
        id,
        first_name,
        last_name,
        username,
        photo_url,
        auth_date,
        hash,
      } = req.body;

      console.log('📋 Parsed fields:', {
        id,
        first_name,
        last_name,
        username,
        photo_url,
        auth_date,
        hash,
      });

      if (!id || !first_name || !auth_date || !hash) {
        console.error('❌ Missing required fields:', {
          id,
          first_name,
          auth_date,
          hash,
        });
        return res.status(400).json({
          success: false,
          error: 'Required fields are missing',
          missing: {
            id: !id,
            first_name: !first_name,
            auth_date: !auth_date,
            hash: !hash,
          },
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

      console.log('🔍 AuthService result:', result);

      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('❌ Telegram Widget authentication error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      } as ApiResponse);
    }
  }

  /**
   * Аутентификация через Telegram Login Widget (новый)
   */
  static async authenticateWithTelegramLogin(req: Request, res: Response) {
    try {
      const { telegramData, user } = req.body;

      if (!telegramData || !user) {
        return res.status(400).json({
          success: false,
          error: 'Telegram data and user are required',
        } as ApiResponse);
      }

      const {
        id,
        first_name,
        last_name,
        username,
        photo_url,
        auth_date,
        hash,
      } = telegramData;

      if (!id || !first_name || !auth_date || !hash) {
        return res.status(400).json({
          success: false,
          error: 'Required Telegram fields are missing',
        } as ApiResponse);
      }

      // TODO: В продакшне здесь должна быть проверка hash
      const isProduction = process.env.NODE_ENV === 'production';

      if (isProduction) {
        // TODO: Добавить проверку hash в продакшне
        console.log('⚠️ Hash verification not implemented for production');
      }

      // Находим или создаем пользователя в БД
      const userResult = await UserService.findOrCreateTelegramUser({
        id: parseInt(id),
        username: username || `user_${id}`,
        firstName: first_name,
        lastName: last_name,
      });

      if (!userResult.success || !userResult.data) {
        return res.status(500).json({
          success: false,
          error: userResult.error || 'Failed to create/find user',
        } as ApiResponse);
      }

      // Генерируем JWT токен
      const token = JwtUtils.generateExtendedToken(userResult.data, 'telegram');

      res.json({
        success: true,
        data: {
          user: userResult.data,
          token,
        },
        message: 'Telegram login successful',
      } as ApiResponse);
    } catch (error) {
      console.error('Telegram Login authentication error:', error);
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
      // В продакшн режиме не выдаем тестовые токены
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
          success: false,
          error: 'Test tokens are not available in production',
        } as ApiResponse);
      }

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
   * Создание тестового токена для реального пользователя (без валидации)
   */
  static async createTestTokenForUser(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
        } as ApiResponse);
      }

      // Создаем тестового пользователя
      const testUser = {
        id: parseInt(userId),
        first_name: 'Test',
        last_name: 'User',
        username: `test_${userId}`,
      };

      // Находим или создаем пользователя в БД
      const userResult = await UserService.findOrCreateTelegramUser({
        id: parseInt(userId),
        username: testUser.username,
        firstName: testUser.first_name,
        lastName: testUser.last_name,
      });

      if (!userResult.success || !userResult.data) {
        return res.status(500).json({
          success: false,
          error: userResult.error || 'Failed to create/find user',
        } as ApiResponse);
      }

      // Генерируем JWT токен
      const token = JwtUtils.generateExtendedToken(userResult.data, 'telegram');

      res.json({
        success: true,
        data: {
          token,
          user: userResult.data,
        },
        message: 'Test token created successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Create test token error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Верификация JWT токена
   */
  static verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      console.log(
        '🔍 verifyToken called with header:',
        authHeader ? 'present' : 'missing'
      );

      if (!token) {
        console.log('❌ No token provided');
        return res.status(401).json({
          success: false,
          error: 'Token is required',
        } as ApiResponse);
      }

      console.log('🔍 Verifying token:', token.substring(0, 20) + '...');

      const result = AuthService.verifyToken(token);

      console.log('🔍 verifyToken result:', {
        success: result.success,
        hasData: !!result.data,
        error: result.error,
      });

      res.json(result);
    } catch (error) {
      console.error('❌ Token verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  /**
   * Верификация расширенного JWT токена
   */
  static async verifyExtendedToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token is required',
        } as ApiResponse);
      }

      const result = await AuthService.verifyExtendedToken(token);
      res.json(result);
    } catch (error) {
      console.error('Extended token verification error:', error);
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

      const result = await AuthService.refreshUserInfo(
        parseInt(req.user.id.toString())
      );
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
      if (!req.extendedUser) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      return res.status(200).json({
        success: true,
        data: req.extendedUser,
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
          data: {
            authenticated: false,
            user: null,
          },
          message: 'No token provided',
        });
      }

      // Проверяем, есть ли расширенный пользователь (установлен optionalExtendedAuth middleware)
      if (req.extendedUser) {
        return res.status(200).json({
          success: true,
          data: {
            authenticated: true,
            user: req.extendedUser,
          },
          message: 'User is authenticated',
        });
      }

      // Fallback к старому методу для обратной совместимости
      const isValid = AuthService.isTokenValid(token);

      return res.status(200).json({
        success: true,
        data: {
          authenticated: isValid,
          user: isValid ? req.user || null : null,
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

  /**
   * Валидация JWT токена
   */
  static async validateToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided',
        });
      }

      // Проверяем валидность токена
      const isValid = AuthService.isTokenValid(token);

      if (isValid) {
        return res.status(200).json({
          success: true,
          message: 'Token is valid',
        });
      } else {
        return res.status(401).json({
          success: false,
          error: 'Token is invalid or expired',
        });
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Создание тестового пользователя для разработки
   */
  static async createDevUser(req: Request, res: Response) {
    try {
      // Проверяем, что мы в режиме разработки
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
          success: false,
          error: 'Dev user creation is not allowed in production',
        });
      }

      const { id, first_name, last_name, username, photo_url } = req.body;

      if (!id || !first_name) {
        return res.status(400).json({
          success: false,
          error: 'ID and first_name are required',
        });
      }

      // Создаем пользователя в базе данных
      const result = await AuthService.createDevUser({
        telegramId: id,
        firstName: first_name,
        lastName: last_name || '',
        username: username || '',
        photoUrl: '', // photoUrl не используется в UserService, но требуется в AuthService
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Create dev user controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
