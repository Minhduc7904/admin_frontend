import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { superAdminApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    loadingResetPasswordByDateRange: false,
    errorResetPasswordByDateRange: null,
    resetPasswordByDateRangeResult: null,
    loadingUpdateAdminDirect: false,
    errorUpdateAdminDirect: null,
    updateAdminDirectResult: null,
    loadingCleanupUnusedMediaOlderThan30Days: false,
    errorCleanupUnusedMediaOlderThan30Days: null,
    cleanupUnusedMediaOlderThan30DaysResult: null,
    loadingGenerateMissingExamSlugs: false,
    errorGenerateMissingExamSlugs: null,
    generateMissingExamSlugsResult: null,
};

export const resetPasswordByDateRangeAsync = createAsyncThunk(
    "superAdmin/resetPasswordByDateRange",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(() => superAdminApi.resetPasswordByDateRange(payload), thunkAPI, {
            showSuccess: true,
            successTitle: "Reset mật khẩu theo khoảng ngày thành công",
            errorTitle: "Lỗi reset mật khẩu theo khoảng ngày",
        });
    }
);

export const updateAdminDirectAsync = createAsyncThunk(
    "superAdmin/updateAdminDirect",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(() => superAdminApi.updateAdminDirect(payload), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật admin trực tiếp thành công",
            errorTitle: "Lỗi cập nhật admin trực tiếp",
        });
    }
);

export const cleanupUnusedMediaOlderThan30DaysAsync = createAsyncThunk(
    "superAdmin/cleanupUnusedMediaOlderThan30Days",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(
            () => superAdminApi.cleanupUnusedMediaOlderThan30Days(payload),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Dọn dẹp media không dùng (hơn 30 ngày) thành công",
                errorTitle: "Lỗi dọn dẹp media không dùng (hơn 30 ngày)",
            }
        );
    }
);

export const generateMissingExamSlugsAsync = createAsyncThunk(
    "superAdmin/generateMissingExamSlugs",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(
            () => superAdminApi.generateMissingExamSlugs(payload),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Tao slug cho exam chua co slug thanh cong",
                errorTitle: "Loi tao slug cho exam chua co slug",
            }
        );
    }
);

export const superAdminSlice = createSlice({
    name: "superAdmin",
    initialState,
    reducers: {
        clearResetPasswordByDateRangeState: (state) => {
            state.errorResetPasswordByDateRange = null;
            state.resetPasswordByDateRangeResult = null;
        },
        clearUpdateAdminDirectState: (state) => {
            state.errorUpdateAdminDirect = null;
            state.updateAdminDirectResult = null;
        },
        clearCleanupUnusedMediaOlderThan30DaysState: (state) => {
            state.errorCleanupUnusedMediaOlderThan30Days = null;
            state.cleanupUnusedMediaOlderThan30DaysResult = null;
        },
        clearGenerateMissingExamSlugsState: (state) => {
            state.errorGenerateMissingExamSlugs = null;
            state.generateMissingExamSlugsResult = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetPasswordByDateRangeAsync.pending, (state) => {
                state.loadingResetPasswordByDateRange = true;
                state.errorResetPasswordByDateRange = null;
            })
            .addCase(resetPasswordByDateRangeAsync.fulfilled, (state, action) => {
                state.loadingResetPasswordByDateRange = false;
                state.resetPasswordByDateRangeResult = action.payload || null;
            })
            .addCase(resetPasswordByDateRangeAsync.rejected, (state, action) => {
                state.loadingResetPasswordByDateRange = false;
                state.errorResetPasswordByDateRange = action.payload;
            })
            .addCase(updateAdminDirectAsync.pending, (state) => {
                state.loadingUpdateAdminDirect = true;
                state.errorUpdateAdminDirect = null;
            })
            .addCase(updateAdminDirectAsync.fulfilled, (state, action) => {
                state.loadingUpdateAdminDirect = false;
                state.updateAdminDirectResult = action.payload || null;
            })
            .addCase(updateAdminDirectAsync.rejected, (state, action) => {
                state.loadingUpdateAdminDirect = false;
                state.errorUpdateAdminDirect = action.payload;
            })
            .addCase(cleanupUnusedMediaOlderThan30DaysAsync.pending, (state) => {
                state.loadingCleanupUnusedMediaOlderThan30Days = true;
                state.errorCleanupUnusedMediaOlderThan30Days = null;
            })
            .addCase(cleanupUnusedMediaOlderThan30DaysAsync.fulfilled, (state, action) => {
                state.loadingCleanupUnusedMediaOlderThan30Days = false;
                state.cleanupUnusedMediaOlderThan30DaysResult = action.payload || null;
            })
            .addCase(cleanupUnusedMediaOlderThan30DaysAsync.rejected, (state, action) => {
                state.loadingCleanupUnusedMediaOlderThan30Days = false;
                state.errorCleanupUnusedMediaOlderThan30Days = action.payload;
            })
            .addCase(generateMissingExamSlugsAsync.pending, (state) => {
                state.loadingGenerateMissingExamSlugs = true;
                state.errorGenerateMissingExamSlugs = null;
            })
            .addCase(generateMissingExamSlugsAsync.fulfilled, (state, action) => {
                state.loadingGenerateMissingExamSlugs = false;
                state.generateMissingExamSlugsResult = action.payload || null;
            })
            .addCase(generateMissingExamSlugsAsync.rejected, (state, action) => {
                state.loadingGenerateMissingExamSlugs = false;
                state.errorGenerateMissingExamSlugs = action.payload;
            });
    },
});

export const {
    clearResetPasswordByDateRangeState,
    clearUpdateAdminDirectState,
    clearCleanupUnusedMediaOlderThan30DaysState,
    clearGenerateMissingExamSlugsState,
} = superAdminSlice.actions;

export const selectSuperAdminLoadingResetPasswordByDateRange = (state) =>
    state.superAdmin.loadingResetPasswordByDateRange;
export const selectSuperAdminErrorResetPasswordByDateRange = (state) =>
    state.superAdmin.errorResetPasswordByDateRange;
export const selectSuperAdminResetPasswordByDateRangeResult = (state) =>
    state.superAdmin.resetPasswordByDateRangeResult;

export const selectSuperAdminLoadingUpdateAdminDirect = (state) =>
    state.superAdmin.loadingUpdateAdminDirect;
export const selectSuperAdminErrorUpdateAdminDirect = (state) =>
    state.superAdmin.errorUpdateAdminDirect;
export const selectSuperAdminUpdateAdminDirectResult = (state) =>
    state.superAdmin.updateAdminDirectResult;

export const selectSuperAdminLoadingCleanupUnusedMediaOlderThan30Days = (state) =>
    state.superAdmin.loadingCleanupUnusedMediaOlderThan30Days;
export const selectSuperAdminErrorCleanupUnusedMediaOlderThan30Days = (state) =>
    state.superAdmin.errorCleanupUnusedMediaOlderThan30Days;
export const selectSuperAdminCleanupUnusedMediaOlderThan30DaysResult = (state) =>
    state.superAdmin.cleanupUnusedMediaOlderThan30DaysResult;

export const selectSuperAdminLoadingGenerateMissingExamSlugs = (state) =>
    state.superAdmin.loadingGenerateMissingExamSlugs;
export const selectSuperAdminErrorGenerateMissingExamSlugs = (state) =>
    state.superAdmin.errorGenerateMissingExamSlugs;
export const selectSuperAdminGenerateMissingExamSlugsResult = (state) =>
    state.superAdmin.generateMissingExamSlugsResult;

export default superAdminSlice.reducer;
