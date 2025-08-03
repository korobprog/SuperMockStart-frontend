import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TelegramAuth from '@/components/TelegramAuth';
import TelegramBotAuth from '@/components/TelegramBotAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [authMethod, setAuthMethod] = useState<'webapp' | 'bot'>('webapp');

  useEffect(() => {
    // Проверяем, находимся ли мы в Telegram Web App
    setIsInTelegram(!!window.Telegram?.WebApp);

    // Если мы в Telegram Web App, автоматически выбираем Web App авторизацию
    if (window.Telegram?.WebApp) {
      setAuthMethod('webapp');
    }
  }, []);

  const handleAuthSuccess = (user: TelegramUser) => {
    console.log('Авторизация успешна:', user);
    // Перенаправляем на главную страницу
    navigate('/');
  };

  const handleAuthError = (error: string) => {
    console.error('Ошибка авторизации:', error);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Добро пожаловать в SuperMock
            </CardTitle>
            <CardDescription className="text-gray-600">
              Выберите способ авторизации
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isInTelegram ? (
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
                value={authMethod}
                onValueChange={(value) =>
                  setAuthMethod(value as 'webapp' | 'bot')
                }
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

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={handleBackToHome}
                variant="outline"
                className="w-full"
              >
                ← Вернуться на главную
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Информация о приложении */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            SuperMock - Платформа для проведения интервью
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Безопасная авторизация через Telegram
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
