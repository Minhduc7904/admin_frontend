import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { competitionApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    competitions: [],
    currentCompetition: null,
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
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    filters: {
        search: "",
        examId: "",
        visibility: "",
        createdBy: "",
        startDateFrom: "",
        endDateTo: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllCompetitionsAsync = createAsyncThunk(
    "competition/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => competitionApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách cuộc thi",
        });
    }
);

export const getMyCompetitionsAsync = createAsyncThunk(
    "competition/getMyCompetitions",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => competitionApi.getMyCompetitions(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách cuộc thi của tôi",
        });
    }
);

export const searchCompetitionsAsync = createAsyncThunk(
    "competition/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => competitionApi.search(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm cuộc thi",
        });
    }
);

export const getCompetitionByIdAsync = createAsyncThunk(
    "competition/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => competitionApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin cuộc thi",
        });
    }
);

export const createCompetitionAsync = createAsyncThunk(
    "competition/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => competitionApi.create(data), thunkAPI, {
            successTitle: "Tạo cuộc thi thành công",
            successMessage: "Cuộc thi mới đã được tạo",
            errorTitle: "Tạo cuộc thi thất bại",
        });
    }
);

export const updateCompetitionAsync = createAsyncThunk(
    "competition/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => competitionApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật cuộc thi thành công",
            successMessage: "Thông tin cuộc thi đã được cập nhật",
            errorTitle: "Cập nhật cuộc thi thất bại",
        });
    }
);

export const deleteCompetitionAsync = createAsyncThunk(
    "competition/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => competitionApi.delete(id), thunkAPI, {
            successTitle: "Xóa cuộc thi thành công",
            successMessage: "Cuộc thi đã được xóa khỏi hệ thống",
            errorTitle: "Xóa cuộc thi thất bại",
        });
    }
);

const competitionSlice = createSlice({
    name: "competition",
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
        clearCurrentCompetition: (state) => {
            state.currentCompetition = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Competitions
            .addCase(getAllCompetitionsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllCompetitionsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.competitions = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllCompetitionsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get My Competitions
            .addCase(getMyCompetitionsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getMyCompetitionsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.competitions = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getMyCompetitionsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Search Competitions
            .addCase(searchCompetitionsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(searchCompetitionsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.competitions = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(searchCompetitionsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Competition By ID
            .addCase(getCompetitionByIdAsync.pending, (state) => {
                state.loadingGetById = true;
                state.error = null;
            })
            .addCase(getCompetitionByIdAsync.fulfilled, (state, action) => {
                state.loadingGetById = false;
                state.currentCompetition = action.payload.data;
                state.error = null;
            })
            .addCase(getCompetitionByIdAsync.rejected, (state, action) => {
                state.loadingGetById = false;
                state.error = action.payload;
            })
            // Create Competition
            .addCase(createCompetitionAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createCompetitionAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.competitions.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createCompetitionAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update Competition
            .addCase(updateCompetitionAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateCompetitionAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.competitions.findIndex(
                    (c) => c.competitionId === action.payload.data.competitionId
                );
                if (index !== -1) {
                    state.competitions[index] = action.payload.data;
                }
                if (
                    state.currentCompetition?.competitionId ===
                    action.payload.data.competitionId
                ) {
                    state.currentCompetition = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateCompetitionAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Competition
            .addCase(deleteCompetitionAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteCompetitionAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.competitions = state.competitions.filter(
                    (c) => c.competitionId !== action.meta.arg
                );
                if (state.currentCompetition?.competitionId === action.meta.arg) {
                    state.currentCompetition = null;
                }
                state.error = null;
            })
            .addCase(deleteCompetitionAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, setPagination, resetFilters, clearCurrentCompetition, clearError } =
    competitionSlice.actions;

// Selectors
export const selectCompetitions = (state) => state.competition.competitions;
export const selectCurrentCompetition = (state) => state.competition.currentCompetition;
export const selectCompetitionPagination = (state) => state.competition.pagination;
export const selectCompetitionLoadingGet = (state) => state.competition.loadingGet;
export const selectCompetitionLoadingCreate = (state) => state.competition.loadingCreate;
export const selectCompetitionLoadingUpdate = (state) => state.competition.loadingUpdate;
export const selectCompetitionLoadingDelete = (state) => state.competition.loadingDelete;
export const selectCompetitionError = (state) => state.competition.error;
export const selectCompetitionFilters = (state) => state.competition.filters;
export const selectCompetitionLoadingGetById = (state) => state.competition.loadingGetById;

export default competitionSlice.reducer;
