import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import TelegramAuth from '@/components/TelegramAuth';
import TelegramBotAuth from '@/components/TelegramBotAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Home: React.FC = () => {
  const { user, loading, isAuthenticated, logout } = useTelegramAuth();
  const [activeTab, setActiveTab] = React.useState('webapp');

  const handleAuthSuccess = (user: any, token: string) => {
    console.log('Авторизация успешна:', user);
    // Перезагружаем страницу для обновления состояния
    window.location.reload();
  };

  const handleAuthError = (error: string) => {
    console.error('Ошибка авторизации:', error);
  };

  const handleLogout = () => {
    logout();
    console.log('🚪 User logged out');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-green-600">
              Добро пожаловать!
            </CardTitle>
            <CardDescription className="text-lg">
              Первый этап собеседования - прохождение моковых собеседований с
              коллегами.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Информация о пользователе */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">
                Информация о пользователе
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Имя:</strong> {user.first_name}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Статус:</strong>{' '}
                    <span className="text-green-600">Авторизован</span>
                  </p>
                  <p>
                    <strong>Токен:</strong>{' '}
                    <span className="text-xs text-gray-500">Действителен</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => (window.location.href = '/collectingcontacts')}
                className="w-full h-12 text-lg"
              >
                Познакомимся
              </Button>
              <Button
                onClick={() => (window.location.href = '/about')}
                variant="outline"
                className="w-full h-12 text-lg"
              >
                О проекте
              </Button>
            </div>

            {/* Дополнительные действия */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => (window.location.href = '/auth-demo')}
                variant="outline"
                size="sm"
              >
                Демо авторизации
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Выйти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Неавторизованный пользователь - показываем новую форму авторизации
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">SuperMockStart</CardTitle>
          <CardDescription className="text-lg">
            Платформа для проведения моковых собеседований с коллегами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Проверяем, находимся ли мы в Telegram Web App */}
          {window.Telegram?.WebApp ? (
            // Если мы в Telegram Web App, показываем только Web App авторизацию
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-blue-700">
                    Вы используете Telegram Web App
                  </span>
                </div>
              </div>

              <TelegramAuth
                onAuthSuccess={handleAuthSuccess}
                onAuthError={handleAuthError}
              />
            </div>
          ) : (
            // Если мы в обычном браузере, показываем выбор метода авторизации
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="webapp">Web App</TabsTrigger>
                <TabsTrigger value="bot">Telegram Bot</TabsTrigger>
              </TabsList>

              <TabsContent value="webapp" className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Откройте приложение в Telegram для авторизации
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                      💡 Совет: Добавьте приложение в Telegram через
                      @SuperMock_bot
                    </p>
                  </div>
                </div>

                <TelegramAuth
                  onAuthSuccess={handleAuthSuccess}
                  onAuthError={handleAuthError}
                />
              </TabsContent>

              <TabsContent value="bot" className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Авторизация через Telegram бота
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-800">
                      ✅ Рекомендуется для обычных браузеров
                    </p>
                  </div>
                </div>

                <TelegramBotAuth
                  onAuthSuccess={handleAuthSuccess}
                  onAuthError={handleAuthError}
                />
              </TabsContent>
            </Tabs>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>Безопасная авторизация через Telegram</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
