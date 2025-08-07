import React, { useState } from 'react';
import TelegramAuth from './TelegramAuth';
import TelegramBotAuth from './TelegramBotAuth';
import TelegramLoginWidget from './TelegramLoginWidget';
import DevAuthWidget from './DevAuthWidget';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ModernCard,
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AuthSectionProps {
  onAuthSuccess: (user: any, token: string) => void;
  onAuthError: (error: string) => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({
  onAuthSuccess,
  onAuthError,
}) => {
  const [activeTab, setActiveTab] = useState(() => {
    // По умолчанию в браузере выбираем Dev Auth для быстрой авторизации в dev режиме
    return window.Telegram?.WebApp ? 'webapp' : 'dev';
  });

  return (
    <ModernCard className="max-w-2xl mx-auto shadow-elegant bg-white/80 backdrop-blur">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-gradient">
          Начните прямо сейчас
        </CardTitle>
        <CardDescription className="text-base sm:text-lg">
          Откройте Telegram бота для регистрации и начните первое собеседование
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
        {/* Проверяем, находимся ли мы в Telegram Web App */}
        {window.Telegram?.WebApp ? (
          // Если мы в Telegram Web App, показываем только Web App авторизацию
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-sm text-primary font-medium">
                  Вы используете Telegram Web App
                </span>
              </div>
            </div>

            <TelegramAuth
              onAuthSuccess={onAuthSuccess}
              onAuthError={onAuthError}
            />
          </div>
        ) : (
          // Если мы в обычном браузере, показываем выбор метода авторизации
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className={`grid w-full ${
                import.meta.env.VITE_NODE_ENV === 'production'
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
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  <span className="text-sm text-accent font-medium">
                    Регистрация через Telegram бота
                  </span>
                </div>
              </div>
              <TelegramBotAuth
                onAuthSuccess={onAuthSuccess}
                onAuthError={onAuthError}
              />
            </TabsContent>
            <TabsContent value="widget" className="space-y-4 mt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-green-700 font-medium">
                    Быстрая авторизация через Telegram Login Widget (работает в
                    dev и prod)
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
          </Tabs>
        )}
      </CardContent>
    </ModernCard>
  );
};

export default AuthSection;
