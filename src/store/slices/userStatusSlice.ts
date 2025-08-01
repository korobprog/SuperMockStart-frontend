import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Типы
export enum UserStatus {
  INTERVIEWER = 'INTERVIEWER',
  CANDIDATE = 'CANDIDATE',
}

export enum InterviewStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED',
}

export interface UserStatusState {
  currentStatus: UserStatus | null;
  loading: boolean;
  error: string | null;
  availableCandidates: any[];
  userInterviews: any[];
}

// Начальное состояние
const initialState: UserStatusState = {
  currentStatus: null,
  loading: false,
  error: null,
  availableCandidates: [],
  userInterviews: [],
};

// Базовый URL для API
const API_BASE_URL = 'http://localhost:3001';

// Получение токена из localStorage или генерация тестового
const getAuthToken = async () => {
  let token = localStorage.getItem('authToken');

  if (!token) {
    try {
      // Получаем тестовый токен
      const response = await fetch(`${API_BASE_URL}/api/auth/test-token`);
      if (response.ok) {
        const data = await response.json();
        token = data.data.token;
        localStorage.setItem('authToken', token);
        if (data.data.user.id) {
          localStorage.setItem('userId', data.data.user.id.toString());
        }
        console.log('Тестовый токен получен:', token);
      }
    } catch (error) {
      console.error('Ошибка получения тестового токена:', error);
    }
  }

  return token;
};

// Async thunks
export const fetchUserStatus = createAsyncThunk(
  'userStatus/fetchUserStatus',
  async () => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/user-status/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.data;
  }
);

export const updateUserStatus = createAsyncThunk(
  'userStatus/updateUserStatus',
  async ({ userId, status }: { userId: string; status: UserStatus }) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/user-status/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.data;
  }
);

export const fetchAvailableCandidates = createAsyncThunk(
  'userStatus/fetchAvailableCandidates',
  async () => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/user-status/candidates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.data;
  }
);

export const fetchUserInterviews = createAsyncThunk(
  'userStatus/fetchUserInterviews',
  async () => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/user-status/interviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.data;
  }
);

// Slice
const userStatusSlice = createSlice({
  name: 'userStatus',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStatus: (state, action: PayloadAction<UserStatus>) => {
      state.currentStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchUserStatus
    builder
      .addCase(fetchUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStatus = action.payload.status;
      })
      .addCase(fetchUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user status';
      });

    // updateUserStatus
    builder
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStatus = action.payload.status;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user status';
      });

    // fetchAvailableCandidates
    builder
      .addCase(fetchAvailableCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCandidates = action.payload;
      })
      .addCase(fetchAvailableCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch candidates';
      });

    // fetchUserInterviews
    builder
      .addCase(fetchUserInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userInterviews = action.payload;
      })
      .addCase(fetchUserInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch interviews';
      });
  },
});

export const { clearError, setCurrentStatus } = userStatusSlice.actions;
export default userStatusSlice.reducer;
