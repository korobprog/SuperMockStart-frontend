import { MatchResult } from './calendarService.js';
export declare class MatchingService {
    /**
     * Найти подходящий матч для пользователя в очереди
     */
    static findMatch(queueEntryId: string): Promise<MatchResult | null>;
    /**
     * Проверить совместимость времени двух участников
     */
    private static isTimeCompatible;
    /**
     * Вычислить оптимальное время для встречи
     */
    private static calculateOptimalTime;
    /**
     * Запустить автоматический матчинг для всех ожидающих
     */
    static runBatchMatching(): Promise<MatchResult[]>;
    /**
     * Очистить просроченные записи в очереди
     */
    static cleanExpiredEntries(): Promise<void>;
}
//# sourceMappingURL=matchingService.d.ts.map