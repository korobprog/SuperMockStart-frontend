import { configureStore } from '@reduxjs/toolkit';
import professionReducer from './slices/professionSlice';

export const store = configureStore({
  reducer: {
    profession: professionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
