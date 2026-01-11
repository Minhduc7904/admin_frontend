import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subjectApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    subjects: [],
    currentSubject: null,
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
        code: "",
        sortBy: "name",
        sortOrder: "asc",
    },
};

// Async thunks
export const getAllSubjectsAsync = createAsyncThunk(
    "subject/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => subjectApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách môn học",
        });
    }
);

export const searchSubjectsAsync = createAsyncThunk(
    "subject/search",
    async (query, thunkAPI) => {
        return handleAsyncThunk(() => subjectApi.getAll(query), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm môn học",
        });
    }
);

export const getSubjectByIdAsync = createAsyncThunk(
    "subject/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => subjectApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin môn học",
        });
    }
);

export const createSubjectAsync = createAsyncThunk(
    "subject/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => subjectApi.create(data), thunkAPI, {
            successTitle: "Tạo môn học thành công",
            successMessage: "Môn học mới đã được tạo",
            errorTitle: "Tạo môn học thất bại",
        });
    }
);

export const updateSubjectAsync = createAsyncThunk(
    "subject/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => subjectApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật môn học thành công",
            successMessage: "Thông tin môn học đã được cập nhật",
            errorTitle: "Cập nhật môn học thất bại",
        });
    }
);

export const deleteSubjectAsync = createAsyncThunk(
    "subject/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => subjectApi.delete(id), thunkAPI, {
            successTitle: "Xóa môn học thành công",
            successMessage: "Môn học đã được xóa khỏi hệ thống",
            errorTitle: "Xóa môn học thất bại",
        });
    }
);

const subjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentSubject: (state) => {
            state.currentSubject = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Subjects
            .addCase(getAllSubjectsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllSubjectsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.subjects = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllSubjectsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Subject By ID
            .addCase(getSubjectByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getSubjectByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentSubject = action.payload.data;
                state.error = null;
            })
            .addCase(getSubjectByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Create Subject
            .addCase(createSubjectAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createSubjectAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.subjects.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createSubjectAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update Subject
            .addCase(updateSubjectAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateSubjectAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.subjects.findIndex(
                    (s) => s.subjectId === action.payload.data.subjectId
                );
                if (index !== -1) {
                    state.subjects[index] = action.payload.data;
                }
                if (
                    state.currentSubject?.subjectId ===
                    action.payload.data.subjectId
                ) {
                    state.currentSubject = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateSubjectAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Subject
            .addCase(deleteSubjectAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteSubjectAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.subjects = state.subjects.filter(
                    (s) => s.subjectId !== action.meta.arg
                );
                if (state.currentSubject?.subjectId === action.meta.arg) {
                    state.currentSubject = null;
                }
                state.error = null;
            })
            .addCase(deleteSubjectAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })
            // Search subjects
            .addCase(searchSubjectsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(searchSubjectsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                // Store search results but don't update pagination
                // This is for dropdown usage only
            })
            .addCase(searchSubjectsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, resetFilters, clearCurrentSubject, clearError } =
    subjectSlice.actions;

// Selectors
export const selectSubjects = (state) => state.subject.subjects;
export const selectCurrentSubject = (state) => state.subject.currentSubject;
export const selectSubjectPagination = (state) => state.subject.pagination;
export const selectSubjectFilters = (state) => state.subject.filters;
export const selectSubjectLoadingGet = (state) => state.subject.loadingGet;
export const selectSubjectLoadingCreate = (state) => state.subject.loadingCreate;
export const selectSubjectLoadingUpdate = (state) => state.subject.loadingUpdate;
export const selectSubjectLoadingDelete = (state) => state.subject.loadingDelete;
export const selectSubjectError = (state) => state.subject.error;

export default subjectSlice.reducer;
