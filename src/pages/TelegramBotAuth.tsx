import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../store/slices/authSlice';

const TelegramBotAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleBotAuth = async () => {
      try {
        console.log('🔍 Processing Telegram bot auth...');

        // Получаем параметры из URL
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');

        console.log('📋 Bot auth parameters:', { userId, token });

        // Проверяем обязательные поля
        if (!userId) {
          console.error('❌ Missing required bot auth parameters');
          setError('Отсутствуют обязательные параметры авторизации');
          setLoading(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        // Если токен уже есть в URL, используем его
        if (token) {
          console.log('🔑 Token found in URL, using it directly');
          dispatch(setToken(token));

          // Получаем информацию о пользователе
          const userResponse = await fetch(
            `${API_URL}/api/telegram-bot/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (userResponse.ok) {
            const userData = await userResponse.json();
            dispatch(setUser(userData.data));
            console.log('✅ Bot authentication successful with token from URL');
            navigate('/', { replace: true });
          } else {
            throw new Error('Failed to get user info');
          }
        } else {
          // Если токена нет, верифицируем пользователя через бота
          console.log('🔍 Verifying user through bot...');
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
            console.log('✅ Bot verification successful:', verifyData);

            // Сохраняем токен и пользователя в Redux store
            dispatch(setToken(verifyData.data.token));

            // Преобразуем пользователя в формат, ожидаемый Redux
            const userForRedux = {
              id: verifyData.data.user.id,
              first_name: verifyData.data.user.firstName || 'User',
              last_name: verifyData.data.user.lastName,
              username: verifyData.data.user.username,
              is_bot: false,
            };

            dispatch(setUser(userForRedux));

            // Также сохраняем в localStorage для совместимости
            localStorage.setItem('authToken', verifyData.data.token);
            localStorage.setItem('token', verifyData.data.token);

            // Преобразуем пользователя в формат, ожидаемый auth.ts
            const userForStorage = {
              id: verifyData.data.user.id,
              first_name: verifyData.data.user.firstName || 'User',
              last_name: verifyData.data.user.lastName,
              username: verifyData.data.user.username,
              is_bot: false,
            };

            localStorage.setItem('user', JSON.stringify(userForStorage));
            localStorage.setItem('telegram_token', verifyData.data.token);

            console.log('✅ Auth data saved to Redux and localStorage');

            navigate('/', { replace: true });
          } else {
            const errorData = await verifyResponse.json();
            throw new Error(errorData.error || 'Bot verification failed');
          }
        }
      } catch (error) {
        console.error('❌ Error during bot auth:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Ошибка обработки авторизации'
        );
      } finally {
        setLoading(false);
      }
    };

    handleBotAuth();
  }, [searchParams, dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">
            Обработка авторизации через Telegram бота...
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Проверяем авторизацию для пользователя {searchParams.get('userId')}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Ошибка авторизации</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default TelegramBotAuth;
