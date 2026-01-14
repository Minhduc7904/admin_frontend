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
    // Students Attendance state (tách biệt)
    studentsAttendance: [],
    studentsAttendancePagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingStudentsAttendance: false,
    loadingExportStudentsAttendance: false,
    studentsAttendanceError: null,
    studentsAttendanceFilters: {
        fromDate: "",
        toDate: "",
        status: "",
        search: "",
    },
    exportStudentsAttendanceOptions: {
        includeSchool: true,
        includeParentPhone: true,
        includeStudentPhone: false,
        includeGrade: true,
        includeEmail: true,
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

// Students Attendance thunks
export const getStudentsAttendanceAsync = createAsyncThunk(
    "course/getStudentsAttendance",
    async ({ courseId, params }, thunkAPI) => {
        return handleAsyncThunk(() => courseApi.getStudentsAttendance(courseId, params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách điểm danh học sinh",
        });
    }
);

export const exportStudentsAttendanceAsync = createAsyncThunk(
    "course/exportStudentsAttendance",
    async ({ courseId, params = {} }, thunkAPI) => {
        try {
            const response = await courseApi.exportStudentsAttendance(courseId, params);

            // Response.data is the blob
            const blob = response.data || response;

            // Extract filename from Content-Disposition header or use default
            const contentDisposition = response.headers?.['content-disposition'];
            let filename = `DiemDanh_KhoaHoc_${courseId}_${new Date().getTime()}.xlsx`;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=(['\"]?)([^'\"\n]*\.(xlsx))\1/i);
                if (filenameMatch && filenameMatch[2]) {
                    filename = decodeURIComponent(filenameMatch[2]);
                }
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi xuất Excel');
        }
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
        // Students Attendance reducers
        setStudentsAttendanceFilters: (state, action) => {
            state.studentsAttendanceFilters = { ...state.studentsAttendanceFilters, ...action.payload };
        },
        resetStudentsAttendanceFilters: (state) => {
            state.studentsAttendanceFilters = initialState.studentsAttendanceFilters;
        },
        clearStudentsAttendance: (state) => {
            state.studentsAttendance = [];
        },
        setExportStudentsAttendanceOptions: (state, action) => {
            state.exportStudentsAttendanceOptions = { ...state.exportStudentsAttendanceOptions, ...action.payload };
        },
        resetExportStudentsAttendanceOptions: (state) => {
            state.exportStudentsAttendanceOptions = initialState.exportStudentsAttendanceOptions;
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
            })
            // Get students attendance
            .addCase(getStudentsAttendanceAsync.pending, (state) => {
                state.loadingStudentsAttendance = true;
                state.studentsAttendanceError = null;
            })
            .addCase(getStudentsAttendanceAsync.fulfilled, (state, action) => {
                state.loadingStudentsAttendance = false;
                state.studentsAttendance = action.payload.data;
                state.studentsAttendancePagination = action.payload.meta;
                state.studentsAttendanceError = null;
            })
            .addCase(getStudentsAttendanceAsync.rejected, (state, action) => {
                state.loadingStudentsAttendance = false;
                state.studentsAttendanceError = action.payload;
            })
            // Export students attendance
            .addCase(exportStudentsAttendanceAsync.pending, (state) => {
                state.loadingExportStudentsAttendance = true;
                state.studentsAttendanceError = null;
            })
            .addCase(exportStudentsAttendanceAsync.fulfilled, (state) => {
                state.loadingExportStudentsAttendance = false;
            })
            .addCase(exportStudentsAttendanceAsync.rejected, (state, action) => {
                state.loadingExportStudentsAttendance = false;
                state.studentsAttendanceError = action.payload;
            });
    },
});

export const { 
    setFilters, 
    clearCurrentCourse, 
    resetFilters,
    setStudentsAttendanceFilters,
    resetStudentsAttendanceFilters,
    clearStudentsAttendance,
    setExportStudentsAttendanceOptions,
    resetExportStudentsAttendanceOptions,
} = courseSlice.actions;

export const selectCourses = (state) => state.course.courses;
export const selectCurrentCourse = (state) => state.course.currentCourse;
export const selectCoursePagination = (state) => state.course.pagination;
export const selectCourseLoadingGet = (state) => state.course.loadingGet;
export const selectCourseLoadingCreate = (state) => state.course.loadingCreate;
export const selectCourseLoadingUpdate = (state) => state.course.loadingUpdate;
export const selectCourseLoadingDelete = (state) => state.course.loadingDelete;
export const selectCourseError = (state) => state.course.error;
export const selectCourseFilters = (state) => state.course.filters;

// Students Attendance selectors
export const selectStudentsAttendance = (state) => state.course.studentsAttendance;
export const selectStudentsAttendancePagination = (state) => state.course.studentsAttendancePagination;
export const selectLoadingStudentsAttendance = (state) => state.course.loadingStudentsAttendance;
export const selectLoadingExportStudentsAttendance = (state) => state.course.loadingExportStudentsAttendance;
export const selectStudentsAttendanceError = (state) => state.course.studentsAttendanceError;
export const selectStudentsAttendanceFilters = (state) => state.course.studentsAttendanceFilters;
export const selectExportStudentsAttendanceOptions = (state) => state.course.exportStudentsAttendanceOptions;

export default courseSlice.reducer;