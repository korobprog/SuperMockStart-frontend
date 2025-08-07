import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser,
  debouncedGetTestToken,
  cleanupInvalidData,
} from '../../utils/auth';
import { createUserWithAvatar, isDevMode } from '../../utils/avatar';
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
  // Очищаем некорректные данные из localStorage
  cleanupInvalidData();

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

    console.log(
      '🔍 Sending verifyToken request with token:',
      token.substring(0, 20) + '...'
    );

    const response = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('🔍 verifyToken response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Token verification failed');
    }

    // Возвращаем весь ответ от сервера
    return data;
  }
);

export const loginWithTelegram = createAsyncThunk(
  'auth/loginWithTelegram',
  async (initData: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

    console.log(
      '🔍 Sending loginWithTelegram request with initData:',
      initData.substring(0, 50) + '...'
    );

    const response = await fetch(`${API_URL}/api/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    });

    const data = await response.json();
    console.log('🔍 loginWithTelegram response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Telegram authentication failed');
    }

    // Обрабатываем пользователя с аватаркой
    if (data.data?.user || data.user) {
      const user = data.data?.user || data.user;
      const isDev = isDevMode();
      const userWithAvatar = createUserWithAvatar(user, isDev);

      return {
        ...data,
        data: data.data
          ? { ...data.data, user: userWithAvatar }
          : { ...data, user: userWithAvatar },
        user: userWithAvatar,
      };
    }

    // Возвращаем весь ответ от сервера
    return data;
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
      const API_URL =
        import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

      console.log('🔍 Sending getTestToken request');

      const response = await fetch(`${API_URL}/api/auth/test-token`);

      const data = await response.json();
      console.log('🔍 getTestToken response:', data);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Слишком много запросов. Попробуйте позже.');
        }
        throw new Error(
          data.error || `Failed to get test token: ${response.status}`
        );
      }

      // Обрабатываем пользователя с аватаркой для dev режима
      if (data.data?.user || data.user) {
        const user = data.data?.user || data.user;
        const isDev = isDevMode();
        const userWithAvatar = createUserWithAvatar(user, isDev);

        return {
          ...data,
          data: data.data
            ? { ...data.data, user: userWithAvatar }
            : { ...data, user: userWithAvatar },
          user: userWithAvatar,
        };
      }

      // Возвращаем весь ответ от сервера
      return data;
    });
  }
);

export const loginWithTelegramWidget = createAsyncThunk(
  'auth/loginWithTelegramWidget',
  async (widgetData: any) => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

    console.log('🔍 Sending loginWithTelegramWidget request:', widgetData);

    const response = await fetch(`${API_URL}/api/auth/telegram-widget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(widgetData),
    });

    const data = await response.json();
    console.log('🔍 loginWithTelegramWidget response:', data);

    if (!response.ok) {
      console.error('❌ Backend auth error:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error,
      });
      throw new Error(data.error || 'Invalid Telegram Widget data');
    }

    // Обрабатываем пользователя с аватаркой
    if (data.data?.user || data.user) {
      const user = data.data?.user || data.user;
      const isDev = isDevMode();
      const userWithAvatar = createUserWithAvatar(user, isDev);

      return {
        ...data,
        data: data.data
          ? { ...data.data, user: userWithAvatar }
          : { ...data, user: userWithAvatar },
        user: userWithAvatar,
      };
    }

    // Возвращаем весь ответ от сервера
    return data;
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
      // Проверяем валидность объекта пользователя
      if (
        action.payload &&
        typeof action.payload === 'object' &&
        action.payload.id &&
        action.payload.first_name
      ) {
        // Обрабатываем пользователя с аватаркой
        const isDev = isDevMode();
        const userWithAvatar = createUserWithAvatar(action.payload, isDev);

        state.user = userWithAvatar;
        // Сохраняем пользователя в localStorage через утилиту
        setStoredUser(userWithAvatar);
      } else {
        console.error(
          'Попытка установить некорректного пользователя:',
          action.payload
        );
        state.user = null;
        // Очищаем localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
      }
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

        // Подробное логирование для отладки
        console.log('verifyToken.fulfilled payload:', action.payload);

        // Проверяем структуру ответа
        if (action.payload && typeof action.payload === 'object') {
          // Если payload содержит data с пользователем
          if (action.payload.data && typeof action.payload.data === 'object') {
            const userData = action.payload.data;
            if (userData.id && userData.first_name) {
              state.user = userData;
              state.isAuthenticated = true;
              setStoredUser(userData);
              console.log('✅ Пользователь успешно верифицирован:', userData);
            } else {
              console.error(
                '❌ Некорректные данные пользователя в payload.data:',
                userData
              );
              state.user = null;
              state.isAuthenticated = false;
            }
          }
          // Если payload напрямую содержит пользователя (для обратной совместимости)
          else if (action.payload.id && action.payload.first_name) {
            state.user = action.payload;
            state.isAuthenticated = true;
            setStoredUser(action.payload);
            console.log(
              '✅ Пользователь успешно верифицирован (legacy):',
              action.payload
            );
          }
          // Если payload содержит success: false
          else if (action.payload.success === false) {
            console.error(
              '❌ Верификация токена не удалась:',
              action.payload.error
            );
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            removeStoredToken();
          }
          // Неизвестная структура payload
          else {
            console.error('❌ Неизвестная структура payload:', action.payload);
            state.user = null;
            state.isAuthenticated = false;
          }
        } else {
          console.error(
            '❌ Некорректный payload из verifyToken:',
            action.payload
          );
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        const errorMessage =
          action.error.message || 'Token verification failed';
        state.error = errorMessage;
        state.isAuthenticated = false;
        state.user = null;
        // Очищаем токен при неудачной верификации
        state.token = null;
        removeStoredToken();
        console.error('❌ verifyToken.rejected:', {
          error: action.error,
          message: errorMessage,
          payload: action.payload,
        });
      });

    // loginWithTelegram
    builder
      .addCase(loginWithTelegram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithTelegram.fulfilled, (state, action) => {
        state.loading = false;

        console.log('🔍 loginWithTelegram.fulfilled payload:', action.payload);

        // Проверяем структуру ответа
        if (action.payload && typeof action.payload === 'object') {
          // Если payload содержит data с токеном и пользователем
          if (
            action.payload.data &&
            action.payload.data.token &&
            action.payload.data.user
          ) {
            const { token, user } = action.payload.data;
            if (user && user.id && user.first_name) {
              state.token = token;
              state.user = user;
              state.isAuthenticated = true;
              setStoredToken(token);
              setStoredUser(user);
              console.log('✅ Telegram авторизация успешна:', user);
            } else {
              console.error(
                '❌ Некорректные данные пользователя в loginWithTelegram:',
                user
              );
              state.user = null;
              state.isAuthenticated = false;
            }
          }
          // Если payload напрямую содержит токен и пользователя (для обратной совместимости)
          else if (action.payload.token && action.payload.user) {
            const { token, user } = action.payload;
            if (user && user.id && user.first_name) {
              state.token = token;
              state.user = user;
              state.isAuthenticated = true;
              setStoredToken(token);
              setStoredUser(user);
              console.log('✅ Telegram авторизация успешна (legacy):', user);
            } else {
              console.error(
                '❌ Некорректные данные пользователя в loginWithTelegram (legacy):',
                user
              );
              state.user = null;
              state.isAuthenticated = false;
            }
          }
          // Если payload содержит success: false
          else if (action.payload.success === false) {
            console.error(
              '❌ Telegram авторизация не удалась:',
              action.payload.error
            );
            state.user = null;
            state.isAuthenticated = false;
          }
          // Неизвестная структура payload
          else {
            console.error(
              '❌ Неизвестная структура payload в loginWithTelegram:',
              action.payload
            );
            state.user = null;
            state.isAuthenticated = false;
          }
        } else {
          console.error(
            '❌ Некорректный payload из loginWithTelegram:',
            action.payload
          );
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginWithTelegram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Telegram authentication failed';
      });

    // loginWithTelegramWidget
    builder
      .addCase(loginWithTelegramWidget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithTelegramWidget.fulfilled, (state, action) => {
        state.loading = false;

        console.log(
          '🔍 loginWithTelegramWidget.fulfilled payload:',
          action.payload
        );

        // Проверяем структуру ответа
        if (action.payload && typeof action.payload === 'object') {
          // Если payload содержит data с токеном и пользователем
          if (
            action.payload.data &&
            action.payload.data.token &&
            action.payload.data.user
          ) {
            const { token, user } = action.payload.data;
            if (user && user.id && user.first_name) {
              state.token = token;
              state.user = user;
              state.isAuthenticated = true;
              setStoredToken(token);
              setStoredUser(user);
              console.log('✅ Telegram Widget авторизация успешна:', user);
            } else {
              console.error(
                '❌ Некорректные данные пользователя в loginWithTelegramWidget:',
                user
              );
              state.user = null;
              state.isAuthenticated = false;
            }
          }
          // Если payload напрямую содержит токен и пользователя (для обратной совместимости)
          else if (action.payload.token && action.payload.user) {
            const { token, user } = action.payload;
            if (user && user.id && user.first_name) {
              state.token = token;
              state.user = user;
              state.isAuthenticated = true;
              setStoredToken(token);
              setStoredUser(user);
              console.log(
                '✅ Telegram Widget авторизация успешна (legacy):',
                user
              );
            } else {
              console.error(
                '❌ Некорректные данные пользователя в loginWithTelegramWidget (legacy):',
                user
              );
              state.user = null;
              state.isAuthenticated = false;
            }
          }
          // Если payload содержит success: false
          else if (action.payload.success === false) {
            console.error(
              '❌ Telegram Widget авторизация не удалась:',
              action.payload.error
            );
            state.user = null;
            state.isAuthenticated = false;
          }
          // Неизвестная структура payload
          else {
            console.error(
              '❌ Неизвестная структура payload в loginWithTelegramWidget:',
              action.payload
            );
            state.user = null;
            state.isAuthenticated = false;
          }
        } else {
          console.error(
            '❌ Некорректный payload из loginWithTelegramWidget:',
            action.payload
          );
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginWithTelegramWidget.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Telegram Widget authentication failed';
      });

    // getTestToken
    builder
      .addCase(getTestToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTestToken.fulfilled, (state, action) => {
        state.loading = false;

        console.log('🔍 getTestToken.fulfilled payload:', action.payload);

        // Проверяем структуру ответа
        if (action.payload && typeof action.payload === 'object') {
          // Если payload содержит data с токеном и пользователем
          if (
            action.payload.data &&
            action.payload.data.token &&
            action.payload.data.user
          ) {
            const { token, user } = action.payload.data;
            if (user && user.id && user.first_name) {
              state.token = token;
              state.user = user;
              state.isAuthenticated = true;
              setStoredToken(token);
              setStoredUser(user);
              console.log('✅ Тестовый токен получен:', user);
            } else {
              console.error(
                '❌ Некорректные данные пользователя в getTestToken:',
                user
              );
              state.user = null;
              state.isAuthenticated = false;
            }
          }
          // Если payload напрямую содержит токен и пользователя (для обратной совместимости)
          else if (action.payload.token && action.payload.user) {
            const { token, user } = action.payload;
            if (user && user.id && user.first_name) {
              state.token = token;
              state.user = user;
              state.isAuthenticated = true;
              setStoredToken(token);
              setStoredUser(user);
              console.log('✅ Тестовый токен получен (legacy):', user);
            } else {
              console.error(
                '❌ Некорректные данные пользователя в getTestToken (legacy):',
                user
              );
              state.user = null;
              state.isAuthenticated = false;
            }
          }
          // Если payload содержит success: false
          else if (action.payload.success === false) {
            console.error(
              '❌ Получение тестового токена не удалось:',
              action.payload.error
            );
            state.user = null;
            state.isAuthenticated = false;
          }
          // Неизвестная структура payload
          else {
            console.error(
              '❌ Неизвестная структура payload в getTestToken:',
              action.payload
            );
            state.user = null;
            state.isAuthenticated = false;
          }
        } else {
          console.error(
            '❌ Некорректный payload из getTestToken:',
            action.payload
          );
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(getTestToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get test token';
      });
  },
});

export const { setToken, setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
