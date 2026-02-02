import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { examImportSessionApi } from "../../../core/api/examImportSessionApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

/* =========================
   Initial State
========================= */
const initialState = {
    sessions: [],
    currentSession: null,
    rawContent: null,
    splitResult: null, // Kết quả tách câu hỏi

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
    loadingRawContent: false,
    loadingUpdateRawContent: false,
    loadingSplit: false, // Loading cho việc tách câu hỏi

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
    async (_, thunkAPI) => {
        return handleAsyncThunk(() => examImportSessionApi.create(), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo phiên import đề thi thành công",
            errorTitle: "Lỗi tạo phiên import đề thi",
        });
    }
);

// ===== GET RAW CONTENT =====
export const getSessionRawContentAsync = createAsyncThunk(
    "examImportSession/getRawContent",
    async ({ sessionId, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(
            () => examImportSessionApi.getMyRawContent(sessionId, expiry),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải raw content",
            }
        );
    }
);

// ===== UPDATE RAW CONTENT =====
export const updateSessionRawContentAsync = createAsyncThunk(
    "examImportSession/updateRawContent",
    async ({ sessionId, rawContent }, thunkAPI) => {
        return handleAsyncThunk(
            () => examImportSessionApi.updateMyRawContent(sessionId, rawContent),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật raw content thành công",
                errorTitle: "Lỗi cập nhật raw content",
            }
        );
    }
);

// ===== SPLIT FROM SESSION =====
export const splitExamFromSessionAsync = createAsyncThunk(
    "examImportSession/splitFromSession",
    async (sessionId, thunkAPI) => {
        return handleAsyncThunk(
            () => examImportSessionApi.splitFromSession(sessionId),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Tách câu hỏi thành công",
                errorTitle: "Lỗi tách câu hỏi từ session",
            }
        );
    }
);

// ===== SPLIT FROM RAW CONTENT =====
export const splitExamFromRawContentAsync = createAsyncThunk(
    "examImportSession/splitFromRawContent",
    async ({ sessionId, rawContent }, thunkAPI) => {
        return handleAsyncThunk(
            () => examImportSessionApi.splitFromRawContent(sessionId, rawContent),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Tách câu hỏi thành công",
                errorTitle: "Lỗi tách câu hỏi",
            }
        );
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
        clearRawContent: (state) => {
            state.rawContent = null;
        },
        clearSplitResult: (state) => {
            state.splitResult = null;
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
                state.sessions = action.payload.data || [];
                state.pagination = action.payload.meta || initialState.pagination;
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
            })

            // ===== GET RAW CONTENT =====
            .addCase(getSessionRawContentAsync.pending, (state) => {
                state.loadingRawContent = true;
                state.error = null;
            })
            .addCase(getSessionRawContentAsync.fulfilled, (state, action) => {
                state.loadingRawContent = false;
                state.rawContent = action.payload.data;
            })
            .addCase(getSessionRawContentAsync.rejected, (state, action) => {
                state.loadingRawContent = false;
                state.error = action.payload;
            })

            // ===== UPDATE RAW CONTENT =====
            .addCase(updateSessionRawContentAsync.pending, (state) => {
                state.loadingUpdateRawContent = true;
                state.error = null;
            })
            .addCase(updateSessionRawContentAsync.fulfilled, (state, action) => {
                state.loadingUpdateRawContent = false;
                // Update rawContent with the new content
                if (state.rawContent) {
                    state.rawContent.rawContent = action.payload.data.rawContent;
                }
            })
            .addCase(updateSessionRawContentAsync.rejected, (state, action) => {
                state.loadingUpdateRawContent = false;
                state.error = action.payload;
            })

            // ===== SPLIT FROM SESSION =====
            .addCase(splitExamFromSessionAsync.pending, (state) => {
                state.loadingSplit = true;
                state.error = null;
                state.splitResult = null;
            })
            .addCase(splitExamFromSessionAsync.fulfilled, (state, action) => {
                state.loadingSplit = false;
                state.splitResult = action.payload.data;
            })
            .addCase(splitExamFromSessionAsync.rejected, (state, action) => {
                state.loadingSplit = false;
                state.error = action.payload;
            })

            // ===== SPLIT FROM RAW CONTENT (PREVIEW) =====
            .addCase(splitExamFromRawContentAsync.pending, (state) => {
                state.loadingSplit = true;
                state.error = null;
                state.splitResult = null;
            })
            .addCase(splitExamFromRawContentAsync.fulfilled, (state, action) => {
                state.loadingSplit = false;
                state.splitResult = action.payload.data;
            })
            .addCase(splitExamFromRawContentAsync.rejected, (state, action) => {
                state.loadingSplit = false;
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
    clearRawContent,
    setPagination,
    resetPagination,
    clearSplitResult,
} = examImportSessionSlice.actions;

export const selectExamImportSessions = (state) => state.examImportSession.sessions;
export const selectCurrentExamImportSession = (state) => state.examImportSession.currentSession;
export const selectExamImportSessionRawContent = (state) => state.examImportSession.rawContent;
export const selectExamImportSessionPagination = (state) => state.examImportSession.pagination;
export const selectExamImportSessionFilters = (state) => state.examImportSession.filters;
export const selectExamImportSessionLoadingGet = (state) => state.examImportSession.loadingGet;
export const selectExamImportSessionLoadingCreate = (state) => state.examImportSession.loadingCreate;
export const selectExamImportSessionLoadingRawContent = (state) => state.examImportSession.loadingRawContent;
export const selectExamImportSessionLoadingUpdateRawContent = (state) => state.examImportSession.loadingUpdateRawContent;
export const selectExamImportSessionError = (state) => state.examImportSession.error;
export const selectExamImportSessionSplitResult = (state) => state.examImportSession.splitResult;
export const selectExamImportSessionLoadingSplit = (state) => state.examImportSession.loadingSplit;


export default examImportSessionSlice.reducer;
