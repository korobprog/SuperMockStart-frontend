import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  fetchUserStatus,
  updateUserStatus,
  fetchAvailableCandidates,
  fetchUserInterviews,
  UserStatus,
  clearError,
} from '../store/slices/userStatusSlice';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const ChooseInterview = () => {
  const dispatch = useAppDispatch();
  const { currentStatus, loading, error, availableCandidates, userInterviews } =
    useAppSelector((state) => state.userStatus);

  useEffect(() => {
    // Загружаем статус пользователя при монтировании компонента
    dispatch(fetchUserStatus());
    dispatch(fetchAvailableCandidates());
    dispatch(fetchUserInterviews());
  }, [dispatch]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleStatusChange = async (status: UserStatus) => {
    try {
      // Получаем ID пользователя из базы данных по Telegram ID
      const response = await fetch(`${API_URL}/user-status/status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        // Для обновления статуса нам нужен ID из базы данных, а не Telegram ID
        // Получаем пользователя по Telegram ID, чтобы получить его ID в базе
        const userResponse = await fetch(`${API_URL}/user-status/status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (userResponse.ok) {
          // Используем Telegram ID для обновления статуса
          const telegramId = localStorage.getItem('userId') || '123456789';

          await dispatch(
            updateUserStatus({ userId: telegramId, status })
          ).unwrap();

          // Обновляем список кандидатов после изменения статуса
          dispatch(fetchAvailableCandidates());
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleRefreshData = () => {
    dispatch(clearError());
    dispatch(fetchUserStatus());
    dispatch(fetchAvailableCandidates());
    dispatch(fetchUserInterviews());
  };

  const handleGetTestToken = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/test-token`);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userId', data.data.user.id.toString());
        alert('Тестовый токен получен! Теперь можно обновить данные.');
        handleRefreshData();
      } else {
        alert('Ошибка получения тестового токена');
      }
    } catch (error) {
      console.error('Ошибка получения тестового токена:', error);
      alert('Ошибка получения тестового токена');
    }
  };

  const getStatusColor = (status: UserStatus) => {
    return status === UserStatus.INTERVIEWER ? 'bg-blue-500' : 'bg-green-500';
  };

  const getStatusText = (status: UserStatus) => {
    return status === UserStatus.INTERVIEWER ? 'Интервьюер' : 'Кандидат';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Управление статусами пользователя (Тестовый режим)
      </h1>

      {/* Получение тестового токена */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle>Получение тестового токена</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-blue-800">
            Для тестирования системы статусов необходимо получить тестовый
            токен.
          </div>
          <Button
            onClick={handleGetTestToken}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Получить тестовый токен
          </Button>
          <div className="text-xs text-blue-600">
            Токен:{' '}
            {localStorage.getItem('authToken')
              ? '✅ Получен'
              : '❌ Отсутствует'}
          </div>
        </CardContent>
      </Card>

      {/* Текущий статус */}
      <Card>
        <CardHeader>
          <CardTitle>Текущий статус пользователя</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center">Загрузка...</div>
          ) : currentStatus ? (
            <div className="flex items-center space-x-4">
              <Badge className={`${getStatusColor(currentStatus)} text-white`}>
                {getStatusText(currentStatus)}
              </Badge>
              <span className="text-sm text-gray-600">
                Telegram ID: {localStorage.getItem('userId') || 'test-user-id'}
              </span>
            </div>
          ) : (
            <div className="text-red-500">Статус не загружен</div>
          )}
        </CardContent>
      </Card>

      {/* Переключение статусов */}
      <Card>
        <CardHeader>
          <CardTitle>
            Быстрое переключение статусов (для тестирования)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button
              onClick={() => handleStatusChange(UserStatus.INTERVIEWER)}
              disabled={loading || currentStatus === UserStatus.INTERVIEWER}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Стать Интервьюером
            </Button>
            <Button
              onClick={() => handleStatusChange(UserStatus.CANDIDATE)}
              disabled={loading || currentStatus === UserStatus.CANDIDATE}
              className="bg-green-500 hover:bg-green-600"
            >
              Стать Кандидатом
            </Button>
          </div>

          <Button
            onClick={handleRefreshData}
            variant="outline"
            disabled={loading}
          >
            Обновить данные
          </Button>
        </CardContent>
      </Card>

      {/* Доступные кандидаты */}
      <Card>
        <CardHeader>
          <CardTitle>
            Доступные кандидаты ({availableCandidates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableCandidates.length > 0 ? (
            <div className="space-y-2">
              {availableCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      {candidate.firstName} {candidate.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      @{candidate.username} | ID: {candidate.id}
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">Кандидат</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">
              Нет доступных кандидатов
            </div>
          )}
        </CardContent>
      </Card>

      {/* Интервью пользователя */}
      <Card>
        <CardHeader>
          <CardTitle>Интервью пользователя ({userInterviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {userInterviews.length > 0 ? (
            <div className="space-y-2">
              {userInterviews.map((interview) => (
                <div key={interview.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      Интервью #{interview.id.slice(-8)}
                    </div>
                    <Badge
                      className={
                        interview.status === 'PENDING'
                          ? 'bg-yellow-500'
                          : interview.status === 'COMPLETED'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }
                    >
                      {interview.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>
                      Интервьюер: {interview.interviewer?.firstName}{' '}
                      {interview.interviewer?.lastName}
                    </div>
                    <div>
                      Кандидат: {interview.candidate?.firstName}{' '}
                      {interview.candidate?.lastName}
                    </div>
                    {interview.feedback && (
                      <div className="mt-2 p-2 bg-gray-100 rounded">
                        <strong>Обратная связь:</strong> {interview.feedback}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">Нет интервью</div>
          )}
        </CardContent>
      </Card>

      {/* Ошибки */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600">
              <strong>Ошибка:</strong> {error}
            </div>
            <Button
              onClick={() => dispatch(clearError())}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Закрыть
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Информация о тестовом режиме */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="text-yellow-800">
            <strong>Тестовый режим:</strong> Этот интерфейс предназначен только
            для разработки и тестирования. В продакшене он должен быть удален
            или защищен административными правами.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChooseInterview;
