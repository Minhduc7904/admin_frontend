import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../../core/api";
import { STORAGE_KEYS } from "../../../core/constants";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
  accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  loading: false,
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    return handleAsyncThunk(() => authApi.login(credentials), thunkAPI, {
      successTitle: "Đăng nhập thành công",
      successMessage: "Chào mừng bạn quay trở lại!",
      errorTitle: "Đăng nhập thất bại",
    });
  }
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    const { getState } = thunkAPI;
    return handleAsyncThunk(
      async () => {
        const { refreshToken } = getState().auth;
        if (refreshToken) {
          await authApi.logout({ refreshToken });
        }
      },
      thunkAPI,
      {
        successTitle: "Đăng xuất thành công",
        successMessage: "Hẹn gặp lại bạn!",
        errorTitle: "Đã đăng xuất",
      }
    );
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        const responseData = action.payload.data;
        const { tokens } = responseData;
        state.loading = false;
        state.accessToken = tokens.accessToken;
        state.refreshToken = tokens.refreshToken;
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;

        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      });
  },
});

export const { setCredentials, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
