import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { homeworkContentApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    homeworkContents: [],
    currentHomeworkContent: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    // By-course state (no pagination)
    byCourseHomeworkContents: [],
    byCourseTotal: 0,
    loadingGetByCourse: false,
    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    filters: {
        search: "",
        learningItemId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllHomeworkContentsAsync = createAsyncThunk(
    "homeworkContent/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => homeworkContentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách nội dung bài tập",
        });
    }
);

export const getHomeworkContentByIdAsync = createAsyncThunk(
    "homeworkContent/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => homeworkContentApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin nội dung bài tập",
        });
    }
);

export const createHomeworkContentAsync = createAsyncThunk(
    "homeworkContent/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => homeworkContentApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo nội dung bài tập thành công",
            errorTitle: "Lỗi tạo nội dung bài tập",
        });
    }
);

export const updateHomeworkContentAsync = createAsyncThunk(
    "homeworkContent/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => homeworkContentApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật nội dung bài tập thành công",
            errorTitle: "Lỗi cập nhật nội dung bài tập",
        });
    }
);

export const deleteHomeworkContentAsync = createAsyncThunk(
    "homeworkContent/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => homeworkContentApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa nội dung bài tập thành công",
            errorTitle: "Lỗi xóa nội dung bài tập",
        });
    }
);

export const getHomeworkContentsByCourseAsync = createAsyncThunk(
    "homeworkContent/getByCourse",
    async (courseId, thunkAPI) => {
        return handleAsyncThunk(() => homeworkContentApi.getByCourse(courseId), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải bài tập theo khoá học",
        });
    }
);

export const searchHomeworkContentsAsync = createAsyncThunk(
    "homeworkContent/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => homeworkContentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm nội dung bài tập",
        });
    }
);

export const homeworkContentSlice = createSlice({
    name: "homeworkContent",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearCurrentHomeworkContent: (state) => {
            state.currentHomeworkContent = null;
        },
        clearByCourseHomeworkContents: (state) => {
            state.byCourseHomeworkContents = [];
            state.byCourseTotal = 0;
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
        // Get all homework contents
        builder
            .addCase(getAllHomeworkContentsAsync.pending, (state) => {
                state.homeworkContents = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllHomeworkContentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.homeworkContents = action.payload.data.homeworkContents;
                state.pagination = action.payload.data.pagination;
                state.error = null;
            })
            .addCase(getAllHomeworkContentsAsync.rejected, (state, action) => {
                state.homeworkContents = [];
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get homework content by ID
            .addCase(getHomeworkContentByIdAsync.pending, (state) => {
                state.currentHomeworkContent = null;
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getHomeworkContentByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentHomeworkContent = action.payload.data;
                state.error = null;
            })
            .addCase(getHomeworkContentByIdAsync.rejected, (state, action) => {
                state.currentHomeworkContent = null;
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create homework content
            .addCase(createHomeworkContentAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createHomeworkContentAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.homeworkContents.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createHomeworkContentAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update homework content
            .addCase(updateHomeworkContentAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateHomeworkContentAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.homeworkContents.findIndex(
                    (item) => item.homeworkContentId === action.payload.data.homeworkContentId
                );
                if (index !== -1) {
                    state.homeworkContents[index] = action.payload.data;
                }
                if (state.currentHomeworkContent?.homeworkContentId === action.payload.data.homeworkContentId) {
                    state.currentHomeworkContent = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateHomeworkContentAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete homework content
            .addCase(deleteHomeworkContentAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteHomeworkContentAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.homeworkContents = state.homeworkContents.filter(
                    (item) => item.homeworkContentId !== action.meta.arg
                );
                if (state.currentHomeworkContent?.homeworkContentId === action.meta.arg) {
                    state.currentHomeworkContent = null;
                }
                state.error = null;
            })
            .addCase(deleteHomeworkContentAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            // Get homework contents by course
            .addCase(getHomeworkContentsByCourseAsync.pending, (state) => {
                state.byCourseHomeworkContents = [];
                state.byCourseTotal = 0;
                state.loadingGetByCourse = true;
                state.error = null;
            })
            .addCase(getHomeworkContentsByCourseAsync.fulfilled, (state, action) => {
                state.loadingGetByCourse = false;
                state.byCourseHomeworkContents = action.payload.data.homeworkContents;
                state.byCourseTotal = action.payload.data.total;
                state.error = null;
            })
            .addCase(getHomeworkContentsByCourseAsync.rejected, (state, action) => {
                state.loadingGetByCourse = false;
                state.error = action.payload;
            })

            // Search homework contents
            .addCase(searchHomeworkContentsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(searchHomeworkContentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.homeworkContents = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(searchHomeworkContentsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    clearCurrentHomeworkContent,
    clearByCourseHomeworkContents,
    resetFilters,
    setPagination,
    resetPagination,
} = homeworkContentSlice.actions;

// Selectors
export const selectHomeworkContents = (state) => state.homeworkContent.homeworkContents;
export const selectByCourseHomeworkContents = (state) => state.homeworkContent.byCourseHomeworkContents;
export const selectByCourseHomeworkTotal = (state) => state.homeworkContent.byCourseTotal;
export const selectHomeworkContentLoadingGetByCourse = (state) => state.homeworkContent.loadingGetByCourse;
export const selectCurrentHomeworkContent = (state) => state.homeworkContent.currentHomeworkContent;
export const selectHomeworkContentPagination = (state) => state.homeworkContent.pagination;
export const selectHomeworkContentFilters = (state) => state.homeworkContent.filters;
export const selectHomeworkContentLoadingGet = (state) => state.homeworkContent.loadingGet;
export const selectHomeworkContentLoadingCreate = (state) => state.homeworkContent.loadingCreate;
export const selectHomeworkContentLoadingUpdate = (state) => state.homeworkContent.loadingUpdate;
export const selectHomeworkContentLoadingDelete = (state) => state.homeworkContent.loadingDelete;
export const selectHomeworkContentError = (state) => state.homeworkContent.error;

export default homeworkContentSlice.reducer;
