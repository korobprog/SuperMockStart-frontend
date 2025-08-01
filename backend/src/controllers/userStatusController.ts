import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { UserStatus, ApiResponse } from '../types';

export class UserStatusController {
  // Получение текущего статуса пользователя
  static async getUserStatus(req: Request, res: Response) {
    try {
      const telegramId = req.user?.id?.toString();
      if (!telegramId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
      }

      const user = await UserService.getUserByTelegramId(telegramId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: { status: (user as any).status },
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getUserStatus:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  // Обновление статуса пользователя (для тестирования)
  static async updateUserStatus(req: Request, res: Response) {
    try {
      const { userId, status } = req.body;

      if (!userId || !status || !Object.values(UserStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid parameters',
        } as ApiResponse);
      }

      // Проверяем, является ли userId Telegram ID или ID из базы данных
      let updatedUser;

      // Сначала пробуем найти пользователя по Telegram ID
      const userByTelegramId = await UserService.getUserByTelegramId(userId);
      if (userByTelegramId) {
        // Если найден по Telegram ID, обновляем по Telegram ID
        updatedUser = await UserService.updateUserStatusByTelegramId({
          telegramId: userId,
          status,
        });
      } else {
        // Если не найден по Telegram ID, пробуем обновить по ID из базы данных
        updatedUser = await UserService.updateUserStatus({
          userId,
          status,
        });
      }

      res.json({
        success: true,
        data: updatedUser,
      } as ApiResponse);
    } catch (error) {
      console.error('Error in updateUserStatus:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  // Создание интервью
  static async createInterview(req: Request, res: Response) {
    try {
      const { candidateId } = req.body;
      const interviewerTelegramId = req.user?.id?.toString();

      if (!interviewerTelegramId || !candidateId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
        } as ApiResponse);
      }

      // Получаем пользователя-интервьюера по Telegram ID
      const interviewer = await UserService.getUserByTelegramId(
        interviewerTelegramId
      );
      if (!interviewer) {
        return res.status(404).json({
          success: false,
          error: 'Interviewer not found',
        } as ApiResponse);
      }

      const interview = await UserService.createInterview({
        interviewerId: interviewer.id,
        candidateId,
      });

      res.json({
        success: true,
        data: interview,
      } as ApiResponse);
    } catch (error) {
      console.error('Error in createInterview:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  // Завершение интервью
  static async completeInterview(req: Request, res: Response) {
    try {
      const { interviewId } = req.params;
      const userId = req.user?.id?.toString();

      if (!userId || !interviewId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
        } as ApiResponse);
      }

      const interview = await UserService.completeInterview(interviewId);

      res.json({
        success: true,
        data: interview,
      } as ApiResponse);
    } catch (error) {
      console.error('Error in completeInterview:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  // Добавление обратной связи
  static async addFeedback(req: Request, res: Response) {
    try {
      const { interviewId } = req.params;
      const { feedback } = req.body;
      const userId = req.user?.id?.toString();

      if (!userId || !interviewId || !feedback) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
        } as ApiResponse);
      }

      const interview = await UserService.addInterviewFeedback({
        interviewId,
        feedback,
      });

      res.json({
        success: true,
        data: interview,
      } as ApiResponse);
    } catch (error) {
      console.error('Error in addFeedback:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  // Получение доступных кандидатов
  static async getAvailableCandidates(req: Request, res: Response) {
    try {
      const currentUserTelegramId = req.user?.id?.toString();
      let excludeUserId: string | undefined;

      if (currentUserTelegramId) {
        const currentUser = await UserService.getUserByTelegramId(
          currentUserTelegramId
        );
        if (currentUser) {
          excludeUserId = currentUser.id;
        }
      }

      const candidates = await UserService.getAvailableCandidates(
        excludeUserId
      );

      res.json({
        success: true,
        data: candidates,
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getAvailableCandidates:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  // Получение интервью пользователя
  static async getUserInterviews(req: Request, res: Response) {
    try {
      const telegramId = req.user?.id?.toString();
      if (!telegramId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
      }

      const user = await UserService.getUserByTelegramId(telegramId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
      }

      const interviews = await UserService.getUserInterviews(user.id);

      res.json({
        success: true,
        data: interviews,
      } as ApiResponse);
    } catch (error) {
      console.error('Error in getUserInterviews:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}
