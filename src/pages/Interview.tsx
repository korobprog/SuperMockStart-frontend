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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru'; // Русская локализация
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addSelectedProfession,
  clearError,
} from '@/store/slices/professionSlice';
import ProfessionHistory from '@/components/ProfessionHistory';
import { getLanguageName, getCountryFlag } from '@/utils/language';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

// Настройка локализации
moment.locale('ru', {
  months:
    'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split(
      '_'
    ),
  monthsShort:
    'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_'),
  monthsParseExact: true,
  weekdays:
    'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
  weekdaysShort: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
  weekdaysMin: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY г.',
    LLL: 'D MMMM YYYY г., H:mm',
    LLLL: 'dddd, D MMMM YYYY г., H:mm',
  },
  calendar: {
    sameDay: '[сегодня в] LT',
    nextDay: '[завтра в] LT',
    nextWeek: 'dddd [в] LT',
    lastDay: '[вчера в] LT',
    lastWeek: 'dddd [в] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'через %s',
    past: '%s назад',
    s: 'несколько секунд',
    ss: '%d секунд',
    m: 'минута',
    mm: '%d минут',
    h: 'час',
    hh: '%d часов',
    d: 'день',
    dd: '%d дней',
    w: 'неделя',
    ww: '%d недель',
    M: 'месяц',
    MM: '%d месяцев',
    y: 'год',
    yy: '%d лет',
  },
  dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
  ordinal: function (number) {
    if (
      number % 10 >= 2 &&
      number % 10 <= 4 &&
      (number % 100 < 12 || number % 100 > 14)
    ) {
      return number + '-й';
    }
    if (
      number % 10 === 0 ||
      (number % 10 >= 5 && number % 10 <= 9) ||
      (number % 100 >= 11 && number % 100 <= 14)
    ) {
      return number + '-й';
    }
    return number + '-го';
  },
  week: {
    dow: 1, // Monday is the first day of the week
    doy: 7, // The week that contains Jan 7th is the first week of the year
  },
});
const localizer = momentLocalizer(moment);

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
  console.log('🚀 ~ Interview ~ userStatus:', userStatus);
  const [canBeCandidate, setCanBeCandidate] = useState(false);
  const [value, setValue] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [pendingTimeSlot, setPendingTimeSlot] = useState<Date | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [currentView, setCurrentView] = useState<'week' | 'day'>('week');
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

  // API URL - используем переменную окружения или fallback на продакшен
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

  // Debug: Проверяем состояние аутентификации
  useEffect(() => {
    console.log('🔍 Debug Interview component:');
    console.log('🌐 API_URL:', API_URL);
    console.log(
      '🔑 telegram_token:',
      localStorage.getItem('telegram_token') ? 'найден' : 'не найден'
    );
    console.log(
      '🔑 extended_token:',
      localStorage.getItem('extended_token') ? 'найден' : 'не найден'
    );
    console.log('👤 userStatus:', userStatus);
    console.log('✅ canBeCandidate:', canBeCandidate);
  }, [API_URL, userStatus, canBeCandidate]);

  // Отслеживаем изменения состояния модального окна
  useEffect(() => {
    // Логирование состояния модального окна для отладки
  }, [showConfirmModal, pendingTimeSlot]);

  const dispatch = useAppDispatch();
  const { loading: professionLoading, error } = useAppSelector(
    (state) => state.profession
  );

  // Получаем токен из localStorage
  const getAuthToken = () => {
    // Сначала пробуем расширенный токен
    const extendedToken = localStorage.getItem('extended_token');
    if (extendedToken) {
      console.log('🔑 Используем extended_token');
      return extendedToken;
    }

    // Fallback на обычный токен
    const token = localStorage.getItem('telegram_token');
    console.log('🔑 Токен из localStorage:', token ? 'найден' : 'не найден');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 Декодированный токен:', payload);
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

        console.log('🔍 Загружаем слоты для профессии:', profession);
        const response = await fetch(
          `${API_URL}/api/calendar/slots/${profession}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(
          '📡 Ответ загрузки слотов:',
          response.status,
          response.statusText
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAvailableSlots(data.data || []);
            console.log('✅ Слоты загружены успешно');
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
          console.log('🔍 Debug queueStatus:', data.data);
          console.log('🔍 queueStatus?.status:', data.data?.status);
          console.log(
            '🔍 queueStatus?.matchedSession:',
            data.data?.matchedSession
          );
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
      setOpen(false);
      setShowCalendar(true);

      // Находим выбранную профессию
      const selectedProfession = itPositions.find(
        (pos) => pos.value === selectedValue
      );
      if (selectedProfession) {
        try {
          // Получаем токен и извлекаем userId из него
          const token = getAuthToken();
          if (!token) {
            console.error('Токен не найден');
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
        } catch (error) {
          console.error('Failed to add profession:', error);
        }
      }
    }
  };

  const handleTimeSlotSelect = (slotInfo: SlotInfo) => {
    const selectedTime = slotInfo.start;
    const now = new Date();

    // Проверяем, не прошло ли уже время
    if (selectedTime <= now) {
      showNotification(
        'Время прошло',
        'Этот временной слот уже прошел. Пожалуйста, выберите другое время.',
        'error'
      );
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
    console.log('🔔 Показываем уведомление:', { title, message, type });
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
    console.log('🔔 Закрываем уведомление');
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
    const events = availableSlots
      .filter((slot) => {
        // Проверяем, что слот доступен и время еще не прошло
        const slotDateTime =
          typeof slot.datetime === 'string'
            ? new Date(slot.datetime)
            : slot.datetime;

        // Показываем только будущие доступные слоты
        return slot.available && slotDateTime > now;
      })
      .map((slot) => {
        // Преобразуем datetime в объект Date, если это строка
        const slotDateTime =
          typeof slot.datetime === 'string'
            ? new Date(slot.datetime)
            : slot.datetime;

        return {
          id: slotDateTime.getTime(),
          title: 'Доступно',
          start: slotDateTime,
          end: new Date(slotDateTime.getTime() + 60 * 60 * 1000), // +1 час
          resource: { available: true },
        };
      });

    return events;
  }, [availableSlots]);

  // Сообщения для календаря на русском
  const messages = {
    date: 'Дата',
    time: 'Время',
    event: 'Событие',
    allDay: 'Весь день',
    week: 'Неделя',
    work_week: 'Рабочая неделя',
    day: 'День',
    month: 'Месяц',
    previous: 'Назад',
    next: 'Вперед',
    yesterday: 'Вчера',
    tomorrow: 'Завтра',
    today: 'Сегодня',
    agenda: 'Повестка дня',
    noEventsInRange: 'Нет доступных слотов в этом диапазоне.',
    showMore: (total: number) => `+${total} еще`,
  };

  // Добавляем отладочную информацию
  console.log('🔍 Debug queueStatus:', queueStatus);
  console.log('🔍 queueStatus?.status:', queueStatus?.status);
  console.log('🔍 queueStatus?.matchedSession:', queueStatus?.matchedSession);
  console.log('🔍 Current calendar view:', currentView);

  // Debug calendar component
  useEffect(() => {
    console.log('🔍 Calendar component mounted with view:', currentView);

    // Test view switching after a short delay
    setTimeout(() => {
      console.log('🔍 Testing calendar view switching...');
      console.log('🔍 Available views:', ['week', 'day']);
      console.log('🔍 Current view:', currentView);
    }, 1000);
  }, [currentView]);

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
                      {moment(
                        queueStatus.matchedSession.scheduledDateTime
                      ).format('DD MMMM YYYY, HH:mm')}
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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-xs sm:text-sm"
                    disabled={professionLoading || loadingProfession}
                  >
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
                      <>
                        <span className="truncate">
                          {value
                            ? itPositions.find((pos) => pos.value === value)
                                ?.label
                            : 'Выберите профессию...'}
                        </span>
                        <ChevronsUpDown className="opacity-50 h-3 w-3 sm:h-4 sm:w-4" />
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto">
                  <Command>
                    <CommandInput
                      placeholder="Поиск профессии..."
                      className="h-9 text-xs sm:text-sm"
                    />
                    <CommandList>
                      <CommandEmpty>Профессия не найдена.</CommandEmpty>
                      <CommandGroup>
                        {itPositions.map((pos) => (
                          <CommandItem
                            key={pos.value}
                            value={pos.value}
                            onSelect={handleProfessionSelect}
                            className="text-xs sm:text-sm"
                          >
                            <span className="truncate">{pos.label}</span>
                            <Check
                              className={cn(
                                'ml-auto h-3 w-3 sm:h-4 sm:w-4',
                                value === pos.value
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
                      onClick={() =>
                        canBeCandidate && setUserStatus('CANDIDATE')
                      }
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
                      onClick={() =>
                        userStatus === 'INTERVIEWER' &&
                        setUserStatus('INTERVIEWER')
                      }
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
                  времени. Серые слоты - прошедшее время, красные - недоступные.
                  Показываются только будущие доступные слоты.
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
                      <span className="hidden xs:inline">Доступно</span>
                      <span className="xs:hidden">Доступно</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded opacity-60"></div>
                      <span className="hidden xs:inline">Прошедшее время</span>
                      <span className="xs:hidden">Прошедшее</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-100 border border-red-300 rounded opacity-80"></div>
                      <span className="hidden xs:inline">Недоступно</span>
                      <span className="xs:hidden">Недоступно</span>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-48 sm:h-64">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
                    <span className="ml-2 text-sm sm:text-base">
                      Загрузка доступных слотов...
                    </span>
                  </div>
                ) : (
                  <div className="h-[400px] sm:h-[500px] lg:h-[600px] overflow-x-auto">
                    {/* Debug buttons for testing calendar view switching */}
                    <div className="mb-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('🔍 Manually switching to week view');
                          setCurrentView('week');
                        }}
                      >
                        Тест: Неделя
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('🔍 Manually switching to day view');
                          setCurrentView('day');
                        }}
                      >
                        Тест: День
                      </Button>
                    </div>

                    <Calendar
                      localizer={localizer}
                      events={calendarEvents}
                      startAccessor="start"
                      endAccessor="end"
                      messages={messages}
                      selectable="ignoreEvents"
                      onSelectSlot={(slotInfo) => {
                        // Проверяем, не прошло ли время слота
                        const now = new Date();
                        if (slotInfo.start <= now) {
                          showNotification(
                            'Время прошло',
                            'Этот временной слот уже прошел. Пожалуйста, выберите другое время.',
                            'error'
                          );
                          return;
                        }

                        handleTimeSlotSelect(slotInfo);
                      }}
                      onSelectEvent={(event) => {
                        // Проверяем, не прошло ли время события
                        const now = new Date();
                        if (event.start <= now) {
                          showNotification(
                            'Время прошло',
                            'Этот временной слот уже прошел. Пожалуйста, выберите другое время.',
                            'error'
                          );
                          return;
                        }

                        // Обрабатываем клик по событию как выбор слота
                        const slotInfo = {
                          start: event.start,
                          end: event.end,
                          slots: [event.start, event.end],
                          action: 'select' as const,
                        };
                        handleTimeSlotSelect(slotInfo);
                      }}
                      onNavigate={(newDate) => {
                        // Навигация по календарю
                        console.log('🔍 Calendar navigation:', newDate);
                      }}
                      view={currentView}
                      onView={(newView) => {
                        console.log('🔍 Calendar view changed:', newView);
                        setCurrentView(newView as 'week' | 'day');
                      }}
                      views={{
                        week: true,
                        day: true,
                      }}
                      defaultView="week"
                      min={new Date(2024, 0, 1, 0, 0)} // 0:00 (полночь)
                      max={new Date(2024, 0, 1, 23, 59)} // 23:59 (конец дня)
                      step={60}
                      timeslots={1}
                      className="calendar-container"
                      popup
                      eventPropGetter={(event) => ({
                        style: {
                          backgroundColor: event.resource?.available
                            ? '#22c55e'
                            : '#ef4444',
                          borderColor: event.resource?.available
                            ? '#16a34a'
                            : '#dc2626',
                          color: 'white',
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                      })}
                      slotPropGetter={(date) => {
                        const now = new Date();
                        const slot = availableSlots.find((s) => {
                          const slotDateTime =
                            typeof s.datetime === 'string'
                              ? new Date(s.datetime)
                              : s.datetime;
                          return (
                            Math.abs(slotDateTime.getTime() - date.getTime()) <
                            60 * 60 * 1000
                          );
                        });

                        // Проверяем, что слот доступен и время еще не прошло
                        const isAvailable =
                          slot?.available && slot.datetime > now;
                        const isPast = date < now;
                        const isUnavailable = slot && !slot.available;

                        // Определяем классы для разных состояний
                        let className = '';
                        if (isPast) {
                          className = 'rbc-past';
                        } else if (isUnavailable) {
                          className = 'rbc-unavailable';
                        } else if (isAvailable) {
                          className = 'rbc-available';
                        }

                        return {
                          className,
                          style: {
                            backgroundColor: isAvailable
                              ? '#f0fdf4'
                              : isPast
                              ? '#f3f4f6'
                              : isUnavailable
                              ? '#fef2f2'
                              : undefined,
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            minHeight: '60px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isPast ? 0.6 : isUnavailable ? 0.8 : 1,
                            transition: 'all 0.2s ease',
                          },
                        };
                      }}
                    />
                  </div>
                )}

                {selectedTimeSlot && (
                  <div className="mt-4 p-3 sm:p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2 text-sm sm:text-base">
                      Выбранное время:
                    </h4>
                    <p className="text-green-700 text-sm sm:text-base">
                      {moment(selectedTimeSlot).format('DD MMMM YYYY, HH:mm')}
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
                    {moment(queueStatus.preferredDateTime).format(
                      'DD.MM.YYYY HH:mm'
                    )}
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
                              {moment(session.scheduledDateTime).format(
                                'DD MMMM YYYY, HH:mm'
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
                  moment(pendingTimeSlot).format('DD MMMM YYYY, HH:mm')}
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
            <DialogDescription className="text-sm">
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
