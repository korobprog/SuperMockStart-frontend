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
    // Проверяем токен из Redux store
    if (auth.token) {
      return await dispatch(verifyToken() as any);
    }

    // Если токена нет в Redux, проверяем localStorage
    const storedToken = localStorage.getItem('telegram_token');
    const storedUser = localStorage.getItem('telegram_user');

    if (storedToken && storedUser && !auth.isAuthenticated) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(setToken(storedToken));
        dispatch(setUser(user));
        return await dispatch(verifyToken() as any);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('telegram_token');
        localStorage.removeItem('telegram_user');
      }
    }
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
