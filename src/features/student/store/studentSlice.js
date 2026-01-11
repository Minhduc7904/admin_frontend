import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { studentApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    students: [],
    currentStudent: null,
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
        sortBy: "createdAt",
        sortOrder: "desc",
        grade: "",
        isActive: undefined,
    },
};

// Async thunks
export const getAllStudentsAsync = createAsyncThunk(
    "student/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => studentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách học sinh",
        });
    }
);

export const searchStudentsAsync = createAsyncThunk(
    "student/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => studentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm học sinh",
        });
    }
);

export const getStudentByIdAsync = createAsyncThunk(
    "student/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => studentApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin học sinh",
        });
    }
);

export const createStudentAsync = createAsyncThunk(
    "student/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => studentApi.create(data), thunkAPI, {
            successTitle: "Tạo học sinh thành công",
            errorTitle: "Lỗi tạo học sinh",
        });
    }
);

export const updateStudentAsync = createAsyncThunk(
    "student/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => studentApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật học sinh thành công",
            errorTitle: "Lỗi cập nhật học sinh",
        });
    }
);

export const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        setStudentFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentStudent: (state) => {
            state.currentStudent = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all students
            .addCase(getAllStudentsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllStudentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.students = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllStudentsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get student by ID
            .addCase(getStudentByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getStudentByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentStudent = action.payload.data;
            })
            .addCase(getStudentByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Create student
            .addCase(createStudentAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createStudentAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                console.log('Created student:', action.payload.data);
                state.students.unshift(action.payload.data);
                if (state.pagination.total) {
                    state.pagination.total += 1;
                }
            })
            .addCase(createStudentAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update student
            .addCase(updateStudentAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateStudentAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const updatedStudent = action.payload.data;
                const index = state.students.findIndex(s => s.id === updatedStudent.id);
                if (index !== -1) {
                    state.students[index] = updatedStudent;
                }
                if (state.currentStudent && state.currentStudent.id === updatedStudent.id) {
                    state.currentStudent = updatedStudent;
                }
            })
            .addCase(updateStudentAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            });
    },
});

export const {
    setStudentFilters,
    resetFilters,
    setFilters,
    clearCurrentStudent,
    clearError,
    setPage,
} = studentSlice.actions;

// Selectors
export const selectStudents = (state) => state.student.students;
export const selectStudentPagination = (state) => state.student.pagination;
export const selectStudentLoadingGet = (state) => state.student.loadingGet;
export const selectStudentLoadingCreate = (state) => state.student.loadingCreate;
export const selectStudentLoadingUpdate = (state) => state.student.loadingUpdate;
export const selectStudentLoadingDelete = (state) => state.student.loadingDelete;
export const selectStudentError = (state) => state.student.error;
export const selectStudentFilters = (state) => state.student.filters;
export const selectCurrentStudent = (state) => state.student.currentStudent;

export default studentSlice.reducer;
