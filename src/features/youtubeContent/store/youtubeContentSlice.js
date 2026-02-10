import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { youtubeContentApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    youtubeContents: [],
    currentYoutubeContent: null,
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
        learningItemId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllYoutubeContentsAsync = createAsyncThunk(
    "youtubeContent/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => youtubeContentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách nội dung YouTube",
        });
    }
);

export const getYoutubeContentByIdAsync = createAsyncThunk(
    "youtubeContent/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => youtubeContentApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin nội dung YouTube",
        });
    }
);

export const createYoutubeContentAsync = createAsyncThunk(
    "youtubeContent/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => youtubeContentApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo nội dung YouTube thành công",
            errorTitle: "Lỗi tạo nội dung YouTube",
        });
    }
);

export const updateYoutubeContentAsync = createAsyncThunk(
    "youtubeContent/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => youtubeContentApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật nội dung YouTube thành công",
            errorTitle: "Lỗi cập nhật nội dung YouTube",
        });
    }
);

export const deleteYoutubeContentAsync = createAsyncThunk(
    "youtubeContent/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => youtubeContentApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa nội dung YouTube thành công",
            errorTitle: "Lỗi xóa nội dung YouTube",
        });
    }
);

export const searchYoutubeContentsAsync = createAsyncThunk(
    "youtubeContent/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => youtubeContentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm nội dung YouTube",
        });
    }
);

export const youtubeContentSlice = createSlice({
    name: "youtubeContent",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearCurrentYoutubeContent: (state) => {
            state.currentYoutubeContent = null;
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
        // Get all youtube contents
        builder
            .addCase(getAllYoutubeContentsAsync.pending, (state) => {
                state.youtubeContents = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllYoutubeContentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.youtubeContents = action.payload.data.youtubeContents;
                state.pagination = action.payload.data.pagination;
                state.error = null;
            })
            .addCase(getAllYoutubeContentsAsync.rejected, (state, action) => {
                state.youtubeContents = [];
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get youtube content by ID
            .addCase(getYoutubeContentByIdAsync.pending, (state) => {
                state.currentYoutubeContent = null;
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getYoutubeContentByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentYoutubeContent = action.payload.data;
                state.error = null;
            })
            .addCase(getYoutubeContentByIdAsync.rejected, (state, action) => {
                state.currentYoutubeContent = null;
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create youtube content
            .addCase(createYoutubeContentAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createYoutubeContentAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.youtubeContents.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createYoutubeContentAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update youtube content
            .addCase(updateYoutubeContentAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateYoutubeContentAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.youtubeContents.findIndex(
                    (item) => item.youtubeContentId === action.payload.data.youtubeContentId
                );
                if (index !== -1) {
                    state.youtubeContents[index] = action.payload.data;
                }
                if (state.currentYoutubeContent?.youtubeContentId === action.payload.data.youtubeContentId) {
                    state.currentYoutubeContent = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateYoutubeContentAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete youtube content
            .addCase(deleteYoutubeContentAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteYoutubeContentAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.youtubeContents = state.youtubeContents.filter(
                    (item) => item.youtubeContentId !== action.meta.arg
                );
                if (state.currentYoutubeContent?.youtubeContentId === action.meta.arg) {
                    state.currentYoutubeContent = null;
                }
                state.error = null;
            })
            .addCase(deleteYoutubeContentAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            // Search youtube contents
            .addCase(searchYoutubeContentsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(searchYoutubeContentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.youtubeContents = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(searchYoutubeContentsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    clearCurrentYoutubeContent,
    resetFilters,
    setPagination,
    resetPagination,
} = youtubeContentSlice.actions;

// Selectors
export const selectYoutubeContents = (state) => state.youtubeContent?.youtubeContents || [];
export const selectCurrentYoutubeContent = (state) => state.youtubeContent?.currentYoutubeContent;
export const selectYoutubeContentPagination = (state) => state.youtubeContent?.pagination || {};
export const selectYoutubeContentFilters = (state) => state.youtubeContent?.filters || {};
export const selectYoutubeContentLoadingGet = (state) => state.youtubeContent?.loadingGet || false;
export const selectYoutubeContentLoadingCreate = (state) => state.youtubeContent?.loadingCreate || false;
export const selectYoutubeContentLoadingUpdate = (state) => state.youtubeContent?.loadingUpdate || false;
export const selectYoutubeContentLoadingDelete = (state) => state.youtubeContent?.loadingDelete || false;
export const selectYoutubeContentError = (state) => state.youtubeContent?.error;

export default youtubeContentSlice.reducer;
