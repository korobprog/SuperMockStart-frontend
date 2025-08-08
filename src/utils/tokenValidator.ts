import { getStoredToken } from './auth';

interface TokenValidationResult {
  isValid: boolean;
  error?: string;
  user?: any;
  token?: string;
}

/**
 * Проверяет валидность токена на сервере
 */
export const validateTokenOnServer =
  async (): Promise<TokenValidationResult> => {
    try {
      const token = getStoredToken();

      if (!token) {
        return {
          isValid: false,
          error: 'No token found in localStorage',
        };
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      console.log('🔍 Testing token validation on server...');
      console.log('🔍 API URL:', API_URL);
      console.log('🔍 Token length:', token.length);

      // Проверяем токен через API
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 Server response status:', response.status);
      console.log(
        '🔍 Server response headers:',
        Object.fromEntries(response.headers.entries())
      );

      const data = await response.json();
      console.log('🔍 Server response data:', data);

      if (response.ok && data.success) {
        return {
          isValid: true,
          user: data.data?.user,
          token: token,
        };
      } else {
        return {
          isValid: false,
          error:
            data.error || `HTTP ${response.status}: ${response.statusText}`,
          token: token,
        };
      }
    } catch (error) {
      console.error('❌ Token validation error:', error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  };

/**
 * Проверяет доступ к API формы
 */
export const validateFormApiAccess =
  async (): Promise<TokenValidationResult> => {
    try {
      const token = getStoredToken();

      if (!token) {
        return {
          isValid: false,
          error: 'No token found in localStorage',
        };
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      console.log('🔍 Testing form API access...');
      console.log('🔍 API URL:', API_URL);
      console.log('🔍 Token length:', token.length);

      // Проверяем доступ к API формы
      const response = await fetch(`${API_URL}/api/form`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 Form API response status:', response.status);
      console.log(
        '🔍 Form API response headers:',
        Object.fromEntries(response.headers.entries())
      );

      const data = await response.json();
      console.log('🔍 Form API response data:', data);

      if (response.ok) {
        return {
          isValid: true,
          user: data.data,
          token: token,
        };
      } else {
        return {
          isValid: false,
          error:
            data.error || `HTTP ${response.status}: ${response.statusText}`,
          token: token,
        };
      }
    } catch (error) {
      console.error('❌ Form API access error:', error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  };

/**
 * Полная диагностика токена
 */
export const diagnoseToken = async (): Promise<{
  tokenExists: boolean;
  tokenValid: boolean;
  serverValid: boolean;
  formApiAccess: boolean;
  errors: string[];
}> => {
  const result = {
    tokenExists: false,
    tokenValid: false,
    serverValid: false,
    formApiAccess: false,
    errors: [] as string[],
  };

  try {
    // 1. Проверяем наличие токена
    const token = getStoredToken();
    result.tokenExists = !!token;

    if (!token) {
      result.errors.push('Токен не найден в localStorage');
      return result;
    }

    // 2. Проверяем формат токена
    const tokenParts = token.split('.');
    result.tokenValid = tokenParts.length === 3;

    if (!result.tokenValid) {
      result.errors.push('Токен имеет неправильный формат JWT');
      return result;
    }

    // 3. Проверяем токен на сервере
    const serverValidation = await validateTokenOnServer();
    result.serverValid = serverValidation.isValid;

    if (!result.serverValid) {
      result.errors.push(
        `Ошибка проверки токена на сервере: ${serverValidation.error}`
      );
    }

    // 4. Проверяем доступ к API формы
    const formValidation = await validateFormApiAccess();
    result.formApiAccess = formValidation.isValid;

    if (!result.formApiAccess) {
      result.errors.push(`Ошибка доступа к API формы: ${formValidation.error}`);
    }

    return result;
  } catch (error) {
    result.errors.push(
      `Ошибка диагностики: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    return result;
  }
};
