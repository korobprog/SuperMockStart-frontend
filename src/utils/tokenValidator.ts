import { } from './auth';

interface TokenValidationResult {
  isValid: boolean;
  error?: string;
  user?: any;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const validateSessionOnServer = async (): Promise<TokenValidationResult> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/session`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.success === false) {
      return { isValid: false, error: data?.error || 'Session invalid' };
    }
    if (data?.data?.authenticated) {
      return { isValid: true, user: data?.data?.user };
    }
    return { isValid: false, error: 'Not authenticated' };
  } catch (error) {
    return { isValid: false, error: error instanceof Error ? error.message : 'Network error' };
  }
};

/**
 * Проверяет доступ к API формы
 */
export const validateFormApiAccess = async (): Promise<TokenValidationResult> => {
  try {
    const response = await fetch(`${API_URL}/api/form`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      return { isValid: true, user: data.data };
    } else {
      return {
        isValid: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
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
    // Session-based diagnostics
    const session = await validateSessionOnServer();
    result.tokenExists = !!session.isValid; // semantics preserved for UI
    result.tokenValid = session.isValid;
    result.serverValid = session.isValid;

    if (!session.isValid) {
      result.errors.push(`Сессия недействительна: ${session.error || 'нет cookie'}`);
      return result;
    }

    const formValidation = await validateFormApiAccess();
    result.formApiAccess = formValidation.isValid;
    if (!result.formApiAccess) {
      result.errors.push(`Ошибка доступа к API формы: ${formValidation.error}`);
    }

    return result;
  } catch (error) {
    result.errors.push(
      `Ошибка диагностики: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return result;
  }
};
