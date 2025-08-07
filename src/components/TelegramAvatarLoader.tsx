import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import Avatar from './ui/avatar';
import { loadTelegramAvatar, isDevMode } from '../utils/avatar';
import { Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TelegramAvatarLoaderProps {
  user: any;
  onAvatarLoaded?: (avatarUrl: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

const TelegramAvatarLoader: React.FC<TelegramAvatarLoaderProps> = ({
  user,
  onAvatarLoaded,
  onError,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const isDev = isDevMode();

  // Проверяем, есть ли уже аватарка у пользователя
  useEffect(() => {
    if (user?.photo_url) {
      setAvatarUrl(user.photo_url);
    }
  }, [user]);

  const handleLoadAvatar = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // В dev режиме показываем сообщение о том, что аватарка загружена
      if (isDev) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Имитируем загрузку
        const devAvatarUrl =
          'https://api.dicebear.com/7.x/avataaars/svg?seed=devuser&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';
        setAvatarUrl(devAvatarUrl);
        onAvatarLoaded?.(devAvatarUrl);
        return;
      }

      // В продакшене загружаем аватарку из Telegram
      const loadedAvatarUrl = await loadTelegramAvatar(user);
      setAvatarUrl(loadedAvatarUrl);
      onAvatarLoaded?.(loadedAvatarUrl);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки аватарки';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleLoadAvatar();
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Avatar
          user={user}
          alt={user?.first_name || 'User'}
          size="lg"
          variant="enhanced"
        />

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user?.first_name} {user?.last_name}
          </h3>

          {user?.username && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              @{user.username}
            </p>
          )}
        </div>
      </div>

      {!avatarUrl && !loading && !error && (
        <Button
          onClick={handleLoadAvatar}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <Download className="w-4 h-4" />
          {isDev
            ? 'Загрузить аватарку (Dev)'
            : 'Загрузить аватарку из Telegram'}
        </Button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Загрузка аватарки...</span>
        </div>
      )}

      {avatarUrl && !loading && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Аватарка загружена</span>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>Ошибка: {error}</span>
          </div>
          <Button onClick={handleRetry} variant="outline" size="sm">
            Попробовать снова
          </Button>
        </div>
      )}

      {isDev && (
        <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded">
          <strong>Dev режим:</strong> Используется аватарка по умолчанию
        </div>
      )}
    </div>
  );
};

export default TelegramAvatarLoader;

