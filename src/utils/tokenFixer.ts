import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  setStoredUser,
} from './auth';

interface TokenFixResult {
  fixed: boolean;
  reason?: string;
  needsRecreation?: boolean;
  newToken?: string;
}

/**
 * Диагностирует и исправляет проблемы с токеном
 */
export const diagnoseAndFixToken = async (): Promise<TokenFixResult> => {
  try {
    console.log('🔍 Starting token diagnosis and fix...');

    const token = getStoredToken();

    // Проверяем наличие токена
    if (!token) {
      console.log('❌ No token found');
      return {
        fixed: false,
        reason: 'No token found in localStorage',
        needsRecreation: true,
      };
    }

    // Проверяем формат JWT
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('❌ Invalid JWT format');
      removeStoredToken();
      return {
        fixed: false,
        reason: 'Invalid JWT format',
        needsRecreation: true,
      };
    }

    // Декодируем токен
    let payload;
    try {
      payload = JSON.parse(atob(tokenParts[1]));
      console.log('✅ Token decoded successfully');
    } catch (error) {
      console.log('❌ Failed to decode token');
      removeStoredToken();
      return {
        fixed: false,
        reason: 'Failed to decode token',
        needsRecreation: true,
      };
    }

    // Проверяем срок действия токена
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      console.log('❌ Token expired');
      removeStoredToken();
      return {
        fixed: false,
        reason: 'Token expired',
        needsRecreation: true,
      };
    }

    // Проверяем наличие userDbId
    if (!payload.userDbId) {
      console.log('❌ Token missing userDbId');
      removeStoredToken();
      return {
        fixed: false,
        reason: 'Token missing userDbId',
        needsRecreation: true,
      };
    }

    // Проверяем токен на сервере
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${API_URL}/api/auth/verify-extended-token`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Token verified on server');
        return {
          fixed: true,
          reason: 'Token is valid and working',
        };
      } else {
        console.log('❌ Token verification failed on server:', data.error);

        // Если токен недействителен на сервере, но имеет правильный формат,
        // возможно проблема с пользователем в БД
        if (data.error && data.error.includes('User not found')) {
          return {
            fixed: false,
            reason: 'User not found in database',
            needsRecreation: true,
          };
        }

        return {
          fixed: false,
          reason: `Server verification failed: ${data.error}`,
          needsRecreation: true,
        };
      }
    } catch (error) {
      console.log('❌ Server verification error:', error);
      return {
        fixed: false,
        reason: 'Server verification error',
        needsRecreation: true,
      };
    }
  } catch (error) {
    console.error('❌ Token diagnosis error:', error);
    return {
      fixed: false,
      reason: error instanceof Error ? error.message : 'Unknown error',
      needsRecreation: true,
    };
  }
};

/**
 * Принудительно очищает все токены
 */
export const forceClearAllTokens = (): void => {
  console.log('🧹 Clearing all tokens...');

  // Очищаем все возможные ключи токенов
  const tokenKeys = [
    'extended_token',
    'telegram_token',
    'authToken',
    'token',
    'user_token',
  ];
  const userKeys = ['user', 'userData', 'authUser', 'telegramUser'];

  tokenKeys.forEach((key) => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed ${key}`);
  });

  userKeys.forEach((key) => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed ${key}`);
  });

  console.log('✅ All tokens cleared');
};

/**
 * Создает новый тестовый токен (только для разработки)
 */
export const createTestToken = async (): Promise<TokenFixResult> => {
  try {
    console.log('🔧 Creating test token...');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/auth/test-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Test token created');
      setStoredToken(data.data.token);
      setStoredUser(data.data.user);

      return {
        fixed: true,
        reason: 'Test token created successfully',
        newToken: data.data.token,
      };
    } else {
      console.log('❌ Failed to create test token:', data.error);
      return {
        fixed: false,
        reason: `Failed to create test token: ${data.error}`,
      };
    }
  } catch (error) {
    console.error('❌ Test token creation error:', error);
    return {
      fixed: false,
      reason: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
