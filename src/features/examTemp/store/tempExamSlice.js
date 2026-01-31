import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tempExamApi } from "../../../core/api/tempExamApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

/* =========================
   Initial State
========================= */
const initialState = {
    currentTempExam: null,

    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,

    error: null,
};

/* =========================
   Async Thunks
========================= */

// ===== GET BY SESSION =====
export const getTempExamBySessionAsync = createAsyncThunk(
    "tempExam/getBySession",
    async (sessionId, thunkAPI) => {
        return handleAsyncThunk(
            () => tempExamApi.getBySessionId(sessionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải thông tin đề thi tạm",
            }
        );
    }
);

// ===== CREATE =====
export const createTempExamAsync = createAsyncThunk(
    "tempExam/create",
    async ({ sessionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => tempExamApi.create(sessionId, data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Tạo đề thi tạm thành công",
                errorTitle: "Lỗi tạo đề thi tạm",
            }
        );
    }
);

// ===== UPDATE =====
export const updateTempExamAsync = createAsyncThunk(
    "tempExam/update",
    async ({ tempExamId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => tempExamApi.update(tempExamId, data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật đề thi tạm thành công",
                errorTitle: "Lỗi cập nhật đề thi tạm",
            }
        );
    }
);

/* =========================
   Slice
========================= */
export const tempExamSlice = createSlice({
    name: "tempExam",
    initialState,
    reducers: {
        clearCurrentTempExam: (state) => {
            state.currentTempExam = null;
        },
        setCurrentTempExam: (state, action) => {
            state.currentTempExam = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // ===== GET BY SESSION =====
            .addCase(getTempExamBySessionAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getTempExamBySessionAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentTempExam = action.payload.data;
            })
            .addCase(getTempExamBySessionAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // ===== CREATE =====
            .addCase(createTempExamAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createTempExamAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.currentTempExam = action.payload.data;
            })
            .addCase(createTempExamAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // ===== UPDATE =====
            .addCase(updateTempExamAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateTempExamAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                state.currentTempExam = action.payload.data;
            })
            .addCase(updateTempExamAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            });
    },
});

/* =========================
   Actions & Selectors
========================= */
export const {
    clearCurrentTempExam,
    setCurrentTempExam,
} = tempExamSlice.actions;

export const selectCurrentTempExam = (state) => state.tempExam.currentTempExam;
export const selectTempExamLoadingGet = (state) => state.tempExam.loadingGet;
export const selectTempExamLoadingCreate = (state) => state.tempExam.loadingCreate;
export const selectTempExamLoadingUpdate = (state) => state.tempExam.loadingUpdate;
export const selectTempExamError = (state) => state.tempExam.error;

export default tempExamSlice.reducer;
