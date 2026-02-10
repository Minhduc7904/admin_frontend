import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { videoContentApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    videoContents: [],
    currentVideoContent: null,
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
export const getAllVideoContentsAsync = createAsyncThunk(
    "videoContent/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => videoContentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách nội dung video",
        });
    }
);

export const getVideoContentByIdAsync = createAsyncThunk(
    "videoContent/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => videoContentApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin nội dung video",
        });
    }
);

export const createVideoContentAsync = createAsyncThunk(
    "videoContent/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => videoContentApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo nội dung video thành công",
            errorTitle: "Lỗi tạo nội dung video",
        });
    }
);

export const updateVideoContentAsync = createAsyncThunk(
    "videoContent/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => videoContentApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật nội dung video thành công",
            errorTitle: "Lỗi cập nhật nội dung video",
        });
    }
);

export const deleteVideoContentAsync = createAsyncThunk(
    "videoContent/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => videoContentApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa nội dung video thành công",
            errorTitle: "Lỗi xóa nội dung video",
        });
    }
);

export const searchVideoContentsAsync = createAsyncThunk(
    "videoContent/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => videoContentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm nội dung video",
        });
    }
);

export const videoContentSlice = createSlice({
    name: "videoContent",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearCurrentVideoContent: (state) => {
            state.currentVideoContent = null;
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
        // Get all video contents
        builder
            .addCase(getAllVideoContentsAsync.pending, (state) => {
                state.videoContents = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllVideoContentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.videoContents = action.payload.data.videoContents;
                state.pagination = action.payload.data.pagination;
                state.error = null;
            })
            .addCase(getAllVideoContentsAsync.rejected, (state, action) => {
                state.videoContents = [];
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get video content by ID
            .addCase(getVideoContentByIdAsync.pending, (state) => {
                state.currentVideoContent = null;
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getVideoContentByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentVideoContent = action.payload.data;
                state.error = null;
            })
            .addCase(getVideoContentByIdAsync.rejected, (state, action) => {
                state.currentVideoContent = null;
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create video content
            .addCase(createVideoContentAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createVideoContentAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.videoContents.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createVideoContentAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update video content
            .addCase(updateVideoContentAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateVideoContentAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.videoContents.findIndex(
                    (item) => item.videoContentId === action.payload.data.videoContentId
                );
                if (index !== -1) {
                    state.videoContents[index] = action.payload.data;
                }
                if (state.currentVideoContent?.videoContentId === action.payload.data.videoContentId) {
                    state.currentVideoContent = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateVideoContentAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete video content
            .addCase(deleteVideoContentAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteVideoContentAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.videoContents = state.videoContents.filter(
                    (item) => item.videoContentId !== action.meta.arg
                );
                if (state.currentVideoContent?.videoContentId === action.meta.arg) {
                    state.currentVideoContent = null;
                }
                state.error = null;
            })
            .addCase(deleteVideoContentAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            // Search video contents
            .addCase(searchVideoContentsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(searchVideoContentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.videoContents = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(searchVideoContentsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    clearCurrentVideoContent,
    resetFilters,
    setPagination,
    resetPagination,
} = videoContentSlice.actions;

// Selectors
export const selectVideoContents = (state) => state.videoContent?.videoContents || [];
export const selectCurrentVideoContent = (state) => state.videoContent?.currentVideoContent;
export const selectVideoContentPagination = (state) => state.videoContent?.pagination || {};
export const selectVideoContentFilters = (state) => state.videoContent?.filters || {};
export const selectVideoContentLoadingGet = (state) => state.videoContent?.loadingGet || false;
export const selectVideoContentLoadingCreate = (state) => state.videoContent?.loadingCreate || false;
export const selectVideoContentLoadingUpdate = (state) => state.videoContent?.loadingUpdate || false;
export const selectVideoContentLoadingDelete = (state) => state.videoContent?.loadingDelete || false;
export const selectVideoContentError = (state) => state.videoContent?.error;

export default videoContentSlice.reducer;
