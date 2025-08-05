import { JwtPayload, TelegramUser, User, ExtendedJwtPayload, UserRole } from '../types/index.js';
export declare class JwtUtils {
    private static secret;
    private static expiresIn;
    static initialize(secret: string, expiresIn: string | number): void;
    /**
     * Создает JWT токен для пользователя (для обратной совместимости)
     */
    static generateToken(user: TelegramUser): string;
    /**
     * Создает расширенный JWT токен для пользователя
     */
    static generateExtendedToken(user: User, authType: 'email' | 'telegram'): string;
    /**
     * Создает JWT токен для пользователя Telegram
     */
    static generateTelegramToken(user: TelegramUser, role?: UserRole): string;
    /**
     * Создает тестовый JWT токен для разработки
     */
    static generateTestToken(): string;
    /**
     * Верифицирует JWT токен
     */
    static verifyToken(token: string): JwtPayload | null;
    /**
     * Верифицирует расширенный JWT токен
     */
    static verifyExtendedToken(token: string): ExtendedJwtPayload | null;
    /**
     * Проверяет роль пользователя в токене
     */
    static hasRole(token: string, requiredRole: UserRole): boolean;
    /**
     * Проверяет, является ли пользователь администратором
     */
    static isAdmin(token: string): boolean;
    /**
     * Декодирует JWT токен без верификации (для отладки)
     */
    static decodeToken(token: string): JwtPayload | null;
    /**
     * Проверяет, истек ли токен
     */
    static isTokenExpired(token: string): boolean;
}
//# sourceMappingURL=jwt.d.ts.map