import { JwtPayload, TelegramUser } from '../types/index.js';
export declare class JwtUtils {
    private static secret;
    private static expiresIn;
    static initialize(secret: string, expiresIn: string | number): void;
    /**
     * Создает JWT токен для пользователя
     */
    static generateToken(user: TelegramUser): string;
    /**
     * Создает тестовый JWT токен для разработки
     */
    static generateTestToken(): string;
    /**
     * Верифицирует JWT токен
     */
    static verifyToken(token: string): JwtPayload | null;
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