import { Request, Response } from 'express';
import { UserService } from '../services/userService.js';

export class ProfessionController {
  // Добавление выбранной профессии
  static async addSelectedProfession(req: Request, res: Response) {
    try {
      const { userId, profession } = req.body;

      if (!userId || !profession) {
        return res.status(400).json({
          success: false,
          message: 'userId и profession обязательны',
        });
      }

      // Временное решение без базы данных
      const mockSelectedProfession = {
        id: `prof_${Date.now()}`,
        userId,
        profession,
        createdAt: new Date().toISOString(),
        user: {
          id: userId,
          telegramId: userId,
          username: 'temp-user',
          firstName: 'Temp',
          lastName: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      res.status(201).json({
        success: true,
        data: mockSelectedProfession,
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
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId обязателен',
        });
      }

      // Временное решение без базы данных
      const mockProfessions = [
        {
          id: 'prof_1',
          userId,
          profession: 'Frontend Developer',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 день назад
        },
        {
          id: 'prof_2',
          userId,
          profession: 'React Developer',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
        },
      ];

      res.status(200).json({
        success: true,
        data: mockProfessions,
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

      // Временное решение без базы данных

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
