import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const AuthDemo: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [userId] = useState(1736594064); // Реальный User ID из логов

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

  const createAuthUrl = async () => {
    setLoading(true);
    console.log('🔗 Creating auth URL for user:', userId);

    try {
      const response = await fetch(`${API_URL}/api/telegram-bot/auth-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          redirectUrl: `${window.location.origin}/auth-callback`,
        }),
      });

      const data = await response.json();
      console.log('📡 API Response:', data);

      if (data.success) {
        console.log('✅ Auth URL created successfully:', data.data?.authUrl);
        setAuthUrl(data.data?.authUrl || '');
        setStep(2);
      } else {
        console.error('❌ API Error:', data.error);
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      alert(`Ошибка сети: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    console.log('🔍 Checking auth for user:', userId);

    try {
      const response = await fetch(`${API_URL}/api/telegram-bot/verify-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await response.json();
      console.log('📡 Verify API Response:', data);

      if (data.success) {
        console.log('✅ Auth verification successful');

        // Сохраняем токен в localStorage
        if (data.data?.token) {
          localStorage.setItem('telegram_token', data.data.token);
          console.log('💾 Token saved to localStorage');
        }

        setStep(4);
      } else {
        console.error('❌ Auth verification failed:', data.error);
        alert(`Ошибка авторизации: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('❌ Network Error during auth check:', error);
      alert(`Ошибка сети при проверке авторизации: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const openTelegram = () => {
    console.log('🔗 Opening Telegram URL:', authUrl);

    if (authUrl) {
      try {
        // Попробуем открыть в новом окне
        const newWindow = window.open(authUrl, '_blank');

        if (newWindow) {
          console.log('✅ Telegram window opened successfully');
          setStep(3);
        } else {
          console.log('❌ Failed to open window, trying alternative method');
          // Альтернативный способ - скопировать ссылку в буфер обмена
          navigator.clipboard
            .writeText(authUrl)
            .then(() => {
              alert(
                'Ссылка скопирована в буфер обмена! Откройте Telegram и вставьте ссылку.'
              );
              setStep(3);
            })
            .catch(() => {
              alert(
                `Не удалось открыть Telegram автоматически. Скопируйте эту ссылку и откройте в Telegram:\n\n${authUrl}`
              );
              setStep(3);
            });
        }
      } catch (error) {
        console.error('❌ Error opening Telegram:', error);
        alert(
          `Ошибка при открытии Telegram: ${error}\n\nСкопируйте эту ссылку и откройте в Telegram:\n\n${authUrl}`
        );
        setStep(3);
      }
    } else {
      console.error('❌ No auth URL available');
      alert(
        'Ошибка: ссылка авторизации не создана. Попробуйте создать ссылку заново.'
      );
    }
  };

  const resetDemo = () => {
    setStep(1);
    setAuthUrl('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Демо авторизации</CardTitle>
          <CardDescription>
            Пошаговый процесс авторизации через Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Шаг 1: Создание ссылки авторизации
              </h3>
              <p className="text-gray-600 mb-4">
                Нажмите кнопку ниже, чтобы создать уникальную ссылку для
                авторизации через Telegram бота.
              </p>
              <Button
                onClick={createAuthUrl}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Создание...' : 'Создать ссылку авторизации'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Шаг 2: Открытие в Telegram
              </h3>
              <p className="text-gray-600 mb-4">
                Ссылка создана! Теперь откройте её в Telegram и нажмите "Start".
              </p>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700 break-all">{authUrl}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={openTelegram} className="w-full">
                  Открыть в Telegram
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Назад
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Шаг 3: Проверка авторизации
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-yellow-800">
                    Ожидание подтверждения в Telegram...
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={checkAuth}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Проверка...' : 'Проверить авторизацию'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="w-full"
                >
                  Назад
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Шаг 4: Авторизация завершена!
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-800">
                    Авторизация прошла успешно!
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Теперь вы можете использовать приложение SuperMock.
              </p>
              <Button onClick={resetDemo} className="w-full">
                Начать заново
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>API URL: {API_URL}</p>
            <p>User ID: {userId}</p>
            <p>Step: {step}/4</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDemo;
