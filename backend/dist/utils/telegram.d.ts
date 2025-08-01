import { TelegramUser, TelegramWebAppData } from '../types/index.js';
export declare class TelegramUtils {
    private static botToken;
    static initialize(token: string): void;
    /**
     * Валидирует данные от Telegram Web App
     */
    static validateWebAppData(initData: string): TelegramWebAppData | null;
    /**
     * Проверяет, не устарели ли данные (больше 1 часа)
     */
    static isDataExpired(authDate: number): boolean;
    /**
     * Получает информацию о пользователе через Telegram Bot API
     */
    static getUserInfo(userId: number): Promise<TelegramUser | null>;
}
//# sourceMappingURL=telegram.d.ts.map