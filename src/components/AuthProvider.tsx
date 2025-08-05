import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getStoredToken } from '../utils/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkAuth, getTestAuth, token, isAuthenticated } = useAuth();

  useEffect(() => {
    // При загрузке приложения проверяем аутентификацию
    const initializeAuth = async () => {
      try {
        // Проверяем токен в localStorage
        const storedToken = getStoredToken();

        // Если токен уже есть и пользователь аутентифицирован, не делаем лишних запросов
        if (storedToken && token && isAuthenticated) {
          console.log('🔑 Токен уже существует и валиден');
          return;
        }

        // Сначала проверяем существующий токен
        const authResult = await checkAuth();

        // Если токена нет или он невалиден, пробуем получить тестовый токен
        if (!authResult || authResult.meta.requestStatus === 'rejected') {
          console.log(
            '🔑 Токен не найден или невалиден, получаем тестовый токен'
          );
          await getTestAuth();
        }
      } catch (error) {
        console.error('❌ Ошибка инициализации аутентификации:', error);
      }
    };

    initializeAuth();
  }, []); // Убираем зависимости, чтобы useEffect выполнялся только один раз

  return <>{children}</>;
};

export default AuthProvider;
