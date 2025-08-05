/**
 * Утилиты для работы с паролями
 */
export declare class PasswordUtils {
    private static readonly SALT_ROUNDS;
    /**
     * Хэширует пароль с использованием bcrypt
     */
    static hashPassword(password: string): Promise<string>;
    /**
     * Проверяет соответствие пароля хэшу
     */
    static verifyPassword(password: string, hash: string): Promise<boolean>;
    /**
     * Генерирует случайный пароль
     */
    static generateRandomPassword(length?: number): string;
    /**
     * Проверяет силу пароля
     */
    static checkPasswordStrength(password: string): {
        score: number;
        feedback: string[];
        isStrong: boolean;
    };
}
//# sourceMappingURL=password.d.ts.map