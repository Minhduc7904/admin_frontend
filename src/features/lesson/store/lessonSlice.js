import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";
import { createLessonLearningItemAsync, deleteLessonLearningItemAsync } from "../../lessonLearningitem/store/lessonLearningItemSlice";
import { createLearningItemAsync } from "../../learningItem/store/learningItemSlice";
const initialState = {
    lessons: [],
    currentLesson: null,
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
        teacherId: "",
        sortBy: "orderInCourse",
        sortOrder: "asc",
    },
};

// Async thunks
export const getAllLessonsAsync = createAsyncThunk(
    "lesson/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => lessonApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách bài học",
        });
    }
);

export const getLessonByIdAsync = createAsyncThunk(
    "lesson/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => lessonApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin bài học",
        });
    }
);

export const createLessonAsync = createAsyncThunk(
    "lesson/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => lessonApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo bài học thành công",
            errorTitle: "Lỗi tạo bài học",
        });
    }
);

export const updateLessonAsync = createAsyncThunk(
    "lesson/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => lessonApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật bài học thành công",
            errorTitle: "Lỗi cập nhật bài học",
        });
    }
);

export const deleteLessonAsync = createAsyncThunk(
    "lesson/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => lessonApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa bài học thành công",
            errorTitle: "Lỗi xóa bài học",
        });
    }
);

export const searchLessonsAsync = createAsyncThunk(
    "lesson/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => lessonApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm bài học",
        });
    }
);

export const lessonSlice = createSlice({
    name: "lesson",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearCurrentLesson: (state) => {
            state.currentLesson = null;
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        resetPagination: (state) => {
            state.pagination = initialState.pagination;
        },
    },
    extraReducers: (builder) => {
        // Get all lessons
        builder
            .addCase(getAllLessonsAsync.pending, (state) => {
                state.lessons = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllLessonsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.lessons = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllLessonsAsync.rejected, (state, action) => {
                state.lessons = [];
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get lesson by ID
            .addCase(getLessonByIdAsync.pending, (state) => {
                state.currentLesson = null;
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getLessonByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentLesson = action.payload.data;
                state.error = null;
            })
            .addCase(getLessonByIdAsync.rejected, (state, action) => {
                state.currentLesson = null;
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create lesson
            .addCase(createLessonAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createLessonAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.error = null;
            })
            .addCase(createLessonAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update lesson
            .addCase(updateLessonAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateLessonAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.lessons.findIndex(
                    (lesson) => lesson.lessonId === action.payload.data.lessonId
                );
                if (index !== -1) {
                    state.lessons[index] = action.payload.data;
                }
                if (
                    state.currentLesson &&
                    state.currentLesson.lessonId === action.payload.data.lessonId
                ) {
                    state.currentLesson = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateLessonAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete lesson
            .addCase(deleteLessonAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteLessonAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.lessons = state.lessons.filter(
                    (lesson) => lesson.lessonId !== action.meta.arg
                );
                state.error = null;
            })
            .addCase(deleteLessonAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            // Listen to lessonLearningItem changes to update count
            // When learning item is added to lesson
            .addCase(createLessonLearningItemAsync.fulfilled, (state, action) => {
                const lessonId = action.meta.arg.lessonId;
                const lessonIndex = state.lessons.findIndex(l => l.lessonId === lessonId);

                if (lessonIndex !== -1) {
                    state.lessons[lessonIndex].learningItemsCount = 
                        (state.lessons[lessonIndex].learningItemsCount || 0) + 1;
                }
                
                if (state.currentLesson && state.currentLesson.lessonId === lessonId) {
                    state.currentLesson.learningItemsCount = 
                        (state.currentLesson.learningItemsCount || 0) + 1;
                }
            })

            // 
            .addCase(createLearningItemAsync.fulfilled, (state, action) => {
                const { lessonId } = action.meta.arg;
                const lessonIndex = state.lessons.findIndex(l => l.lessonId === lessonId);
                if (lessonIndex !== -1) {
                    state.lessons[lessonIndex].learningItemsCount = 
                        (state.lessons[lessonIndex].learningItemsCount || 0) + 1;
                }
                if (state.currentLesson && state.currentLesson.lessonId === lessonId) {
                    state.currentLesson.learningItemsCount = 
                        (state.currentLesson.learningItemsCount || 0) + 1;
                }
            })
            
            // When learning item is removed from lesson
            .addCase(deleteLessonLearningItemAsync.fulfilled, (state, action) => {
                const lessonId = action.meta.arg.lessonId;
                const lessonIndex = state.lessons.findIndex(l => l.lessonId === lessonId);
                
                if (lessonIndex !== -1 && state.lessons[lessonIndex].learningItemsCount > 0) {
                    state.lessons[lessonIndex].learningItemsCount = 
                        state.lessons[lessonIndex].learningItemsCount - 1;
                }
                
                if (state.currentLesson && state.currentLesson.lessonId === lessonId && 
                    state.currentLesson.learningItemsCount > 0) {
                    state.currentLesson.learningItemsCount = 
                        state.currentLesson.learningItemsCount - 1;
                }
            });
    },
});

export const {
    setFilters,
    clearCurrentLesson,
    resetFilters,
    setPagination,
    resetPagination,
} = lessonSlice.actions;

export const selectLessons = (state) => state.lesson.lessons;
export const selectCurrentLesson = (state) => state.lesson.currentLesson;
export const selectLessonPagination = (state) => state.lesson.pagination;
export const selectLessonLoadingGet = (state) => state.lesson.loadingGet;
export const selectLessonLoadingCreate = (state) => state.lesson.loadingCreate;
export const selectLessonLoadingUpdate = (state) => state.lesson.loadingUpdate;
export const selectLessonLoadingDelete = (state) => state.lesson.loadingDelete;
export const selectLessonError = (state) => state.lesson.error;
export const selectLessonFilters = (state) => state.lesson.filters;

export default lessonSlice.reducer;
