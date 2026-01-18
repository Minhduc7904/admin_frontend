import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonLearningItemApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    lessonLearningItems: [],
    currentLessonLearningItem: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: {},
    loadingGetById: false,
    loadingCreate: false,
    loadingDelete: false,
    error: null,
    filters: {
        lessonId: "",
        learningItemId: "",
        sortBy: "order",
        sortOrder: "asc",
    },
};

// Async thunks
export const getAllLessonLearningItemsAsync = createAsyncThunk(
    "lessonLearningItem/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => lessonLearningItemApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách tài liệu trong bài học",
        });
    }
);

export const getLessonLearningItemByIdAsync = createAsyncThunk(
    "lessonLearningItem/getById",
    async ({ lessonId, learningItemId }, thunkAPI) => {
        return handleAsyncThunk(() => lessonLearningItemApi.getById(lessonId, learningItemId), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin tài liệu trong bài học",
        });
    }
);

export const createLessonLearningItemAsync = createAsyncThunk(
    "lessonLearningItem/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => lessonLearningItemApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Thêm tài liệu vào bài học thành công",
            errorTitle: "Lỗi thêm tài liệu vào bài học",
        });
    }
);

export const deleteLessonLearningItemAsync = createAsyncThunk(
    "lessonLearningItem/delete",
    async ({ lessonId, learningItemId }, thunkAPI) => {
        return handleAsyncThunk(() => lessonLearningItemApi.delete(lessonId, learningItemId), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa tài liệu khỏi bài học thành công",
            errorTitle: "Lỗi xóa tài liệu khỏi bài học",
        });
    }
);

export const lessonLearningItemSlice = createSlice({
    name: "lessonLearningItem",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearCurrentLessonLearningItem: (state) => {
            state.currentLessonLearningItem = null;
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
        clearLessonLearningItems: (state, action) => {
            if (action.payload) {
                delete state.lessonLearningItems[action.payload];
            } else {
                state.lessonLearningItems = {};
            }
        },
    },
    extraReducers: (builder) => {
        // Get all lesson learning items
        builder
            .addCase(getAllLessonLearningItemsAsync.pending, (state, action) => {
                const lessonId = action.meta.arg.lessonId;
                if (lessonId) {
                    state.lessonLearningItems[lessonId] = [];
                }
                state.loadingGet[lessonId] = true;
                state.error = null;
            })
            .addCase(getAllLessonLearningItemsAsync.fulfilled, (state, action) => {
                const lessonId = action.meta.arg.lessonId;
                state.loadingGet[lessonId] = false;
                if (lessonId) {
                    state.lessonLearningItems[lessonId] = action.payload.data?.lessonLearningItems || [];
                }
                state.pagination = action.payload.data?.pagination || state.pagination;
                state.error = null;
            })
            .addCase(getAllLessonLearningItemsAsync.rejected, (state, action) => {
                const lessonId = action.meta.arg?.lessonId;
                if (lessonId) {
                    state.lessonLearningItems[lessonId] = [];
                }
                state.loadingGet[lessonId] = false;
                state.error = action.payload;
            })

            // Get lesson learning item by ID
            .addCase(getLessonLearningItemByIdAsync.pending, (state) => {
                state.currentLessonLearningItem = null;
                state.loadingGetById = true;
                state.error = null;
            })
            .addCase(getLessonLearningItemByIdAsync.fulfilled, (state, action) => {
                state.loadingGetById = false;
                state.currentLessonLearningItem = action.payload.data;
                state.error = null;
            })
            .addCase(getLessonLearningItemByIdAsync.rejected, (state, action) => {
                state.currentLessonLearningItem = null;
                state.loadingGetById = false;
                state.error = action.payload;
            })

            // Create lesson learning item
            .addCase(createLessonLearningItemAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createLessonLearningItemAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.error = null;
            })
            .addCase(createLessonLearningItemAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Delete lesson learning item
            .addCase(deleteLessonLearningItemAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteLessonLearningItemAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                const { lessonId, learningItemId } = action.meta.arg;
                if (state.lessonLearningItems[lessonId]) {
                    state.lessonLearningItems[lessonId] = state.lessonLearningItems[lessonId].filter(
                        (item) => item.learningItemId !== learningItemId
                    );
                }
                state.error = null;
            })
            .addCase(deleteLessonLearningItemAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    clearCurrentLessonLearningItem,
    resetFilters,
    setPagination,
    resetPagination,
    clearLessonLearningItems,
} = lessonLearningItemSlice.actions;

export const selectLessonLearningItems = (lessonId) => (state) =>
    state.lessonLearningItem.lessonLearningItems[lessonId] || [];
export const selectCurrentLessonLearningItem = (state) => state.lessonLearningItem.currentLessonLearningItem;
export const selectLessonLearningItemPagination = (state) => state.lessonLearningItem.pagination;
export const selectLessonLearningItemLoadingGet = (lessonId) => (state) =>
    state.lessonLearningItem.loadingGet[lessonId] || false;
export const selectLessonLearningItemLoadingCreate = (state) => state.lessonLearningItem.loadingCreate;
export const selectLessonLearningItemLoadingDelete = (state) => state.lessonLearningItem.loadingDelete;
export const selectLessonLearningItemError = (state) => state.lessonLearningItem.error;
export const selectLessonLearningItemFilters = (state) => state.lessonLearningItem.filters;
export const selectLessonLearningItemLoadingGetById = (state) => state.lessonLearningItem.loadingGetById;

export default lessonLearningItemSlice.reducer;
