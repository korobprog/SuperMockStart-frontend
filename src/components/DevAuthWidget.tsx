import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface DevAuthWidgetProps {
  onAuthSuccess: (user: any, token: string) => void;
  onAuthError: (error: string) => void;
  className?: string;
}

const DevAuthWidget: React.FC<DevAuthWidgetProps> = ({
  onAuthSuccess,
  onAuthError,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);

  const handleDevAuth = async () => {
    setLoading(true);

    try {
      // Создаем тестового пользователя
      const testUser = {
        id: Date.now(),
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: '',
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'dev_hash_' + Date.now(),
      };

      // Создаем пользователя через backend API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      // Сначала создаем пользователя в базе данных
      const createUserResponse = await fetch(`${apiUrl}/api/auth/dev-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });

      if (createUserResponse.ok) {
        const authData = await createUserResponse.json();

        if (!authData.success || !authData.data) {
          throw new Error(authData.error || 'Failed to create dev user');
        }

        const { token, user } = authData.data;

        // Сохраняем в localStorage
        localStorage.setItem('telegram_user', JSON.stringify(user));
        localStorage.setItem('telegram_token', token);

        console.log('✅ Dev auth success:', user);

        // Вызываем callback с правильными данными
        onAuthSuccess(user, token);
      } else {
        const errorData = await createUserResponse.json();
        throw new Error(errorData.error || 'Failed to create dev user');
      }
    } catch (error) {
      console.error('❌ Dev auth error:', error);
      onAuthError('Ошибка тестовой авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`dev-auth-widget ${className}`}>
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold">
            Тестовая авторизация (DEV)
          </CardTitle>
          <CardDescription>
            Для разработки используйте эту кнопку для быстрой авторизации
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={handleDevAuth}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Авторизация...' : '🚀 Тестовая авторизация'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Создает тестового пользователя для разработки
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevAuthWidget;
