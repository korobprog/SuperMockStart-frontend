import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { itPositions, ItPosition } from '@/data/itPositions';
import { useState, useEffect } from 'react';
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

const CollectingContacts = () => {
  const [countryOpen, setCountryOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
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

  // Автоматическая аутентификация в режиме разработки
  useEffect(() => {
    const authenticateInDev = async () => {
      const token = localStorage.getItem('telegram_token');

      // Если токена нет и мы в режиме разработки, получаем тестовый токен
      if (!token && import.meta.env.DEV) {
        setIsAuthenticating(true);
        try {
          // Принудительно очищаем кэш в режиме разработки
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
          }

          // Удаляем service workers если они есть
          if ('serviceWorker' in navigator) {
            const registrations =
              await navigator.serviceWorker.getRegistrations();
            await Promise.all(
              registrations.map((registration) => registration.unregister())
            );
          }

          const apiUrl =
            import.meta.env.VITE_API_URL || 'http://localhost:3001';
          const response = await fetch(`${apiUrl}/api/auth/test-token`, {
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              localStorage.setItem('telegram_token', data.data.token);
              console.log(
                '✅ Автоматически получен тестовый токен в режиме разработки'
              );
            }
          }
        } catch (error) {
          console.error('Ошибка получения тестового токена:', error);
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    authenticateInDev();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form data:', data);

      // Получаем токен из localStorage
      const token = localStorage.getItem('telegram_token');

      if (!token) {
        alert('Ошибка авторизации. Пожалуйста, войдите через Telegram.');
        return;
      }

      // Отправляем данные на сервер
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        cache: 'no-cache',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при отправке данных');
      }

      const result = await response.json();
      console.log('Server response:', result);

      // Перенаправляем на страницу интервью
      navigate('/interview');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(
        error instanceof Error ? error.message : 'Ошибка при отправке данных'
      );
    }
  };

  // Преобразуем данные из countries-list в удобный формат
  const countriesList = Object.entries(countries)
    .map(([code, country]) => ({
      value: code,
      label: country.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Получаем языки из countries-list
  const getLanguagesFromCountry = (countryCode: string) => {
    const country = countries[countryCode as keyof typeof countries];
    if (!country || !country.languages) return [];

    return country.languages.map((lang: string) => ({
      value: lang,
      label: getLanguageName(lang),
    }));
  };

  // Названия языков
  const getLanguageName = (code: string) => {
    const languageNames: Record<string, string> = {
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
    return languageNames[code] || code;
  };

  const experienceOptions = [
    { value: '0-0', label: '0-0 study' },
    { value: '0-1', label: '0-1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
  ];

  // Показываем загрузку во время аутентификации
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Настройка аутентификации...</p>
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
                render={({ field }) => (
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
                        {field.value
                          ? countriesList.find(
                              (item) => item.value === field.value
                            )?.label
                          : 'Выберите страну...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Поиск страны..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Страна не найдена.</CommandEmpty>
                          <CommandGroup>
                            {countriesList.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  setValue('country', item.value);
                                  // Автоматически устанавливаем первый язык страны
                                  const languages = getLanguagesFromCountry(
                                    item.value
                                  );
                                  if (languages.length > 0) {
                                    setValue('language', languages[0].value);
                                  }
                                  setCountryOpen(false);
                                }}
                              >
                                {item.label}
                                <Check
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    field.value === item.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
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
                  const availableLanguages = selectedCountry
                    ? getLanguagesFromCountry(selectedCountry)
                    : [];

                  return (
                    <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={languageOpen}
                          className={cn(
                            'w-full justify-between',
                            errors.language && 'border-red-400'
                          )}
                          disabled={isSubmitting || !selectedCountry}
                        >
                          {field.value
                            ? availableLanguages.find(
                                (item) => item.value === field.value
                              )?.label || field.value
                            : selectedCountry
                            ? 'Выберите язык...'
                            : 'Сначала выберите страну'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Поиск языка..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Язык не найден.</CommandEmpty>
                            <CommandGroup>
                              {availableLanguages.map((item) => (
                                <CommandItem
                                  key={item.value}
                                  value={item.value}
                                  onSelect={() => {
                                    setValue('language', item.value);
                                    setLanguageOpen(false);
                                  }}
                                >
                                  {item.label}
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      field.value === item.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                    {experienceOptions.map((option) => (
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
};

export default CollectingContacts;
