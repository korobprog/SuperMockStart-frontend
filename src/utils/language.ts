/**
 * Названия языков для отображения пользователю
 */
export const LANGUAGE_NAMES: Record<string, string> = {
  ru: 'Русский',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
  cs: 'Čeština',
  tr: 'Türkçe',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  ar: 'العربية',
  he: 'עברית',
};

/**
 * Получить название языка
 */
export function getLanguageName(languageCode: string): string {
  return LANGUAGE_NAMES[languageCode] || languageCode;
}

/**
 * Получить флаг страны по коду
 */
export function getCountryFlag(countryCode: string): string {
  const flagMap: Record<string, string> = {
    RU: '🇷🇺',
    BY: '🇧🇾',
    KZ: '🇰🇿',
    KG: '🇰🇬',
    UZ: '🇺🇿',
    TJ: '🇹🇯',
    AM: '🇦🇲',
    GE: '🇬🇪',
    MD: '🇲🇩',
    UA: '🇺🇦',
    US: '🇺🇸',
    GB: '🇬🇧',
    CA: '🇨🇦',
    AU: '🇦🇺',
    NZ: '🇳🇿',
    IE: '🇮🇪',
    ZA: '🇿🇦',
    IN: '🇮🇳',
    PK: '🇵🇰',
    BD: '🇧🇩',
    MY: '🇲🇾',
    SG: '🇸🇬',
    PH: '🇵🇭',
    NG: '🇳🇬',
    KE: '🇰🇪',
    GH: '🇬🇭',
    DE: '🇩🇪',
    AT: '🇦🇹',
    CH: '🇨🇭',
    FR: '🇫🇷',
    BE: '🇧🇪',
    LU: '🇱🇺',
    MC: '🇲🇨',
    ES: '🇪🇸',
    MX: '🇲🇽',
    AR: '🇦🇷',
    CO: '🇨🇴',
    PE: '🇵🇪',
    CL: '🇨🇱',
    VE: '🇻🇪',
    EC: '🇪🇨',
    UY: '🇺🇾',
    BO: '🇧🇴',
    PY: '🇵🇾',
    PT: '🇵🇹',
    BR: '🇧🇷',
    IT: '🇮🇹',
    NL: '🇳🇱',
    PL: '🇵🇱',
    CZ: '🇨🇿',
    TR: '🇹🇷',
    JP: '🇯🇵',
    KR: '🇰🇷',
    CN: '🇨🇳',
    TW: '🇹🇼',
    HK: '🇭🇰',
    AE: '🇦🇪',
    SA: '🇸🇦',
    EG: '🇪🇬',
    IL: '🇮🇱',
    NO: '🇳🇴',
    SE: '🇸🇪',
    DK: '🇩🇰',
    FI: '🇫🇮',
    IS: '🇮🇸',
  };

  return flagMap[countryCode?.toUpperCase()] || '🌍';
}
