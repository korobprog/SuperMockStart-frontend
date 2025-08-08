import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ModernCard,
} from '../components/ui/card';
import BackgroundGradient from '../components/BackgroundGradient';

const BotAuthTest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'pending' | 'success' | 'error'>(
    'initial'
  );
  const [error, setError] = useState<string | null>(null);

  const handleBotAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      // Генерируем случайный userId для тестирования
      const userId = Math.floor(Math.random() * 1000000) + 100000;

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      console.log('🔍 Starting bot authentication for userId:', userId);

      // 1. Создаем URL для авторизации
      const authUrlResponse = await fetch(
        `${API_URL}/api/telegram-bot/auth-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            redirectUrl: `${window.location.origin}/bot-auth`,
          }),
        }
      );

      if (!authUrlResponse.ok) {
        throw new Error('Failed to create auth URL');
      }

      const authUrlData = await authUrlResponse.json();
      const authUrl = authUrlData.data.authUrl;

      console.log('🔗 Auth URL created:', authUrl);

      // 2. Открываем ссылку на бота в новом окне
      window.open(authUrl, '_blank');

      // 3. Сохраняем userId для последующей проверки
      localStorage.setItem('pending_bot_auth_userId', userId.toString());

      // 4. Переходим к ожиданию
      setStep('pending');
      setLoading(false);
    } catch (error) {
      console.error('❌ Bot auth error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setStep('error');
      setLoading(false);
    }
  };

  const handleCheckAuth = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('pending_bot_auth_userId');

      if (!userId) {
        throw new Error('No pending authentication found');
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      console.log('🔍 Checking bot authentication for userId:', userId);

      // Проверяем авторизацию через бота
      const verifyResponse = await fetch(
        `${API_URL}/api/telegram-bot/verify-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: parseInt(userId) }),
        }
      );

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('✅ Bot authentication successful:', verifyData);

        // Очищаем pending auth
        localStorage.removeItem('pending_bot_auth_userId');

        // Сохраняем токен и пользователя
        localStorage.setItem('token', verifyData.data.token);
        localStorage.setItem('user', JSON.stringify(verifyData.data.user));

        setStep('success');

        // Перенаправляем через 2 секунды
        setTimeout(() => {
          navigate('/collectingcontacts');
        }, 2000);
      } else {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Bot verification failed');
      }
    } catch (error) {
      console.error('❌ Check auth error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('pending_bot_auth_userId');
    setStep('initial');
    setError(null);
  };

  return (
    <BackgroundGradient className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <ModernCard>
            <CardHeader>
              <CardTitle className="text-center">
                🤖 Тест авторизации через Telegram бота
              </CardTitle>
              <CardDescription className="text-center">
                Простая авторизация без Login Widget
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'initial' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      ✅ Авторизация через Telegram бота работает
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Нажмите кнопку ниже для начала авторизации
                    </p>
                  </div>
                  <Button
                    onClick={handleBotAuth}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Подготовка...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        Войти через Telegram бота
                      </>
                    )}
                  </Button>
                </div>
              )}

              {step === 'pending' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      🔄 Ожидание авторизации через бота...
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      После авторизации в боте нажмите кнопку ниже
                    </p>
                  </div>
                  <Button
                    onClick={handleCheckAuth}
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Проверка...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        Проверить авторизацию
                      </>
                    )}
                  </Button>
                </div>
              )}

              {step === 'success' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      ✅ Авторизация успешна!
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Перенаправление...
                    </p>
                  </div>
                </div>
              )}

              {step === 'error' && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">❌ Ошибка: {error}</p>
                  </div>
                  <Button onClick={handleReset} className="w-full">
                    Попробовать снова
                  </Button>
                </div>
              )}

              <div className="mt-4 text-center">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="text-sm"
                >
                  Вернуться на главную
                </Button>
              </div>
            </CardContent>
          </ModernCard>
        </div>
      </div>
    </BackgroundGradient>
  );
};

export default BotAuthTest;
