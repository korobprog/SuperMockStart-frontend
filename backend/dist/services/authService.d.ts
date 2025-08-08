import { TelegramUser, ApiResponse, LoginCredentials, RegisterData, User } from '../types/index.js';
interface TelegramWidgetData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}
export declare class AuthService {
    /**
     * Регистрирует нового пользователя
     */
    static registerUser(data: RegisterData): Promise<ApiResponse<{
        token: string;
        user: User;
    }>>;
    /**
     * Аутентифицирует пользователя через email/password
     */
    static loginWithEmail(credentials: LoginCredentials): Promise<ApiResponse<{
        token: string;
        user: User;
    }>>;
    /**
     * Аутентифицирует пользователя через Telegram Web App
     */
    static authenticateWithTelegram(initData: string): Promise<ApiResponse<{
        token: string;
        user: User;
    }>>;
    /**
     * Аутентифицирует пользователя через Telegram Login Widget
     */
    static authenticateWithTelegramWidget(widgetData: TelegramWidgetData): Promise<ApiResponse<{
        token: string;
        user: User;
    }>>;
    /**
     * Получает тестовый токен для разработки
     */
    static getTestToken(): Promise<ApiResponse<{
        token: string;
        user: User;
    }>>;
    /**
     * Верифицирует JWT токен и возвращает данные пользователя
     */
    static verifyToken(token: string): ApiResponse<TelegramUser>;
    /**
     * Верифицирует расширенный JWT токен и возвращает данные пользователя
     */
    static verifyExtendedToken(token: string): Promise<ApiResponse<User>>;
    /**
     * Обновляет информацию о пользователе через Telegram API
     */
    static refreshUserInfo(userId: number): Promise<ApiResponse<TelegramUser>>;
    /**
     * Генерирует JWT токен для пользователя
     */
    static generateTokenForUser(user: TelegramUser): string;
    /**
     * Проверяет, действителен ли токен
     */
    static isTokenValid(token: string): boolean;
    /**
     * Создает тестового пользователя для разработки
     */
    static createDevUser(data: {
        telegramId: number;
        firstName: string;
        lastName: string;
        username: string;
        photoUrl: string;
    }): Promise<ApiResponse<{
        token: string;
        user: User;
    }>>;
}
export {};
//# sourceMappingURL=authService.d.ts.map