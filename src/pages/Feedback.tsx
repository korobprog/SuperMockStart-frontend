import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SessionInfo {
  id: string;
  profession: string;
  scheduledDateTime: string;
  candidate: {
    firstName?: string;
    lastName?: string;
  };
  interviewer: {
    firstName?: string;
    lastName?: string;
  };
}

interface FeedbackData {
  id: string;
  rating: number;
  comment?: string;
  fromUser: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  toUser: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

const Feedback = () => {
  const { sessionId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [existingFeedbacks, setExistingFeedbacks] = useState<FeedbackData[]>(
    []
  );
  const [submitted, setSubmitted] = useState(false);
  const [roleChanged, setRoleChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Получаем токен из localStorage
  const getAuthToken = () => {
    return localStorage.getItem('telegram_token');
  };

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      alert('Необходима авторизация');
      window.location.href = '/';
      return;
    }
    if (!sessionId) {
      alert('Неверный ID сессии');
      window.location.href = '/';
      return;
    }
  }, [sessionId]);

  // Загружаем информацию о сессии и существующие отзывы
  useEffect(() => {
    const loadSessionInfo = async () => {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        if (!token || !sessionId) return;

        // Загружаем информацию о сессии
        const sessionResponse = await fetch(
          `${API_URL}/api/calendar/sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          setSessionInfo(sessionData.data);
        }

        // Загружаем существующие отзывы
        const feedbackResponse = await fetch(
          `${API_URL}/api/feedback/sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json();
          setExistingFeedbacks(feedbackData.data || []);

          // Проверяем, оставил ли текущий пользователь уже отзыв
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const currentUserId = tokenPayload.userId;

            const userFeedback = feedbackData.data?.find(
              (f: FeedbackData) => f.fromUser.id === currentUserId
            );

            if (userFeedback) {
              setSubmitted(true);
              console.log(
                'User has already submitted feedback for this session'
              );
            }
          } catch (tokenError) {
            console.error('Error parsing token:', tokenError);
            // Если не можем распарсить токен, попробуем другой способ
            // Проверим, есть ли отзыв от текущего пользователя по другим критериям
          }
        } else if (feedbackResponse.status === 401) {
          console.error('Unauthorized access to feedback');
          alert('Ошибка авторизации. Пожалуйста, войдите в систему.');
          window.location.href = '/';
        } else {
          console.error('Error loading feedback:', feedbackResponse.status);
        }
      } catch (error) {
        console.error('Error loading session info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionInfo();
  }, [sessionId, API_URL]);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Пожалуйста, поставьте оценку');
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Необходима авторизация');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/feedback/sessions/${sessionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating,
            comment,
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);

        // Проверяем, оставили ли оба участника отзывы
        if (existingFeedbacks.length === 1) {
          setRoleChanged(true);
          setTimeout(() => {
            alert(
              'Отлично! Оба участника оставили отзывы. Ваши роли поменялись местами!'
            );
            // Перенаправляем на страницу интервью
            window.location.href = '/interview';
          }, 2000);
        } else {
          alert('Спасибо за ваш отзыв! Ожидаем отзыв от второго участника.');
          // Перенаправляем на страницу интервью
          setTimeout(() => {
            window.location.href = '/interview';
          }, 2000);
        }
      } else {
        const errorData = await response.json();

        // Проверяем, не оставлял ли уже пользователь отзыв
        if (
          errorData.error ===
          'You have already submitted feedback for this session'
        ) {
          setSubmitted(true);
          alert('Вы уже оставили отзыв для этой сессии. Спасибо!');
          setTimeout(() => {
            window.location.href = '/interview';
          }, 2000);
        } else {
          alert(`Ошибка при отправке отзыва: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Ошибка при отправке отзыва');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionInfo || isLoading) {
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
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Назад
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center sm:text-left">
              Загрузка...
            </h1>
            <div className="w-20"></div>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
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
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Назад
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center sm:text-left">
              Отзыв отправлен
            </h1>
            <div className="w-20"></div>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                Спасибо за ваш отзыв!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  Ваш отзыв успешно отправлен и поможет улучшить систему
                  собеседований.
                </p>

                {roleChanged && (
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="font-medium text-blue-900 text-sm sm:text-base">
                        Роли поменялись!
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-700">
                      Оба участника оставили отзывы. Теперь вы можете
                      попробовать другую роль в системе.
                    </p>
                  </div>
                )}

                {existingFeedbacks.length === 1 && !roleChanged && (
                  <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                      <span className="font-medium text-amber-900 text-sm sm:text-base">
                        Ожидаем второго участника
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-700">
                      Второй участник еще не оставил отзыв. После этого ваши
                      роли поменяются местами.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
                <Button asChild className="flex-1 text-xs sm:text-sm">
                  <Link to="/interview">Записаться на новое собеседование</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="text-xs sm:text-sm"
                >
                  <Link to="/">Вернуться на главную</Link>
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
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Назад
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center sm:text-left">
            Оставьте отзыв о собеседовании
          </h1>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Информация о сессии */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">
                Информация о собеседовании
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Профессия
                </p>
                <p className="font-medium text-sm sm:text-base">
                  {sessionInfo.profession}
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Дата и время
                </p>
                <p className="font-medium text-sm sm:text-base">
                  {new Date(sessionInfo.scheduledDateTime).toLocaleString(
                    'ru-RU'
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Участники
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Кандидат
                    </Badge>
                    <span className="text-xs sm:text-sm">
                      {sessionInfo.candidate.firstName}{' '}
                      {sessionInfo.candidate.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Интервьюер
                    </Badge>
                    <span className="text-xs sm:text-sm">
                      {sessionInfo.interviewer.firstName}{' '}
                      {sessionInfo.interviewer.lastName}
                    </span>
                  </div>
                </div>
              </div>

              {existingFeedbacks.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Отзывы
                  </p>
                  <div className="space-y-2">
                    {existingFeedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="p-2 sm:p-3 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-medium">
                            {feedback.fromUser.firstName}{' '}
                            {feedback.fromUser.lastName}
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= feedback.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {feedback.comment && (
                          <p className="text-xs text-gray-600">
                            {feedback.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Форма отзыва */}
          <Card className="lg:col-span-2">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Ваш отзыв</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
              {/* Рейтинг звездами */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Оценка собеседования *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      <Star
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        fill={star <= rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {rating === 0 && 'Пожалуйста, поставьте оценку'}
                  {rating === 1 && 'Очень плохо'}
                  {rating === 2 && 'Плохо'}
                  {rating === 3 && 'Удовлетворительно'}
                  {rating === 4 && 'Хорошо'}
                  {rating === 5 && 'Отлично'}
                </p>
              </div>

              {/* Комментарий */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Комментарий (необязательно)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Поделитесь своими впечатлениями о собеседовании, что понравилось, что можно улучшить..."
                  rows={4}
                  className="text-xs sm:text-sm"
                />
              </div>

              {/* Информация о смене ролей */}
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="font-medium text-blue-900 text-sm sm:text-base">
                    Важная информация
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-blue-700">
                  После того как оба участника оставят отзывы, ваши роли
                  поменяются местами. Это позволит вам попробовать себя как в
                  роли кандидата, так и в роли интервьюера.
                </p>
              </div>

              {/* Кнопки */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || rating === 0}
                  className="flex-1 text-xs sm:text-sm"
                >
                  {loading ? (
                    'Отправка...'
                  ) : (
                    <>
                      <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Отправить отзыв</span>
                      <span className="xs:hidden">Отправить</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="text-xs sm:text-sm"
                >
                  <Link to="/">Отмена</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
