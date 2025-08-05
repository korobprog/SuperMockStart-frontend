/**
 * Маппинг стран на основные языки для собеседований
 */
export declare const COUNTRY_TO_LANGUAGE: Record<string, string>;
/**
 * Названия языков для отображения пользователю
 */
export declare const LANGUAGE_NAMES: Record<string, string>;
/**
 * Определить язык по коду страны
 */
export declare function getLanguageFromCountry(countryCode: string): string;
/**
 * Получить название языка
 */
export declare function getLanguageName(languageCode: string): string;
/**
 * Получить список всех поддерживаемых языков
 */
export declare function getSupportedLanguages(): {
    code: string;
    name: string;
}[];
//# sourceMappingURL=language.d.ts.map