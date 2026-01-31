import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mediaUsageApi } from "../../../core/api/mediaUsageApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    usages: [],
    currentUsage: null,
    mediaUsages: [], // Usages by specific media
    entityUsages: [], // Usages by specific entity
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingAttach: false,
    loadingDetach: false,
    loadingByMedia: false,
    loadingByEntity: false,
    error: null,
    filters: {
        mediaId: null,
        entityType: "",
        entityId: null,
        context: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const attachMediaAsync = createAsyncThunk(
    "mediaUsage/attach",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => mediaUsageApi.attach(data), thunkAPI, {
            successTitle: "Gắn media thành công",
            successMessage: "Media đã được gắn vào đối tượng",
            errorTitle: "Gắn media thất bại",
        });
    }
);

export const getAllMediaUsagesAsync = createAsyncThunk(
    "mediaUsage/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => mediaUsageApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách sử dụng media",
        });
    }
);

export const getMediaUsagesByMediaAsync = createAsyncThunk(
    "mediaUsage/getByMedia",
    async (mediaId, thunkAPI) => {
        return handleAsyncThunk(() => mediaUsageApi.getByMedia(mediaId), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin sử dụng media",
        });
    }
);

export const getMediaUsagesByEntityAsync = createAsyncThunk(
    "mediaUsage/getByEntity",
    async ({ entityType, entityId }, thunkAPI) => {
        return handleAsyncThunk(() => mediaUsageApi.getByEntity(entityType, entityId), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải media của đối tượng",
        });
    }
);

export const detachMediaAsync = createAsyncThunk(
    "mediaUsage/detach",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => mediaUsageApi.detach(id), thunkAPI, {
            successTitle: "Gỡ media thành công",
            successMessage: "Media đã được gỡ khỏi đối tượng",
            errorTitle: "Gỡ media thất bại",
        });
    }
);

export const detachMediaByEntityAsync = createAsyncThunk(
    "mediaUsage/detachByEntity",
    async ({ entityType, entityId }, thunkAPI) => {
        return handleAsyncThunk(() => mediaUsageApi.detachByEntity(entityType, entityId), thunkAPI, {
            successTitle: "Gỡ tất cả media thành công",
            successMessage: "Tất cả media đã được gỡ khỏi đối tượng",
            errorTitle: "Gỡ media thất bại",
        });
    }
);

const mediaUsageSlice = createSlice({
    name: "mediaUsage",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentUsage: (state) => {
            state.currentUsage = null;
        },
        clearMediaUsages: (state) => {
            state.mediaUsages = [];
        },
        clearEntityUsages: (state) => {
            state.entityUsages = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Attach Media
            .addCase(attachMediaAsync.pending, (state) => {
                state.loadingAttach = true;
                state.error = null;
            })
            .addCase(attachMediaAsync.fulfilled, (state, action) => {
                state.loadingAttach = false;
                state.usages.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(attachMediaAsync.rejected, (state, action) => {
                state.loadingAttach = false;
                state.error = action.payload;
            })
            // Get All Media Usages
            .addCase(getAllMediaUsagesAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllMediaUsagesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.usages = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllMediaUsagesAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Media Usages By Media
            .addCase(getMediaUsagesByMediaAsync.pending, (state) => {
                state.loadingByMedia = true;
                state.error = null;
            })
            .addCase(getMediaUsagesByMediaAsync.fulfilled, (state, action) => {
                state.loadingByMedia = false;
                state.mediaUsages = action.payload.data;
                state.error = null;
            })
            .addCase(getMediaUsagesByMediaAsync.rejected, (state, action) => {
                state.loadingByMedia = false;
                state.error = action.payload;
            })
            // Get Media Usages By Entity
            .addCase(getMediaUsagesByEntityAsync.pending, (state) => {
                state.loadingByEntity = true;
                state.entityUsages = [];
                state.error = null;
            })
            .addCase(getMediaUsagesByEntityAsync.fulfilled, (state, action) => {
                state.loadingByEntity = false;
                state.entityUsages = action.payload.data.data;
                state.error = null;
            })
            .addCase(getMediaUsagesByEntityAsync.rejected, (state, action) => {
                state.entityUsages = [];
                state.loadingByEntity = false;
                state.error = action.payload;
            })
            // Detach Media
            .addCase(detachMediaAsync.pending, (state) => {
                state.loadingDetach = true;
                state.error = null;
            })
            .addCase(detachMediaAsync.fulfilled, (state, action) => {
                state.loadingDetach = false;
                const deletedId = action.meta.arg;
                state.usages = state.usages.filter((u) => u.usageId !== deletedId);
                state.mediaUsages = state.mediaUsages.filter((u) => u.usageId !== deletedId);
                state.entityUsages = state.entityUsages.filter((u) => u.usageId !== deletedId);
                if (state.currentUsage?.usageId === deletedId) {
                    state.currentUsage = null;
                }
                state.error = null;
            })
            .addCase(detachMediaAsync.rejected, (state, action) => {
                state.loadingDetach = false;
                state.error = action.payload;
            })
            // Detach Media By Entity
            .addCase(detachMediaByEntityAsync.pending, (state) => {
                state.loadingDetach = true;
                state.error = null;
            })
            .addCase(detachMediaByEntityAsync.fulfilled, (state, action) => {
                state.loadingDetach = false;
                const { entityType, entityId } = action.meta.arg;
                // Remove all usages matching the entity
                state.usages = state.usages.filter(
                    (u) => !(u.entityType === entityType && u.entityId === entityId)
                );
                state.entityUsages = [];
                state.error = null;
            })
            .addCase(detachMediaByEntityAsync.rejected, (state, action) => {
                state.loadingDetach = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    resetFilters,
    clearCurrentUsage,
    clearMediaUsages,
    clearEntityUsages,
    clearError,
} = mediaUsageSlice.actions;

// Selectors
export const selectMediaUsages = (state) => state.mediaUsage.usages;
export const selectCurrentMediaUsage = (state) => state.mediaUsage.currentUsage;
export const selectMediaUsagesByMedia = (state) => state.mediaUsage.mediaUsages;
export const selectMediaUsagesByEntity = (state) => state.mediaUsage.entityUsages;
export const selectMediaUsagePagination = (state) => state.mediaUsage.pagination;
export const selectMediaUsageLoadingGet = (state) => state.mediaUsage.loadingGet;
export const selectMediaUsageLoadingAttach = (state) => state.mediaUsage.loadingAttach;
export const selectMediaUsageLoadingDetach = (state) => state.mediaUsage.loadingDetach;
export const selectMediaUsageLoadingByMedia = (state) => state.mediaUsage.loadingByMedia;
export const selectMediaUsageLoadingByEntity = (state) => state.mediaUsage.loadingByEntity;
export const selectMediaUsageError = (state) => state.mediaUsage.error;
export const selectMediaUsageFilters = (state) => state.mediaUsage.filters;

export default mediaUsageSlice.reducer;
