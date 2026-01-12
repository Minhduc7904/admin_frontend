import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { classSessionApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

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
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    filters: {
        search: "",
        classId: "",
        sortBy: "startTime",
        sortOrder: "asc",
    },
};

// ======================
// Async thunks
// ======================

export const getAllClassSessionsAsync = createAsyncThunk(
    "classSession/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => classSessionApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách buổi học",
        });
    }
);

export const getClassSessionByIdAsync = createAsyncThunk(
    "classSession/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => classSessionApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin buổi học",
        });
    }
);

export const createClassSessionAsync = createAsyncThunk(
    "classSession/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => classSessionApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo buổi học thành công",
            errorTitle: "Lỗi tạo buổi học",
        });
    }
);

export const updateClassSessionAsync = createAsyncThunk(
    "classSession/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => classSessionApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật buổi học thành công",
            errorTitle: "Lỗi cập nhật buổi học",
        });
    }
);

export const deleteClassSessionAsync = createAsyncThunk(
    "classSession/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => classSessionApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa buổi học thành công",
            errorTitle: "Lỗi xóa buổi học",
        });
    }
);

// ======================
// Slice
// ======================

export const classSessionSlice = createSlice({
    name: "classSession",
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
    },
    extraReducers: (builder) => {
        builder
            // Get all
            .addCase(getAllClassSessionsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllClassSessionsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.sessions = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllClassSessionsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(getClassSessionByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getClassSessionByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentSession = action.payload.data;
            })
            .addCase(getClassSessionByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createClassSessionAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createClassSessionAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.sessions.push(action.payload.data);
            })
            .addCase(createClassSessionAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateClassSessionAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateClassSessionAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.sessions.findIndex(
                    (ss) => ss.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.sessions[index] = action.payload.data;
                }
                if (
                    state.currentSession &&
                    state.currentSession.id === action.payload.data.id
                ) {
                    state.currentSession = action.payload.data;
                }
            })
            .addCase(updateClassSessionAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteClassSessionAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteClassSessionAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.sessions = state.sessions.filter(
                    (ss) => ss.id !== action.meta.arg
                );
            })
            .addCase(deleteClassSessionAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

// ======================
// Selectors
// ======================

export const {
    setFilters,
    resetFilters,
    clearCurrentSession,
} = classSessionSlice.actions;

export const selectClassSessions = (state) => state.classSession.sessions;
export const selectCurrentClassSession = (state) =>
    state.classSession.currentSession;
export const selectClassSessionPagination = (state) =>
    state.classSession.pagination;
export const selectClassSessionLoadingGet = (state) =>
    state.classSession.loadingGet;
export const selectClassSessionLoadingCreate = (state) =>
    state.classSession.loadingCreate;
export const selectClassSessionLoadingUpdate = (state) =>
    state.classSession.loadingUpdate;
export const selectClassSessionLoadingDelete = (state) =>
    state.classSession.loadingDelete;
export const selectClassSessionError = (state) =>
    state.classSession.error;
export const selectClassSessionFilters = (state) =>
    state.classSession.filters;

export default classSessionSlice.reducer;
