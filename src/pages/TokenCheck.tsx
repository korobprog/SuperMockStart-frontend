import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import BackgroundGradient from '../components/BackgroundGradient';

const TokenCheck: React.FC = () => {
  const { user, token, loading, error, isAuthenticated, checkAuth } = useAuth();
  const [checkResult, setCheckResult] = useState<any>(null);

  useEffect(() => {
    // Автоматически проверяем токен при загрузке страницы
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const result = await checkAuth();
      setCheckResult({
        timestamp: new Date().toISOString(),
        result,
        localStorage: {
          telegram_user: localStorage.getItem('telegram_user'),
          telegram_token: localStorage.getItem('telegram_token'),
          auth_id: localStorage.getItem('auth_id'),
        },
      });
    } catch (error) {
      setCheckResult({
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <BackgroundGradient className="min-h-screen">
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Проверка авторизации
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Состояние авторизации</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Загрузка:</strong> {loading ? 'Да' : 'Нет'}
                </p>
                <p>
                  <strong>Авторизован:</strong> {isAuthenticated ? 'Да' : 'Нет'}
                </p>
                <p>
                  <strong>Есть токен:</strong> {token ? 'Да' : 'Нет'}
                </p>
                <p>
                  <strong>Есть пользователь:</strong> {user ? 'Да' : 'Нет'}
                </p>
                {error && (
                  <p>
                    <strong>Ошибка:</strong> {error}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Информация о пользователе</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p>
                    <strong>ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Имя:</strong> {user.first_name} {user.last_name}
                  </p>
                  <p>
                    <strong>Username:</strong> {user.username || 'Нет'}
                  </p>
                  <p>
                    <strong>Фото:</strong> {user.photo_url ? 'Есть' : 'Нет'}
                  </p>
                </div>
              ) : (
                <p>Нет данных пользователя</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-6">
          <Button onClick={checkAuthStatus} className="px-8">
            Проверить статус
          </Button>
        </div>

        {checkResult && (
          <Card>
            <CardHeader>
              <CardTitle>Результат проверки</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(checkResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </BackgroundGradient>
  );
};

export default TokenCheck;
