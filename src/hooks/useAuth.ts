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
    if (auth.token) {
      return await dispatch(verifyToken() as any);
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
