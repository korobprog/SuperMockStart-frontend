import { CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { itPositions, ItPosition } from '@/data/itPositions';
import { useState } from 'react';
import { countries } from 'countries-list';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Схема валидации с Zod
const formSchema = z.object({
  profession: z.string().min(1, 'Выберите профессию'),
  country: z.string().min(1, 'Выберите страну'),
  experience: z.string().min(1, 'Выберите опыт работы'),
  email: z.string().email('Неверный формат email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

const CollectingContacts = () => {
  const [professionOpen, setProfessionOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

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
      experience: '',
      email: '',
      phone: '',
    },
    mode: 'onChange', // Показывать ошибки при изменении полей
  });



  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form data:', data);
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Данные успешно отправлены!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Ошибка при отправке данных');
    }
  };

  // Преобразуем данные из countries-list в удобный формат
  const countriesList = Object.entries(countries)
    .map(([code, country]) => ({
      value: code,
      label: country.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const experienceOptions = [
    { value: '0-0', label: '0-0 study' },
    { value: '0-1', label: '0-1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
  ];

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
                  <Popover
                    open={professionOpen}
                    onOpenChange={setProfessionOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={professionOpen}
                        className={cn(
                          'w-full justify-between',
                          errors.profession && 'border-red-400'
                        )}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {field.value
                              ? itPositions.find(
                                  (item: ItPosition) =>
                                    item.value === field.value
                                )?.label
                              : 'Выберите профессию...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Поиск профессии..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Профессия не найдена.</CommandEmpty>
                          <CommandGroup>
                            {itPositions.map((item: ItPosition) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  setValue('profession', item.value);
                                  setProfessionOpen(false);
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
              {errors.profession && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.profession.message}
                </p>
              )}
            </div>

            {/* Выбор страны */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Язык <span className="text-red-500">*</span>
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
