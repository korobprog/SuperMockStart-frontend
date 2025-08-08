import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginWithTelegramWidget } from '../store/slices/authSlice';

const TelegramAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleTelegramAuth = async () => {
      try {
        console.log('🔍 Processing Telegram auth callback...');

        // Получаем параметры из URL
        const id = searchParams.get('id');
        const first_name = searchParams.get('first_name');
        const last_name = searchParams.get('last_name');
        const username = searchParams.get('username');
        const photo_url = searchParams.get('photo_url');
        const auth_date = searchParams.get('auth_date');
        const hash = searchParams.get('hash');

        console.log('📋 Telegram auth parameters:', {
          id,
          first_name,
          last_name,
          username,
          photo_url,
          auth_date,
          hash,
        });

        // Проверяем обязательные поля
        if (!id || !first_name || !auth_date || !hash) {
          console.error('❌ Missing required Telegram auth parameters');
          setError('Отсутствуют обязательные параметры авторизации');
          setLoading(false);
          return;
        }

        // Формируем объект с данными пользователя
        const userData = {
          id: parseInt(id),
          first_name,
          last_name: last_name || undefined,
          username: username || undefined,
          photo_url: photo_url || undefined,
          auth_date: parseInt(auth_date),
          hash,
        };

        console.log('📤 Sending user data to backend:', userData);

        // Отправляем данные на сервер
        const result = await dispatch(loginWithTelegramWidget(userData) as any);

        if (result.meta?.requestStatus === 'fulfilled') {
          console.log('✅ Telegram authentication successful');
          // Перенаправляем на главную страницу
          navigate('/', { replace: true });
        } else {
          console.error('❌ Telegram authentication failed');
          setError('Ошибка авторизации через Telegram');
        }
      } catch (error) {
        console.error('❌ Error during Telegram auth callback:', error);
        setError('Ошибка обработки авторизации');
      } finally {
        setLoading(false);
      }
    };

    handleTelegramAuth();
  }, [searchParams, dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Обработка авторизации Telegram...</p>
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

export default TelegramAuthCallback;
