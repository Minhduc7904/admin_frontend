import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";
import { userApi } from "../../../core/api/userApi";

const initialState = {
    loadingToggleActivation: false,
    error: null,
};

export const toggleUserActivationAsync = createAsyncThunk(
    "user/toggleActivation",
    async (userId, thunkAPI) => {
        return handleAsyncThunk(() => userApi.toggleActivation(userId), thunkAPI, {
            showSuccess: true,
            successMessage: "Đổi trạng thái người dùng thành công",
            successTitle: "Thành công",
        });
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(toggleUserActivationAsync.pending, (state) => {
                state.loadingToggleActivation = true;
                state.error = null;
            })
            .addCase(toggleUserActivationAsync.fulfilled, (state) => {
                state.loadingToggleActivation = false;
            })
            .addCase(toggleUserActivationAsync.rejected, (state, action) => {
                state.loadingToggleActivation = false;
                state.error = action.payload;
            });
    },
});

export const selectLoadingToggleActivation = (state) => state.user.loadingToggleActivation;

export const userReducer = userSlice.reducer;
