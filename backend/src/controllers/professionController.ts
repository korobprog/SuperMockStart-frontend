import { Request, Response } from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { UserService } from '../services/userService.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class ProfessionController {
  // Добавление выбранной профессии
  static async addSelectedProfession(req: Request, res: Response) {
    try {
      const { profession } = req.body;
      const userId = req.extendedUser?.id;

      if (!userId || !profession) {
        return res.status(400).json({
          success: false,
          message: 'profession обязателен',
        });
      }

      // Находим пользователя по ID из токена
      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден',
        });
      }

      // Сохраняем выбранную профессию в базу данных
      const selectedProfession = await prisma.selected_professions.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          profession,
        },
        include: {
          users: true,
        },
      });

      res.status(201).json({
        success: true,
        data: selectedProfession,
      });
    } catch (error) {
      console.error('Error adding selected profession:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при добавлении профессии',
      });
    }
  }

  // Получение всех выбранных профессий пользователя
  static async getUserProfessions(req: Request, res: Response) {
    try {
      const authenticatedUserId = req.extendedUser?.id;

      if (!authenticatedUserId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      // Получаем все выбранные профессии аутентифицированного пользователя
      const professions = await prisma.selected_professions.findMany({
        where: { userId: authenticatedUserId },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: professions,
      });
    } catch (error) {
      console.error('Error getting user professions:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении профессий',
      });
    }
  }

  // Удаление выбранной профессии
  static async removeSelectedProfession(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'id профессии обязателен',
        });
      }

      // Удаляем профессию из базы данных
      await prisma.selected_professions.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Профессия успешно удалена',
      });
    } catch (error) {
      console.error('Error removing selected profession:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении профессии',
      });
    }
  }

  // Получение пользователя с его профессиями
  static async getUserWithProfessions(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId обязателен',
        });
      }

      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден',
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Error getting user with professions:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении пользователя',
      });
    }
  }
}
