import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import LoadingSpinner from '../components/LoadingSpinner';
import BackgroundGradient from '../components/BackgroundGradient';

const TelegramAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Получаем параметры из URL
        const authId = searchParams.get('auth_id');
        const userId = searchParams.get('id') || authId?.split('_')[0]; // Извлекаем userId из auth_id если id нет
        const firstName = searchParams.get('first_name');
        const lastName = searchParams.get('last_name');
        const username = searchParams.get('username');
        const photoUrl = searchParams.get('photo_url');
        const authDate = searchParams.get('auth_date');
        const hash = searchParams.get('hash');

        console.log('📥 Telegram Auth Callback received:', {
          authId,
          userId,
          firstName,
          lastName,
          username,
          photoUrl,
          authDate,
          hash,
        });

        // Проверяем, что у нас есть хотя бы userId или authId
        if (!userId && !authId) {
          setError('Отсутствуют необходимые параметры авторизации');
          setLoading(false);
          return;
        }

        // Проверяем, что авторизация не старше 5 минут
        if (authDate) {
          const authTimestamp = parseInt(authDate);
          const currentTime = Date.now() / 1000;
          const fiveMinutes = 5 * 60;

          if (currentTime - authTimestamp > fiveMinutes) {
            setError('Ссылка авторизации устарела');
            setLoading(false);
            return;
          }
        }

        // Создаем объект пользователя
        const user = {
          id: userId ? parseInt(userId) : Date.now(), // Используем timestamp если userId нет
          first_name: firstName || 'User',
          last_name: lastName || '',
          username: username || '',
          photo_url: photoUrl || '',
        };

        // Генерируем токен авторизации
        const token =
          Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

        // Сохраняем пользователя и токен
        localStorage.setItem('telegram_user', JSON.stringify(user));
        localStorage.setItem('telegram_token', token);
        localStorage.setItem('auth_id', authId || '');

        console.log('✅ User authenticated successfully:', user);

        // Перенаправляем на главную страницу или следующую страницу
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('❌ Error processing auth callback:', error);
        setError('Ошибка обработки авторизации');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <BackgroundGradient className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <LoadingSpinner message="Обработка авторизации..." />
          </CardContent>
        </Card>
      </BackgroundGradient>
    );
  }

  if (error) {
    return (
      <BackgroundGradient className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Ошибка авторизации</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Вернуться на главную
            </button>
          </CardContent>
        </Card>
      </BackgroundGradient>
    );
  }

  return (
    <BackgroundGradient className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">
            ✅ Авторизация успешна!
          </CardTitle>
          <CardDescription>
            Перенаправление на главную страницу...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Вы успешно авторизовались через Telegram
            </p>
          </div>
        </CardContent>
      </Card>
    </BackgroundGradient>
  );
};

export default TelegramAuthCallback;
