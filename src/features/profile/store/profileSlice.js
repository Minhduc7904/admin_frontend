import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi, mediaApi, mediaUsageApi } from "../../../core/api";
import { STORAGE_KEYS } from "../../../core/constants";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
  profile: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
  loading: false,
  error: null,
  avatarUsages: [],
  loadingAvatar: false,
  avatarDownloadUrl: null,
  loadingAvatarDownloadUrl: false,
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

export const getAvatarUsagesAsync = createAsyncThunk(
  "profile/getAvatarUsages",
  async (userId, thunkAPI) => {
    return handleAsyncThunk(
      () => mediaUsageApi.getByEntity("AVATAR", userId),
      thunkAPI, {
      showSuccess: false,
    });
  }
);

export const getAvatarDownloadUrlAsync = createAsyncThunk(
  "profile/getAvatarDownloadUrl",
  async (mediaId, thunkAPI) => {
    return handleAsyncThunk(
      () => mediaApi.getDownloadUrl(mediaId, 3600),
      thunkAPI, {
      showSuccess: false,
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
    setAvatarDownloadUrl: (state, action) => {
      state.avatarDownloadUrl = action.payload;
    },
    setLoadingAvatarDownloadUrl: (state, action) => {
      state.loadingAvatarDownloadUrl = action.payload;
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
      })
      .addCase(getAvatarUsagesAsync.pending, (state) => {
        state.loadingAvatar = true;
        state.error = null;
      })
      .addCase(getAvatarUsagesAsync.fulfilled, (state, action) => {
        state.loadingAvatar = false;
        state.avatarUsages = action.payload.data;
        state.error = null;
      })
      .addCase(getAvatarUsagesAsync.rejected, (state, action) => {
        state.loadingAvatar = false;
        state.error = action.payload;
      })
      .addCase(getAvatarDownloadUrlAsync.pending, (state) => {
        state.loadingAvatarDownloadUrl = true;
        state.error = null;
      })
      .addCase(getAvatarDownloadUrlAsync.fulfilled, (state, action) => {
        state.loadingAvatarDownloadUrl = false;
        state.avatarDownloadUrl = action.payload.data.downloadUrl;
        state.error = null;
      })
      .addCase(getAvatarDownloadUrlAsync.rejected, (state, action) => {
        state.loadingAvatarDownloadUrl = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, setProfile } = profileSlice.actions;

// Selectors
export const selectProfile = (state) => state.profile.profile;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectAvatarUsages = (state) => state.profile.avatarUsages;
export const selectAvatarLoading = (state) => state.profile.loadingAvatar;
export const selectAvatarDownloadUrl = (state) => state.profile.avatarDownloadUrl;
export const selectAvatarDownloadUrlLoading = (state) => state.profile.loadingAvatarDownloadUrl;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;


