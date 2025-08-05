import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle,
  Info,
  AlertCircle,
  MessageSquare,
  Star,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addSelectedProfession,
  clearError,
} from '@/store/slices/professionSlice';
import ProfessionHistory from '@/components/ProfessionHistory';
import { getLanguageName, getCountryFlag } from '@/utils/language';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

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
  const { logout } = useTelegramAuth();
  const [userStatus, setUserStatus] = useState<'CANDIDATE' | 'INTERVIEWER'>(
    'CANDIDATE' // Changed default value
  );

  const [canBeCandidate, setCanBeCandidate] = useState(false);
  const [value, setValue] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Функция для фильтрации слотов по дням (больше не используется, но оставляем для совместимости)
  const getFilteredSlots = useCallback(() => {
    const now = new Date();
    const bufferTime = new Date(now);
    bufferTime.setMinutes(bufferTime.getMinutes() - 5);

    const filtered = availableSlots
      .filter((slot) => slot.available)
      .filter((slot) => {
        const slotDateTime =
          typeof slot.datetime === 'string'
            ? new Date(slot.datetime)
            : slot.datetime;
        return slotDateTime > bufferTime; // Исключаем прошедшие слоты
      });

    return filtered;
  }, [availableSlots]);

  // Функция для получения слотов для выбранной даты
  const getSlotsForSelectedDate = useCallback(() => {
    if (!selectedDate) return [];

    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    const selectedDateEnd = new Date(selectedDate);
    selectedDateEnd.setHours(23, 59, 59, 999);

    return availableSlots.filter((slot) => {
      const slotDateTime =
        typeof slot.datetime === 'string'
          ? new Date(slot.datetime)
          : slot.datetime;

      return (
        slotDateTime >= selectedDateStart &&
        slotDateTime <= selectedDateEnd &&
        slot.available
      );
    });
  }, [availableSlots, selectedDate]);

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
  const [currentTime, setCurrentTime] = useState(new Date());

  // API URL - используем переменную окружения или fallback на продакшен
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dispatch = useAppDispatch();
  const { loading: professionLoading, error } = useAppSelector(
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
        const payload = JSON.parse(atob(token.split('.')[1]));
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
          `${API_URL}/api/calendar/slots/${profession}`,
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
      const response = await fetch(`${API_URL}/api/calendar/queue/status`, {
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
      const response = await fetch(`${API_URL}/api/calendar/sessions`, {
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
      const response = await fetch(`${API_URL}/api/form`, {
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

  // Загружаем последнюю выбранную профессию при монтировании только если есть токен
  useEffect(() => {
    const loadLastProfession = async () => {
      const token = getAuthToken();
      if (!token) return;

      setLoadingProfession(true);
      try {
        const response = await fetch(`${API_URL}/api/form`, {
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
      const response = await fetch(`${API_URL}/api/calendar/queue`, {
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
      const response = await fetch(`${API_URL}/api/calendar/queue`, {
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
        `${API_URL}/api/calendar/sessions/${sessionId}/complete`,
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
  const calendarEvents = useMemo(() => {
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
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                ← Назад
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center sm:text-left">
              Собеседование подтверждено!
            </h1>
            <Button
              variant="outline"
              onClick={logout}
              className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
              size="sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Выйти</span>
              <span className="xs:hidden">Выход</span>
            </Button>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                Встреча запланирована
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Ваше собеседование успешно запланировано
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">
                      Дата и время
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">
                      {format(
                        queueStatus.matchedSession.scheduledDateTime,
                        'dd MMMM yyyy, HH:mm',
                        { locale: ru }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">
                      Профессия
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">
                      {queueStatus.matchedSession.profession}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <p className="font-medium text-blue-900 text-sm sm:text-base">
                    Ссылка на видеоконференцию
                  </p>
                </div>
                <a
                  href={queueStatus.matchedSession.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all text-xs sm:text-sm"
                >
                  {queueStatus.matchedSession.meetingLink}
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
                <Button asChild className="flex-1 text-xs sm:text-sm">
                  <a
                    href={queueStatus.matchedSession.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">
                      Присоединиться к встрече
                    </span>
                    <span className="xs:hidden">Присоединиться</span>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('🔍 Клик по кнопке "Завершить собеседование"');
                    console.log(
                      '🔍 queueStatus.matchedSession:',
                      queueStatus.matchedSession
                    );
                    if (queueStatus.matchedSession) {
                      console.log(
                        '🔍 Вызываем completeSession с ID:',
                        queueStatus.matchedSession.id
                      );
                      completeSession(queueStatus.matchedSession.id);
                    } else {
                      console.log(
                        '❌ queueStatus.matchedSession не существует'
                      );
                    }
                  }}
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 text-xs sm:text-sm"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">
                    Завершить и оставить отзыв
                  </span>
                  <span className="xs:hidden">Завершить</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={leaveQueue}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Отменить встречу
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              ← Назад
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center sm:text-left">
            Записаться на собеседование
          </h1>
          <Button
            variant="outline"
            onClick={logout}
            className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
            size="sm"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Выйти</span>
            <span className="xs:hidden">Выход</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Выбор профессии и роли */}
          <Card className="w-full">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">
                Шаг 1: Выберите профессию
              </CardTitle>
              <CardDescription className="text-sm">
                Выберите профессию для собеседования
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
              {/* Radix UI Select компонент */}
              <Select
                value={value}
                onValueChange={handleProfessionSelect}
                disabled={professionLoading || loadingProfession}
              >
                <SelectTrigger className="w-full text-xs sm:text-sm">
                  {professionLoading || loadingProfession ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span className="text-xs sm:text-sm">
                        {loadingProfession
                          ? 'Загрузка профессии...'
                          : 'Сохранение...'}
                      </span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Выберите профессию..." />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itPositions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {value && (
                <div className="space-y-3">
                  {userCountry && (
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <span className="text-base sm:text-lg flex-shrink-0">
                        {getCountryFlag(userCountry)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-700">
                          Язык собеседования: {getLanguageName(userLanguage)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Вы будете участвовать в собеседованиях на{' '}
                          {getLanguageName(userLanguage).toLowerCase()} языке
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm font-medium">Ваша роль:</p>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        userStatus === 'CANDIDATE' ? 'default' : 'outline'
                      }
                      size="sm"
                      disabled={!canBeCandidate && userStatus !== 'CANDIDATE'}
                      onClick={() => {
                        if (canBeCandidate) {
                          setUserStatus('CANDIDATE');
                          setProfessionNotificationShown(false);
                        }
                      }}
                      className={`text-xs sm:text-sm ${
                        !canBeCandidate && userStatus !== 'CANDIDATE'
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <span className="hidden xs:inline">Кандидат</span>
                      <span className="xs:hidden">Кандидат</span>
                      {!canBeCandidate && userStatus !== 'CANDIDATE' && (
                        <span className="ml-1">🔒</span>
                      )}
                    </Button>
                    <Button
                      variant={
                        userStatus === 'INTERVIEWER' ? 'default' : 'outline'
                      }
                      size="sm"
                      disabled={userStatus !== 'INTERVIEWER'}
                      onClick={() => {
                        if (userStatus === 'INTERVIEWER') {
                          setUserStatus('INTERVIEWER');
                          setProfessionNotificationShown(false);
                        }
                      }}
                      className={`text-xs sm:text-sm ${
                        userStatus !== 'INTERVIEWER'
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <span className="hidden xs:inline">Интервьюер</span>
                      <span className="xs:hidden">Интервьюер</span>
                      {userStatus !== 'INTERVIEWER' && (
                        <span className="ml-1">🔒</span>
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      {userStatus === 'CANDIDATE'
                        ? 'Вы будете проходить собеседование'
                        : 'Вы будете проводить собеседование'}
                    </p>
                    {!canBeCandidate && userStatus !== 'CANDIDATE' && (
                      <p className="text-amber-600 font-medium text-xs">
                        🔒 Чтобы стать кандидатом, сначала проведите
                        собеседование как интервьюер и получите обратную связь
                      </p>
                    )}
                    {userStatus !== 'INTERVIEWER' && (
                      <p className="text-amber-600 font-medium text-xs">
                        🔒 Чтобы стать интервьюером, сначала пройдите
                        собеседование как кандидат и получите обратную связь
                      </p>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-xs sm:text-sm">
                  Ошибка: {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Календарь */}
          {showCalendar && (
            <Card className="lg:col-span-2">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">
                  Шаг 2: Выберите время
                </CardTitle>
                <CardDescription className="text-sm">
                  Нажмите на доступный временной слот (зеленые блоки) для выбора
                  времени. Серые слоты - прошедшее время, красные - недоступные
                  слоты. Недоступные слоты не кликабельны.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-6">
                {/* Легенда календаря */}
                <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Легенда:
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                      <span className="hidden xs:inline">
                        Доступно (зеленые)
                      </span>
                      <span className="xs:hidden">Доступно</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded opacity-60"></div>
                      <span className="hidden xs:inline">
                        Прошедшее время (серые)
                      </span>
                      <span className="xs:hidden">Прошедшее</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-100 border border-red-300 rounded opacity-80"></div>
                      <span className="hidden xs:inline">
                        Недоступно (красные)
                      </span>
                      <span className="xs:hidden">Недоступно</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Нажмите на зеленые блоки для выбора времени. Серые блоки
                    показывают прошедшее время, красные - недоступные слоты.
                  </p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-48 sm:h-64">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
                    <span className="ml-2 text-sm sm:text-base">
                      Загрузка доступных слотов...
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex-1 min-h-0 overflow-x-auto"
                    style={{ height: '100%' }}
                  >
                    {/* Часы пользователя */}
                    <div className="clock-widget mb-4">
                      <Clock className="clock-icon" />
                      <div className="flex flex-col items-center">
                        <div className="time-display">
                          {currentTime.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                          })}
                        </div>
                        <div className="date-display">
                          {currentTime.toLocaleDateString('ru-RU', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Debug buttons for testing calendar view switching */}
                    <div className="mb-4 flex gap-2"></div>

                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">
                          Выберите удобную дату для интервью
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Выберите дату, затем выберите время из доступных
                          слотов
                        </p>
                      </div>

                      <div className="flex flex-col items-center space-y-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          className="rounded-md border"
                          disabled={(date) => {
                            // Отключаем прошедшие даты
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />

                        {selectedDate && (
                          <div className="w-full max-w-md">
                            <h4 className="text-sm font-medium mb-3 text-center">
                              Доступные слоты на{' '}
                              {format(selectedDate, 'dd MMMM yyyy', {
                                locale: ru,
                              })}
                              :
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {getAllSlotsForSelectedDate().map(
                                (slot, index) => {
                                  const slotDateTime =
                                    typeof slot.datetime === 'string'
                                      ? new Date(slot.datetime)
                                      : slot.datetime;

                                  const isAvailable = slot.available;
                                  const isPast = slotDateTime < new Date();

                                  return (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      disabled={!isAvailable || isPast}
                                      className={`text-xs transition-colors interview-time-slot ${
                                        isAvailable && !isPast
                                          ? 'available'
                                          : isPast
                                          ? 'past'
                                          : 'unavailable'
                                      }`}
                                      onClick={() => {
                                        if (isAvailable && !isPast) {
                                          const slotInfo = {
                                            start: slotDateTime,
                                            end: new Date(
                                              slotDateTime.getTime() +
                                                60 * 60 * 1000
                                            ),
                                            slots: [
                                              slotDateTime,
                                              new Date(
                                                slotDateTime.getTime() +
                                                  60 * 60 * 1000
                                              ),
                                            ],
                                            action: 'select' as const,
                                          };
                                          handleTimeSlotSelect(slotInfo);
                                        }
                                      }}
                                    >
                                      {format(slotDateTime, 'HH:mm', {
                                        locale: ru,
                                      })}
                                    </Button>
                                  );
                                }
                              )}
                            </div>

                            {getAllSlotsForSelectedDate().filter(
                              (slot) => slot.available
                            ).length === 0 && (
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">
                                  На выбранную дату нет доступных слотов
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Сообщение, если нет доступных слотов */}
                      {availableSlots.filter((slot) => slot.available)
                        .length === 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-700">
                            Нет доступных слотов для записи на собеседование.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedTimeSlot && (
                  <div className="mt-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      Выбранное время:
                    </h4>
                    <p className="text-green-700 text-sm sm:text-base">
                      {format(selectedTimeSlot, 'dd MMMM yyyy, HH:mm', {
                        locale: ru,
                      })}
                    </p>
                  </div>
                )}

                {selectedTimeSlot && (
                  <div className="mt-4 flex gap-2 sm:gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTimeSlot(null)}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      Выбрать другое время
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Статус очереди */}
        {queueStatus && queueStatus.status === 'WAITING' && (
          <Card className="mt-6 sm:mt-8 max-w-2xl mx-auto">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                Ожидание партнера
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              <div className="space-y-3">
                <p className="text-sm sm:text-base">
                  Мы ищем для вас подходящего партнера для собеседования:
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                  <Badge variant="outline">
                    Профессия: {queueStatus.profession}
                  </Badge>
                  <Badge variant="outline">
                    Язык: {getLanguageName(queueStatus.language)}
                  </Badge>
                  <Badge variant="outline">
                    Время:{' '}
                    {format(queueStatus.preferredDateTime, 'dd.MM.yyyy HH:mm', {
                      locale: ru,
                    })}
                  </Badge>
                </div>

                {/* Предупреждение о количестве пользователей */}
                {queueStatus.usersInQueueWithSameLanguage !== undefined && (
                  <div
                    className={`p-3 sm:p-4 rounded-lg ${
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
                        className={`text-xs sm:text-sm ${
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

                <div className="flex gap-2 sm:gap-4 pt-4">
                  <Button
                    variant="destructive"
                    onClick={leaveQueue}
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    Отменить запись
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!showCalendar && getAuthToken() && (
          <div className="text-center mt-6 sm:mt-8">
            <ProfessionHistory
              userId={JSON.parse(
                atob(getAuthToken()!.split('.')[1])
              ).userId.toString()}
            />

            {/* Кнопка для создания нового интервью когда нет активных сессий */}
            {completedSessions.length === 0 && (
              <div className="mt-4 sm:mt-6">
                <Button
                  onClick={() => {
                    // Сбрасываем состояние формы для нового интервью
                    setValue('');
                    setSelectedTimeSlot(null);
                    setShowCalendar(false);
                    setQueueStatus(null);
                    dispatch(clearError());
                    // Прокручиваем к началу страницы
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Создать новое интервью
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Секция завершенных собеседований */}
        {completedSessions.length > 0 && (
          <Card className="mt-6 sm:mt-8">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                Завершенные собеседования
              </CardTitle>
              <CardDescription className="text-sm">
                Оставьте отзыв о прошедших собеседованиях или создайте новое
                интервью
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              {loadingCompletedSessions ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Загрузка...
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {completedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <div className="min-w-0">
                            <p className="font-medium text-sm sm:text-base">
                              {session.profession}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {format(
                                session.scheduledDateTime,
                                'dd MMMM yyyy, HH:mm',
                                { locale: ru }
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Кандидат
                              </Badge>
                              <span className="text-xs sm:text-sm">
                                {session.candidate?.firstName}{' '}
                                {session.candidate?.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Интервьюер
                              </Badge>
                              <span className="text-xs sm:text-sm">
                                {session.interviewer?.firstName}{' '}
                                {session.interviewer?.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1 sm:flex-none text-xs"
                        >
                          <Link to={`/feedback/${session.id}`}>
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">
                              Оставить отзыв
                            </span>
                            <span className="xs:hidden">Отзыв</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1 sm:flex-none text-xs"
                        >
                          <Link to="/feedback-history">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">
                              История отзывов
                            </span>
                            <span className="xs:hidden">История</span>
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
      </div>

      {/* Модальное окно подтверждения выбора времени */}
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

      {/* Модальное окно уведомлений */}
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
