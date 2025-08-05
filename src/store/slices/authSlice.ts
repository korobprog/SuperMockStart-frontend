import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser,
  debouncedGetTestToken,
} from '../../utils/auth';
import { RootState } from '../index';

// Типы
export interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Начальное состояние
const getInitialState = (): AuthState => {
  // Получаем токен и пользователя из localStorage при инициализации
  const savedToken = getStoredToken();
  const savedUser = getStoredUser();

  return {
    token: savedToken,
    user: savedUser,
    loading: false,
    error: null,
    isAuthenticated: !!savedToken,
  };
};

// Async thunks
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;

    if (!token) {
      throw new Error('No token found');
    }

    const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

    const response = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    const data = await response.json();
    return data.data;
  }
);

export const loginWithTelegram = createAsyncThunk(
  'auth/loginWithTelegram',
  async (initData: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

    const response = await fetch(`${API_URL}/api/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      throw new Error('Telegram authentication failed');
    }

    const data = await response.json();
    return data.data;
  }
);

export const getTestToken = createAsyncThunk(
  'auth/getTestToken',
  async (_, { getState }) => {
    const state = getState() as RootState;

    // Если токен уже есть, не делаем повторный запрос
    if (state.auth.token && state.auth.isAuthenticated) {
      console.log(
        '🔑 Токен уже существует, пропускаем запрос тестового токена'
      );
      return {
        token: state.auth.token,
        user: state.auth.user,
      };
    }

    // Используем debounce для предотвращения множественных запросов
    return debouncedGetTestToken(async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      const response = await fetch(`${API_URL}/api/auth/test-token`);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Слишком много запросов. Попробуйте позже.');
        }
        throw new Error(`Failed to get test token: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    });
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      // Сохраняем в localStorage через утилиту
      setStoredToken(action.payload);
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      // Сохраняем пользователя в localStorage через утилиту
      setStoredUser(action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Очищаем localStorage через утилиту
      removeStoredToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // verifyToken
    builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        // Обновляем пользователя в localStorage через утилиту
        setStoredUser(action.payload);
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Token verification failed';
        state.isAuthenticated = false;
        // Очищаем токен при неудачной верификации
        state.token = null;
        removeStoredToken();
      });

    // loginWithTelegram
    builder
      .addCase(loginWithTelegram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithTelegram.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // Сохраняем в localStorage через утилиты
        setStoredToken(action.payload.token);
        setStoredUser(action.payload.user);
      })
      .addCase(loginWithTelegram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Telegram authentication failed';
      });

    // getTestToken
    builder
      .addCase(getTestToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTestToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // Сохраняем в localStorage через утилиты
        setStoredToken(action.payload.token);
        setStoredUser(action.payload.user);
      })
      .addCase(getTestToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get test token';
      });
  },
});

export const { setToken, setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
