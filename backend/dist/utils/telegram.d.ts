import { TelegramUser, TelegramWebAppData } from '../types/index.js';
interface TelegramWidgetData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}
export declare class TelegramUtils {
    private static botToken;
    static initialize(token: string): void;
    /**
     * Проверяет, инициализирован ли бот токен
     */
    private static isInitialized;
    /**
     * Валидирует данные от Telegram Web App
     */
    static validateWebAppData(initData: string): TelegramWebAppData | null;
    /**
     * Валидирует данные от Telegram Login Widget
     * Использует правильный алгоритм для Login Widget согласно документации
     */
    static validateWidgetData(widgetData: TelegramWidgetData): boolean;
    /**
     * Проверяет, не устарели ли данные (больше 1 часа)
     */
    static isDataExpired(authDate: number): boolean;
    /**
     * Получает информацию о пользователе через Telegram Bot API
     */
    static getUserInfo(userId: number): Promise<TelegramUser | null>;
}
export {};
//# sourceMappingURL=telegram.d.ts.map