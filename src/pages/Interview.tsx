import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle,
  Info,
  AlertCircle,
  MessageSquare,
  Star,
  ChevronLeft,
  Users,
  Code,
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Calendar } from '../components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addSelectedProfession,
  clearError,
} from '../store/slices/professionSlice';

import { getLanguageName, getCountryFlag } from '../utils/language';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const itPositions = [
  // Frontend разработка
  {
    value: 'frontend-developer',
    label: 'Frontend Developer',
    category: 'Frontend',
  },
  {
    value: 'react-developer',
    label: 'React Developer',
    category: 'Frontend',
  },
  {
    value: 'vue-developer',
    label: 'Vue.js Developer',
    category: 'Frontend',
  },
  {
    value: 'angular-developer',
    label: 'Angular Developer',
    category: 'Frontend',
  },
  {
    value: 'ui-ux-developer',
    label: 'UI/UX Developer',
    category: 'Frontend',
  },

  // Backend разработка
  {
    value: 'backend-developer',
    label: 'Backend Developer',
    category: 'Backend',
  },
  {
    value: 'nodejs-developer',
    label: 'Node.js Developer',
    category: 'Backend',
  },
  {
    value: 'python-developer',
    label: 'Python Developer',
    category: 'Backend',
  },
  {
    value: 'java-developer',
    label: 'Java Developer',
    category: 'Backend',
  },
  {
    value: 'csharp-developer',
    label: 'C# Developer',
    category: 'Backend',
  },
  {
    value: 'php-developer',
    label: 'PHP Developer',
    category: 'Backend',
  },
  {
    value: 'go-developer',
    label: 'Go Developer',
    category: 'Backend',
  },

  // Full Stack разработка
  {
    value: 'fullstack-developer',
    label: 'Full Stack Developer',
    category: 'Full Stack',
  },
  {
    value: 'mern-developer',
    label: 'MERN Stack Developer',
    category: 'Full Stack',
  },
  {
    value: 'mean-developer',
    label: 'MEAN Stack Developer',
    category: 'Full Stack',
  },

  // Мобильная разработка
  {
    value: 'ios-developer',
    label: 'iOS Developer',
    category: 'Mobile',
  },
  {
    value: 'android-developer',
    label: 'Android Developer',
    category: 'Mobile',
  },
  {
    value: 'react-native-developer',
    label: 'React Native Developer',
    category: 'Mobile',
  },
  {
    value: 'flutter-developer',
    label: 'Flutter Developer',
    category: 'Mobile',
  },

  // DevOps и инфраструктура
  {
    value: 'devops-engineer',
    label: 'DevOps Engineer',
    category: 'DevOps',
  },
  {
    value: 'site-reliability-engineer',
    label: 'Site Reliability Engineer (SRE)',
    category: 'DevOps',
  },
  {
    value: 'cloud-engineer',
    label: 'Cloud Engineer',
    category: 'DevOps',
  },
  {
    value: 'infrastructure-engineer',
    label: 'Infrastructure Engineer',
    category: 'DevOps',
  },

  // Data Science и аналитика
  {
    value: 'data-scientist',
    label: 'Data Scientist',
    category: 'Data',
  },
  {
    value: 'data-engineer',
    label: 'Data Engineer',
    category: 'Data',
  },
  {
    value: 'data-analyst',
    label: 'Data Analyst',
    category: 'Data',
  },
  {
    value: 'machine-learning-engineer',
    label: 'Machine Learning Engineer',
    category: 'Data',
  },

  // QA и тестирование
  {
    value: 'qa-engineer',
    label: 'QA Engineer',
    category: 'QA',
  },
  {
    value: 'test-automation-engineer',
    label: 'Test Automation Engineer',
    category: 'QA',
  },
  {
    value: 'manual-tester',
    label: 'Manual Tester',
    category: 'QA',
  },

  // Безопасность
  {
    value: 'security-engineer',
    label: 'Security Engineer',
    category: 'Security',
  },
  {
    value: 'cybersecurity-analyst',
    label: 'Cybersecurity Analyst',
    category: 'Security',
  },
  {
    value: 'penetration-tester',
    label: 'Penetration Tester',
    category: 'Security',
  },

  // Управление проектами
  {
    value: 'project-manager',
    label: 'Project Manager',
    category: 'Management',
  },
  {
    value: 'product-manager',
    label: 'Product Manager',
    category: 'Management',
  },
  {
    value: 'scrum-master',
    label: 'Scrum Master',
    category: 'Management',
  },

  // Специализированные роли
  {
    value: 'blockchain-developer',
    label: 'Blockchain Developer',
    category: 'Specialized',
  },
  {
    value: 'game-developer',
    label: 'Game Developer',
    category: 'Specialized',
  },
  {
    value: 'embedded-developer',
    label: 'Embedded Developer',
    category: 'Specialized',
  },
  {
    value: 'system-administrator',
    label: 'System Administrator',
    category: 'Specialized',
  },
  {
    value: 'database-administrator',
    label: 'Database Administrator',
    category: 'Specialized',
  },
];

interface TimeSlot {
  datetime: Date | string;
  available: boolean;
}

interface SlotInfo {
  start: Date;
  end: Date;
  slots: Date[];
  action: 'select';
}

interface QueueStatus {
  id: string;
  status: 'WAITING' | 'MATCHED' | 'CANCELLED' | 'EXPIRED';
  profession: string;
  language: string;
  preferredDateTime: Date;
  usersInQueueWithSameLanguage?: number;
  matchedSession?: {
    id: string;
    scheduledDateTime: Date;
    meetingLink: string;
    profession: string;
    language: string;
    candidate: { firstName?: string; lastName?: string };
    interviewer: { firstName?: string; lastName?: string };
  };
}

const Interview = () => {
  const {} = useTelegramAuth();
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState<'CANDIDATE' | 'INTERVIEWER'>(
    'CANDIDATE' // Changed default value
  );

  const [canBeCandidate, setCanBeCandidate] = useState(false);
  const [value, setValue] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Функция для получения всех слотов (доступных и недоступных) для выбранной даты
  const getAllSlotsForSelectedDate = useCallback(() => {
    if (!selectedDate) return [];

    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    const selectedDateEnd = new Date(selectedDate);
    selectedDateEnd.setHours(23, 59, 59, 999);

    // Создаем все возможные слоты для выбранной даты (каждый час)
    const allSlots: TimeSlot[] = [];
    const current = new Date(selectedDateStart);

    while (current <= selectedDateEnd) {
      for (let hour = 0; hour < 24; hour++) {
        current.setHours(hour, 0, 0, 0);

        // Проверяем, есть ли этот слот в availableSlots и доступен ли он
        const existingSlot = availableSlots.find((slot) => {
          const slotDateTime =
            typeof slot.datetime === 'string'
              ? new Date(slot.datetime)
              : slot.datetime;
          return (
            Math.abs(slotDateTime.getTime() - current.getTime()) <
            60 * 60 * 1000
          ); // В пределах часа
        });

        allSlots.push({
          datetime: new Date(current),
          available: existingSlot ? existingSlot.available : false,
        });
      }
      current.setDate(current.getDate() + 1);
    }

    return allSlots;
  }, [availableSlots, selectedDate]);

  const [pendingTimeSlot, setPendingTimeSlot] = useState<Date | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);

  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);

  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [loadingCompletedSessions, setLoadingCompletedSessions] =
    useState(false);
  const [userLanguage, setUserLanguage] = useState<string>('en');
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [loadingProfession, setLoadingProfession] = useState(true);
  const [joiningQueue, setJoiningQueue] = useState(false);
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });
  const [professionNotificationShown, setProfessionNotificationShown] =
    useState(false);

  // Состояние для времени пользователя
  const [, setCurrentTime] = useState(new Date());

  // API URL - используем переменную окружения или fallback на продакшен
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru/api';

  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dispatch = useAppDispatch();
  const { loading: professionLoading } = useAppSelector(
    (state) => state.profession
  );

  // Получаем токен из localStorage
  const getAuthToken = () => {
    // Сначала пробуем расширенный токен
    const extendedToken = localStorage.getItem('extended_token');
    if (extendedToken) {
      return extendedToken;
    }

    // Fallback на обычный токен
    const token = localStorage.getItem('telegram_token');
    if (token) {
      try {
        JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
        console.error('❌ Ошибка декодирования токена:', error);
      }
    }
    return token;
  };

  const loadAvailableSlots = useCallback(
    async (profession: string) => {
      setLoading(true);
      try {
        const token = getAuthToken();

        if (!token) {
          console.error('❌ Токен не найден! Пользователь не аутентифицирован');
          return;
        }

        const response = await fetch(
          `${API_URL}/calendar/slots/${profession}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAvailableSlots(data.data || []);
          } else {
            console.error('❌ Ошибка загрузки слотов:', data.error);
          }
        } else {
          console.error('❌ Ошибка загрузки слотов:', response.status);
        }
      } catch (error) {
        console.error('💥 Ошибка загрузки слотов:', error);
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  const checkQueueStatus = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('❌ Токен не найден для проверки статуса очереди');
        return;
      }

      console.log('🔍 Проверяем статус очереди...');
      const response = await fetch(`${API_URL}/calendar/queue/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(
        '📡 Ответ проверки статуса очереди:',
        response.status,
        response.statusText
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQueueStatus(data.data);
        }
      } else {
        console.error('❌ Ошибка проверки статуса очереди:', response.status);
      }
    } catch (error) {
      console.error('💥 Ошибка проверки статуса очереди:', error);
    }
  }, [API_URL]);

  const loadCompletedSessions = useCallback(async () => {
    setLoadingCompletedSessions(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('❌ Токен не найден для загрузки завершенных сессий');
        return;
      }

      console.log('🔍 Загружаем завершенные сессии...');
      const response = await fetch(`${API_URL}/calendar/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(
        '📡 Ответ загрузки сессий:',
        response.status,
        response.statusText
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCompletedSessions(data.data || []);
          console.log('✅ Завершенные сессии загружены');
        }
      } else {
        console.error(
          '❌ Ошибка загрузки завершенных сессий:',
          response.status
        );
      }
    } catch (error) {
      console.error('💥 Ошибка загрузки завершенных сессий:', error);
    } finally {
      setLoadingCompletedSessions(false);
    }
  }, [API_URL]);

  // Функция для обновления статуса пользователя
  const updateUserStatus = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('❌ Токен не найден для обновления статуса пользователя');
        return;
      }

      console.log('🔍 Обновляем статус пользователя...');
      const response = await fetch(`${API_URL}/form`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(
        '📡 Ответ обновления статуса:',
        response.status,
        response.statusText
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Обновляем статус пользователя и возможность быть кандидатом
          setUserStatus(data.data.status || 'INTERVIEWER');
          setCanBeCandidate(data.data.canBeCandidate || false);
          setProfessionNotificationShown(false);
          console.log('✅ Статус пользователя обновлен:', {
            status: data.data.status,
            canBeCandidate: data.data.canBeCandidate,
          });
        }
      } else {
        console.error(
          '❌ Ошибка обновления статуса пользователя:',
          response.status
        );
      }
    } catch (error) {
      console.error('💥 Ошибка обновления статуса пользователя:', error);
    }
  }, [API_URL]);

  // Check if user has completed registration form
  useEffect(() => {
    const checkUserRegistration = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.log('❌ Токен не найден, перенаправляем на аутентификацию');
          navigate('/auth');
          return;
        }

        const response = await fetch(`${API_URL}/form`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log('🔍 Данные формы пользователя:', data.data);

            // Check if user has form data (registration completed)
            // The backend checks for user.formData[0] existence, so we need to verify the user has actually submitted the form
            // We check for both profession and country since country is only set when the form is actually submitted
            if (!data.data.profession || !data.data.country) {
              console.log(
                '❌ Пользователь не завершил регистрацию, перенаправляем на форму'
              );
              navigate('/collectingcontacts');
              return;
            }

            // Set user status based on form data
            setCanBeCandidate(data.data.canBeCandidate || false);
            if (data.data.profession) {
              setValue(data.data.profession);
            }
          } else {
            console.log('❌ Ошибка получения данных формы:', data.error);
            showNotification(
              'Требуется регистрация',
              'Пожалуйста, заполните форму регистрации перед записью на собеседование',
              'error'
            );
            navigate('/collectingcontacts');
          }
        } else {
          console.log('❌ Ошибка запроса данных формы:', response.status);
          showNotification(
            'Ошибка проверки регистрации',
            'Не удалось проверить статус регистрации. Пожалуйста, попробуйте снова.',
            'error'
          );
          navigate('/collectingcontacts');
        }
      } catch (error) {
        console.error('💥 Ошибка проверки регистрации:', error);
        showNotification(
          'Ошибка системы',
          'Произошла ошибка при проверке регистрации. Пожалуйста, попробуйте позже.',
          'error'
        );
        navigate('/collectingcontacts');
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkUserRegistration();
  }, [navigate, API_URL]);

  // Загружаем последнюю выбранную профессию при монтировании только если есть токен
  useEffect(() => {
    const loadLastProfession = async () => {
      const token = getAuthToken();
      if (!token) return;

      setLoadingProfession(true);
      try {
        const response = await fetch(`${API_URL}/form`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Устанавливаем статус пользователя и возможность быть кандидатом
            setUserStatus(data.data.status || 'INTERVIEWER');
            setCanBeCandidate(data.data.canBeCandidate || false);
            setProfessionNotificationShown(false);
            setUserLanguage(data.data.language || 'en');
            setUserCountry(data.data.country || null);

            if (data.data.profession) {
              // Ищем профессию по value (который приходит из базы)
              const professionOption = itPositions.find(
                (pos) => pos.value === data.data.profession
              );
              if (professionOption) {
                setValue(professionOption.value);
                setShowCalendar(true);
                console.log(
                  '✅ Автоматически загружена профессия:',
                  data.data.profession
                );

                // Загружаем слоты для загруженной профессии
                await loadAvailableSlots(data.data.profession);
              } else {
                console.log(
                  '❌ Профессия не найдена в списке:',
                  data.data.profession
                );
              }
            }

            console.log('✅ Пользователь:', {
              status: data.data.status,
              canBeCandidate: data.data.canBeCandidate,
              language: data.data.language,
              country: data.data.country,
              profession: data.data.profession,
            });
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки профессии:', error);
      } finally {
        setLoadingProfession(false);
      }
    };

    loadLastProfession();
  }, []);

  // Загружаем доступные слоты при выборе профессии только если есть токен
  useEffect(() => {
    if (value && showCalendar && getAuthToken()) {
      console.log('🔄 Загружаем слоты для профессии:', value);
      loadAvailableSlots(value);
    }
  }, [value, showCalendar, loadAvailableSlots]);

  // Проверяем статус очереди при загрузке только если есть токен
  useEffect(() => {
    if (getAuthToken()) {
      checkQueueStatus();
      loadCompletedSessions();
    }
  }, [checkQueueStatus, loadCompletedSessions]);

  // Обновляем статус пользователя при фокусе на странице только если есть токен
  useEffect(() => {
    const handleFocus = () => {
      if (getAuthToken()) {
        updateUserStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [updateUserStatus]);

  // Отслеживаем изменения userStatus
  useEffect(() => {
    console.log('🔄 userStatus изменился:', userStatus);
  }, [userStatus]);

  const handleProfessionSelect = async (selectedValue: string) => {
    if (selectedValue && selectedValue !== value) {
      setValue(selectedValue);
      setShowCalendar(true);

      // Сбрасываем флаг уведомления при смене профессии
      setProfessionNotificationShown(false);

      // Находим выбранную профессию
      const selectedProfession = itPositions.find(
        (pos) => pos.value === selectedValue
      );

      if (selectedProfession) {
        try {
          // Получаем токен и извлекаем userId из него
          const token = getAuthToken();
          if (!token) {
            console.error('❌ Токен не найден');
            showNotification('Ошибка', 'Токен авторизации не найден', 'error');
            return;
          }

          // Декодируем JWT токен для получения userId
          const payload = JSON.parse(atob(token.split('.')[1]));
          const realUserId = payload.userId.toString();

          await dispatch(
            addSelectedProfession({
              userId: realUserId, // Используем реальный telegramId
              profession: selectedProfession.value, // Сохраняем value, а не label
            })
          ).unwrap();

          // Загружаем доступные слоты для выбранной профессии
          await loadAvailableSlots(selectedValue);

          // Показываем уведомление только один раз при выборе профессии
          if (!professionNotificationShown) {
            const userRoleText =
              userStatus === 'CANDIDATE' ? 'кандидата' : 'интервьюера';
            const nextStepText =
              userStatus === 'CANDIDATE'
                ? 'Теперь вы можете выбрать время для прохождения собеседования.'
                : 'Теперь вы можете выбрать время для проведения собеседования.';

            showNotification(
              'Профессия выбрана',
              `Выбрана профессия: ${selectedProfession.label}\n\nВаша роль: ${userRoleText}\n\n${nextStepText}`,
              'success'
            );
            setProfessionNotificationShown(true);
          }
        } catch (error) {
          console.error('❌ Failed to add profession:', error);
          showNotification(
            'Ошибка',
            'Не удалось сохранить выбранную профессию',
            'error'
          );
        }
      } else {
        console.error('❌ Профессия не найдена в списке:', selectedValue);
        showNotification(
          'Ошибка',
          'Выбранная профессия не найдена в списке',
          'error'
        );
      }
    }
  };

  const handleTimeSlotSelect = (slotInfo: SlotInfo) => {
    const selectedTime = slotInfo.start;
    const now = new Date();

    // Проверяем, не прошло ли уже время
    if (selectedTime <= now) {
      // Просто игнорируем прошедшее время без уведомления
      return;
    }

    // Проверяем, доступен ли этот слот
    const slot = availableSlots.find((s) => {
      const slotDateTime =
        typeof s.datetime === 'string' ? new Date(s.datetime) : s.datetime;
      const timeDiff = Math.abs(
        slotDateTime.getTime() - selectedTime.getTime()
      );
      return timeDiff < 60 * 60 * 1000; // В пределах часа
    });

    if (slot && slot.available) {
      setPendingTimeSlot(selectedTime);
      setShowConfirmModal(true);
    } else {
      showNotification(
        'Слот недоступен',
        'Этот временной слот недоступен. Пожалуйста, выберите другое время.',
        'error'
      );
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Убираем автоматический выбор первого слота при выборе даты
  };

  const joinQueue = async () => {
    if (!value || !selectedTimeSlot) {
      showNotification(
        'Необходимо выбрать',
        'Пожалуйста, выберите профессию и время',
        'error'
      );
      return;
    }

    setJoiningQueue(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/calendar/queue`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profession: value,
          preferredDateTime: selectedTimeSlot.toISOString(),
          queueType: userStatus,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.data.session) {
          // Матч найден сразу!
          showNotification(
            'Отлично!',
            'Найден партнер для собеседования!',
            'success'
          );
          setQueueStatus(data.data.queueEntry);
        } else {
          // Добавлены в очередь
          showNotification(
            'В очереди',
            'Вы добавлены в очередь. Мы найдем вам партнера!',
            'success'
          );
          setQueueStatus(data.data.queueEntry);
        }

        // Обновляем статус
        await checkQueueStatus();
      } else {
        const errorData = await response.json();
        showNotification('Ошибка', `Ошибка: ${errorData.error}`, 'error');
      }
    } catch (error) {
      console.error('Error joining queue:', error);
      showNotification('Ошибка', 'Ошибка при добавлении в очередь', 'error');
    } finally {
      setJoiningQueue(false);
    }
  };

  const leaveQueue = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/calendar/queue`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setQueueStatus(null);
        showNotification('Успешно', 'Вы вышли из очереди', 'success');
      }
    } catch (error) {
      console.error('Error leaving queue:', error);
    }
  };

  // Функция для завершения собеседования
  const completeSession = async (sessionId: string) => {
    try {
      console.log('🔍 Вызываем completeSession с sessionId:', sessionId);
      const token = getAuthToken();
      console.log('🔍 Токен получен:', token ? 'да' : 'нет');

      const response = await fetch(
        `${API_URL}/calendar/sessions/${sessionId}/complete`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log('✅ Собеседование успешно завершено');
        showNotification(
          'Собеседование завершено! 📝',
          'Теперь оставьте отзыв о собеседовании, чтобы завершить процесс.',
          'success'
        );
        // Очищаем статус очереди, чтобы убрать кнопку "Завершить собеседование"
        setQueueStatus(null);
        // Обновляем список завершенных сессий
        loadCompletedSessions();
        // Обновляем статус пользователя
        updateUserStatus();
        // Перенаправляем на страницу отзыва
        setTimeout(() => {
          window.location.href = `/feedback/${sessionId}`;
        }, 1000);
      } else {
        const errorData = await response.json();
        showNotification(
          'Ошибка',
          `Ошибка завершения: ${errorData.error}`,
          'error'
        );
      }
    } catch (error) {
      console.error('Error completing session:', error);
      showNotification(
        'Ошибка',
        'Ошибка при завершении собеседования',
        'error'
      );
    }
  };

  const confirmAndJoinQueue = async () => {
    if (pendingTimeSlot) {
      setSelectedTimeSlot(pendingTimeSlot);
      setShowConfirmModal(false);
      setPendingTimeSlot(null);

      // Сразу записываемся в очередь
      await joinQueue();
    }
  };

  const cancelTimeSelection = () => {
    setShowConfirmModal(false);
    setPendingTimeSlot(null);
  };

  const showNotification = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    setNotificationModal({
      isOpen: true,
      title,
      message,
      type,
    });

    // Автоматически закрываем уведомление через 5 секунд для успешных операций
    if (type === 'success') {
      setTimeout(() => {
        closeNotification();
      }, 5000);
    }
  };

  const closeNotification = () => {
    setNotificationModal({
      isOpen: false,
      title: '',
      message: '',
      type: 'info',
    });
  };

  // Подготавливаем события календаря для отображения доступных слотов
  useMemo(() => {
    const now = new Date();
    const events: Array<{
      id: string;
      title: string;
      start: Date;
      end: Date;
      resource: {
        available: boolean;
        past: boolean;
        unavailable: boolean;
      };
    }> = [];

    // Группируем слоты по дням, чтобы избежать наложения
    const slotsByDay = new Map<string, typeof availableSlots>();

    availableSlots.forEach((slot) => {
      const slotDateTime =
        typeof slot.datetime === 'string'
          ? new Date(slot.datetime)
          : slot.datetime;

      const dayKey = slotDateTime.toDateString();
      if (!slotsByDay.has(dayKey)) {
        slotsByDay.set(dayKey, []);
      }
      slotsByDay.get(dayKey)!.push(slot);
    });

    // Создаем события для каждого дня
    slotsByDay.forEach((daySlots, dayKey) => {
      // Сортируем слоты по времени
      daySlots.sort((a, b) => {
        const aTime =
          typeof a.datetime === 'string' ? new Date(a.datetime) : a.datetime;
        const bTime =
          typeof b.datetime === 'string' ? new Date(b.datetime) : b.datetime;
        return aTime.getTime() - bTime.getTime();
      });

      // Создаем отдельные события для прошедшего и будущего времени
      const pastSlots = daySlots.filter((slot) => {
        const slotTime =
          typeof slot.datetime === 'string'
            ? new Date(slot.datetime)
            : slot.datetime;
        return slotTime <= now;
      });

      const futureSlots = daySlots.filter((slot) => {
        const slotTime =
          typeof slot.datetime === 'string'
            ? new Date(slot.datetime)
            : slot.datetime;
        return slotTime > now;
      });

      // Создаем событие для прошедшего времени
      if (pastSlots.length > 0) {
        const firstPastSlot = pastSlots[0];
        const lastPastSlot = pastSlots[pastSlots.length - 1];

        const firstPastTime =
          typeof firstPastSlot.datetime === 'string'
            ? new Date(firstPastSlot.datetime)
            : firstPastSlot.datetime;
        const lastPastTime =
          typeof lastPastSlot.datetime === 'string'
            ? new Date(lastPastSlot.datetime)
            : lastPastSlot.datetime;

        events.push({
          id: `past-${dayKey}`,
          title: 'Прошедшее время',
          start: firstPastTime,
          end: new Date(lastPastTime.getTime() + 60 * 60 * 1000),
          resource: {
            available: false,
            past: true,
            unavailable: false,
          },
        });
      }

      // Создаем событие для будущего времени
      if (futureSlots.length > 0) {
        const firstFutureSlot = futureSlots[0];
        const lastFutureSlot = futureSlots[futureSlots.length - 1];

        const firstFutureTime =
          typeof firstFutureSlot.datetime === 'string'
            ? new Date(firstFutureSlot.datetime)
            : firstFutureSlot.datetime;
        const lastFutureTime =
          typeof lastFutureSlot.datetime === 'string'
            ? new Date(lastFutureSlot.datetime)
            : lastFutureSlot.datetime;

        const hasAvailableSlots = futureSlots.some((slot) => slot.available);
        const isAvailable = hasAvailableSlots;
        const isUnavailable = !hasAvailableSlots;

        events.push({
          id: `future-${dayKey}`,
          title: isAvailable ? 'Доступно' : 'Недоступно',
          start: firstFutureTime,
          end: new Date(lastFutureTime.getTime() + 60 * 60 * 1000),
          resource: {
            available: isAvailable,
            past: false,
            unavailable: isUnavailable,
          },
        });
      }
    });

    return events;
  }, [availableSlots]);

  // Если есть подтвержденная встреча
  if (queueStatus?.status === 'MATCHED' && queueStatus.matchedSession) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>

              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">
                  Собеседование подтверждено!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Ваше собеседование успешно запланировано
                </p>
              </div>
            </div>

            <Card className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">
                    Встреча запланирована
                  </h2>
                  <p className="text-muted-foreground">
                    Ваше собеседование успешно запланировано
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Дата и время</p>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          queueStatus.matchedSession.scheduledDateTime,
                          'dd MMMM yyyy, HH:mm',
                          { locale: ru }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Code className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Профессия</p>
                      <p className="text-sm text-muted-foreground">
                        {queueStatus.matchedSession.profession}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-5 w-5 text-blue-600" />
                    <p className="font-medium text-blue-900">
                      Ссылка на видеоконференцию
                    </p>
                  </div>
                  <a
                    href={queueStatus.matchedSession.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                  >
                    {queueStatus.matchedSession.meetingLink}
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <a
                      href={queueStatus.matchedSession.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Присоединиться к встрече
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (queueStatus.matchedSession) {
                        completeSession(queueStatus.matchedSession.id);
                      }
                    }}
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Завершить и оставить отзыв
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={leaveQueue}
                  className="w-full"
                >
                  Отменить встречу
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show loading screen while checking registration
  if (checkingRegistration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Проверяем регистрацию...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>

            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">
                Записаться на собеседование
              </h1>
              <p className="text-muted-foreground mb-6">
                Выберите профессию и время для собеседования
              </p>
            </div>
          </div>

          {/* Step 1: Profession Selection */}
          <Card className="p-6 mb-6">
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="profession"
                  className="text-base font-medium mb-3 block"
                >
                  Выберите профессию:
                </Label>
                <Select
                  value={value}
                  onValueChange={handleProfessionSelect}
                  disabled={professionLoading || loadingProfession}
                >
                  <SelectTrigger className="w-full h-12 text-base bg-background border-border">
                    {professionLoading || loadingProfession ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">
                          {loadingProfession
                            ? 'Загрузка профессии...'
                            : 'Сохранение...'}
                        </span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Выберите профессию" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <SelectGroup>
                      {itPositions.map((pos) => (
                        <SelectItem
                          key={pos.value}
                          value={pos.value}
                          className="hover:bg-accent"
                        >
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-primary" />
                            {pos.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {value && (
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Ваша роль:
                  </Label>
                  <RadioGroup
                    value={userStatus}
                    onValueChange={(value: string) =>
                      setUserStatus(value as 'CANDIDATE' | 'INTERVIEWER')
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="CANDIDATE"
                        id="candidate"
                        disabled={!canBeCandidate && userStatus !== 'CANDIDATE'}
                      />
                      <Label
                        htmlFor="candidate"
                        className="text-base font-medium cursor-pointer"
                      >
                        Кандидат
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="INTERVIEWER"
                        id="interviewer"
                        disabled={userStatus !== 'INTERVIEWER'}
                      />
                      <Label
                        htmlFor="interviewer"
                        className="text-base font-medium cursor-pointer flex items-center gap-1"
                      >
                        Интервьюер
                        <Star className="w-4 h-4 text-warning" />
                      </Label>
                    </div>
                  </RadioGroup>

                  {userStatus === 'CANDIDATE' &&
                    !canBeCandidate &&
                    userStatus !== 'CANDIDATE' && (
                      <p className="text-sm text-muted-foreground mt-2 p-3 bg-gradient-secondary rounded-lg">
                        💡 Чтобы стать кандидатом, сначала проведите
                        собеседование как интервьюер и получите обратную связь
                      </p>
                    )}

                  {userStatus === 'INTERVIEWER' && (
                    <p className="text-sm text-success mt-2 p-3 bg-success/10 rounded-lg">
                      Вы будете проводить собеседование
                    </p>
                  )}
                </div>
              )}

              {userCountry && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg flex-shrink-0">
                    {getCountryFlag(userCountry)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Язык собеседования: {getLanguageName(userLanguage)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Вы будете участвовать в собеседованиях на{' '}
                      {getLanguageName(userLanguage).toLowerCase()} языке
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Step 2 Header */}
          {showCalendar && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Шаг 2: Выберите дату и время
              </h2>
              <p className="text-muted-foreground">
                Выберите удобную дату и время для собеседования
              </p>

              {value && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {itPositions.find((pos) => pos.value === value)?.label}
                  </Badge>
                  <Badge variant="outline">
                    {userStatus === 'INTERVIEWER' ? 'Интервьюер' : 'Кандидат'}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Calendar */}
          {showCalendar && (
            <Card className="p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="flex justify-center mb-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      // Разрешаем выбирать текущий день, но блокируем прошедшие дни
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                    className="pointer-events-auto"
                    locale={ru}
                  />
                </div>

                {/* Кнопка для возврата к текущему дню */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                  className="text-xs"
                >
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  Вернуться к сегодняшнему дню
                </Button>
              </div>
            </Card>
          )}

          {/* Available Time Slots */}
          {showCalendar && selectedDate && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Доступные слоты на{' '}
                {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}:
              </h3>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Загрузка доступных слотов...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {getAllSlotsForSelectedDate().map((slot, index) => {
                    const slotDateTime =
                      typeof slot.datetime === 'string'
                        ? new Date(slot.datetime)
                        : slot.datetime;

                    const isAvailable = slot.available;
                    const isPast = slotDateTime < new Date();

                    return (
                      <Button
                        key={index}
                        variant={isAvailable && !isPast ? 'default' : 'outline'}
                        className={`h-12 text-lg font-medium transition-all duration-200 ${
                          isAvailable && !isPast
                            ? 'bg-success text-white hover:bg-success/90'
                            : isPast
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                            : 'hover:border-primary hover:text-primary'
                        }`}
                        disabled={!isAvailable || isPast}
                        onClick={() => {
                          if (isAvailable && !isPast) {
                            const slotInfo = {
                              start: slotDateTime,
                              end: new Date(
                                slotDateTime.getTime() + 60 * 60 * 1000
                              ),
                              slots: [
                                slotDateTime,
                                new Date(
                                  slotDateTime.getTime() + 60 * 60 * 1000
                                ),
                              ],
                              action: 'select' as const,
                            };
                            handleTimeSlotSelect(slotInfo);
                          }
                        }}
                      >
                        <Clock
                          className={`w-4 h-4 mr-2 ${
                            isPast ? 'text-gray-400' : ''
                          }`}
                        />
                        {format(slotDateTime, 'HH:mm', { locale: ru })}
                        {isPast && (
                          <span className="ml-1 text-xs">(прошло)</span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              )}

              {selectedTimeSlot && (
                <div className="mt-6 text-center">
                  <div className="p-4 bg-gradient-secondary rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      Выбранное время:
                    </p>
                    <p className="text-lg font-semibold">
                      {format(selectedTimeSlot, 'dd MMMM yyyy', { locale: ru })}{' '}
                      в {format(selectedTimeSlot, 'HH:mm', { locale: ru })}
                    </p>
                  </div>

                  <Button
                    onClick={joinQueue}
                    className="w-full"
                    size="lg"
                    disabled={!selectedTimeSlot || !value || joiningQueue}
                  >
                    {joiningQueue ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Записываемся...
                      </>
                    ) : (
                      'Записаться на собеседование'
                    )}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Queue Status */}
          {queueStatus && queueStatus.status === 'WAITING' && (
            <Card className="mt-6">
              <CardHeader className="px-6">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Ожидание партнера
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  <p className="text-sm">
                    Мы ищем для вас подходящего партнера для собеседования:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      Профессия: {queueStatus.profession}
                    </Badge>
                    <Badge variant="outline">
                      Язык: {getLanguageName(queueStatus.language)}
                    </Badge>
                    <Badge variant="outline">
                      Время:{' '}
                      {format(
                        queueStatus.preferredDateTime,
                        'dd.MM.yyyy HH:mm',
                        { locale: ru }
                      )}
                    </Badge>
                  </div>

                  {queueStatus.usersInQueueWithSameLanguage !== undefined && (
                    <div
                      className={`p-3 rounded-lg ${
                        queueStatus.usersInQueueWithSameLanguage <= 1
                          ? 'bg-amber-50 border border-amber-200'
                          : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {queueStatus.usersInQueueWithSameLanguage <= 1 ? (
                          <span className="text-amber-600">⚠️</span>
                        ) : (
                          <span className="text-green-600">👥</span>
                        )}
                        <p
                          className={`text-sm ${
                            queueStatus.usersInQueueWithSameLanguage <= 1
                              ? 'text-amber-700'
                              : 'text-green-700'
                          }`}
                        >
                          {queueStatus.usersInQueueWithSameLanguage <= 1
                            ? `Вы первый с языком ${getLanguageName(
                                queueStatus.language
                              )}. Ожидание других участников...`
                            : `В очереди ${
                                queueStatus.usersInQueueWithSameLanguage
                              } участников с языком ${getLanguageName(
                                queueStatus.language
                              )}`}
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    onClick={leaveQueue}
                    className="w-full"
                  >
                    Отменить запись
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Sessions */}
          {completedSessions.length > 0 && (
            <Card className="mt-6">
              <CardHeader className="px-6">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Завершенные собеседования
                </CardTitle>
                <CardDescription>
                  Оставьте отзыв о прошедших собеседованиях или создайте новое
                  интервью
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {loadingCompletedSessions ? (
                  <div className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Загрузка...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{session.profession}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              session.scheduledDateTime,
                              'dd MMMM yyyy, HH:mm',
                              { locale: ru }
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/feedback/${session.id}`}>
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Отзыв
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/feedback-history">
                              <Star className="h-4 w-4 mr-1" />
                              История
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Create New Interview Button */}
          {!showCalendar &&
            getAuthToken() &&
            completedSessions.length === 0 && (
              <div className="text-center mt-6">
                <Button
                  onClick={() => {
                    setValue('');
                    setSelectedTimeSlot(null);
                    setShowCalendar(false);
                    setQueueStatus(null);
                    dispatch(clearError());
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-4"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Создать новое интервью
                </Button>
              </div>
            )}
        </div>
      </div>

      {/* Модальные окна остаются без изменений */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Подтвердите запись на собеседование
            </DialogTitle>
            <DialogDescription className="text-sm">
              Вы выбрали время для собеседования. Нажмите кнопку ниже, чтобы
              подтвердить и записаться в очередь.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-xs sm:text-sm font-medium">
                <strong>Выбранное время:</strong>{' '}
                {pendingTimeSlot &&
                  format(pendingTimeSlot, 'dd MMMM yyyy, HH:mm', {
                    locale: ru,
                  })}
              </p>
              <p className="text-xs sm:text-sm font-medium">
                <strong>Профессия:</strong>{' '}
                {value && itPositions.find((pos) => pos.value === value)?.label}
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={cancelTimeSelection}
              size="sm"
              className="text-xs sm:text-sm"
            >
              Отменить
            </Button>
            <Button
              onClick={confirmAndJoinQueue}
              disabled={joiningQueue}
              size="sm"
              className="text-xs sm:text-sm"
            >
              {joiningQueue ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                  <span className="hidden xs:inline">Записываемся...</span>
                  <span className="xs:hidden">Запись...</span>
                </>
              ) : (
                <>
                  <span className="hidden xs:inline">
                    Записаться на собеседование
                  </span>
                  <span className="xs:hidden">Записаться</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={notificationModal.isOpen} onOpenChange={closeNotification}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              {notificationModal.type === 'success' && (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              )}
              {notificationModal.type === 'error' && (
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              )}
              {notificationModal.type === 'info' && (
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              )}
              {notificationModal.title}
            </DialogTitle>
            <DialogDescription className="text-sm whitespace-pre-line">
              {notificationModal.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={closeNotification}
              className="w-full text-xs sm:text-sm"
            >
              Понятно
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Interview;
