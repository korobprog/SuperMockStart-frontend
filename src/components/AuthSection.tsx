import React from 'react';
import { ModernCard } from './ui/card';
import TelegramLoginWidget from './TelegramLoginWidget';
import TelegramAuth from './TelegramAuth';

interface AuthSectionProps {
  onAuthSuccess: (user: any, token: string) => void;
  onAuthError: (error: string) => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({
  onAuthSuccess,
  onAuthError,
}) => {
  const isWebApp = typeof window !== 'undefined' && !!window.Telegram?.WebApp;

  return (
    <ModernCard className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Авторизация
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {isWebApp
            ? 'Вы авторизуетесь через Telegram Mini App'
            : 'Вы авторизуетесь через Telegram Login Widget'}
        </p>
      </div>

      <div className="space-y-4">
        {isWebApp ? (
          <TelegramAuth onAuthSuccess={onAuthSuccess} onAuthError={onAuthError} />
        ) : (
          <TelegramLoginWidget
            onAuthSuccess={onAuthSuccess}
            onAuthError={onAuthError}
          />
        )}
      </div>
    </ModernCard>
  );
};

export default AuthSection;
