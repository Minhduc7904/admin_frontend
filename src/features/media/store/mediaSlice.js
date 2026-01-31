import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mediaApi } from "../../../core/api/mediaApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    media: [],
    currentMedia: null,
    buckets: [],
    bucketStatistics: null,
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
    loadingGetPresignedUrl: false,
    loadingCompleteUpload: false,
    loadingBuckets: false,
    loadingBucketStatistics: false,
    loadingUpload: false,
    loadingUpdate: false,
    loadingSoftDelete: false,
    loadingHardDelete: false,
    loadingDownloadUrl: false,
    loadingViewUrl: false,
    loadingBatchViewUrl: false,
    loadingExtractText: false,
    extractedText: null,
    loadingAdminRawContent: false,
    loadingMyRawContent: false,
    rawContent: null,
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

export const getPresignedUploadUrlAsync = createAsyncThunk(
    "media/getPresignedUploadUrl",
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => mediaApi.getPresignedUploadUrl(data),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi lấy URL tải lên",
            }
        );
    }
);

export const postUploadCompleteAsync = createAsyncThunk(
    "media/postUploadComplete",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.postUploadComplete(data), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi hoàn tất tải lên",
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

export const getMyMediaAsync = createAsyncThunk(
    "media/getMy",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.getMy(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách media của tôi",
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
        return handleAsyncThunk(
            () => mediaApi.getDownloadUrl(id, expiry),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tạo link tải xuống",
            }
        );
    }
);

export const getAdminMediaDownloadUrlAsync = createAsyncThunk(
    "media/getAdminDownloadUrl",
    async ({ id, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(
            () => mediaApi.getAdminDownloadUrl(id, expiry),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tạo link tải xuống quản trị",
            }
        );
    }
);

export const getMyMediaDownloadUrlAsync = createAsyncThunk(
    "media/getMyDownloadUrl",
    async ({ id, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(
            () => mediaApi.getMyDownloadUrl(id, expiry),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tạo link tải xuống của tôi",
            }
        );
    }
);

export const getBatchMyMediaViewUrlAsync = createAsyncThunk(
    "media/getBatchMyViewUrl",
    async ({ mediaIds, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(
            () => mediaApi.getBatchMyViewUrl(mediaIds, expiry),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tạo link xem hàng loạt",
            }
        );
    }
);

export const getViewUrlAsync = createAsyncThunk(
    "media/getViewUrl",
    async ({ id, expiry = 3600, context = {} }, thunkAPI) => {
        return handleAsyncThunk(
            () => mediaApi.getViewUrl(id, expiry, context),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tạo link xem",
            }
        );
    }
);

export const getAdminViewUrlAsync = createAsyncThunk(
    "media/getAdminViewUrl",
    async ({ id, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(
            () => mediaApi.getAdminViewUrl(id, expiry),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tạo link xem quản trị",
            }
        );
    }
);

export const getMyViewUrlAsync = createAsyncThunk(
    "media/getMyViewUrl",
    async ({ id, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.getMyViewUrl(id, expiry), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tạo link xem của tôi",
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

export const softDeleteMediaByUserAsync = createAsyncThunk(
    "media/softDeleteByUser",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.softDeleteByUser(id), thunkAPI, {
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

export const getBucketStatisticsAsync = createAsyncThunk(
    "media/getBucketStatistics",
    async (_, thunkAPI) => {
        return handleAsyncThunk(() => mediaApi.getBucketStatistics(), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thống kê bucket",
        });
    }
);

export const extractTextAsync = createAsyncThunk(
    "media/extractText",
    async ({ id, includeImageBase64 = false }, thunkAPI) => {
        return handleAsyncThunk(
            () => mediaApi.extractText(id, { includeImageBase64 }),
            thunkAPI,
            {
                successTitle: "Trích xuất văn bản thành công",
                successMessage: "Văn bản đã được trích xuất từ file",
                errorTitle: "Trích xuất văn bản thất bại",
            }
        );
    }
);

export const getAdminRawContentAsync = createAsyncThunk(
    "media/getAdminRawContent",
    async ({ id, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(
            () => mediaApi.getAdminRawContent(id, expiry),
            thunkAPI,
            {
                successTitle: "Lấy nội dung thành công",
                successMessage: "Nội dung đã được tải",
                errorTitle: "Lấy nội dung thất bại",
            }
        );
    }
);

export const getMyRawContentAsync = createAsyncThunk(
    "media/getMyRawContent",
    async ({ id, expiry = 3600 }, thunkAPI) => {
        return handleAsyncThunk(
            () => mediaApi.getMyRawContent(id, expiry),
            thunkAPI,
            {
                successTitle: "Lấy nội dung thành công",
                successMessage: "Nội dung đã được tải",
                errorTitle: "Lấy nội dung thất bại",
            }
        );
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
        clearBucketStatistics: (state) => {
            state.bucketStatistics = null;
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
            // Get Presigned Upload URL
            .addCase(getPresignedUploadUrlAsync.pending, (state) => {
                state.loadingGetPresignedUrl = true;
                state.error = null;
            })
            .addCase(getPresignedUploadUrlAsync.fulfilled, (state, action) => {
                state.loadingGetPresignedUrl = false;
                state.error = null;
            })
            .addCase(getPresignedUploadUrlAsync.rejected, (state, action) => {
                state.loadingGetPresignedUrl = false;
                state.error = action.payload;
            })
            // Post Upload Complete
            .addCase(postUploadCompleteAsync.pending, (state) => {
                state.loadingCompleteUpload = true;
                state.error = null;
            })
            .addCase(postUploadCompleteAsync.fulfilled, (state, action) => {
                state.loadingCompleteUpload = false;
                state.media.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(postUploadCompleteAsync.rejected, (state, action) => {
                state.loadingCompleteUpload = false;
                state.error = action.payload;
            })
            // Get All Media
            .addCase(getAllMediaAsync.pending, (state) => {
                state.media = [];
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
                state.media = [];
                state.loadingGet = false;
                state.error = action.payload;
            })
            // get My Media
            .addCase(getMyMediaAsync.pending, (state) => {
                state.media = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getMyMediaAsync.fulfilled, (state, action) => {
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
            .addCase(getMyMediaAsync.rejected, (state, action) => {
                state.media = [];
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
            // Get Admin Media Download URL
            .addCase(getAdminMediaDownloadUrlAsync.pending, (state) => {
                state.loadingDownloadUrl = true;
                state.error = null;
            })
            .addCase(getAdminMediaDownloadUrlAsync.fulfilled, (state, action) => {
                state.loadingDownloadUrl = false;
                state.downloadUrl = action.payload.data;
                state.error = null;
            })
            // Get My Media Download URL
            .addCase(getMyMediaDownloadUrlAsync.pending, (state) => {
                state.loadingDownloadUrl = true;
                state.error = null;
            })
            .addCase(getMyMediaDownloadUrlAsync.fulfilled, (state, action) => {
                state.loadingDownloadUrl = false;
                state.error = null;
            })
            .addCase(getMyMediaDownloadUrlAsync.rejected, (state, action) => {
                state.loadingDownloadUrl = false;
                state.error = action.payload;
            })
            // Get Batch My Media View URL
            .addCase(getBatchMyMediaViewUrlAsync.pending, (state) => {
                state.loadingBatchViewUrl = true;
                state.error = null;
            })
            .addCase(getBatchMyMediaViewUrlAsync.fulfilled, (state, action) => {
                state.loadingBatchViewUrl = false;
                state.batchViewUrls = action.payload.data;
                state.error = null;
            })
            .addCase(getBatchMyMediaViewUrlAsync.rejected, (state, action) => {
                state.loadingBatchViewUrl = false;
                state.error = action.payload;
            })

            // Get View URL
            .addCase(getViewUrlAsync.pending, (state) => {
                state.loadingViewUrl = true;
                state.error = null;
            })
            .addCase(getViewUrlAsync.fulfilled, (state, action) => {
                state.loadingViewUrl = false;
                state.error = null;
            })
            .addCase(getViewUrlAsync.rejected, (state, action) => {
                state.loadingViewUrl = false;
                state.error = action.payload;
            })

            // Get Admin View Url
            .addCase(getAdminViewUrlAsync.pending, (state) => {
                state.loadingViewUrl = true;
                state.error = null;
            })
            .addCase(getAdminViewUrlAsync.fulfilled, (state) => {
                state.loadingViewUrl = false;
                state.error = null;
            })
            .addCase(getAdminViewUrlAsync.rejected, (state, action) => {
                state.loadingViewUrl = false;
                state.error = action.payload;
            })

            // Get My View URL
            .addCase(getMyViewUrlAsync.pending, (state) => {
                state.loadingViewUrl = true;
                state.error = null;
            })
            .addCase(getMyViewUrlAsync.fulfilled, (state, action) => {
                state.loadingViewUrl = false;
                state.error = null;
            })
            .addCase(getMyViewUrlAsync.rejected, (state, action) => {
                state.loadingViewUrl = false;
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
                    state.media[index].status = "DELETED";
                }
                state.error = null;
            })
            .addCase(softDeleteMediaAsync.rejected, (state, action) => {
                state.loadingSoftDelete = false;
                state.error = action.payload;
            })
            // Soft Delete Media By User
            .addCase(softDeleteMediaByUserAsync.pending, (state) => {
                state.loadingSoftDelete = true;
                state.error = null;
            })
            .addCase(softDeleteMediaByUserAsync.fulfilled, (state, action) => {
                state.loadingSoftDelete = false;
                // Update media status to DELETED instead of removing from list
                const index = state.media.findIndex(
                    (m) => m.mediaId === action.meta.arg
                );
                if (index !== -1) {
                    state.media[index].status = "DELETED";
                }
                state.error = null;
            })
            .addCase(softDeleteMediaByUserAsync.rejected, (state, action) => {
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
                state.media = state.media.filter((m) => m.mediaId !== action.meta.arg);
                if (state.currentMedia?.mediaId === action.meta.arg) {
                    state.currentMedia = null;
                }
                state.error = null;
            })
            .addCase(hardDeleteMediaAsync.rejected, (state, action) => {
                state.loadingHardDelete = false;
                state.error = action.payload;
            })
            // Get Bucket Statistics
            .addCase(getBucketStatisticsAsync.pending, (state) => {
                state.loadingBucketStatistics = true;
                state.error = null;
            })
            .addCase(getBucketStatisticsAsync.fulfilled, (state, action) => {
                state.loadingBucketStatistics = false;
                state.bucketStatistics = action.payload.data;
                state.error = null;
            })
            .addCase(getBucketStatisticsAsync.rejected, (state, action) => {
                state.loadingBucketStatistics = false;
                state.error = action.payload;
            })
            // Extract Text
            .addCase(extractTextAsync.pending, (state) => {
                state.loadingExtractText = true;
                state.extractedText = null;
                state.error = null;
            })
            .addCase(extractTextAsync.fulfilled, (state, action) => {
                state.loadingExtractText = false;
                state.extractedText = action.payload.data;
                state.error = null;
            })
            .addCase(extractTextAsync.rejected, (state, action) => {
                state.loadingExtractText = false;
                state.error = action.payload;
            })
            // Get Admin Raw Content
            .addCase(getAdminRawContentAsync.pending, (state) => {
                state.loadingAdminRawContent = true;
                state.rawContent = null;
                state.error = null;
            })
            .addCase(getAdminRawContentAsync.fulfilled, (state, action) => {
                state.loadingAdminRawContent = false;
                state.rawContent = action.payload.data;
                state.error = null;
            })
            .addCase(getAdminRawContentAsync.rejected, (state, action) => {
                state.loadingAdminRawContent = false;
                state.error = action.payload;
            })
            // Get My Raw Content
            .addCase(getMyRawContentAsync.pending, (state) => {
                state.loadingMyRawContent = true;
                state.rawContent = null;
                state.error = null;
            })
            .addCase(getMyRawContentAsync.fulfilled, (state, action) => {
                state.loadingMyRawContent = false;
                state.rawContent = action.payload.data;
                state.error = null;
            })
            .addCase(getMyRawContentAsync.rejected, (state, action) => {
                state.loadingMyRawContent = false;
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
    clearBucketStatistics,
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
export const selectMediaLoadingGetPresignedUrl = (state) =>
    state.media.loadingGetPresignedUrl;
export const selectMediaLoadingCompleteUpload = (state) =>
    state.media.loadingCompleteUpload;
export const selectMediaLoadingUpdate = (state) => state.media.loadingUpdate;
export const selectMediaLoadingSoftDelete = (state) =>
    state.media.loadingSoftDelete;
export const selectMediaLoadingHardDelete = (state) =>
    state.media.loadingHardDelete;
export const selectMediaLoadingDownloadUrl = (state) =>
    state.media.loadingDownloadUrl;
export const selectMediaLoadingBatchViewUrl = (state) =>
    state.media.loadingBatchViewUrl;
export const selectMediaError = (state) => state.media.error;
export const selectMediaFilters = (state) => state.media.filters;
export const selectMediaDownloadUrl = (state) => state.media.downloadUrl;
export const selectMediaBatchViewUrls = (state) => state.media.batchViewUrls;
export const selectBucketStatistics = (state) => state.media.bucketStatistics;
export const selectBucketStatisticsLoading = (state) =>
    state.media.loadingBucketStatistics;
export const selectMediaLoadingViewUrl = (state) => state.media.loadingViewUrl;
export const selectMediaLoadingExtractText = (state) => state.media.loadingExtractText;
export const selectExtractedText = (state) => state.media.extractedText;
export const selectMediaLoadingAdminRawContent = (state) => state.media.loadingAdminRawContent;
export const selectMediaLoadingMyRawContent = (state) => state.media.loadingMyRawContent;
export const selectMediaRawContent = (state) => state.media.rawContent;

export default mediaSlice.reducer;
