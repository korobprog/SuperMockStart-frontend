import prisma from './prisma.js';
import { UserStatus, InterviewStatus } from '../types/index.js';

export interface CreateUserData {
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface AddProfessionData {
  userId: string;
  profession: string;
}

export interface UpdateUserStatusData {
  userId: string;
  status: UserStatus;
}

export interface UpdateUserStatusByTelegramIdData {
  telegramId: string;
  status: UserStatus;
}

export interface CreateInterviewData {
  interviewerId: string;
  candidateId: string;
}

export interface UpdateInterviewFeedbackData {
  interviewId: string;
  feedback: string;
}

export class UserService {
  // Создание нового пользователя
  static async createUser(data: CreateUserData) {
    return await prisma.user.create({
      data,
    });
  }

  // Получение пользователя по Telegram ID
  static async getUserByTelegramId(telegramId: string) {
    return await prisma.user.findUnique({
      where: { telegramId },
      include: {
        selectedProfessions: true,
      },
    });
  }

  // Получение пользователя по ID
  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        selectedProfessions: true,
      },
    });
  }

  // Добавление выбранной профессии пользователю
  static async addSelectedProfession(data: AddProfessionData) {
    return await prisma.selectedProfession.create({
      data,
      include: {
        user: true,
      },
    });
  }

  // Получение всех выбранных профессий пользователя
  static async getUserProfessions(userId: string) {
    return await prisma.selectedProfession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Удаление выбранной профессии
  static async removeSelectedProfession(id: string) {
    return await prisma.selectedProfession.delete({
      where: { id },
    });
  }

  // Обновление или создание пользователя
  static async upsertUser(data: CreateUserData) {
    return await prisma.user.upsert({
      where: { telegramId: data.telegramId },
      update: {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      create: data,
    });
  }

  // Обновление статуса пользователя по ID
  static async updateUserStatus(data: UpdateUserStatusData) {
    return await prisma.user.update({
      where: { id: data.userId },
      data: { status: data.status },
      include: {
        selectedProfessions: true,
      },
    });
  }

  // Обновление статуса пользователя по Telegram ID
  static async updateUserStatusByTelegramId(
    data: UpdateUserStatusByTelegramIdData
  ) {
    return await prisma.user.update({
      where: { telegramId: data.telegramId },
      data: { status: data.status },
      include: {
        selectedProfessions: true,
      },
    });
  }

  // Получение пользователей по статусу
  static async getUsersByStatus(status: UserStatus) {
    return await prisma.user.findMany({
      where: { status },
      include: {
        selectedProfessions: true,
      },
    });
  }

  // Создание интервью
  static async createInterview(data: CreateInterviewData) {
    return await prisma.interview.create({
      data,
      include: {
        interviewer: true,
        candidate: true,
      },
    });
  }

  // Завершение интервью
  static async completeInterview(interviewId: string) {
    return await prisma.interview.update({
      where: { id: interviewId },
      data: { status: InterviewStatus.COMPLETED },
      include: {
        interviewer: true,
        candidate: true,
      },
    });
  }

  // Добавление обратной связи к интервью
  static async addInterviewFeedback(data: UpdateInterviewFeedbackData) {
    const interview = await prisma.interview.update({
      where: { id: data.interviewId },
      data: {
        feedback: data.feedback,
        status: InterviewStatus.FEEDBACK_RECEIVED,
        feedbackReceivedAt: new Date(),
      },
      include: {
        interviewer: true,
        candidate: true,
      },
    });

    // Автоматически меняем статус интервьюера на кандидата
    await this.updateUserStatus({
      userId: interview.interviewerId,
      status: UserStatus.CANDIDATE,
    });

    return interview;
  }

  // Получение интервью пользователя
  static async getUserInterviews(userId: string) {
    return await prisma.interview.findMany({
      where: {
        OR: [{ interviewerId: userId }, { candidateId: userId }],
      },
      include: {
        interviewer: true,
        candidate: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Получение доступных кандидатов для интервью
  static async getAvailableCandidates(excludeUserId?: string) {
    return await prisma.user.findMany({
      where: {
        status: UserStatus.CANDIDATE,
        ...(excludeUserId && { id: { not: excludeUserId } }),
      },
      include: {
        selectedProfessions: true,
      },
    });
  }

  // Получение доступных интервьюеров
  static async getAvailableInterviewers(excludeUserId?: string) {
    return await prisma.user.findMany({
      where: {
        status: UserStatus.INTERVIEWER,
        ...(excludeUserId && { id: { not: excludeUserId } }),
      },
      include: {
        selectedProfessions: true,
      },
    });
  }
}
