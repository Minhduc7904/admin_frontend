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
            });
    },
});

export const {
    clearResetPasswordByDateRangeState,
    clearUpdateAdminDirectState,
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

export default superAdminSlice.reducer;
