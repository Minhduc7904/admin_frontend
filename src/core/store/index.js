import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/store/authSlice';
import profileReducer from '../../features/profile/store/profileSlice';
import notificationReducer from '../../features/notification/store/notificationSlice';
import roleReducer from '../../features/role/store/roleSlice';
import permissionReducer from '../../features/permission/store/permissionSlice';
import auditLogReducer from '../../features/adminAuditLog/store/auditLogSlice';
import mediaReducer from '../../features/media/store/mediaSlice';
import mediaUsageReducer from '../../features/mediaUsage/store/mediaUsageSlice';
import adminReducer from '../../features/admin/store/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    notification: notificationReducer,
    role: roleReducer,
    permission: permissionReducer,
    auditLog: auditLogReducer,
    media: mediaReducer,
    mediaUsage: mediaUsageReducer,
    admin: adminReducer,
  },
});
