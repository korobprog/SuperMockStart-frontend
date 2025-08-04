import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TokenCheck = () => {
  const [searchParams] = useSearchParams();
  const [tokens, setTokens] = useState<{
    telegram_token?: string;
    authToken?: string;
    userId?: string;
    telegramUser?: any;
  }>({});
  const [testResult, setTestResult] = useState<any>(null);

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
  }, [searchParams]);

  const getTestToken = async () => {
    try {
      console.log('Getting test token...');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/auth/test-token`);
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
      const urlUserId = searchParams.get('userId');
      if (!urlUserId) {
        alert('Нет userId в URL!');
        return;
      }

      console.log('Creating real token for userId:', urlUserId);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      const response = await fetch(`${apiUrl}/api/auth/test-token-user`, {
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

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
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

      const response = await fetch(`${apiUrl}/api/form`, {
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
          <CardTitle>🔐 Проверка токенов авторизации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {urlUserId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                📱 Данные от Telegram бота:
              </h3>
              <div className="text-sm text-blue-700">
                <div>
                  <span className="font-medium">Telegram ID:</span> {urlUserId}
                </div>
                <div>
                  <span className="font-medium">Статус:</span>{' '}
                  {tokens.telegram_token
                    ? '✅ Токен создан'
                    : '❌ Токен не создан'}
                </div>
              </div>
            </div>
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
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                🎯 Создать токен для {urlUserId}
              </Button>
            )}
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
