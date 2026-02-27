import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { competitionSubmitApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    submits: [],
    currentSubmit: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingGetById: false,
    loadingDelete: false,
    error: null,
    filters: {
        competitionId: '',
        studentId: '',
        status: '',
        attemptNumber: '',
        isGraded: '',
        startedFrom: '',
        startedTo: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    },
};

/* ── Async Thunks ───────────────────────────────────────────────── */

export const getAllCompetitionSubmitsAsync = createAsyncThunk(
    'competitionSubmit/getAll',
    async (params, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionSubmitApi.getAll(params),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải danh sách bài nộp',
            }
        );
    }
);

export const getCompetitionSubmitByIdAsync = createAsyncThunk(
    'competitionSubmit/getById',
    async (id, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionSubmitApi.getById(id),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải thông tin bài nộp',
            }
        );
    }
);

export const deleteCompetitionSubmitAsync = createAsyncThunk(
    'competitionSubmit/delete',
    async (id, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionSubmitApi.delete(id),
            thunkAPI,
            {
                successTitle: 'Xóa bài nộp thành công',
                successMessage: 'Bài nộp đã được xóa khỏi hệ thống',
                errorTitle: 'Xóa bài nộp thất bại',
            }
        );
    }
);

/* ── Slice ──────────────────────────────────────────────────────── */

const competitionSubmitSlice = createSlice({
    name: 'competitionSubmit',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentSubmit: (state) => {
            state.currentSubmit = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ── Get All ──────────────────────────────────────────── */
            .addCase(getAllCompetitionSubmitsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllCompetitionSubmitsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                // Support both { data: [], meta: {} } and { data: { competitionSubmits: [], pagination: {} } }
                const payload = action.payload;
                state.submits = Array.isArray(payload.data)
                    ? payload.data
                    : (payload.data?.competitionSubmits ?? []);
                state.pagination = payload.meta
                    ?? payload.data?.pagination
                    ?? initialState.pagination;
                state.error = null;
            })
            .addCase(getAllCompetitionSubmitsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            /* ── Get By ID ────────────────────────────────────────── */
            .addCase(getCompetitionSubmitByIdAsync.pending, (state) => {
                state.loadingGetById = true;
                state.error = null;
            })
            .addCase(getCompetitionSubmitByIdAsync.fulfilled, (state, action) => {
                state.loadingGetById = false;
                state.currentSubmit = action.payload.data;
                state.error = null;
            })
            .addCase(getCompetitionSubmitByIdAsync.rejected, (state, action) => {
                state.loadingGetById = false;
                state.error = action.payload;
            })

            /* ── Delete ───────────────────────────────────────────── */
            .addCase(deleteCompetitionSubmitAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteCompetitionSubmitAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.submits = state.submits.filter(
                    (s) => s.submitId !== action.meta.arg
                );
                if (state.currentSubmit?.submitId === action.meta.arg) {
                    state.currentSubmit = null;
                }
                state.error = null;
            })
            .addCase(deleteCompetitionSubmitAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    setPagination,
    resetFilters,
    clearCurrentSubmit,
    clearError,
} = competitionSubmitSlice.actions;

/* ── Selectors ──────────────────────────────────────────────────── */

export const selectCompetitionSubmits = (state) => state.competitionSubmit.submits;
export const selectCurrentCompetitionSubmit = (state) => state.competitionSubmit.currentSubmit;
export const selectCompetitionSubmitPagination = (state) => state.competitionSubmit.pagination;
export const selectCompetitionSubmitFilters = (state) => state.competitionSubmit.filters;
export const selectCompetitionSubmitLoadingGet = (state) => state.competitionSubmit.loadingGet;
export const selectCompetitionSubmitLoadingGetById = (state) => state.competitionSubmit.loadingGetById;
export const selectCompetitionSubmitLoadingDelete = (state) => state.competitionSubmit.loadingDelete;
export const selectCompetitionSubmitError = (state) => state.competitionSubmit.error;

export default competitionSubmitSlice.reducer;
