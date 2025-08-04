import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getLanguageFromCountry } from '../utils/language.js';

const prisma = new PrismaClient();

interface FormData {
  profession: string;
  country: string;
  language: string;
  experience: string;
  email?: string;
  phone?: string;
}

export const saveFormData = async (req: Request, res: Response) => {
  try {
    const {
      profession,
      country,
      language,
      experience,
      email,
      phone,
    }: FormData = req.body;
    const telegramId = req.user?.id?.toString();

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Telegram ID not found',
      });
    }

    // Валидация обязательных полей
    if (!profession || !country || !language || !experience) {
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields: profession, country, language, experience',
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
        language,
        experience,
        email,
        phone,
      },
    });

    // НЕ обновляем статус пользователя - оставляем как есть (INTERVIEWER по умолчанию)
    // Статус CANDIDATE устанавливается только после получения обратной связи

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
        formData: {
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
    const latestFormData = user.formData[0];

    // Проверяем, может ли пользователь быть кандидатом (получал ли он обратную связь)
    const feedbackReceived = await prisma.feedback.findFirst({
      where: {
        toUserId: user.id,
      },
    });

    const canBeCandidate = feedbackReceived !== null;

    res.status(200).json({
      success: true,
      data: {
        profession: latestProfession?.profession || null,
        language: latestFormData?.language || 'en',
        country: latestFormData?.country || null,
        status: user.status || 'INTERVIEWER', // По умолчанию INTERVIEWER
        canBeCandidate,
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
