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
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser,
  isValidToken,
} from '../utils/auth';

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
    if (auth.token && isValidToken(auth.token)) {
      console.log('🔑 Valid token found in Redux store');
      try {
        return await dispatch(verifyToken() as any);
      } catch (error) {
        console.error('Error verifying token from Redux:', error);
        // Если токен недействителен, очищаем состояние
        dispatch(logoutAction());
        return { meta: { requestStatus: 'rejected' } };
      }
    }

    // Если токена нет в Redux, проверяем localStorage
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    console.log('🔍 Checking localStorage:', {
      storedToken: storedToken ? 'present' : 'missing',
      storedUser: storedUser ? 'present' : 'missing',
    });

    if (storedToken && storedUser && !auth.isAuthenticated) {
      try {
        console.log('✅ Found stored user:', storedUser);

        // Обновляем Redux store
        dispatch(setToken(storedToken));
        dispatch(setUser(storedUser));

        // Проверяем валидность токена на сервере
        try {
          return await dispatch(verifyToken() as any);
        } catch (error) {
          console.error('Error verifying token from localStorage:', error);
          // Если сервер недоступен, но у нас есть данные пользователя, считаем авторизованным
          if (storedUser && storedUser.id) {
            console.log(
              '✅ Using cached user data due to server unavailability'
            );
            return { meta: { requestStatus: 'fulfilled' } };
          }
          return { meta: { requestStatus: 'rejected' } };
        }
      } catch (error) {
        console.error('Error processing stored auth data:', error);
        removeStoredToken();
        return { meta: { requestStatus: 'rejected' } };
      }
    }

    console.log('❌ No valid auth data found');
    return { meta: { requestStatus: 'rejected' } };
  };

  const getTestAuth = async () => {
    return await dispatch(getTestToken() as any);
  };

  const updateToken = (token: string) => {
    if (isValidToken(token)) {
      dispatch(setToken(token));
      setStoredToken(token);
    } else {
      console.error('Invalid token provided to updateToken:', token);
    }
  };

  const updateUser = (user: any) => {
    if (user && typeof user === 'object') {
      dispatch(setUser(user));
      setStoredUser(user);
    } else {
      console.error('Invalid user provided to updateUser:', user);
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    token: auth.token,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    login,
    logout,
    checkAuth,
    getTestAuth,
    updateToken,
    updateUser,
    clearAuthError,
  };
};
