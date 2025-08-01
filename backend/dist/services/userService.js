import prisma from './prisma';
export class UserService {
    // Создание нового пользователя
    static async createUser(data) {
        return await prisma.user.create({
            data,
        });
    }
    // Получение пользователя по Telegram ID
    static async getUserByTelegramId(telegramId) {
        return await prisma.user.findUnique({
            where: { telegramId },
            include: {
                selectedProfessions: true,
            },
        });
    }
    // Получение пользователя по ID
    static async getUserById(id) {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                selectedProfessions: true,
            },
        });
    }
    // Добавление выбранной профессии пользователю
    static async addSelectedProfession(data) {
        return await prisma.selectedProfession.create({
            data,
            include: {
                user: true,
            },
        });
    }
    // Получение всех выбранных профессий пользователя
    static async getUserProfessions(userId) {
        return await prisma.selectedProfession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Удаление выбранной профессии
    static async removeSelectedProfession(id) {
        return await prisma.selectedProfession.delete({
            where: { id },
        });
    }
    // Обновление или создание пользователя
    static async upsertUser(data) {
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
//# sourceMappingURL=userService.js.map