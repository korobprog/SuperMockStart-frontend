import { Request, Response } from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
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
    const userId = req.extendedUser?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User ID not found',
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

    // Находим пользователя по userId (database ID)
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Сохраняем выбранную профессию
    await prisma.selected_professions.create({
      data: {
        id: `profession-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        userId: user.id,
        profession,
      },
    });

    // Сохраняем полные данные формы
    await prisma.user_form_data.create({
      data: {
        id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

export const updateFormData = async (req: Request, res: Response) => {
  try {
    console.log('🔍 updateFormData called');
    console.log('🔍 req.body:', req.body);
    console.log('🔍 req.extendedUser:', req.extendedUser);

    const {
      profession,
      country,
      language,
      experience,
      email,
      phone,
    }: FormData = req.body;
    const userId = req.extendedUser?.id;

    console.log('🔍 userId:', userId);
    console.log('🔍 form data:', {
      profession,
      country,
      language,
      experience,
      email,
      phone,
    });

    if (!userId) {
      console.log('❌ User ID not found');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User ID not found',
      });
    }

    // Валидация обязательных полей
    if (!profession || !country || !language || !experience) {
      console.log('❌ Missing required fields:', {
        profession,
        country,
        language,
        experience,
      });
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields: profession, country, language, experience',
      });
    }

    console.log('🔍 Looking for user with ID:', userId);

    // Находим пользователя по userId
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    console.log('🔍 User found:', !!user);
    console.log('🔍 User data:', user);

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    console.log('🔍 Creating selected_professions record');

    // Создаем новую запись профессии (история выбора)
    await prisma.selected_professions.create({
      data: {
        id: `profession-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        userId: user.id,
        profession,
      },
    });

    console.log('🔍 selected_professions record created');

    // Обновляем или создаем данные формы
    const existingFormData = await prisma.user_form_data.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    console.log('🔍 existingFormData found:', !!existingFormData);

    if (existingFormData) {
      console.log('🔍 Updating existing form data');
      await prisma.user_form_data.update({
        where: { id: existingFormData.id },
        data: {
          profession,
          country,
          language,
          experience,
          email,
          phone,
        },
      });
    } else {
      console.log('🔍 Creating new form data');
      await prisma.user_form_data.create({
        data: {
          id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          profession,
          country,
          language,
          experience,
          email,
          phone,
        },
      });
    }

    console.log('✅ Form data updated successfully');

    res.status(200).json({
      success: true,
      message: 'Form data updated successfully',
      data: {
        profession,
        country,
        language,
        experience,
        email,
        phone,
      },
    });
  } catch (error) {
    console.error('❌ Error updating form data:', error);
    console.error(
      '❌ Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getFormData = async (req: Request, res: Response) => {
  try {
    const userId = req.extendedUser?.id;
    console.log('🔍 getFormData - userId:', userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User ID not found',
      });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        selected_professions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        user_form_data: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    console.log('🔍 getFormData - user found:', !!user);
    console.log('🔍 getFormData - user.user_form_data:', user?.user_form_data);
    console.log(
      '🔍 getFormData - user.selected_professions:',
      user?.selected_professions
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const latestProfession = user.selected_professions[0];
    const latestFormData = user.user_form_data[0];

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
        experience: latestFormData?.experience || null,
        email: latestFormData?.email || null,
        phone: latestFormData?.phone || null,
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
