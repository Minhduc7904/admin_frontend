import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { superAdminApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    loadingResetPasswordByDateRange: false,
    errorResetPasswordByDateRange: null,
    resetPasswordByDateRangeResult: null,
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

export const superAdminSlice = createSlice({
    name: "superAdmin",
    initialState,
    reducers: {
        clearResetPasswordByDateRangeState: (state) => {
            state.errorResetPasswordByDateRange = null;
            state.resetPasswordByDateRangeResult = null;
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
            });
    },
});

export const { clearResetPasswordByDateRangeState } = superAdminSlice.actions;

export const selectSuperAdminLoadingResetPasswordByDateRange = (state) =>
    state.superAdmin.loadingResetPasswordByDateRange;
export const selectSuperAdminErrorResetPasswordByDateRange = (state) =>
    state.superAdmin.errorResetPasswordByDateRange;
export const selectSuperAdminResetPasswordByDateRangeResult = (state) =>
    state.superAdmin.resetPasswordByDateRangeResult;

export default superAdminSlice.reducer;
