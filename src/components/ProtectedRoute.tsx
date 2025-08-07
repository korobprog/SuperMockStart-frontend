import React, { useEffect, useState } from 'react';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { loading, isAuthenticated, checkAuthStatus } = useTelegramAuth();
  const navigate = useNavigate();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0);

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    const checkAuth = async () => {
      if (
        !isAuthenticated &&
        !loading &&
        !hasCheckedAuth &&
        authCheckAttempts < 2
      ) {
        setAuthCheckAttempts((prev) => prev + 1);
        try {
          await checkAuthStatus();
        } catch (error) {
          console.error('Error checking auth status:', error);
        } finally {
          setHasCheckedAuth(true);
        }
      }
    };

    checkAuth();
  }, [
    isAuthenticated,
    loading,
    hasCheckedAuth,
    authCheckAttempts,
    checkAuthStatus,
  ]);

  // Если проверка завершена и пользователь не авторизован, перенаправляем на страницу авторизации
  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated && !loading) {
      console.log('🔀 Перенаправление на страницу авторизации');
      navigate('/auth', { replace: true });
    }
  }, [hasCheckedAuth, isAuthenticated, loading, navigate]);

  // Показываем загрузку только при первой проверке
  if (loading && !hasCheckedAuth) {
    return <LoadingSpinner message="Проверка авторизации..." />;
  }

  // Если пользователь авторизован, показываем защищенный контент
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Если проверка завершена, но пользователь не авторизован, показываем fallback или страницу авторизации
  if (hasCheckedAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Показываем промежуточную страницу с кнопкой авторизации
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Требуется авторизация
            </CardTitle>
            <CardDescription className="text-gray-600">
              Для доступа к этой странице необходимо войти через Telegram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-400 hover:border-blue-300"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-3"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Перейти к авторизации
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Показываем загрузку во время проверки
  return <LoadingSpinner message="Проверка авторизации..." />;
};

export default ProtectedRoute;
