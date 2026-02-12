import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { examApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    exams: [],
    currentExam: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    // Search state (for SearchableSelect)
    searchExams: [],
    searchPagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    searchTerm: '',
    loadingGet: false,
    loadingSearch: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    filters: {
        search: "",
        subjectId: "",
        grade: "",
        visibility: "",
        createdBy: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllExamsAsync = createAsyncThunk(
    "exam/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => examApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách đề thi",
        });
    }
);

export const getMyExamsAsync = createAsyncThunk(
    "exam/getMyExams",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => examApi.getMyExams(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách đề thi của tôi",
        });
    }
);

export const searchExamsAsync = createAsyncThunk(
    "exam/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => examApi.search(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm đề thi",
        });
    }
);

export const getExamByIdAsync = createAsyncThunk(
    "exam/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => examApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin đề thi",
        });
    }
);

export const createExamAsync = createAsyncThunk(
    "exam/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => examApi.create(data), thunkAPI, {
            successTitle: "Tạo đề thi thành công",
            successMessage: "Đề thi mới đã được tạo",
            errorTitle: "Tạo đề thi thất bại",
        });
    }
);

export const updateExamAsync = createAsyncThunk(
    "exam/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => examApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật đề thi thành công",
            successMessage: "Thông tin đề thi đã được cập nhật",
            errorTitle: "Cập nhật đề thi thất bại",
        });
    }
);

export const deleteExamAsync = createAsyncThunk(
    "exam/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => examApi.delete(id), thunkAPI, {
            successTitle: "Xóa đề thi thành công",
            successMessage: "Đề thi đã được xóa khỏi hệ thống",
            errorTitle: "Xóa đề thi thất bại",
        });
    }
);

const examSlice = createSlice({
    name: "exam",
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
        clearCurrentExam: (state) => {
            state.currentExam = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        clearSearchExams: (state) => {
            state.searchExams = [];
            state.searchPagination = initialState.searchPagination;
            state.searchTerm = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Exams
            .addCase(getAllExamsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllExamsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.exams = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllExamsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get My Exams
            .addCase(getMyExamsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getMyExamsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.exams = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getMyExamsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Search Exams
            .addCase(searchExamsAsync.pending, (state) => {
                state.loadingSearch = true;
                state.error = null;
            })
            .addCase(searchExamsAsync.fulfilled, (state, action) => {
                state.loadingSearch = false;
                const { page } = action.meta.arg;
                
                if (page === 1) {
                    // First page - replace
                    state.searchExams = action.payload.data;
                } else {
                    // Subsequent pages - append and deduplicate
                    const existing = state.searchExams;
                    const newItems = action.payload.data;
                    const merged = [...existing, ...newItems];
                    const uniqueMap = new Map();
                    merged.forEach(item => {
                        if (!uniqueMap.has(item.examId)) {
                            uniqueMap.set(item.examId, item);
                        }
                    });
                    state.searchExams = Array.from(uniqueMap.values());
                }
                
                state.searchPagination = action.payload.meta;
                state.error = null;
            })
            .addCase(searchExamsAsync.rejected, (state, action) => {
                state.loadingSearch = false;
                state.error = action.payload;
            })
            // Get Exam By ID
            .addCase(getExamByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getExamByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentExam = action.payload.data;
                state.error = null;
            })
            .addCase(getExamByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Create Exam
            .addCase(createExamAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createExamAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.exams.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createExamAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update Exam
            .addCase(updateExamAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateExamAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.exams.findIndex(
                    (e) => e.examId === action.payload.data.examId
                );
                if (index !== -1) {
                    state.exams[index] = action.payload.data;
                }
                if (
                    state.currentExam?.examId ===
                    action.payload.data.examId
                ) {
                    state.currentExam = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateExamAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Exam
            .addCase(deleteExamAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteExamAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.exams = state.exams.filter(
                    (e) => e.examId !== action.meta.arg
                );
                if (state.currentExam?.examId === action.meta.arg) {
                    state.currentExam = null;
                }
                state.error = null;
            })
            .addCase(deleteExamAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    setPagination,
    resetFilters,
    clearCurrentExam,
    clearError,
    setSearchTerm,
    clearSearchExams,
} = examSlice.actions;

// Selectors
export const selectExams = (state) => state.exam.exams;
export const selectCurrentExam = (state) => state.exam.currentExam;
export const selectExamPagination = (state) => state.exam.pagination;
export const selectExamLoadingGet = (state) => state.exam.loadingGet;
export const selectExamLoadingCreate = (state) => state.exam.loadingCreate;
export const selectExamLoadingUpdate = (state) => state.exam.loadingUpdate;
export const selectExamLoadingDelete = (state) => state.exam.loadingDelete;
export const selectExamError = (state) => state.exam.error;
export const selectExamFilters = (state) => state.exam.filters;
// Search selectors
export const selectSearchExams = (state) => state.exam.searchExams;
export const selectSearchPagination = (state) => state.exam.searchPagination;
export const selectSearchTerm = (state) => state.exam.searchTerm;
export const selectExamLoadingSearch = (state) => state.exam.loadingSearch;

export default examSlice.reducer;
