import React from 'react';
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
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { user, loading, isAuthenticated } = useTelegramAuth();
  const [activeTab, setActiveTab] = React.useState('webapp');
  const navigate = useNavigate();

  const handleAuthSuccess = (_user: any, token: string) => {
    // Сохраняем токен в правильном ключе
    localStorage.setItem('telegram_token', token);

    // Небольшая задержка перед перенаправлением
    setTimeout(() => {
      navigate('/interview');
    }, 500);
  };

  const handleAuthError = (error: string) => {
    console.error('Ошибка авторизации:', error);
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

  // Если пользователь авторизован, перенаправляем на страницу интервью
  if (isAuthenticated && user) {
    // Используем useEffect для перенаправления, чтобы избежать ошибок рендеринга
    React.useEffect(() => {
      navigate('/interview');
    }, [navigate, isAuthenticated]);

    // Показываем загрузку во время перенаправления
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Перенаправление на страницу интервью...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Неавторизованный пользователь - показываем новую форму авторизации
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            SuperMockStart
          </CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Платформа для проведения моковых собеседований с коллегами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
          {/* Проверяем, находимся ли мы в Telegram Web App */}
          {window.Telegram?.WebApp ? (
            // Если мы в Telegram Web App, показываем только Web App авторизацию
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-2 flex-shrink-0"
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
                <TabsTrigger value="webapp" className="text-xs sm:text-sm">
                  Telegram Web App
                </TabsTrigger>
                <TabsTrigger value="bot" className="text-xs sm:text-sm">
                  Telegram Bot
                </TabsTrigger>
              </TabsList>
              <TabsContent value="webapp" className="space-y-4 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-2 flex-shrink-0"
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
                      Рекомендуется для мобильных устройств
                    </span>
                  </div>
                </div>
                <TelegramAuth
                  onAuthSuccess={handleAuthSuccess}
                  onAuthError={handleAuthError}
                />
              </TabsContent>
              <TabsContent value="bot" className="space-y-4 mt-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-green-700">
                      Альтернативный способ авторизации
                    </span>
                  </div>
                </div>
                <TelegramBotAuth
                  onAuthSuccess={handleAuthSuccess}
                  onAuthError={handleAuthError}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
