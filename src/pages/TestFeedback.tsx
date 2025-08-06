import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
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

const TestFeedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [existingFeedbacks, setExistingFeedbacks] = useState<FeedbackData[]>(
    []
  );
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';
  const sessionId = 'test-session-1';

  // Тестовый расширенный токен для кандидата из сессии test-session-1
  const TEST_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWR3aGx6N24wMDAxNTV4c3IzcnMyNmdlIiwidXNlcm5hbWUiOiJjYW5kaWRhdGV1c2VyIiwiZmlyc3ROYW1lIjoiQ2FuZGlkYXRlIiwibGFzdE5hbWUiOiJVc2VyIiwiYXV0aFR5cGUiOiJ0ZWxlZ3JhbSIsImlhdCI6MTc1NDI5MTk4NiwiZXhwIjoxNzU0ODk2Nzg2fQ.wB1FCtEj8lZ6RoH9LeS7AJMHo7K24lKJ-JEJBB2eR04';

  // Загружаем информацию о сессии и существующие отзывы
  useEffect(() => {
    const loadSessionInfo = async () => {
      try {
        setError(null);

        // Загружаем информацию о сессии
        const sessionResponse = await fetch(
          `${API_URL}/api/calendar/sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${TEST_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          setSessionInfo(sessionData.data);
        } else {
          const errorData = await sessionResponse.json();
          setError(`Ошибка получения сессии: ${errorData.error}`);
        }

        // Загружаем существующие отзывы
        const feedbackResponse = await fetch(
          `${API_URL}/api/feedback/sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${TEST_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json();
          setExistingFeedbacks(feedbackData.data || []);
        } else {
          const errorData = await feedbackResponse.json();
          setError(`Ошибка получения отзывов: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error loading session info:', error);
        setError('Ошибка загрузки данных');
      }
    };

    loadSessionInfo();
  }, [API_URL]);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Пожалуйста, поставьте оценку');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/feedback/sessions/${sessionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
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
        alert('Отзыв успешно отправлен!');
      } else {
        const errorData = await response.json();

        // Проверяем, не оставлял ли уже пользователь отзыв
        if (
          errorData.error ===
          'You have already submitted feedback for this session'
        ) {
          setSubmitted(true);
          alert('Вы уже оставили отзыв для этой сессии. Спасибо!');
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Ошибка</h1>
            <div className="w-20"></div>
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
                Произошла ошибка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!sessionInfo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Загрузка...</h1>
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Отзыв отправлен
            </h1>
            <div className="w-20"></div>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Спасибо за ваш отзыв!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ваш отзыв успешно отправлен и поможет улучшить систему
                собеседований.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Тестовая страница отзывов
          </h1>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Информация о сессии */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о собеседовании</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Профессия
                </p>
                <p className="font-medium">{sessionInfo.profession}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Дата и время
                </p>
                <p className="font-medium">
                  {new Date(sessionInfo.scheduledDateTime).toLocaleString(
                    'ru-RU'
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Участники
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Кандидат</Badge>
                    <span>
                      {sessionInfo.candidate.firstName}{' '}
                      {sessionInfo.candidate.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Интервьюер</Badge>
                    <span>
                      {sessionInfo.interviewer.firstName}{' '}
                      {sessionInfo.interviewer.lastName}
                    </span>
                  </div>
                </div>
              </div>

              {existingFeedbacks.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Отзывы
                  </p>
                  <div className="space-y-2">
                    {existingFeedbacks.map((feedback) => (
                      <div key={feedback.id} className="p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
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
            <CardHeader>
              <CardTitle>Ваш отзыв</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Рейтинг звездами */}
              <div>
                <label className="block text-sm font-medium mb-2">
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
                        className="h-6 w-6"
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
                <label className="block text-sm font-medium mb-2">
                  Комментарий (необязательно)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Поделитесь своими впечатлениями о собеседовании, что понравилось, что можно улучшить..."
                  rows={4}
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || rating === 0}
                  className="flex-1"
                >
                  {loading ? (
                    'Отправка...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Отправить отзыв
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild>
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

export default TestFeedback;
