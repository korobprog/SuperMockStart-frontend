import React from 'react';
import { Button } from './ui/button';
import Avatar from './ui/avatar';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

interface TelegramAuthStatusProps {
  onLogout?: () => void;
  className?: string;
}

const TelegramAuthStatus: React.FC<TelegramAuthStatusProps> = ({
  onLogout,
  className = '',
}) => {
  const { user, loading, logout } = useTelegramAuth();

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Avatar user={user} alt={user.first_name} size="md" variant="header" />
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.first_name} {user.last_name}
          </p>
          {user.username && (
            <p className="text-xs text-gray-500 dark:text-gray-300">
              @{user.username}
            </p>
          )}
        </div>
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        Выйти
      </Button>
    </div>
  );
};

export default TelegramAuthStatus;
