import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mediaApi } from "../../../core/api/mediaApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    media: [],
    currentMedia: null,
    buckets: [],
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingGetById: false,
    loadingBuckets: false,
    loadingUpload: false,
    loadingUpdate: false,
    loadingSoftDelete: false,
    loadingHardDelete: false,
    loadingDownloadUrl: false,
    loadingBatchViewUrl: false,
    error: null,
    filters: {
        search: "",
        folderId: null,
        uploadedBy: null,
        bucketName: "",
        type: "", // IMAGE, VIDEO, AUDIO, DOCUMENT, OTHER
        status: "", // UPLOADING, READY, FAILED, DELETED
        uploadedBy: null,
        sortBy: "createdAt",
        sortOrder: "desc",
    },
    downloadUrl: null,
    batchViewUrls: null,
};

// Async thunks
export const uploadMediaAsync = createAsyncThunk(
    "media/upload",
    async (formData, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.upload(formData), thunkAPI, {
            successTitle: "Tải lên media thành công",
            successMessage: "Media đã được tải lên",
            errorTitle: "Tải lên media thất bại",
        });
    }
);

export const getAllMediaAsync = createAsyncThunk(
    "media/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách media",
        });
    }
);

export const getBucketsAsync = createAsyncThunk(
    "media/getBuckets",
    async (_, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.getBuckets(), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách buckets",
        });
    }
);

export const getMediaByIdAsync = createAsyncThunk(
    "media/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin media",
        });
    }
);

export const getMediaDownloadUrlAsync = createAsyncThunk(
    "media/getDownloadUrl",
    async ({ id, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.getDownloadUrl(id, expiry), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tạo link tải xuống",
        });
    }
);

export const getBatchMediaViewUrlAsync = createAsyncThunk(
    "media/getBatchViewUrl",
    async ({ mediaIds, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.getBatchViewUrl(mediaIds, expiry), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tạo link xem hàng loạt",
        });
    }
);

export const updateMediaAsync = createAsyncThunk(
    "media/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật media thành công",
            successMessage: "Thông tin media đã được cập nhật",
            errorTitle: "Cập nhật media thất bại",
        });
    }
);

export const softDeleteMediaAsync = createAsyncThunk(
    "media/softDelete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.softDelete(id), thunkAPI, {
            successTitle: "Xóa media thành công",
            successMessage: "Media đã được chuyển vào thùng rác",
            errorTitle: "Xóa media thất bại",
        });
    }
);

export const hardDeleteMediaAsync = createAsyncThunk(
    "media/hardDelete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.hardDelete(id), thunkAPI, {
            successTitle: "Xóa vĩnh viễn media thành công",
            successMessage: "Media đã được xóa vĩnh viễn khỏi hệ thống",
            errorTitle: "Xóa vĩnh viễn media thất bại",
        });
    }
);

const mediaSlice = createSlice({
    name: "media",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentMedia: (state) => {
            state.currentMedia = null;
        },
        clearDownloadUrl: (state) => {
            state.downloadUrl = null;
        },
        clearBatchViewUrls: (state) => {
            state.batchViewUrls = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Upload Media
            .addCase(uploadMediaAsync.pending, (state) => {
                state.loadingUpload = true;
                state.error = null;
            })
            .addCase(uploadMediaAsync.fulfilled, (state, action) => {
                state.loadingUpload = false;
                state.media.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(uploadMediaAsync.rejected, (state, action) => {
                state.loadingUpload = false;
                state.error = action.payload;
            })
            // Get All Media
            .addCase(getAllMediaAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllMediaAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                // New structure: { success, message, data: MediaResponseDto[], meta: PaginationMetaDto }
                state.media = action.payload.data;
                state.pagination = {
                    page: action.payload.meta.page,
                    limit: action.payload.meta.limit,
                    total: action.payload.meta.total,
                    totalPages: action.payload.meta.totalPages,
                    hasPrevious: action.payload.meta.hasPrevious,
                    hasNext: action.payload.meta.hasNext,
                };
                state.error = null;
            })
            .addCase(getAllMediaAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Buckets
            .addCase(getBucketsAsync.pending, (state) => {
                state.loadingBuckets = true;
                state.error = null;
            })
            .addCase(getBucketsAsync.fulfilled, (state, action) => {
                state.loadingBuckets = false;
                state.buckets = action.payload.data.data;
                state.error = null;
            })
            .addCase(getBucketsAsync.rejected, (state, action) => {
                state.loadingBuckets = false;
                state.error = action.payload;
            })
            // Get Media By ID
            .addCase(getMediaByIdAsync.pending, (state) => {
                state.loadingGetById = true;
                state.error = null;
            })
            .addCase(getMediaByIdAsync.fulfilled, (state, action) => {
                state.loadingGetById = false;
                state.currentMedia = action.payload.data;
                state.error = null;
            })
            .addCase(getMediaByIdAsync.rejected, (state, action) => {
                state.loadingGetById = false;
                state.error = action.payload;
            })
            // Get Media Download URL
            .addCase(getMediaDownloadUrlAsync.pending, (state) => {
                state.loadingDownloadUrl = true;
                state.error = null;
            })
            .addCase(getMediaDownloadUrlAsync.fulfilled, (state, action) => {
                state.loadingDownloadUrl = false;
                state.downloadUrl = action.payload.data;
                state.error = null;
            })
            .addCase(getMediaDownloadUrlAsync.rejected, (state, action) => {
                state.loadingDownloadUrl = false;
                state.error = action.payload;
            })
            // Get Batch Media View URL
            .addCase(getBatchMediaViewUrlAsync.pending, (state) => {
                state.loadingBatchViewUrl = true;
                state.error = null;
            })
            .addCase(getBatchMediaViewUrlAsync.fulfilled, (state, action) => {
                state.loadingBatchViewUrl = false;
                state.batchViewUrls = action.payload.data;
                state.error = null;
            })
            .addCase(getBatchMediaViewUrlAsync.rejected, (state, action) => {
                state.loadingBatchViewUrl = false;
                state.error = action.payload;
            })
            // Update Media
            .addCase(updateMediaAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateMediaAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.media.findIndex(
                    (m) => m.mediaId === action.payload.data.mediaId
                );
                if (index !== -1) {
                    state.media[index] = action.payload.data;
                }
                if (state.currentMedia?.mediaId === action.payload.data.mediaId) {
                    state.currentMedia = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateMediaAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Soft Delete Media
            .addCase(softDeleteMediaAsync.pending, (state) => {
                state.loadingSoftDelete = true;
                state.error = null;
            })
            .addCase(softDeleteMediaAsync.fulfilled, (state, action) => {
                state.loadingSoftDelete = false;
                // Update media status to DELETED instead of removing from list
                const index = state.media.findIndex(
                    (m) => m.mediaId === action.meta.arg
                );
                if (index !== -1) {
                    state.media[index].status = 'DELETED';
                }
                state.error = null;
            })
            .addCase(softDeleteMediaAsync.rejected, (state, action) => {
                state.loadingSoftDelete = false;
                state.error = action.payload;
            })
            // Hard Delete Media
            .addCase(hardDeleteMediaAsync.pending, (state) => {
                state.loadingHardDelete = true;
                state.error = null;
            })
            .addCase(hardDeleteMediaAsync.fulfilled, (state, action) => {
                state.loadingHardDelete = false;
                // Remove from list completely
                state.media = state.media.filter(
                    (m) => m.mediaId !== action.meta.arg
                );
                if (state.currentMedia?.mediaId === action.meta.arg) {
                    state.currentMedia = null;
                }
                state.error = null;
            })
            .addCase(hardDeleteMediaAsync.rejected, (state, action) => {
                state.loadingHardDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    resetFilters,
    clearCurrentMedia,
    clearDownloadUrl,
    clearBatchViewUrls,
    clearError,
} = mediaSlice.actions;

// Selectors
export const selectMedia = (state) => state.media.media;
export const selectCurrentMedia = (state) => state.media.currentMedia;
export const selectBuckets = (state) => state.media.buckets || [];
export const selectMediaPagination = (state) => state.media.pagination;
export const selectMediaLoadingGet = (state) => state.media.loadingGet;
export const selectMediaLoadingGetById = (state) => state.media.loadingGetById;
export const selectMediaLoadingBuckets = (state) => state.media.loadingBuckets;
export const selectMediaLoadingUpload = (state) => state.media.loadingUpload;
export const selectMediaLoadingUpdate = (state) => state.media.loadingUpdate;
export const selectMediaLoadingSoftDelete = (state) => state.media.loadingSoftDelete;
export const selectMediaLoadingHardDelete = (state) => state.media.loadingHardDelete;
export const selectMediaLoadingDownloadUrl = (state) => state.media.loadingDownloadUrl;
export const selectMediaLoadingBatchViewUrl = (state) => state.media.loadingBatchViewUrl;
export const selectMediaError = (state) => state.media.error;
export const selectMediaFilters = (state) => state.media.filters;
export const selectMediaDownloadUrl = (state) => state.media.downloadUrl;
export const selectMediaBatchViewUrls = (state) => state.media.batchViewUrls;

export default mediaSlice.reducer;
