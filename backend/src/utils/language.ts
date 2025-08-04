/**
 * Маппинг стран на основные языки для собеседований
 */
export const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  // Русскоязычные страны
  RU: 'ru', // Россия
  BY: 'ru', // Беларусь
  KZ: 'ru', // Казахстан
  KG: 'ru', // Кыргызстан
  UZ: 'ru', // Узбекистан
  TJ: 'ru', // Таджикистан
  AM: 'ru', // Армения
  GE: 'ru', // Грузия
  MD: 'ru', // Молдова
  UA: 'ru', // Украина

  // Англоязычные страны
  US: 'en', // США
  GB: 'en', // Великобритания
  CA: 'en', // Канада
  AU: 'en', // Австралия
  NZ: 'en', // Новая Зеландия
  IE: 'en', // Ирландия
  ZA: 'en', // ЮАР
  IN: 'en', // Индия
  PK: 'en', // Пакистан
  BD: 'en', // Бангладеш
  MY: 'en', // Малайзия
  SG: 'en', // Сингапур
  PH: 'en', // Филиппины
  NG: 'en', // Нигерия
  KE: 'en', // Кения
  GH: 'en', // Гана

  // Немецкоязычные страны
  DE: 'de', // Германия
  AT: 'de', // Австрия
  CH: 'de', // Швейцария (частично)

  // Французскоязычные страны
  FR: 'fr', // Франция
  BE: 'fr', // Бельгия
  LU: 'fr', // Люксембург
  MC: 'fr', // Монако

  // Испаноязычные страны
  ES: 'es', // Испания
  MX: 'es', // Мексика
  AR: 'es', // Аргентина
  CO: 'es', // Колумбия
  PE: 'es', // Перу
  CL: 'es', // Чили
  VE: 'es', // Венесуэла
  EC: 'es', // Эквадор
  UY: 'es', // Уругвай
  BO: 'es', // Боливия
  PY: 'es', // Парагвай

  // Португальскоязычные страны
  PT: 'pt', // Португалия
  BR: 'pt', // Бразилия

  // Итальянский
  IT: 'it', // Италия

  // Нидерландский
  NL: 'nl', // Нидерланды

  // Польский
  PL: 'pl', // Польша

  // Чешский
  CZ: 'cs', // Чехия

  // Турецкий
  TR: 'tr', // Турция

  // Японский
  JP: 'ja', // Япония

  // Корейский
  KR: 'ko', // Южная Корея

  // Китайский
  CN: 'zh', // Китай
  TW: 'zh', // Тайвань
  HK: 'zh', // Гонконг

  // Арабский
  AE: 'ar', // ОАЭ
  SA: 'ar', // Саудовская Аравия
  EG: 'ar', // Египет

  // Иврит
  IL: 'he', // Израиль

  // Скандинавские страны (используем английский для универсальности)
  NO: 'en', // Норвегия
  SE: 'en', // Швеция
  DK: 'en', // Дания
  FI: 'en', // Финляндия
  IS: 'en', // Исландия
};

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
 * Определить язык по коду страны
 */
export function getLanguageFromCountry(countryCode: string): string {
  const language = COUNTRY_TO_LANGUAGE[countryCode.toUpperCase()];
  return language || 'en'; // Английский по умолчанию
}

/**
 * Получить название языка
 */
export function getLanguageName(languageCode: string): string {
  return LANGUAGE_NAMES[languageCode] || languageCode;
}

/**
 * Получить список всех поддерживаемых языков
 */
export function getSupportedLanguages() {
  const uniqueLanguages = [...new Set(Object.values(COUNTRY_TO_LANGUAGE))];
  return uniqueLanguages
    .map((lang) => ({
      code: lang,
      name: getLanguageName(lang),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
