import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../store/slices/authSlice';
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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🚀 TelegramAuthCallback component loaded');
  console.log('🔗 Current URL:', window.location.href);
  console.log('📋 Search params:', Object.fromEntries(searchParams.entries()));

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Получаем параметры из URL
        const id = searchParams.get('id') || searchParams.get('userId');
        const firstName =
          searchParams.get('first_name') || searchParams.get('firstName');
        const lastName =
          searchParams.get('last_name') || searchParams.get('lastName');
        const username = searchParams.get('username');
        const photoUrl =
          searchParams.get('photo_url') || searchParams.get('photoUrl');
        const authDate =
          searchParams.get('auth_date') || searchParams.get('authDate');
        const hash = searchParams.get('hash');

        console.log('📥 Telegram Auth Callback received:', {
          id,
          firstName,
          lastName,
          username,
          photoUrl,
          authDate,
          hash,
        });

        // Проверяем, что у нас есть необходимые параметры
        if (!id || !firstName || !authDate || !hash) {
          setError('Отсутствуют необходимые параметры авторизации');
          setLoading(false);
          return;
        }

        // Проверяем, что авторизация не старше 5 минут
        const authTimestamp = parseInt(authDate);
        const currentTime = Date.now() / 1000;
        const fiveMinutes = 5 * 60;

        if (currentTime - authTimestamp > fiveMinutes) {
          setError('Ссылка авторизации устарела');
          setLoading(false);
          return;
        }

        // Создаем объект пользователя в правильном формате
        const user = {
          id: parseInt(id),
          first_name: firstName,
          last_name: lastName || '',
          username: username || '',
          photo_url: photoUrl || '',
        };

        // Отправляем данные на backend для получения JWT токена
        const API_URL =
          import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

        // Создаем объект с данными для отправки на сервер
        const authData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || '',
          username: user.username || '',
          photo_url: user.photo_url || '',
          auth_date: parseInt(authDate),
          hash: hash,
        };

        console.log('📤 Sending auth data to backend:', authData);

        try {
          const response = await fetch(`${API_URL}/api/auth/telegram-widget`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(authData),
          });

          if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
              const errorData = await response.json();
              errorMessage =
                errorData.error || errorData.message || errorMessage;
            } catch (parseError) {
              console.error('Failed to parse error response:', parseError);
            }

            console.error('❌ Backend auth error:', {
              status: response.status,
              statusText: response.statusText,
              error: errorMessage,
            });

            throw new Error(errorMessage);
          }

          const data = await response.json();

          console.log('📥 Response from backend:', data);

          if (data.success) {
            // Сохраняем пользователя и JWT токен в localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('telegram_token', data.data.token); // Для совместимости

            console.log('💾 Saved to localStorage:', {
              user: user,
              authToken: data.data.token ? 'present' : 'missing',
              telegram_token: data.data.token ? 'present' : 'missing',
            });

            // Обновляем Redux store
            dispatch(setToken(data.data.token));
            dispatch(setUser(user));

            console.log(
              '✅ User authenticated successfully with JWT token:',
              user
            );

            // Перенаправляем на главную страницу с небольшой задержкой
            setTimeout(() => {
              navigate('/');
            }, 1000);
          } else {
            throw new Error(data.error || 'Ошибка авторизации на сервере');
          }
        } catch (error) {
          console.error('❌ Error getting JWT token:', error);
          setError(
            error instanceof Error ? error.message : 'Ошибка авторизации'
          );
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error processing auth callback:', error);
        setError('Ошибка обработки авторизации');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, dispatch]);

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
