import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

const DebugAuth: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Собираем информацию для отладки
    const info = {
      userAgent: navigator.userAgent,
      isInTelegram: !!window.Telegram?.WebApp,
      telegramWebApp: window.Telegram?.WebApp ? 'доступен' : 'не доступен',
      envVars: {
        VITE_API_URL:
          import.meta.env.VITE_API_URL || 'https://api.supermock.ru',
        VITE_TELEGRAM_BOT_USERNAME:
          import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'не задан',
        NODE_ENV: import.meta.env.NODE_ENV || 'не задан',
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD,
      },
      localStorage: {
        telegram_token: localStorage.getItem('telegram_token') ? 'есть' : 'нет',
      },
      location: {
        href: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname,
      },
    };

    setDebugInfo(info);
  }, []);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('');

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

      const response = await fetch(`${API_URL}/api/auth/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Бэкенд доступен: ${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResult(
          `❌ Ошибка бэкенда: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      setTestResult(
        `❌ Ошибка подключения: ${
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const testTelegramAuth = async () => {
    setLoading(true);
    setTestResult('');

    try {
      if (!window.Telegram?.WebApp) {
        setTestResult('❌ Telegram Web App не доступен');
        setLoading(false);
        return;
      }

      const tg = window.Telegram.WebApp;
      const initData = tg.initData;
      const user = tg.initDataUnsafe?.user;

      setTestResult(`✅ Telegram Web App доступен:
initData: ${initData ? 'есть' : 'нет'}
user: ${user ? JSON.stringify(user, null, 2) : 'нет'}`);
    } catch (error) {
      setTestResult(
        `❌ Ошибка Telegram: ${
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('telegram_token');
    setDebugInfo((prev: any) => ({
      ...prev,
      localStorage: {
        telegram_token: 'нет',
      },
    }));
    setTestResult('✅ localStorage очищен');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Отладка авторизации Telegram</CardTitle>
            <CardDescription>
              Информация для диагностики проблем с авторизацией
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={testBackendConnection}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Тестирование...' : 'Тест подключения к бэкенду'}
                </Button>
                <Button
                  onClick={testTelegramAuth}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Тестирование...' : 'Тест Telegram Web App'}
                </Button>
              </div>

              <Button
                onClick={clearStorage}
                variant="outline"
                className="w-full"
              >
                Очистить localStorage
              </Button>

              {testResult && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Результат теста:</h3>
                  <pre className="text-sm whitespace-pre-wrap">
                    {testResult}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Информация для отладки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(debugInfo).map(([key, value]) => (
                <div key={key}>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">
                    {key}:
                  </h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💡 Возможные решения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <strong>Если кнопки не отображаются:</strong>
                <ul className="list-disc list-inside mt-1 ml-4">
                  <li>
                    Проверьте, что файл env.local создан с правильными
                    переменными
                  </li>
                  <li>Убедитесь, что бэкенд запущен на порту 3001</li>
                  <li>Проверьте консоль браузера на наличие ошибок</li>
                </ul>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg">
                <strong>Если авторизация не работает:</strong>
                <ul className="list-disc list-inside mt-1 ml-4">
                  <li>Откройте приложение в Telegram через @SuperMock_bot</li>
                  <li>Проверьте, что бот настроен правильно</li>
                  <li>Убедитесь, что домен добавлен в настройки бота</li>
                </ul>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <strong>Для тестирования:</strong>
                <ul className="list-disc list-inside mt-1 ml-4">
                  <li>Используйте ngrok для локальной разработки</li>
                  <li>Настройте Telegram Bot API для локального домена</li>
                  <li>Проверьте логи бэкенда на наличие ошибок</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugAuth;
