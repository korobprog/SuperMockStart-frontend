import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ModernCard } from './ui/card';
import DevAuthWidget from './DevAuthWidget';
import TelegramBotAuthButton from './TelegramBotAuthButton';
import TelegramLoginWidget from './TelegramLoginWidget';
import TelegramAuth from './TelegramAuth';
import TelegramDevPanel from './TelegramDevPanel';

interface AuthSectionProps {
  onAuthSuccess: (user: any, token: string) => void;
  onAuthError: (error: string) => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({
  onAuthSuccess,
  onAuthError,
}) => {
  return (
    <ModernCard className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Авторизация
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Выберите способ входа в систему
        </p>
      </div>
      <div className="space-y-4">
        {import.meta.env.VITE_NODE_ENV === 'production' ? (
          <div className="space-y-4">
            {/* Основной способ - Telegram Bot */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center mr-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-sm text-green-700 font-medium">
                  Рекомендуемый способ авторизации
                </span>
              </div>
            </div>
            <TelegramBotAuthButton
              onAuthSuccess={(userId, token) => {
                // Создаем объект пользователя для совместимости
                const user = {
                  id: userId,
                  first_name: 'User',
                  is_bot: false,
                };
                onAuthSuccess(user, token);
              }}
              onAuthError={onAuthError}
            />

            {/* Резервный способ - Login Widget */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-blue-700 font-medium">
                    Альтернативный способ авторизации
                  </span>
                </div>
              </div>
              <TelegramLoginWidget
                onAuthSuccess={(user) => {
                  const token =
                    Math.random().toString(36).substring(2, 15) +
                    Date.now().toString(36);
                  onAuthSuccess(user, token);
                }}
                onAuthError={onAuthError}
              />
            </div>
          </div>
        ) : (
          <Tabs value="bot" className="w-full">
            <TabsList
              className={`grid w-full ${
                import.meta.env.VITE_NODE_ENV !== 'production'
                  ? 'grid-cols-3'
                  : 'grid-cols-4'
              } bg-gradient-secondary`}
            >
              {import.meta.env.VITE_NODE_ENV !== 'production' && (
                <TabsTrigger value="dev" className="text-xs sm:text-sm">
                  Dev Auth
                </TabsTrigger>
              )}
              <TabsTrigger value="bot" className="text-xs sm:text-sm">
                Telegram Bot
              </TabsTrigger>
              <TabsTrigger value="widget" className="text-xs sm:text-sm">
                Login Widget
              </TabsTrigger>
              <TabsTrigger value="webapp" className="text-xs sm:text-sm">
                Web App
              </TabsTrigger>
              {import.meta.env.VITE_NODE_ENV !== 'production' && (
                <TabsTrigger value="test" className="text-xs sm:text-sm">
                  Test Panel
                </TabsTrigger>
              )}
            </TabsList>
            {import.meta.env.VITE_NODE_ENV !== 'production' && (
              <TabsContent value="dev" className="space-y-4 mt-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-green-700 font-medium">
                      Быстрая тестовая авторизация для разработки
                    </span>
                  </div>
                </div>
                <DevAuthWidget
                  onAuthSuccess={onAuthSuccess}
                  onAuthError={onAuthError}
                />
              </TabsContent>
            )}
            <TabsContent value="bot" className="space-y-4 mt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-green-700 font-medium">
                    Основной способ авторизации через Telegram бота
                  </span>
                </div>
              </div>
              <TelegramBotAuthButton
                onAuthSuccess={(userId, token) => {
                  // Создаем объект пользователя для совместимости
                  const user = {
                    id: userId,
                    first_name: 'User',
                    is_bot: false,
                  };
                  onAuthSuccess(user, token);
                }}
                onAuthError={onAuthError}
              />
            </TabsContent>
            <TabsContent value="widget" className="space-y-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-blue-700 font-medium">
                    Альтернативная авторизация через Telegram Login Widget
                  </span>
                </div>
              </div>
              <TelegramLoginWidget
                onAuthSuccess={(user) => {
                  const token =
                    Math.random().toString(36).substring(2, 15) +
                    Date.now().toString(36);
                  onAuthSuccess(user, token);
                }}
                onAuthError={onAuthError}
              />
            </TabsContent>
            <TabsContent value="webapp" className="space-y-4 mt-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm text-primary font-medium">
                    Быстрая авторизация через Telegram Web App
                  </span>
                </div>
              </div>
              <TelegramAuth
                onAuthSuccess={onAuthSuccess}
                onAuthError={onAuthError}
              />
            </TabsContent>
            {import.meta.env.VITE_NODE_ENV !== 'production' && (
              <TabsContent value="test" className="space-y-4 mt-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-yellow-200 rounded-full flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-yellow-700 font-medium">
                      Тестирование Telegram авторизации
                    </span>
                  </div>
                </div>
                <TelegramDevPanel
                  onAuthSuccess={(user) => {
                    const token =
                      Math.random().toString(36).substring(2, 15) +
                      Date.now().toString(36);
                    onAuthSuccess(user, token);
                  }}
                  onAuthError={onAuthError}
                />
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </ModernCard>
  );
};

export default AuthSection;
