import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseClassApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    classes: [],
    currentClass: null,
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
        courseId: "",
        instructorId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// ======================
// Async thunks
// ======================

export const getAllCourseClassesAsync = createAsyncThunk(
    "courseClass/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách lớp học",
        });
    }
);

export const getCourseClassByIdAsync = createAsyncThunk(
    "courseClass/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin lớp học",
        });
    }
);

export const createCourseClassAsync = createAsyncThunk(
    "courseClass/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo lớp học thành công",
            errorTitle: "Lỗi tạo lớp học",
        });
    }
);

export const updateCourseClassAsync = createAsyncThunk(
    "courseClass/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật lớp học thành công",
            errorTitle: "Lỗi cập nhật lớp học",
        });
    }
);

export const deleteCourseClassAsync = createAsyncThunk(
    "courseClass/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa lớp học thành công",
            errorTitle: "Lỗi xóa lớp học",
        });
    }
);

// ======================
// Slice
// ======================

export const courseClassSlice = createSlice({
    name: "courseClass",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentClass: (state) => {
            state.currentClass = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all
            .addCase(getAllCourseClassesAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllCourseClassesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.classes = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllCourseClassesAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(getCourseClassByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getCourseClassByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentClass = action.payload.data;
            })
            .addCase(getCourseClassByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createCourseClassAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createCourseClassAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.classes.unshift(action.payload.data);
            })
            .addCase(createCourseClassAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateCourseClassAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateCourseClassAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.classes.findIndex(
                    (cls) => cls.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.classes[index] = action.payload.data;
                }
                if (
                    state.currentClass &&
                    state.currentClass.id === action.payload.data.id
                ) {
                    state.currentClass = action.payload.data;
                }
            })
            .addCase(updateCourseClassAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteCourseClassAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteCourseClassAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.classes = state.classes.filter(
                    (cls) => cls.id !== action.meta.arg
                );
            })
            .addCase(deleteCourseClassAsync.rejected, (state, action) => {
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
    clearCurrentClass,
} = courseClassSlice.actions;

export const selectCourseClasses = (state) => state.courseClass.classes;
export const selectCurrentCourseClass = (state) => state.courseClass.currentClass;
export const selectCourseClassPagination = (state) => state.courseClass.pagination;
export const selectCourseClassLoadingGet = (state) => state.courseClass.loadingGet;
export const selectCourseClassLoadingCreate = (state) => state.courseClass.loadingCreate;
export const selectCourseClassLoadingUpdate = (state) => state.courseClass.loadingUpdate;
export const selectCourseClassLoadingDelete = (state) => state.courseClass.loadingDelete;
export const selectCourseClassError = (state) => state.courseClass.error;
export const selectCourseClassFilters = (state) => state.courseClass.filters;

export default courseClassSlice.reducer;
