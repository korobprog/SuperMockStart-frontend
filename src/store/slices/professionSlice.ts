import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Типы
export interface SelectedProfession {
  id: string;
  userId: string;
  profession: string;
  createdAt: string;
}

export interface ProfessionState {
  selectedProfessions: SelectedProfession[];
  loading: boolean;
  error: string | null;
  currentProfession: string | null;
}

// Начальное состояние
const initialState: ProfessionState = {
  selectedProfessions: [],
  loading: false,
  error: null,
  currentProfession: null,
};

// Базовый URL для API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://api.supermock.ru/api';

// Async thunks
export const addSelectedProfession = createAsyncThunk(
  'profession/addSelectedProfession',
  async ({ userId, profession }: { userId: string; profession: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/professions/selected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, profession }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchUserProfessions = createAsyncThunk(
  'profession/fetchUserProfessions',
  async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/professions/user/${userId}`);

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

export const removeSelectedProfession = createAsyncThunk(
  'profession/removeSelectedProfession',
  async (professionId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/professions/selected/${professionId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return professionId;
  }
);

// Slice
const professionSlice = createSlice({
  name: 'profession',
  initialState,
  reducers: {
    setCurrentProfession: (state, action: PayloadAction<string | null>) => {
      state.currentProfession = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // addSelectedProfession
    builder
      .addCase(addSelectedProfession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSelectedProfession.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProfessions.unshift(action.payload);
        state.currentProfession = action.payload.profession;
      })
      .addCase(addSelectedProfession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add profession';
      });

    // fetchUserProfessions
    builder
      .addCase(fetchUserProfessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfessions.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProfessions = action.payload;
      })
      .addCase(fetchUserProfessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch professions';
      });

    // removeSelectedProfession
    builder
      .addCase(removeSelectedProfession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSelectedProfession.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProfessions = state.selectedProfessions.filter(
          (profession) => profession.id !== action.payload
        );
      })
      .addCase(removeSelectedProfession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove profession';
      });
  },
});

export const { setCurrentProfession, clearError } = professionSlice.actions;
export default professionSlice.reducer;
