import { CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '../components/ui/command';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { cn } from '../lib/utils';
import { itPositions, ItPosition } from '../data/itPositions';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { countries } from 'countries-list';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

// Схема валидации с Zod
const formSchema = z.object({
  profession: z.string().min(1, 'Выберите профессию'),
  country: z.string().min(1, 'Выберите страну'),
  language: z.string().min(1, 'Выберите язык собеседования'),
  experience: z.string().min(1, 'Выберите опыт работы'),
  email: z.string().email('Неверный формат email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

// Константы для оптимизации
const EXPERIENCE_OPTIONS = [
  { value: '0-0', label: '0-0 study' },
  { value: '0-1', label: '0-1 year' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
] as const;

// Языки с приоритетом
const PRIORITY_LANGUAGES = {
  ru: 'Русский',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
} as const;

const CollectingContacts = memo(() => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCheckingExistingData, setIsCheckingExistingData] = useState(true);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profession: '',
      country: '',
      language: '',
      experience: '',
      email: '',
      phone: '',
    },
    mode: 'onChange', // Показывать ошибки при изменении полей
  });

  // Автоматическое заполнение формы в режиме разработки
  useEffect(() => {
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      console.log('🔧 Режим разработки: автоматически заполняем форму');
      setValue('profession', 'frontend-developer');
      setValue('country', 'RU');
      setValue('language', 'ru');
      setValue('experience', '1-3');
      setValue('email', 'test@example.com');
      setValue('phone', '+7 (999) 123-45-67');
    }
  }, [setValue]);

  // Убираем автоматическую аутентификацию в режиме разработки
  // Пользователь должен авторизоваться через Telegram
  useEffect(() => {
    // Проверяем только наличие токена
    const token =
      localStorage.getItem('extended_token') ||
      localStorage.getItem('telegram_token');

    if (!token) {
      console.log('❌ Токен не найден, пользователь должен авторизоваться');
      setIsAuthenticating(false);
      return;
    }

    setIsAuthenticating(false);
  }, []);

  // Проверка существующих данных формы пользователя
  useEffect(() => {
    const checkExistingFormData = async () => {
      try {
        const token =
          localStorage.getItem('extended_token') ||
          localStorage.getItem('telegram_token');

        if (!token) {
          console.log('❌ Токен не найден, перенаправляем на главную страницу');
          navigate('/');
          return;
        }

        const apiUrl =
          import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
        const response = await fetch(`${apiUrl}/api/form`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Проверка существующих данных формы:', data);

          // Если у пользователя уже есть данные формы (профессия и страна), перенаправляем
          if (data.success && data.data.profession && data.data.country) {
            console.log(
              '✅ У пользователя уже есть данные формы, перенаправляем на /interview'
            );
            navigate('/interview');
            return;
          } else {
            console.log(
              '❌ У пользователя нет данных формы, показываем форму для заполнения'
            );
            // Показываем форму для заполнения
          }
        } else {
          console.log(
            '❌ Ошибка запроса данных формы, перенаправляем на главную страницу'
          );
          navigate('/');
        }
      } catch (error) {
        console.log('⚠️ Ошибка при проверке данных формы:', error);
        navigate('/');
      } finally {
        setIsCheckingExistingData(false);
      }
    };

    // Проверяем только после того, как аутентификация завершена
    if (!isAuthenticating) {
      checkExistingFormData();
    }
  }, [isAuthenticating, navigate]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        console.log('📝 Отправка данных формы:', data);

        const token =
          localStorage.getItem('extended_token') ||
          localStorage.getItem('telegram_token');

        console.log('🔑 Токен найден:', !!token);

        if (!token) {
          setError('Ошибка авторизации. Пожалуйста, войдите через Telegram.');
          return;
        }

        const apiUrl =
          import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
        console.log('🌐 API URL:', apiUrl);

        const response = await fetch(`${apiUrl}/api/form`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        console.log('📤 Ответ сервера:', response.status, response.statusText);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Ошибка от сервера:', errorData);
          throw new Error(errorData.error || 'Ошибка при отправке данных');
        }

        const result = await response.json();
        console.log('✅ Данные успешно сохранены в базу данных:', result);

        navigate('/interview');
      } catch (error) {
        console.error('❌ Ошибка при отправке формы:', error);
        setError(
          error instanceof Error ? error.message : 'Ошибка при отправке данных'
        );
      }
    },
    [navigate]
  );

  // Автоматическая отправка формы в режиме разработки
  useEffect(() => {
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment && !isCheckingExistingData) {
      // Автоматически отправляем форму через 3 секунды после загрузки
      const timer = setTimeout(() => {
        console.log('🔧 Режим разработки: автоматически отправляем форму');
        const formData = {
          profession: 'frontend-developer',
          country: 'RU',
          language: 'ru',
          experience: '1-3',
          email: 'test@example.com',
          phone: '+7 (999) 123-45-67',
        };
        onSubmit(formData);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [onSubmit, isCheckingExistingData]);

  // Мемоизированный список стран
  const countriesList = useMemo(() => {
    return Object.entries(countries as Record<string, any>)
      .map(([code, country]) => {
        // Берем только первое название (до запятой или точки с запятой)
        let countryName = country.name;
        if (typeof countryName === 'string') {
          countryName = countryName.split(',')[0].split(';')[0].trim();
        }
        return {
          value: code,
          label: countryName,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // Фильтрация стран по поисковому запросу
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countriesList;
    const search = countrySearch.toLowerCase().trim();
    const filtered = countriesList.filter((country) =>
      country.label.toLowerCase().includes(search)
    );
    console.log(`🔍 Поиск: "${search}", найдено: ${filtered.length} стран`);
    return filtered;
  }, [countriesList, countrySearch]);

  // Оптимизированное получение языков
  const getLanguagesFromCountry = useCallback((countryCode: string) => {
    const country = (countries as Record<string, any>)[countryCode];
    if (!country || !country.languages) return [];

    return country.languages
      .map((lang: string) => ({
        value: lang,
        label:
          PRIORITY_LANGUAGES[lang as keyof typeof PRIORITY_LANGUAGES] || lang,
      }))
      .sort(
        (
          a: { value: string; label: string },
          b: { value: string; label: string }
        ) => {
          // Приоритетные языки сначала
          const aIsPriority = a.value in PRIORITY_LANGUAGES;
          const bIsPriority = b.value in PRIORITY_LANGUAGES;
          if (aIsPriority && !bIsPriority) return -1;
          if (!aIsPriority && bIsPriority) return 1;
          return a.label.localeCompare(b.label);
        }
      );
  }, []);

  // Показываем загрузку во время аутентификации или проверки данных
  if (isAuthenticating || isCheckingExistingData) {
    return (
      <LoadingSpinner
        message={
          isAuthenticating
            ? 'Настройка аутентификации...'
            : 'Проверка данных пользователя...'
        }
      />
    );
  }

  // Показываем ошибку если есть
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Ошибка</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <CardContent className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Заполните форму для прохождения собеседования
          </h1>

          {/* Сообщение о режиме разработки */}
          {import.meta.env.DEV && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-blue-800 text-sm">
                  🔧 Режим разработки: форма будет автоматически заполнена и
                  отправлена через 3 секунды
                </p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Выбор профессии */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Профессия <span className="text-red-500">*</span>
              </label>
              <Controller
                name="profession"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      className={cn(
                        'w-full justify-between',
                        errors.profession && 'border-red-400'
                      )}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Загрузка...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Выберите профессию..." />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {itPositions.map((item: ItPosition) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.profession && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.profession.message}
                </p>
              )}
            </div>

            {/* Выбор страны */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Страна <span className="text-red-500">*</span>
              </label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => {
                  const selectedCountry = countriesList.find(
                    (country) => country.value === field.value
                  );

                  return (
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={countryOpen}
                          className={cn(
                            'w-full justify-between',
                            errors.country && 'border-red-400'
                          )}
                          disabled={isSubmitting}
                        >
                          {selectedCountry?.label || 'Выберите страну...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0"
                        align="start"
                      >
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Поиск страны..."
                            value={countrySearch}
                            onValueChange={setCountrySearch}
                          />
                          <CommandList className="max-h-[300px]">
                            {filteredCountries.length === 0 &&
                              countrySearch.trim() && (
                                <CommandEmpty>Страна не найдена.</CommandEmpty>
                              )}
                            <CommandGroup>
                              {(countrySearch.trim()
                                ? filteredCountries
                                : countriesList
                              )
                                .slice(0, 100) // Ограничиваем до 100 результатов для производительности
                                .map((country) => (
                                  <div
                                    key={country.value}
                                    className={cn(
                                      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                                      field.value === country.value &&
                                        'bg-accent'
                                    )}
                                    onClick={() => {
                                      field.onChange(country.value);
                                      // Автоматически устанавливаем первый язык страны
                                      const languages = getLanguagesFromCountry(
                                        country.value
                                      );
                                      if (languages.length > 0) {
                                        setValue(
                                          'language',
                                          languages[0].value
                                        );
                                      }
                                      setCountryOpen(false);
                                      setCountrySearch('');
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === country.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {country.label}
                                  </div>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
              {errors.country && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* Выбор языка собеседования */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Язык собеседования <span className="text-red-500">*</span>
              </label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => {
                  const selectedCountry = watch('country');
                  const availableLanguages = useMemo(
                    () =>
                      selectedCountry
                        ? getLanguagesFromCountry(selectedCountry)
                        : [],
                    [selectedCountry, getLanguagesFromCountry]
                  );

                  return (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting || !selectedCountry}
                    >
                      <SelectTrigger
                        className={cn(
                          'w-full',
                          errors.language && 'border-red-400'
                        )}
                      >
                        <SelectValue
                          placeholder={
                            selectedCountry
                              ? 'Выберите язык...'
                              : 'Сначала выберите страну'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectGroup>
                          {availableLanguages.length > 0 ? (
                            availableLanguages.map(
                              (lang: { value: string; label: string }) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              )
                            )
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              Сначала выберите страну
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.language && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.language.message}
                </p>
              )}
            </div>

            {/* Опыт работы */}
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="experience"
              >
                Опыт работы <span className="text-red-500">*</span>
              </label>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={cn(
                      'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500',
                      errors.experience ? 'border-red-400' : 'border-gray-300'
                    )}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      Выберите опыт работы
                    </option>
                    {EXPERIENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.experience && (
                <p className="text-xs text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Телефон */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Телефон
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+7 (999) 123-45-67"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Кнопка отправки */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                'Пройти собеседование'
              )}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
});

CollectingContacts.displayName = 'CollectingContacts';

export default CollectingContacts;
