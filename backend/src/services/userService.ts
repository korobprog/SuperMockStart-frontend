import { PrismaClient } from '@prisma/client';
import { User, UserStatus, ApiResponse } from '../types/index.js';

const prisma = new PrismaClient();

export class UserService {
  /**
   * Находит или создает пользователя по Telegram ID
   */
  static async findOrCreateTelegramUser(telegramData: {
    id: number;
    username?: string;
    firstName: string;
    lastName?: string;
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
  static async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
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
}
