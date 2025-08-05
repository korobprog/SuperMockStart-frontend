import TelegramBot from 'node-telegram-bot-api';
import { TelegramUser, ApiResponse } from '../types/index.js';
export declare class TelegramBotService {
    private static bot;
    private static botToken;
    private static pendingAuths;
    static initialize(token: string): void;
    /**
     * Получает информацию о пользователе через Telegram Bot API
     */
    static getUserInfo(userId: number): Promise<TelegramUser | null>;
    /**
     * Отправляет сообщение пользователю
     */
    static sendMessage(userId: number, message: string): Promise<boolean>;
    /**
     * Создает URL для авторизации через бота
     */
    static createAuthUrl(userId: number, redirectUrl: string): string;
    /**
     * Проверяет pending авторизацию
     */
    static checkPendingAuth(authId: string): Promise<{
        userId: number;
        valid: boolean;
    } | null>;
    /**
     * Обрабатывает команду /start с параметрами авторизации
     */
    static handleStartCommand(msg: TelegramBot.Message): Promise<void>;
    /**
     * Получает информацию о боте
     */
    static getBotInfo(): Promise<ApiResponse<any>>;
    /**
     * Проверяет, может ли бот отправлять сообщения пользователю
     */
    static canSendMessage(userId: number): Promise<boolean>;
    static sendCheckTokenButton(chatId: number): Promise<void>;
}
//# sourceMappingURL=telegramBotService.d.ts.map