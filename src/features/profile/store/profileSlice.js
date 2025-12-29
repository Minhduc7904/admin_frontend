import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi } from "../../../core/api";
import { STORAGE_KEYS } from "../../../core/constants";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
  profile: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
  loading: false,
  error: null,
};

// Async thunks
export const getProfileAsync = createAsyncThunk(
  "profile/getProfile",
  async (_, thunkAPI) => {
    return handleAsyncThunk(() => profileApi.getProfile(), thunkAPI, {
      showSuccess: false, // Không hiện thông báo khi lấy profile
      errorTitle: "Lỗi tải thông tin",
    });
  }
);

export const updateProfileAsync = createAsyncThunk(
  "profile/updateProfile",
  async (data, thunkAPI) => {
    return handleAsyncThunk(() => profileApi.updateProfile(data), thunkAPI, {
      successTitle: "Cập nhật thành công",
      successMessage: "Thông tin của bạn đã được cập nhật",
      errorTitle: "Cập nhật thất bại",
    });
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
        state.error = null;

        // Lưu vào localStorage
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(action.payload.data)
        );
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
        state.error = null;

        // Cập nhật localStorage
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(action.payload.data)
        );
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, setProfile } = profileSlice.actions;

// Selectors
export const selectProfile = (state) => state.profile.profile;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;


