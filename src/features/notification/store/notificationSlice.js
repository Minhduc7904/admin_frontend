import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationApi, studentApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  // Toast notifications (old state - không đụng chạm)
  notifications: [],
  nextId: 1,

  // User notifications from backend (new state)
  myNotifications: [],
  userNotifications: [], // For admin viewing specific user's notifications
  stats: {
    total: 0,
    unread: 0,
    read: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  userNotificationsPagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  loadingMyNotifications: false,
  loadingUserNotifications: false,
  loadingStats: false,
  loadingMarkRead: false,
  loadingMarkAllRead: false,
  loadingDelete: false,
  loadingSend: false,
  studentsForBroadcast: [],
  loadingStudentsForBroadcast: false,
  error: null,
  filters: {
    search: '',
    type: '', // SYSTEM, COURSE, LESSON, ATTENDANCE, GENERAL
    level: '', // INFO, WARNING, ERROR, SUCCESS
    isRead: '', // true, false, or empty for all
    sortBy: 'createdAt',
    sortOrder: 'desc',
    fromDate: '',
    toDate: '',
  },
  userNotificationsFilters: {
    search: '',
    type: '',
    level: '',
    isRead: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    fromDate: '',
    toDate: '',
  },
};

// Async thunks
export const getMyNotificationsAsync = createAsyncThunk(
  'notification/getMyNotifications',
  async (params, thunkAPI) => {
    return handleAsyncThunk(() => notificationApi.getMy(params), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi tải thông báo',
    });
  }
);

export const getMyStatsAsync = createAsyncThunk(
  'notification/getMyStats',
  async (_, thunkAPI) => {
    return handleAsyncThunk(() => notificationApi.getMyStats(), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi tải thống kê thông báo',
    });
  }
);

export const markNotificationReadAsync = createAsyncThunk(
  'notification/markRead',
  async (id, thunkAPI) => {
    return handleAsyncThunk(() => notificationApi.markRead(id), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi đánh dấu thông báo',
    });
  }
);

export const markAllReadAsync = createAsyncThunk(
  'notification/markAllRead',
  async (_, thunkAPI) => {
    return handleAsyncThunk(() => notificationApi.markAllRead(), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi đánh dấu thông báo',
    });
  }
);

export const deleteNotificationAsync = createAsyncThunk(
  'notification/delete',
  async (id, thunkAPI) => {
    return handleAsyncThunk(() => notificationApi.delete(id), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi xóa thông báo',
    });
  }
);

export const getUserNotificationsAsync = createAsyncThunk(
  'notification/getUserNotifications',
  async ({ userId, params }, thunkAPI) => {
    return handleAsyncThunk(() => notificationApi.getByUserId(userId, params), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi tải thông báo người dùng',
    });
  }
);

export const sendNotificationAsync = createAsyncThunk(
  'notification/send',
  async (data, thunkAPI) => {
    return handleAsyncThunk(() => notificationApi.send(data), thunkAPI, {
      showSuccess: true,
      successTitle: 'Gửi thông báo thành công',
      errorTitle: 'Lỗi gửi thông báo',
    });
  }
);

export const getAllStudentsForNotificationAsync = createAsyncThunk(
  'notification/getAllStudentsForNotification',
  async (params, thunkAPI) => {
    return handleAsyncThunk(() => studentApi.getAll(params), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Loi tai danh sach hoc sinh',
    });
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Toast notifications reducers (old - không đổi)
    addNotification: (state, action) => {
      const { type, title, message, autoHide } = action.payload;
      state.notifications.push({
        id: state.nextId++,
        type,
        title,
        message,
        autoHide: autoHide !== undefined ? autoHide : true,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // New reducers for backend notifications
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
    setUserNotificationsFilters: (state, action) => {
      state.userNotificationsFilters = { ...state.userNotificationsFilters, ...action.payload };
    },
    resetUserNotificationsFilters: (state) => {
      state.userNotificationsFilters = initialState.userNotificationsFilters;
    },
    setUserNotificationsPagination: (state, action) => {
      state.userNotificationsPagination = { ...state.userNotificationsPagination, ...action.payload };
    },
    resetUserNotificationsPagination: (state) => {
      state.userNotificationsPagination = initialState.userNotificationsPagination;
    },
    clearMyNotifications: (state) => {
      state.myNotifications = [];
    },
    clearUserNotifications: (state) => {
      state.userNotifications = [];
    },
    // Real-time notification from socket
    addRealtimeNotification: (state, action) => {
      if (!state.myNotifications) {
        state.myNotifications = [];
      }
      state.myNotifications.unshift(action.payload);
      state.stats.total += 1;
      state.stats.unread += 1;
      if (state.pagination) {
        state.pagination.total = (state.pagination.total || 0) + 1;
      }
    },
    // Update stats from socket
    updateStatsFromSocket: (state, action) => {
      state.stats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get my notifications
      .addCase(getMyNotificationsAsync.pending, (state) => {
        if (state.pagination.page === 1) {
          state.myNotifications = [];
        }
        state.loadingMyNotifications = true;
        state.error = null;
      })
      .addCase(getMyNotificationsAsync.fulfilled, (state, action) => {
        state.loadingMyNotifications = false;
        // Append for infinite scroll
        const page = action.payload?.pagination?.page || action.payload?.meta?.page || 1;
        if (page === 1) {
          state.myNotifications = action.payload.data;
        } else {
          state.myNotifications = [...state.myNotifications, ...action.payload.data];
        }
        state.pagination = action.payload.pagination || action.payload.meta || state.pagination;
        state.error = null;
      })
      .addCase(getMyNotificationsAsync.rejected, (state, action) => {
        state.myNotifications = [];
        state.loadingMyNotifications = false;
        state.error = action.payload;
      })

      // Get my stats
      .addCase(getMyStatsAsync.pending, (state) => {
        state.loadingStats = true;
      })
      .addCase(getMyStatsAsync.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload.data;
      })
      .addCase(getMyStatsAsync.rejected, (state, action) => {
        state.loadingStats = false;
        state.error = action.payload;
      })

      // Mark notification read
      .addCase(markNotificationReadAsync.pending, (state) => {
        state.loadingMarkRead = true;
        state.error = null;
      })
      .addCase(markNotificationReadAsync.fulfilled, (state, action) => {
        state.loadingMarkRead = false;
        const updatedNotification = action.payload.data;

        // Update in myNotifications
        const index = state.myNotifications.findIndex(
          (n) => n.notificationId === updatedNotification.notificationId
        );
        if (index !== -1) {
          state.myNotifications[index] = updatedNotification;
        }

        // Update stats
        if (updatedNotification.isRead) {
          state.stats.unread = Math.max(0, state.stats.unread - 1);
          state.stats.read += 1;
        }
      })
      .addCase(markNotificationReadAsync.rejected, (state, action) => {
        state.loadingMarkRead = false;
        state.error = action.payload;
      })

      // Mark all read
      .addCase(markAllReadAsync.pending, (state) => {
        state.loadingMarkAllRead = true;
        state.error = null;
      })
      .addCase(markAllReadAsync.fulfilled, (state, action) => {
        state.loadingMarkAllRead = false;
        // Mark all as read in state
        state.myNotifications = state.myNotifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        }));
        // Update stats
        state.stats.read = state.stats.total;
        state.stats.unread = 0;
      })
      .addCase(markAllReadAsync.rejected, (state, action) => {
        state.loadingMarkAllRead = false;
        state.error = action.payload;
      })

      // Delete notification
      .addCase(deleteNotificationAsync.pending, (state) => {
        state.loadingDelete = true;
        state.error = null;
      })
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        state.loadingDelete = false;
        const deletedId = action.meta.arg;

        // Find the notification before removing
        const notification = state.myNotifications.find(n => n.notificationId === deletedId);

        // Remove from myNotifications
        state.myNotifications = state.myNotifications.filter(
          (n) => n.notificationId !== deletedId
        );

        // Update stats
        state.stats.total = Math.max(0, state.stats.total - 1);
        if (notification && !notification.isRead) {
          state.stats.unread = Math.max(0, state.stats.unread - 1);
        } else if (notification && notification.isRead) {
          state.stats.read = Math.max(0, state.stats.read - 1);
        }
      })
      .addCase(deleteNotificationAsync.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
      })

      // Get user notifications (admin)
      .addCase(getUserNotificationsAsync.pending, (state) => {
        state.userNotifications = [];
        state.loadingUserNotifications = true;
        state.error = null;
      })
      .addCase(getUserNotificationsAsync.fulfilled, (state, action) => {
        state.loadingUserNotifications = false;
        state.userNotifications = action.payload.data;
        state.userNotificationsPagination = action.payload.meta;
        state.error = null;
      })
      .addCase(getUserNotificationsAsync.rejected, (state, action) => {
        state.userNotifications = [];
        state.loadingUserNotifications = false;
        state.error = action.payload;
      })

      // Get students for broadcast notification
      .addCase(getAllStudentsForNotificationAsync.pending, (state) => {
        state.studentsForBroadcast = [];
        state.loadingStudentsForBroadcast = true;
        state.error = null;
      })
      .addCase(getAllStudentsForNotificationAsync.fulfilled, (state, action) => {
        state.loadingStudentsForBroadcast = false;
        state.studentsForBroadcast = action.payload.data;
        state.error = null;
      })
      .addCase(getAllStudentsForNotificationAsync.rejected, (state, action) => {
        state.studentsForBroadcast = [];
        state.loadingStudentsForBroadcast = false;
        state.error = action.payload;
      })

      // Send notification
      .addCase(sendNotificationAsync.pending, (state) => {
        state.loadingSend = true;
        state.error = null;
      })
      .addCase(sendNotificationAsync.fulfilled, (state) => {
        state.loadingSend = false;
      })
      .addCase(sendNotificationAsync.rejected, (state, action) => {
        state.loadingSend = false;
        state.error = action.payload;
      });
  },
});

export const {
  // Old toast actions
  addNotification,
  removeNotification,
  clearNotifications,
  // New backend notification actions
  setFilters,
  resetFilters,
  setPagination,
  resetPagination,
  setUserNotificationsFilters,
  resetUserNotificationsFilters,
  setUserNotificationsPagination,
  resetUserNotificationsPagination,
  clearMyNotifications,
  clearUserNotifications,
  addRealtimeNotification,
} = notificationSlice.actions;

// Selectors
// Old toast selectors
export const selectToastNotifications = (state) => state.notification.notifications;

// New backend notification selectors
export const selectMyNotifications = (state) => state.notification.myNotifications;
export const selectUserNotifications = (state) => state.notification.userNotifications;
export const selectNotificationStats = (state) => state.notification.stats;
export const selectNotificationPagination = (state) => state.notification.pagination;
export const selectUserNotificationsPagination = (state) => state.notification.userNotificationsPagination;
export const selectLoadingMyNotifications = (state) => state.notification.loadingMyNotifications;
export const selectLoadingUserNotifications = (state) => state.notification.loadingUserNotifications;
export const selectLoadingStats = (state) => state.notification.loadingStats;
export const selectLoadingMarkRead = (state) => state.notification.loadingMarkRead;
export const selectLoadingMarkAllRead = (state) => state.notification.loadingMarkAllRead;
export const selectLoadingDelete = (state) => state.notification.loadingDelete;
export const selectLoadingSend = (state) => state.notification.loadingSend;
export const selectStudentsForBroadcast = (state) => state.notification.studentsForBroadcast;
export const selectLoadingStudentsForBroadcast = (state) => state.notification.loadingStudentsForBroadcast;
export const selectNotificationError = (state) => state.notification.error;
export const selectNotificationFilters = (state) => state.notification.filters;
export const selectUserNotificationsFilters = (state) => state.notification.userNotificationsFilters;

export default notificationSlice.reducer;
