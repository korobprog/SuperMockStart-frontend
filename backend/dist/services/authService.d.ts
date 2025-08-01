import { TelegramUser, ApiResponse } from '../types/index.js';
export declare class AuthService {
    /**
     * Аутентифицирует пользователя через Telegram Web App
     */
    static authenticateWithTelegram(initData: string): Promise<ApiResponse<{
        token: string;
        user: TelegramUser;
    }>>;
    /**
     * Верифицирует JWT токен и возвращает данные пользователя
     */
    static verifyToken(token: string): ApiResponse<TelegramUser>;
    /**
     * Обновляет информацию о пользователе через Telegram API
     */
    static refreshUserInfo(userId: number): Promise<ApiResponse<TelegramUser>>;
    /**
     * Проверяет, действителен ли токен
     */
    static isTokenValid(token: string): boolean;
}
//# sourceMappingURL=authService.d.ts.map