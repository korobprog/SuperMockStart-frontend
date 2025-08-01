import prisma from './prisma';

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
}
