import prisma from './prisma.js';
import { User, UserStatus, ApiResponse } from '../types/index.js';

export class UserService {
  /**
   * Находит или создает пользователя по Telegram ID
   */
  static async findOrCreateTelegramUser(telegramData: {
    id: number;
    username?: string | null;
    firstName: string;
    lastName?: string | null;
  }): Promise<ApiResponse<User>> {
    try {
      const telegramId = telegramData.id.toString();

      // Ищем существующего пользователя
      let user = await prisma.user.findUnique({
        where: { telegramId },
      });

      if (user) {
        // Обновляем данные пользователя
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            username: telegramData.username || user.username,
            firstName: telegramData.firstName || user.firstName,
            lastName: telegramData.lastName || user.lastName,
          },
        });

        const userResponse: User = {
          id: user.id,
          telegramId: user.telegramId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status as UserStatus,
          role: user.role as any,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        return {
          success: true,
          data: userResponse,
          message: 'Пользователь найден',
        };
      }

      // Создаем нового пользователя
      const newUser = await prisma.user.create({
        data: {
          telegramId,
          username: telegramData.username,
          firstName: telegramData.firstName,
          lastName: telegramData.lastName,
          status: UserStatus.INTERVIEWER,
        },
      });

      const userResponse: User = {
        id: newUser.id,
        telegramId: newUser.telegramId,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        status: newUser.status as UserStatus,
        role: newUser.role as any,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };

      return {
        success: true,
        data: userResponse,
        message: 'Пользователь создан',
      };
    } catch (error) {
      console.error('Telegram user find/create error:', error);
      return {
        success: false,
        error: 'Ошибка при работе с пользователем Telegram',
      };
    }
  }

  /**
   * Получает пользователя по ID
   */
  static async getUserById(id: string | number): Promise<ApiResponse<User>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id.toString() },
      });

      if (!user) {
        return {
          success: false,
          error: 'Пользователь не найден',
        };
      }

      const userResponse: User = {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status as UserStatus,
        role: user.role as any,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        data: userResponse,
      };
    } catch (error) {
      console.error('Get user by ID error:', error);
      return {
        success: false,
        error: 'Ошибка при получении пользователя',
      };
    }
  }

  /**
   * Получает пользователя по Telegram ID
   */
  static async getUserByTelegramId(
    telegramId: string
  ): Promise<ApiResponse<User>> {
    try {
      const user = await prisma.user.findUnique({
        where: { telegramId },
      });

      if (!user) {
        return {
          success: false,
          error: 'Пользователь не найден',
        };
      }

      const userResponse: User = {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status as UserStatus,
        role: user.role as any,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        data: userResponse,
      };
    } catch (error) {
      console.error('Get user by Telegram ID error:', error);
      return {
        success: false,
        error: 'Ошибка при получении пользователя',
      };
    }
  }

  /**
   * Обновляет статус пользователя
   */
  static async updateUserStatus(
    userId: string,
    status: UserStatus
  ): Promise<ApiResponse<User>> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { status },
      });

      const userResponse: User = {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status as UserStatus,
        role: user.role as any,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        data: userResponse,
        message: 'Статус пользователя обновлен',
      };
    } catch (error) {
      console.error('Update user status error:', error);
      return {
        success: false,
        error: 'Ошибка при обновлении статуса пользователя',
      };
    }
  }

  /**
   * Обновляет статус пользователя по Telegram ID
   */
  static async updateUserStatusByTelegramId({
    telegramId,
    status,
  }: {
    telegramId: string;
    status: UserStatus;
  }): Promise<ApiResponse<User>> {
    try {
      const user = await prisma.user.update({
        where: { telegramId },
        data: { status },
      });

      const userResponse: User = {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status as UserStatus,
        role: user.role as any,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        data: userResponse,
        message: 'Статус пользователя обновлен',
      };
    } catch (error) {
      console.error('Update user status by Telegram ID error:', error);
      return {
        success: false,
        error: 'Ошибка при обновлении статуса пользователя',
      };
    }
  }

  /**
   * Получает всех пользователей
   */
  static async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const usersResponse: User[] = users.map((user) => ({
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status as UserStatus,
        role: user.role as any,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return {
        success: true,
        data: usersResponse,
      };
    } catch (error) {
      console.error('Get all users error:', error);
      return {
        success: false,
        error: 'Ошибка при получении пользователей',
      };
    }
  }

  /**
   * Удаляет пользователя
   */
  static async deleteUser(userId: string): Promise<ApiResponse<boolean>> {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });

      return {
        success: true,
        data: true,
        message: 'Пользователь удален',
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        error: 'Ошибка при удалении пользователя',
      };
    }
  }

  /**
   * Создает нового пользователя
   */
  static async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
  }): Promise<ApiResponse<User>> {
    try {
      // This is a placeholder implementation
      // You'll need to implement actual user creation logic
      return {
        success: false,
        error: 'User creation not implemented',
      };
    } catch (error) {
      console.error('Create user error:', error);
      return {
        success: false,
        error: 'Ошибка при создании пользователя',
      };
    }
  }

  /**
   * Аутентифицирует пользователя
   */
  static async authenticateUser(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<User>> {
    try {
      // This is a placeholder implementation
      // You'll need to implement actual authentication logic
      return {
        success: false,
        error: 'Authentication not implemented',
      };
    } catch (error) {
      console.error('Authenticate user error:', error);
      return {
        success: false,
        error: 'Ошибка при аутентификации',
      };
    }
  }

  /**
   * Обновляет пароль пользователя
   */
  static async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse<boolean>> {
    try {
      // This is a placeholder implementation
      // You'll need to implement actual password update logic
      return {
        success: false,
        error: 'Password update not implemented',
      };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        error: 'Ошибка при обновлении пароля',
      };
    }
  }

  /**
   * Связывает аккаунт с Telegram
   */
  static async linkTelegramAccount(
    userId: string,
    telegramId: string,
    userData: { username?: string; firstName?: string; lastName?: string }
  ): Promise<ApiResponse<User>> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { telegramId },
      });

      const userResponse: User = {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status as UserStatus,
        role: user.role as any, // Add role property
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        data: userResponse,
        message: 'Telegram аккаунт связан',
      };
    } catch (error) {
      console.error('Link Telegram account error:', error);
      return {
        success: false,
        error: 'Ошибка при связывании Telegram аккаунта',
      };
    }
  }

  /**
   * Создает интервью
   */
  static async createInterview(
    interviewerId: string,
    candidateId: string
  ): Promise<ApiResponse<any>> {
    try {
      // This is a placeholder implementation
      // You'll need to implement actual interview creation logic
      return {
        success: false,
        error: 'Interview creation not implemented',
      };
    } catch (error) {
      console.error('Create interview error:', error);
      return {
        success: false,
        error: 'Ошибка при создании интервью',
      };
    }
  }

  /**
   * Завершает интервью
   */
  static async completeInterview(
    interviewId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      // This is a placeholder implementation
      // You'll need to implement actual interview completion logic
      return {
        success: false,
        error: 'Interview completion not implemented',
      };
    } catch (error) {
      console.error('Complete interview error:', error);
      return {
        success: false,
        error: 'Ошибка при завершении интервью',
      };
    }
  }

  /**
   * Добавляет отзыв к интервью
   */
  static async addInterviewFeedback(
    interviewId: string,
    feedback: string
  ): Promise<ApiResponse<boolean>> {
    try {
      // This is a placeholder implementation
      // You'll need to implement actual feedback logic
      return {
        success: false,
        error: 'Feedback not implemented',
      };
    } catch (error) {
      console.error('Add interview feedback error:', error);
      return {
        success: false,
        error: 'Ошибка при добавлении отзыва',
      };
    }
  }

  /**
   * Получает доступных кандидатов
   */
  static async getAvailableCandidates(): Promise<ApiResponse<User[]>> {
    try {
      const candidates = await prisma.user.findMany({
        where: { status: UserStatus.CANDIDATE },
        orderBy: { createdAt: 'desc' },
      });

      const candidatesResponse: User[] = candidates.map((user) => ({
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status as UserStatus,
        role: user.role as any, // Add role property
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return {
        success: true,
        data: candidatesResponse,
      };
    } catch (error) {
      console.error('Get available candidates error:', error);
      return {
        success: false,
        error: 'Ошибка при получении кандидатов',
      };
    }
  }

  /**
   * Получает интервью пользователя
   */
  static async getUserInterviews(userId: string): Promise<ApiResponse<any[]>> {
    try {
      // This is a placeholder implementation
      // You'll need to implement actual interview retrieval logic
      return {
        success: false,
        error: 'Get user interviews not implemented',
      };
    } catch (error) {
      console.error('Get user interviews error:', error);
      return {
        success: false,
        error: 'Ошибка при получении интервью пользователя',
      };
    }
  }
}
