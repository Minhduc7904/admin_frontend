import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/store/authSlice';
import profileReducer from '../../features/profile/store/profileSlice';
import notificationReducer from '../../features/notification/store/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    notification: notificationReducer,
  },
});
