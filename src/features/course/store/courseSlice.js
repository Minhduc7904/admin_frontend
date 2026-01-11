import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";


const initialState = {
    courses: [],
    currentCourse: null,
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
        grade: "",
        visibility: "",
        academicYear: "",
        teacherId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllCoursesAsync = createAsyncThunk(
    "course/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách khóa học",
        });
    }
);
export const getCourseByIdAsync = createAsyncThunk(
    "course/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => courseApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin khóa học",
        });
    }
);

export const createCourseAsync = createAsyncThunk(
    "course/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => courseApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo khóa học thành công",
            errorTitle: "Lỗi tạo khóa học",
        });
    }
);

export const updateCourseAsync = createAsyncThunk(
    "course/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => courseApi.update(id, data), thunkAPI, {   
            showSuccess: true,
            successTitle: "Cập nhật khóa học thành công",
            errorTitle: "Lỗi cập nhật khóa học",
        });
    }
);

export const deleteCourseAsync = createAsyncThunk(
    "course/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => courseApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa khóa học thành công",
            errorTitle: "Lỗi xóa khóa học",
        });
    }
);

export const searchCoursesAsync = createAsyncThunk(
    "course/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm khóa học",
        });
    }
);

export const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
    },
    extraReducers: (builder) => {
        // Get all courses
        builder
            .addCase(getAllCoursesAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllCoursesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.courses = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllCoursesAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get course by ID
            .addCase(getCourseByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getCourseByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentCourse = action.payload.data;
                state.error = null;
            })
            .addCase(getCourseByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })  
            // Create course
            .addCase(createCourseAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createCourseAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.courses.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createCourseAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update course
            .addCase(updateCourseAsync.pending, (state) => {
                state.loadingUpdate = true; 
                state.error = null;
            })
            .addCase(updateCourseAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.courses.findIndex(  
                    (course) => course.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.courses[index] = action.payload.data;
                }
                if (
                    state.currentCourse && 
                    state.currentCourse.id === action.payload.data.id
                ) {
                    state.currentCourse = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateCourseAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete course
            .addCase(deleteCourseAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteCourseAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.courses = state.courses.filter(
                    (course) => course.id !== action.meta.arg
                );
                state.error = null;
            })
            .addCase(deleteCourseAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearCurrentCourse, resetFilters } = courseSlice.actions;

export const selectCourses = (state) => state.course.courses;
export const selectCurrentCourse = (state) => state.course.currentCourse;
export const selectCoursePagination = (state) => state.course.pagination;
export const selectCourseLoadingGet = (state) => state.course.loadingGet;
export const selectCourseLoadingCreate = (state) => state.course.loadingCreate;
export const selectCourseLoadingUpdate = (state) => state.course.loadingUpdate;
export const selectCourseLoadingDelete = (state) => state.course.loadingDelete;
export const selectCourseError = (state) => state.course.error;
export const selectCourseFilters = (state) => state.course.filters;

export default courseSlice.reducer;