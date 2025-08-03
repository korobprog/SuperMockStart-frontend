import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FormData {
  profession: string;
  country: string;
  experience: string;
  email?: string;
  phone?: string;
}

export const saveFormData = async (req: Request, res: Response) => {
  try {
    const { profession, country, experience, email, phone }: FormData =
      req.body;
    const telegramId = req.user?.id?.toString();

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Telegram ID not found',
      });
    }

    // Валидация обязательных полей
    if (!profession || !country || !experience) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: profession, country, experience',
      });
    }

    // Находим пользователя по telegramId
    const user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Сохраняем выбранную профессию
    await prisma.selectedProfession.create({
      data: {
        userId: user.id,
        profession,
      },
    });

    // Сохраняем полные данные формы
    await prisma.userFormData.create({
      data: {
        userId: user.id,
        profession,
        country,
        experience,
        email,
        phone,
      },
    });

    // Обновляем статус пользователя на CANDIDATE
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'CANDIDATE',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Form data saved successfully',
      data: {
        profession,
        country,
        experience,
        email,
        phone,
      },
    });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getFormData = async (req: Request, res: Response) => {
  try {
    const telegramId = req.user?.id?.toString();

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Telegram ID not found',
      });
    }

    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: {
        selectedProfessions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const latestProfession = user.selectedProfessions[0];

    res.status(200).json({
      success: true,
      data: {
        profession: latestProfession?.profession || null,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Error getting form data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
