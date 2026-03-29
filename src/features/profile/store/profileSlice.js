import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
  profile: null,
  loading: false,
  error: null,
  uploadingAvatar: false,
  permissions: [],
  roles: [],
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

export const uploadAvatarAsync = createAsyncThunk(
  "profile/uploadAvatar",
  async (file, thunkAPI) => {
    return handleAsyncThunk(
      () => profileApi.uploadAvatar(file),
      thunkAPI,
      {
        successTitle: "Cập nhật avatar thành công",
        errorTitle: "Cập nhật avatar thất bại",
      }
    );
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfileAsync.pending, (state) => {
        // state.profile = null;
        state.permissions = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
        const roles = action.payload.data.roles || [];
        state.roles = roles;
        if (roles.length > 0) {
          const permissionsSet = new Set();
          roles.forEach((role) => {
            const rolePermissions = role.permissions || [];
            rolePermissions.forEach((perm) => permissionsSet.add(perm));
          });
          state.permissions = Array.from(permissionsSet);
        } else {
          state.permissions = [];
        }
        state.error = null;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.permissions = [];
        state.profile = null;
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
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadAvatarAsync.pending, (state) => {
        state.uploadingAvatar = true;
        state.error = null;
      })
      .addCase(uploadAvatarAsync.fulfilled, (state, action) => {
        state.uploadingAvatar = false;
        const avatarData = action.payload?.data || {};
        const nextAvatarUrl =
          avatarData.viewUrl || avatarData.url || avatarData.downloadUrl || null;
        if (state.profile && nextAvatarUrl) {
          state.profile.avatarUrl = nextAvatarUrl;
        }
        state.error = null;
      })
      .addCase(uploadAvatarAsync.rejected, (state, action) => {
        state.uploadingAvatar = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, setProfile } = profileSlice.actions;

// Selectors
export const selectProfile = (state) => state.profile.profile;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectAvatarUploading = (state) => state.profile.uploadingAvatar;
export const selectProfileError = (state) => state.profile.error;
export const selectProfilePermissions = (state) => state.profile.permissions;
export const selectProfileRoles = (state) => state.profile.roles;

export default profileSlice.reducer;


