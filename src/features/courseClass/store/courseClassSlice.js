import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseClassApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    classes: [],
    myClasses: [],
    currentClass: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    myClassesPagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingGetMyClasses: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    lessonVisibilityClasses: [],
    lessonVisibilityClassesPagination: {
        page: 1,
        limit: 1000,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingLessonVisibilityClasses: false,
    loadingSwitchLessonVisibilityClassIds: [],
    error: null,
    filters: {
        search: "",
        courseId: "",
        instructorId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
    myClassesFilters: {
        search: "",
        courseId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// ======================
// Async thunks
// ======================

const getResponseData = (payload) => payload?.data ?? payload;

const getCourseClassLessonRecord = (payload) => {
    const data = getResponseData(payload);
    return data?.courseClassLesson || data?.classLesson || data?.record || data;
};

const upsertCourseClassLessonRecord = (courseClass, rawRecord) => {
    const record = {
        ...rawRecord,
        classId: rawRecord?.classId ?? rawRecord?.courseClassId,
        lessonId: rawRecord?.lessonId ?? rawRecord?.lesson?.lessonId,
    };

    if (!courseClass || !record.classId || !record.lessonId) {
        return;
    }

    courseClass.courseClassLesson = record;

    if (!Array.isArray(courseClass.courseClassLessons)) {
        courseClass.courseClassLessons = [];
    }

    const index = courseClass.courseClassLessons.findIndex(
        (item) =>
            Number(item.classId ?? item.courseClassId) === Number(record.classId) &&
            Number(item.lessonId) === Number(record.lessonId)
    );

    if (index >= 0) {
        courseClass.courseClassLessons[index] = {
            ...courseClass.courseClassLessons[index],
            ...record,
        };
    } else {
        courseClass.courseClassLessons.push(record);
    }
};

export const getAllCourseClassesAsync = createAsyncThunk(
    "courseClass/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách lớp học",
        });
    }
);

export const searchCourseClassesAsync = createAsyncThunk(
    "courseClass/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.search(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm lớp học",
        });
    }
);

export const getMyCourseClassesAsync = createAsyncThunk(
    "courseClass/getMyClasses",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.getMyClasses(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách lớp học của tôi",
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

export const getCourseClassesForLessonVisibilityAsync = createAsyncThunk(
    "courseClass/getForLessonVisibility",
    async ({ courseId }, thunkAPI) => {
        return handleAsyncThunk(
            () => courseClassApi.getForLessonVisibility(courseId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải danh sách lớp học trong khóa",
            }
        );
    }
);

export const switchCourseClassLessonVisibilityAsync = createAsyncThunk(
    "courseClass/switchLessonVisibility",
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => courseClassApi.switchLessonVisibility(data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật hiển thị bài học thành công",
                errorTitle: "Lỗi cập nhật hiển thị bài học",
            }
        );
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
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setMyFilters: (state, action) => {
            state.myClassesFilters = { ...state.myClassesFilters, ...action.payload };
        },
        resetMyFilters: (state) => {
            state.myClassesFilters = initialState.myClassesFilters;
        },
        setMyPagination: (state, action) => {
            state.myClassesPagination = { ...state.myClassesPagination, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            // Get all
            .addCase(getAllCourseClassesAsync.pending, (state) => {
                state.classes = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllCourseClassesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.classes = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllCourseClassesAsync.rejected, (state, action) => {
                state.classes = [];
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get my classes
            .addCase(getMyCourseClassesAsync.pending, (state) => {
                state.myClasses = [];
                state.loadingGetMyClasses = true;
                state.error = null;
            })
            .addCase(getMyCourseClassesAsync.fulfilled, (state, action) => {
                state.loadingGetMyClasses = false;
                state.myClasses = action.payload.data;
                state.myClassesPagination = action.payload.meta;
            })
            .addCase(getMyCourseClassesAsync.rejected, (state, action) => {
                state.myClasses = [];
                state.loadingGetMyClasses = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(getCourseClassByIdAsync.pending, (state) => {
                state.currentClass = null;
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getCourseClassByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentClass = action.payload.data;
            })
            .addCase(getCourseClassByIdAsync.rejected, (state, action) => {
                state.currentClass = null;
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createCourseClassAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createCourseClassAsync.fulfilled, (state) => {
                state.loadingCreate = false;
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
            })

            // Classes in course for lesson visibility switches
            .addCase(getCourseClassesForLessonVisibilityAsync.pending, (state) => {
                state.lessonVisibilityClasses = [];
                state.loadingLessonVisibilityClasses = true;
                state.error = null;
            })
            .addCase(getCourseClassesForLessonVisibilityAsync.fulfilled, (state, action) => {
                state.loadingLessonVisibilityClasses = false;
                state.lessonVisibilityClasses = action.payload.data || [];
                state.lessonVisibilityClassesPagination =
                    action.payload.meta || initialState.lessonVisibilityClassesPagination;
            })
            .addCase(getCourseClassesForLessonVisibilityAsync.rejected, (state, action) => {
                state.lessonVisibilityClasses = [];
                state.loadingLessonVisibilityClasses = false;
                state.error = action.payload;
            })

            // Switch class-lesson visibility
            .addCase(switchCourseClassLessonVisibilityAsync.pending, (state, action) => {
                const classId = action.meta.arg.classId;
                state.loadingSwitchLessonVisibilityClassIds.push(classId);
                state.error = null;
            })
            .addCase(switchCourseClassLessonVisibilityAsync.fulfilled, (state, action) => {
                const classId = action.meta.arg.classId;
                const record = {
                    ...action.meta.arg,
                    ...getCourseClassLessonRecord(action.payload),
                };

                state.loadingSwitchLessonVisibilityClassIds =
                    state.loadingSwitchLessonVisibilityClassIds.filter((id) => id !== classId);

                const courseClass = state.lessonVisibilityClasses.find(
                    (item) => Number(item.classId) === Number(classId)
                );
                upsertCourseClassLessonRecord(courseClass, record);
            })
            .addCase(switchCourseClassLessonVisibilityAsync.rejected, (state, action) => {
                const classId = action.meta.arg.classId;
                state.loadingSwitchLessonVisibilityClassIds =
                    state.loadingSwitchLessonVisibilityClassIds.filter((id) => id !== classId);
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
    setPagination,
    setMyFilters,
    resetMyFilters,
    setMyPagination
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
export const selectMyCourseClasses = (state) => state.courseClass.myClasses;
export const selectMyCourseClassPagination = (state) => state.courseClass.myClassesPagination;
export const selectMyCourseClassLoadingGet = (state) => state.courseClass.loadingGet;
export const selectMyCourseClassFilters = (state) => state.courseClass.myClassesFilters;
export const selectLessonVisibilityClasses = (state) => state.courseClass.lessonVisibilityClasses;
export const selectLessonVisibilityClassesLoading = (state) =>
    state.courseClass.loadingLessonVisibilityClasses;
export const selectSwitchLessonVisibilityClassIds = (state) =>
    state.courseClass.loadingSwitchLessonVisibilityClassIds;

export default courseClassSlice.reducer;
