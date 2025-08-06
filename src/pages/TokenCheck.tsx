import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

const TokenCheck = () => {
  const [searchParams] = useSearchParams();
  const [tokens, setTokens] = useState<{
    telegram_token?: string;
    authToken?: string;
    userId?: string;
    telegramUser?: any;
  }>({});
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru/api';

  useEffect(() => {
    console.log('TokenCheck component mounted');

    // Получаем userId из URL параметров
    const urlUserId = searchParams.get('userId');

    const telegramToken = localStorage.getItem('telegram_token') || undefined;
    const authToken = localStorage.getItem('authToken') || undefined;
    const userId = localStorage.getItem('userId') || urlUserId || undefined;
    const telegramUserStr = localStorage.getItem('telegramUser');
    const telegramUser = telegramUserStr ? JSON.parse(telegramUserStr) : null;

    setTokens({
      telegram_token: telegramToken,
      authToken,
      userId,
      telegramUser,
    });

    // Если есть userId в URL, но нет токена, предлагаем создать токен
    if (urlUserId && !telegramToken) {
      console.log('Найден userId в URL:', urlUserId);
    }

    // Очистка интервала при размонтировании
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [searchParams]);

  // Функция для автоматического обновления токена
  const startAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    const interval = setInterval(async () => {
      await refreshToken();
    }, 30000); // Обновляем каждые 30 секунд

    setRefreshInterval(interval);
    setAutoRefresh(true);
  };

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
    setAutoRefresh(false);
  };

  // Функция для обновления токена
  const refreshToken = async () => {
    try {
      setLoading(true);
      const currentUserId = searchParams.get('userId') || tokens.userId;

      if (!currentUserId) {
        console.log('Нет userId для обновления токена');
        return;
      }

      console.log('🔄 Обновление токена для userId:', currentUserId);

      const response = await fetch(`${API_URL}/auth/test-token-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      const data = await response.json();
      console.log('🔄 Результат обновления токена:', data);

      if (data.success) {
        // Сохраняем обновленный токен
        localStorage.setItem('extended_token', data.data.token);
        localStorage.setItem('telegram_token', data.data.token);
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userId', data.data.user.id.toString());
        localStorage.setItem('telegramUser', JSON.stringify(data.data.user));

        setTokens((prev) => ({
          ...prev,
          telegram_token: data.data.token,
          authToken: data.data.token,
          userId: data.data.user.id.toString(),
          telegramUser: data.data.user,
        }));

        console.log('✅ Токен успешно обновлен');
      } else {
        console.error('❌ Ошибка обновления токена:', data.error);
      }
    } catch (error) {
      console.error('❌ Ошибка при обновлении токена:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTestToken = async () => {
    try {
      console.log('Getting test token...');
      const response = await fetch(`${API_URL}/auth/test-token`);
      const data = await response.json();

      console.log('Token response:', data);

      if (data.success) {
        // Сохраняем токен в обеих переменных для совместимости
        localStorage.setItem('telegram_token', data.data.token);
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userId', data.data.user.id.toString());

        setTokens((prev) => ({
          ...prev,
          telegram_token: data.data.token,
          authToken: data.data.token,
          userId: data.data.user.id.toString(),
        }));
        alert('Тестовый токен получен!');
      } else {
        alert('Ошибка получения токена: ' + data.error);
      }
    } catch (error) {
      console.error('Ошибка получения токена:', error);
      alert('Ошибка получения токена');
    }
  };

  const createRealToken = async () => {
    try {
      setLoading(true);
      const urlUserId = searchParams.get('userId');
      if (!urlUserId) {
        alert('Нет userId в URL!');
        return;
      }

      console.log('Creating real token for userId:', urlUserId);

      const response = await fetch(`${API_URL}/auth/test-token-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: urlUserId }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Real token response:', data);

      if (data.success) {
        // Сохраняем расширенный токен
        localStorage.setItem('extended_token', data.data.token);
        localStorage.setItem('telegram_token', data.data.token);
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userId', data.data.user.id.toString());
        localStorage.setItem('telegramUser', JSON.stringify(data.data.user));

        setTokens((prev) => ({
          ...prev,
          telegram_token: data.data.token,
          authToken: data.data.token,
          userId: data.data.user.id.toString(),
          telegramUser: data.data.user,
        }));
        alert('Реальный расширенный токен создан!');
      } else {
        console.error('Token creation failed:', data);
        alert('Ошибка создания токена: ' + data.error);
      }
    } catch (error) {
      console.error('Ошибка создания реального токена:', error);
      alert(
        'Ошибка создания токена: ' +
          (error instanceof Error ? error.message : 'Неизвестная ошибка')
      );
    } finally {
      setLoading(false);
    }
  };

  const testFormSubmission = async () => {
    try {
      const token =
        localStorage.getItem('telegram_token') ||
        localStorage.getItem('authToken');

      if (!token) {
        alert('Сначала получите токен!');
        return;
      }

      const formData = {
        profession: 'frontend-developer',
        country: 'RU',
        language: 'ru',
        experience: '0-0',
        email: 'test@example.com',
        phone: '+79001234567',
        linkedin: 'https://linkedin.com/in/test',
        github: 'https://github.com/test',
        portfolio: 'https://portfolio.test',
        about: 'Тестовое описание',
        skills: ['JavaScript', 'React', 'TypeScript'],
        education: 'Высшее образование',
        englishLevel: 'B2',
        salary: '100000',
        remoteWork: true,
        relocation: false,
        noticePeriod: '2 недели',
        additionalInfo: 'Дополнительная информация',
      };

              const response = await fetch(`${API_URL}/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setTestResult({ status: response.status, data: result });

      if (response.ok) {
        alert('Форма успешно отправлена!');
      } else {
        alert(`Ошибка отправки формы: ${result.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Ошибка тестирования формы:', error);
      setTestResult({
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
      alert('Ошибка тестирования формы');
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('telegram_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('extended_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('telegramUser');
    setTokens({});
    setTestResult(null);
    alert('Токены очищены!');
  };

  const urlUserId = searchParams.get('userId');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔐 Управление токенами авторизации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {urlUserId && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription>
                <div className="font-semibold text-blue-800 mb-2">
                  📱 Данные от Telegram бота:
                </div>
                <div className="text-sm text-blue-700">
                  <div>
                    <span className="font-medium">Telegram ID:</span>{' '}
                    {urlUserId}
                  </div>
                  <div>
                    <span className="font-medium">Статус:</span>{' '}
                    {tokens.telegram_token
                      ? '✅ Токен создан'
                      : '❌ Токен не создан'}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Токены в localStorage:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">extended_token:</span>{' '}
                  <span
                    className={
                      localStorage.getItem('extended_token')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {localStorage.getItem('extended_token')
                      ? '✅ Найден'
                      : '❌ Не найден'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">telegram_token:</span>{' '}
                  <span
                    className={
                      tokens.telegram_token ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {tokens.telegram_token ? '✅ Найден' : '❌ Не найден'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">authToken:</span>{' '}
                  <span
                    className={
                      tokens.authToken ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {tokens.authToken ? '✅ Найден' : '❌ Не найден'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">userId:</span>{' '}
                  <span
                    className={
                      tokens.userId ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {tokens.userId ? `✅ ${tokens.userId}` : '❌ Не найден'}
                  </span>
                </div>
              </div>
            </div>

            {tokens.telegramUser && (
              <div>
                <h3 className="font-semibold mb-2">
                  Данные пользователя Telegram:
                </h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">ID:</span>{' '}
                    {tokens.telegramUser.id}
                  </div>
                  <div>
                    <span className="font-medium">Имя:</span>{' '}
                    {tokens.telegramUser.firstName}
                  </div>
                  <div>
                    <span className="font-medium">Фамилия:</span>{' '}
                    {tokens.telegramUser.lastName || 'Не указана'}
                  </div>
                  <div>
                    <span className="font-medium">Username:</span>{' '}
                    {tokens.telegramUser.username || 'Не указан'}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {urlUserId && (
              <Button
                onClick={createRealToken}
                disabled={loading}
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Создание...
                  </>
                ) : (
                  `🎯 Создать токен для ${urlUserId}`
                )}
              </Button>
            )}

            <Button onClick={refreshToken} disabled={loading} variant="outline">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Обновление...
                </>
              ) : (
                '🔄 Обновить токен'
              )}
            </Button>

            <Button
              onClick={autoRefresh ? stopAutoRefresh : startAutoRefresh}
              variant={autoRefresh ? 'destructive' : 'outline'}
            >
              {autoRefresh
                ? '⏹️ Остановить автообновление'
                : '🔄 Автообновление'}
            </Button>

            <Button onClick={getTestToken} variant="outline">
              Получить тестовый токен
            </Button>

            <Button onClick={testFormSubmission} variant="outline">
              Протестировать отправку формы
            </Button>

            <Button onClick={clearTokens} variant="destructive">
              Очистить токены
            </Button>
          </div>

          {autoRefresh && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription>
                🔄 Автообновление токена включено. Токен будет обновляться
                каждые 30 секунд.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Результат тестирования</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TokenCheck;
