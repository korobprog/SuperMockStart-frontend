import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Star, ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeedbackItem {
  id: string;
  rating: number;
  comment?: string;
  fromUser: {
    firstName?: string;
    lastName?: string;
  };
  toUser: {
    firstName?: string;
    lastName?: string;
  };
  session: {
    profession: string;
    scheduledDateTime: string;
  };
  createdAt: string;
}

const FeedbackHistory = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'given' | 'received'>('received');

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

  // Получаем токен из localStorage
  const getAuthToken = () => {
    return localStorage.getItem('telegram_token');
  };

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(
          `${API_URL}/api/feedback/user?type=${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data.data || []);
        }
      } catch (error) {
        console.error('Error loading feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, [type, API_URL]);

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Очень плохо';
      case 2:
        return 'Плохо';
      case 3:
        return 'Удовлетворительно';
      case 4:
        return 'Хорошо';
      case 5:
        return 'Отлично';
      default:
        return '';
    }
  };

  if (loading) {
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
              История отзывов
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
            История отзывов
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Переключатель типа отзывов */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button
                variant={type === 'received' ? 'default' : 'outline'}
                onClick={() => setType('received')}
              >
                Полученные отзывы (
                {feedbacks.filter(() => type === 'received').length})
              </Button>
              <Button
                variant={type === 'given' ? 'default' : 'outline'}
                onClick={() => setType('given')}
              >
                Оставленные отзывы (
                {feedbacks.filter(() => type === 'given').length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {feedbacks.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {type === 'received'
                    ? 'Нет полученных отзывов'
                    : 'Нет оставленных отзывов'}
                </h3>
                <p className="text-muted-foreground">
                  {type === 'received'
                    ? 'Вы еще не получили отзывы от других участников собеседований.'
                    : 'Вы еще не оставили отзывы о собеседованиях.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {type === 'received'
                          ? `Отзыв от ${feedback.fromUser.firstName} ${feedback.fromUser.lastName}`
                          : `Отзыв для ${feedback.toUser.firstName} ${feedback.toUser.lastName}`}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {feedback.session.profession} •{' '}
                        {new Date(
                          feedback.session.scheduledDateTime
                        ).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {new Date(feedback.createdAt).toLocaleDateString('ru-RU')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Рейтинг */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= feedback.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {feedback.rating}/5 - {getRatingText(feedback.rating)}
                    </span>
                  </div>

                  {/* Комментарий */}
                  {feedback.comment && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {feedback.comment}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackHistory;
