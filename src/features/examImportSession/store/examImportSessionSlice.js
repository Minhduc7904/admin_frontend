import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { examImportSessionApi } from "../../../core/api/examImportSessionApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

/* =========================
   Initial State
========================= */
const initialState = {
    sessions: [],
    currentSession: null,

    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },

    loadingGet: false,
    loadingCreate: false,

    error: null,

    filters: {
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

/* =========================
   Async Thunks
========================= */

// ===== LIST =====
export const getExamImportSessionsAsync = createAsyncThunk(
    "examImportSession/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(
            () => examImportSessionApi.getAll(params),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải danh sách phiên import đề thi",
            }
        );
    }
);

// ===== DETAIL =====
export const getExamImportSessionByIdAsync = createAsyncThunk(
    "examImportSession/getById",
    async (sessionId, thunkAPI) => {
        return handleAsyncThunk(
            () => examImportSessionApi.getById(sessionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải chi tiết phiên import đề thi",
            }
        );
    }
);

// ===== CREATE =====
export const createExamImportSessionAsync = createAsyncThunk(
    "examImportSession/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => examImportSessionApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo phiên import đề thi thành công",
            errorTitle: "Lỗi tạo phiên import đề thi",
        });
    }
);

/* =========================
   Slice
========================= */
export const examImportSessionSlice = createSlice({
    name: "examImportSession",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentSession: (state) => {
            state.currentSession = null;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        resetPagination: (state) => {
            state.pagination = initialState.pagination;
        },
    },
    extraReducers: (builder) => {
        builder
            // ===== GET ALL =====
            .addCase(getExamImportSessionsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getExamImportSessionsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.sessions = action.payload.data.data || [];
                state.pagination = action.payload.data.pagination || initialState.pagination;
            })
            .addCase(getExamImportSessionsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // ===== GET BY ID =====
            .addCase(getExamImportSessionByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getExamImportSessionByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentSession = action.payload.data;
            })
            .addCase(getExamImportSessionByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // ===== CREATE =====
            .addCase(createExamImportSessionAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createExamImportSessionAsync.fulfilled, (state) => {
                state.loadingCreate = false;
            })
            .addCase(createExamImportSessionAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            });
    },
});

/* =========================
   Actions & Selectors
========================= */
export const {
    setFilters,
    resetFilters,
    clearCurrentSession,
    setPagination,
    resetPagination,
} = examImportSessionSlice.actions;

export const selectExamImportSessions = (state) => state.examImportSession.sessions;
export const selectCurrentExamImportSession = (state) => state.examImportSession.currentSession;
export const selectExamImportSessionPagination = (state) => state.examImportSession.pagination;
export const selectExamImportSessionFilters = (state) => state.examImportSession.filters;
export const selectExamImportSessionLoadingGet = (state) => state.examImportSession.loadingGet;
export const selectExamImportSessionLoadingCreate = (state) => state.examImportSession.loadingCreate;
export const selectExamImportSessionError = (state) => state.examImportSession.error;

export default examImportSessionSlice.reducer;
