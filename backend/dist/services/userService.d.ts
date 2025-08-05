import { User, UserStatus, ApiResponse } from '../types/index.js';
export declare class UserService {
    /**
     * Находит или создает пользователя по Telegram ID
     */
    static findOrCreateTelegramUser(telegramData: {
        id: number;
        username?: string | null;
        firstName: string;
        lastName?: string | null;
    }): Promise<ApiResponse<User>>;
    /**
     * Получает пользователя по ID
     */
    static getUserById(id: string | number): Promise<ApiResponse<User>>;
    /**
     * Получает пользователя по Telegram ID
     */
    static getUserByTelegramId(telegramId: string): Promise<ApiResponse<User>>;
    /**
     * Обновляет статус пользователя
     */
    static updateUserStatus(userId: string, status: UserStatus): Promise<ApiResponse<User>>;
    /**
     * Обновляет статус пользователя по Telegram ID
     */
    static updateUserStatusByTelegramId({ telegramId, status, }: {
        telegramId: string;
        status: UserStatus;
    }): Promise<ApiResponse<User>>;
    /**
     * Получает всех пользователей
     */
    static getAllUsers(): Promise<ApiResponse<User[]>>;
    /**
     * Удаляет пользователя
     */
    static deleteUser(userId: string): Promise<ApiResponse<boolean>>;
    /**
     * Создает нового пользователя
     */
    static createUser(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName?: string;
    }): Promise<ApiResponse<User>>;
    /**
     * Аутентифицирует пользователя
     */
    static authenticateUser(credentials: {
        email: string;
        password: string;
    }): Promise<ApiResponse<User>>;
    /**
     * Обновляет пароль пользователя
     */
    static updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<ApiResponse<boolean>>;
    /**
     * Связывает аккаунт с Telegram
     */
    static linkTelegramAccount(userId: string, telegramId: string, userData: {
        username?: string;
        firstName?: string;
        lastName?: string;
    }): Promise<ApiResponse<User>>;
    /**
     * Создает интервью
     */
    static createInterview(interviewerId: string, candidateId: string): Promise<ApiResponse<any>>;
    /**
     * Завершает интервью
     */
    static completeInterview(interviewId: string): Promise<ApiResponse<boolean>>;
    /**
     * Добавляет отзыв к интервью
     */
    static addInterviewFeedback(interviewId: string, feedback: string): Promise<ApiResponse<boolean>>;
    /**
     * Получает доступных кандидатов
     */
    static getAvailableCandidates(): Promise<ApiResponse<User[]>>;
    /**
     * Получает интервью пользователя
     */
    static getUserInterviews(userId: string): Promise<ApiResponse<any[]>>;
}
//# sourceMappingURL=userService.d.ts.map