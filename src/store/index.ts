import { configureStore } from '@reduxjs/toolkit';
import professionReducer from './slices/professionSlice';
import userStatusReducer from './slices/userStatusSlice';

export const store = configureStore({
  reducer: {
    profession: professionReducer,
    userStatus: userStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
