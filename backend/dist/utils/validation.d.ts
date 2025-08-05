/**
 * Утилиты для валидации данных
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare class ValidationUtils {
    /**
     * Валидация email адреса
     */
    static validateEmail(email: string): ValidationResult;
    /**
     * Валидация пароля
     */
    static validatePassword(password: string): ValidationResult;
    /**
     * Валидация имени пользователя
     */
    static validateName(name: string, fieldName?: string): ValidationResult;
    /**
     * Валидация username
     */
    static validateUsername(username: string): ValidationResult;
    /**
     * Валидация данных регистрации
     */
    static validateRegistrationData(data: {
        email: string;
        password: string;
        firstName: string;
        lastName?: string;
        username?: string;
    }): ValidationResult;
    /**
     * Очистка email (приведение к нижнему регистру, удаление пробелов)
     */
    static sanitizeEmail(email: string): string;
    /**
     * Очистка имени (удаление лишних пробелов, приведение первой буквы к верхнему регистру)
     */
    static sanitizeName(name: string): string;
}
//# sourceMappingURL=validation.d.ts.map