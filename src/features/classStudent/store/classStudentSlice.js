import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { classStudentApi } from "../../../core/api";
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
        classId: "",
        studentId: "",
        status: "",        // active | inactive | dropped
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// ======================
// Async thunks
// ======================

export const getAllClassStudentsAsync = createAsyncThunk(
    "classStudent/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => classStudentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách học sinh trong lớp",
        });
    }
);

export const getClassStudentByIdAsync = createAsyncThunk(
    "classStudent/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => classStudentApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin học sinh",
        });
    }
);

export const addStudentToClassAsync = createAsyncThunk(
    "classStudent/add",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => classStudentApi.add(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Thêm học sinh vào lớp thành công",
            errorTitle: "Lỗi thêm học sinh vào lớp",
        });
    }
);

export const updateClassStudentAsync = createAsyncThunk(
    "classStudent/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => classStudentApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật học sinh thành công",
            errorTitle: "Lỗi cập nhật học sinh",
        });
    }
);

export const removeStudentFromClassAsync = createAsyncThunk(
    "classStudent/remove",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => classStudentApi.remove(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa học sinh khỏi lớp thành công",
            errorTitle: "Lỗi xóa học sinh khỏi lớp",
        });
    }
);

// ======================
// Slice
// ======================

export const classStudentSlice = createSlice({
    name: "classStudent",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentStudent: (state) => {
            state.currentStudent = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all
            .addCase(getAllClassStudentsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllClassStudentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.students = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllClassStudentsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(getClassStudentByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getClassStudentByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentStudent = action.payload.data;
            })
            .addCase(getClassStudentByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Add
            .addCase(addStudentToClassAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(addStudentToClassAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.students.unshift(action.payload.data);
            })
            .addCase(addStudentToClassAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateClassStudentAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateClassStudentAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.students.findIndex(
                    (st) => st.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.students[index] = action.payload.data;
                }
                if (
                    state.currentStudent &&
                    state.currentStudent.id === action.payload.data.id
                ) {
                    state.currentStudent = action.payload.data;
                }
            })
            .addCase(updateClassStudentAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Remove
            .addCase(removeStudentFromClassAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(removeStudentFromClassAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.students = state.students.filter(
                    (st) => st.id !== action.meta.arg
                );
            })
            .addCase(removeStudentFromClassAsync.rejected, (state, action) => {
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
    clearCurrentStudent,
} = classStudentSlice.actions;

export const selectClassStudents = (state) => state.classStudent.students;
export const selectCurrentClassStudent = (state) =>
    state.classStudent.currentStudent;
export const selectClassStudentPagination = (state) =>
    state.classStudent.pagination;
export const selectClassStudentLoadingGet = (state) =>
    state.classStudent.loadingGet;
export const selectClassStudentLoadingCreate = (state) =>
    state.classStudent.loadingCreate;
export const selectClassStudentLoadingUpdate = (state) =>
    state.classStudent.loadingUpdate;
export const selectClassStudentLoadingDelete = (state) =>
    state.classStudent.loadingDelete;
export const selectClassStudentError = (state) =>
    state.classStudent.error;
export const selectClassStudentFilters = (state) =>
    state.classStudent.filters;

export default classStudentSlice.reducer;
