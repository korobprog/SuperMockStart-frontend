import React from 'react';
import { cn } from '../../lib/utils';
import {
  getUserAvatarUrl,
  getAvatarFallbackText,
  isDevMode,
} from '../../utils/avatar';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?:
    | 'default'
    | 'enhanced'
    | 'fallback'
    | 'profile'
    | 'header'
    | 'card'
    | 'gradient';
  className?: string;
  onClick?: () => void;
  user?: any; // Добавляем объект пользователя для автоматического получения аватарки
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  variant = 'default',
  className,
  onClick,
  user,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const variantClasses = {
    default: 'rounded-full',
    enhanced: 'rounded-full avatar-enhanced',
    fallback: 'rounded-full avatar-fallback',
    profile: 'rounded-full profile-avatar',
    header: 'rounded-full header-avatar',
    card: 'rounded-full card-avatar',
    gradient: 'rounded-full avatar-gradient-border',
  };

  // Получаем URL аватарки
  const getAvatarUrl = (): string => {
    // Если передан src, используем его
    if (src) {
      return src;
    }

    // Если передан объект пользователя, получаем аватарку автоматически
    if (user) {
      const isDev = isDevMode();
      return getUserAvatarUrl(user, isDev);
    }

    // Fallback
    return '';
  };

  // Получаем fallback текст
  const getFallbackText = (): string => {
    if (fallback) return fallback;
    if (user) return getAvatarFallbackText(user);
    if (alt) return alt.charAt(0).toUpperCase();
    return '?';
  };

  const avatarUrl = getAvatarUrl();
  const fallbackText = getFallbackText();

  return (
    <div
      className={cn(
        'flex items-center justify-center transition-all duration-300',
        sizeClasses[size],
        variantClasses[variant],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={alt || 'Avatar'}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // При ошибке загрузки изображения показываем fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallbackSpan = target.nextElementSibling as HTMLSpanElement;
            if (fallbackSpan) {
              fallbackSpan.style.display = 'flex';
            }
          }}
        />
      )}
      <span
        className="font-semibold text-white"
        style={{ display: avatarUrl ? 'none' : 'flex' }}
      >
        {fallbackText}
      </span>
    </div>
  );
};

export default Avatar;
