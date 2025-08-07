import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  verifyToken,
  loginWithTelegram,
  getTestToken,
  logout as logoutAction,
  setToken,
  setUser,
  clearError,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (initData: string) => {
    return await dispatch(loginWithTelegram(initData) as any);
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const checkAuth = async () => {
    console.log('🔍 Checking auth status...');

    // Проверяем токен из Redux store
    if (auth.token) {
      console.log('🔑 Token found in Redux store');
      try {
        return await dispatch(verifyToken() as any);
      } catch (error) {
        console.error('Error verifying token:', error);
        // Если токен недействителен, очищаем состояние
        dispatch(logoutAction());
        return { meta: { requestStatus: 'rejected' } };
      }
    }

    // Если токена нет в Redux, проверяем localStorage
    const storedToken = localStorage.getItem('telegram_token');
    const storedUser = localStorage.getItem('user');

    console.log('🔍 Checking localStorage:', {
      storedToken: storedToken ? 'present' : 'missing',
      storedUser: storedUser ? 'present' : 'missing',
    });

    if (storedToken && storedUser && !auth.isAuthenticated) {
      try {
        const user = JSON.parse(storedUser);

        console.log('✅ Found stored user:', user);

        // Обновляем Redux store
        dispatch(setToken(storedToken));
        dispatch(setUser(user));

        // Проверяем валидность токена на сервере только если есть подключение к БД
        try {
          return await dispatch(verifyToken() as any);
        } catch (error) {
          console.error('Error verifying token from localStorage:', error);
          // Если сервер недоступен, но у нас есть данные пользователя, считаем авторизованным
          if (user && user.id) {
            console.log(
              '✅ Using cached user data due to server unavailability'
            );
            return { meta: { requestStatus: 'fulfilled' } };
          }
          return { meta: { requestStatus: 'rejected' } };
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('telegram_token');
        localStorage.removeItem('user');
        return { meta: { requestStatus: 'rejected' } };
      }
    }

    console.log('❌ No valid auth data found');
    // Если нет сохраненных данных, возвращаем пустой результат
    return { meta: { requestStatus: 'rejected' } };
  };

  const getTestAuth = async () => {
    return await dispatch(getTestToken() as any);
  };

  const updateToken = (token: string) => {
    dispatch(setToken(token));
  };

  const updateUser = (user: any) => {
    dispatch(setUser(user));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    // Состояние
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,

    // Действия
    login,
    logout,
    checkAuth,
    getTestAuth,
    updateToken,
    updateUser,
    clearAuthError,
  };
};
