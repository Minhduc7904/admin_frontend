import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import authReducer from '@/features/auth/store/authSlice';
import moduleReducer from '@/features/modules/store/moduleSlice';
import { uiReducer } from '@/shared/store';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    module: moduleReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
