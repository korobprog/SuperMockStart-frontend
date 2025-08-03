import React from 'react';
import { Button } from '@/components/ui/button';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

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
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.first_name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-[#0088cc] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.first_name.charAt(0)}
            </span>
          </div>
        )}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user.first_name} {user.last_name}
          </p>
          {user.username && (
            <p className="text-xs text-gray-500">@{user.username}</p>
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