import { configureStore } from '@reduxjs/toolkit';
import professionReducer from './slices/professionSlice';
import userStatusReducer from './slices/userStatusSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    profession: professionReducer,
    userStatus: userStatusReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
