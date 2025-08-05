import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { itPositions } from '@/data/itPositions';
import { countries } from 'countries-list';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Star,
  Trophy,
  Code,
  Edit,
  Github,
  Linkedin,
  ExternalLink,
  CheckCircle,
  BookOpen,
  Clock,
} from 'lucide-react';

// Схема валидации для редактирования профиля
const editProfileSchema = z.object({
  profession: z.string().min(1, 'Выберите профессию'),
  country: z.string().min(1, 'Выберите страну'),
  language: z.string().min(1, 'Выберите язык собеседования'),
  experience: z.string().min(1, 'Выберите опыт работы'),
  email: z.string().email('Неверный формат email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

const EXPERIENCE_OPTIONS = [
  { value: '0-0', label: '0-0 study' },
  { value: '0-1', label: '0-1 year' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
] as const;

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useTelegramAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // Настройка формы редактирования
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      profession: '',
      country: '',
      language: '',
      experience: '',
      email: '',
      phone: '',
    },
  });

  // Получение данных формы пользователя
  useEffect(() => {
    const loadFormData = async () => {
      if (!isAuthenticated) return;

      try {
        const token =
          localStorage.getItem('extended_token') ||
          localStorage.getItem('telegram_token');

        if (!token) return;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/form`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFormData(data.data);
            // Заполняем форму существующими данными
            reset({
              profession: data.data.profession || '',
              country: data.data.country || '',
              language: data.data.language || '',
              experience: data.data.experience || '',
              email: data.data.email || '',
              phone: data.data.phone || '',
            });
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных формы:', error);
      }
    };

    loadFormData();
  }, [isAuthenticated, reset]);

  // Обновление данных формы
  const onSubmit = async (data: EditProfileFormData) => {
    try {
      const token =
        localStorage.getItem('extended_token') ||
        localStorage.getItem('telegram_token');

      if (!token) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/form`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Данные профиля обновлены:', result);
        setFormData(data);
        setEditDialogOpen(false);
      } else {
        const errorData = await response.json();
        console.error('❌ Ошибка обновления профиля:', errorData);
      }
    } catch (error) {
      console.error('❌ Ошибка при обновлении профиля:', error);
    }
  };

  // Получение списка стран
  const countriesList = Object.entries(countries as Record<string, any>)
    .map(([code, country]) => ({
      value: code,
      label: country.name.split(',')[0].split(';')[0].trim(),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Если пользователь не авторизован, показываем загрузку
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto animate-glow-pulse">
            <div className="w-8 h-8 bg-white rounded-full animate-ping"></div>
          </div>
          <p className="text-muted-foreground">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  const skills = [
    { name: 'JavaScript', level: 85, category: 'Frontend' },
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 75, category: 'Backend' },
    { name: 'Python', level: 70, category: 'Backend' },
    { name: 'Docker', level: 60, category: 'DevOps' },
    { name: 'AWS', level: 55, category: 'DevOps' },
  ];

  const achievements = [
    {
      title: 'Первое собеседование',
      icon: <Star className="w-4 h-4" />,
      completed: true,
    },
    {
      title: '10 собеседований',
      icon: <Trophy className="w-4 h-4" />,
      completed: true,
    },
    {
      title: 'Хакатон победитель',
      icon: <Trophy className="w-4 h-4" />,
      completed: false,
    },
    {
      title: 'Ментор года',
      icon: <Star className="w-4 h-4" />,
      completed: false,
    },
  ];

  const interviewHistory = [
    {
      role: 'Frontend React',
      company: 'Яндекс',
      date: '15 янв 2024',
      rating: 4.5,
      status: 'success',
    },
    {
      role: 'Fullstack',
      company: 'Сбер',
      date: '10 янв 2024',
      rating: 4.2,
      status: 'success',
    },
    {
      role: 'JavaScript',
      company: 'VK',
      date: '05 янв 2024',
      rating: 3.8,
      status: 'pending',
    },
    {
      role: 'React Native',
      company: 'Авито',
      date: '28 дек 2023',
      rating: 4.0,
      status: 'success',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-elegant">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-1 text-gradient">
                  {user.first_name || 'Пользователь'} {user.last_name || ''}
                </h2>
                <p className="text-muted-foreground">
                  {formData?.profession
                    ? itPositions.find((p) => p.value === formData.profession)
                        ?.label || formData.profession
                    : 'Frontend Developer'}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-muted-foreground">
                    (24 отзыва)
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {formData?.email || user.username
                    ? formData?.email || `${user.username}@telegram.org`
                    : 'email@example.com'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {formData?.country
                    ? countriesList.find((c) => c.value === formData.country)
                        ?.label || formData.country
                    : 'Москва, Россия'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  На платформе с января 2024
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span className="text-sm">
                    github.com/{user.username || 'user'}
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">
                    linkedin.com/in/{user.username || 'user'}
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>

              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:shadow-glow transition-all duration-300">
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать профиль
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Редактирование профиля</DialogTitle>
                    <DialogDescription>
                      Измените ваши данные профиля. Эти данные используются для
                      поиска собеседований.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Профессия */}
                    <div className="space-y-2">
                      <Label htmlFor="profession">Профессия *</Label>
                      <Controller
                        name="profession"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите профессию..." />
                            </SelectTrigger>
                            <SelectContent>
                              {itPositions.map((position) => (
                                <SelectItem
                                  key={position.value}
                                  value={position.value}
                                >
                                  {position.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.profession && (
                        <p className="text-xs text-red-500">
                          {errors.profession.message}
                        </p>
                      )}
                    </div>

                    {/* Страна */}
                    <div className="space-y-2">
                      <Label htmlFor="country">Страна *</Label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите страну..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {countriesList.map((country) => (
                                <SelectItem
                                  key={country.value}
                                  value={country.value}
                                >
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.country && (
                        <p className="text-xs text-red-500">
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    {/* Язык */}
                    <div className="space-y-2">
                      <Label htmlFor="language">Язык собеседования *</Label>
                      <Controller
                        name="language"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите язык..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ru">Русский</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.language && (
                        <p className="text-xs text-red-500">
                          {errors.language.message}
                        </p>
                      )}
                    </div>

                    {/* Опыт работы */}
                    <div className="space-y-2">
                      <Label htmlFor="experience">Опыт работы *</Label>
                      <Controller
                        name="experience"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите опыт..." />
                            </SelectTrigger>
                            <SelectContent>
                              {EXPERIENCE_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                      <Label htmlFor="email">Email</Label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                          />
                        )}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Телефон */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+7 (999) 123-45-67"
                          />
                        )}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditDialogOpen(false)}
                      >
                        Отмена
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>

            {/* Achievements */}
            <Card className="p-6 mt-6 shadow-elegant">
              <h3 className="font-semibold mb-4">Достижения</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.completed ? 'bg-success/10' : 'bg-muted/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        achievement.completed
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {achievement.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        achievement.icon
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        achievement.completed
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {achievement.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <Card className="p-6 shadow-elegant">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Навыки и технологии</h3>
                <Button variant="outline" size="sm" className="hover-lift">
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              </div>

              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6 hover-lift">
                <Code className="w-4 h-4 mr-2" />
                Добавить навык
              </Button>
            </Card>

            {/* Interview History */}
            <Card className="p-6 shadow-elegant">
              <h3 className="text-xl font-semibold mb-6">
                История собеседований
              </h3>
              <div className="space-y-4">
                {interviewHistory.map((interview, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-secondary card-hover"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{interview.role}</div>
                        <div className="text-sm text-muted-foreground">
                          {interview.company} • {interview.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-sm font-medium">
                          {interview.rating}
                        </span>
                      </div>
                      <Badge
                        variant={
                          interview.status === 'success'
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          interview.status === 'success' ? 'bg-success' : ''
                        }
                      >
                        {interview.status === 'success'
                          ? 'Завершено'
                          : 'В процессе'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center card-hover">
                <div className="text-3xl font-bold text-primary mb-2">24</div>
                <div className="text-sm text-muted-foreground">
                  Собеседований
                </div>
              </Card>
              <Card className="p-6 text-center card-hover">
                <div className="text-3xl font-bold text-success mb-2">87%</div>
                <div className="text-sm text-muted-foreground">Успешность</div>
              </Card>
              <Card className="p-6 text-center card-hover">
                <div className="text-3xl font-bold text-accent mb-2">156</div>
                <div className="text-sm text-muted-foreground">
                  Часов практики
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6 shadow-elegant">
              <h3 className="text-xl font-semibold mb-6">
                Последняя активность
              </h3>
              <div className="space-y-4">
                {[
                  {
                    action: 'Завершил собеседование',
                    company: 'Яндекс',
                    time: '2 часа назад',
                    icon: <CheckCircle className="w-4 h-4 text-success" />,
                  },
                  {
                    action: 'Начал подготовку',
                    company: 'React Interview',
                    time: '1 день назад',
                    icon: <BookOpen className="w-4 h-4 text-primary" />,
                  },
                  {
                    action: 'Получил фидбек',
                    company: 'Сбер',
                    time: '3 дня назад',
                    icon: <Star className="w-4 h-4 text-warning" />,
                  },
                  {
                    action: 'Запланировал сессию',
                    company: 'VK',
                    time: '1 неделю назад',
                    icon: <Clock className="w-4 h-4 text-accent" />,
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-secondary"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.company} • {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
