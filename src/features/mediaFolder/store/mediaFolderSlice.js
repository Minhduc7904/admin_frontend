import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mediaFolderApi } from "../../../core/api/mediaFolderApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    folders: [],
    currentFolder: null,
    rootFolders: [],
    childFolders: [],
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
    loadingRoots: false,
    loadingChildren: false,
    error: null,
    filters: {
        search: "",
        parentId: null,
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const createMediaFolderAsync = createAsyncThunk(
    "mediaFolder/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => mediaFolderApi.create(data), thunkAPI, {
            successTitle: "Tạo thư mục thành công",
            successMessage: "Thư mục media mới đã được tạo",
            errorTitle: "Tạo thư mục thất bại",
        });
    }
);

export const getAllMediaFoldersAsync = createAsyncThunk(
    "mediaFolder/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => mediaFolderApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách thư mục",
        });
    }
);

export const getRootMediaFoldersAsync = createAsyncThunk(
    "mediaFolder/getRoots",
    async (_, thunkAPI) => {
        return handleAsyncThunk(() => mediaFolderApi.getRoots(), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thư mục gốc",
        });
    }
);

export const getMediaFolderByIdAsync = createAsyncThunk(
    "mediaFolder/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => mediaFolderApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin thư mục",
        });
    }
);

export const getMediaFolderChildrenAsync = createAsyncThunk(
    "mediaFolder/getChildren",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => mediaFolderApi.getChildren(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thư mục con",
        });
    }
);

export const updateMediaFolderAsync = createAsyncThunk(
    "mediaFolder/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => mediaFolderApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật thư mục thành công",
            successMessage: "Thông tin thư mục đã được cập nhật",
            errorTitle: "Cập nhật thư mục thất bại",
        });
    }
);

export const deleteMediaFolderAsync = createAsyncThunk(
    "mediaFolder/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => mediaFolderApi.delete(id), thunkAPI, {
            successTitle: "Xóa thư mục thành công",
            successMessage: "Thư mục và các thư mục con đã được xóa",
            errorTitle: "Xóa thư mục thất bại",
        });
    }
);

const mediaFolderSlice = createSlice({
    name: "mediaFolder",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentFolder: (state) => {
            state.currentFolder = null;
        },
        clearChildFolders: (state) => {
            state.childFolders = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Media Folder
            .addCase(createMediaFolderAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createMediaFolderAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.folders.unshift(action.payload.data);
                // If it's a root folder, add to rootFolders
                if (!action.payload.data.parentId) {
                    state.rootFolders.unshift(action.payload.data);
                }
                state.error = null;
            })
            .addCase(createMediaFolderAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Get All Media Folders
            .addCase(getAllMediaFoldersAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllMediaFoldersAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.folders = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllMediaFoldersAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Root Media Folders
            .addCase(getRootMediaFoldersAsync.pending, (state) => {
                state.loadingRoots = true;
                state.error = null;
            })
            .addCase(getRootMediaFoldersAsync.fulfilled, (state, action) => {
                state.loadingRoots = false;
                state.rootFolders = action.payload.data;
                state.error = null;
            })
            .addCase(getRootMediaFoldersAsync.rejected, (state, action) => {
                state.loadingRoots = false;
                state.error = action.payload;
            })
            // Get Media Folder By ID
            .addCase(getMediaFolderByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getMediaFolderByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentFolder = action.payload.data;
                state.error = null;
            })
            .addCase(getMediaFolderByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Media Folder Children
            .addCase(getMediaFolderChildrenAsync.pending, (state) => {
                state.loadingChildren = true;
                state.error = null;
            })
            .addCase(getMediaFolderChildrenAsync.fulfilled, (state, action) => {
                state.loadingChildren = false;
                state.childFolders = action.payload.data;
                state.error = null;
            })
            .addCase(getMediaFolderChildrenAsync.rejected, (state, action) => {
                state.loadingChildren = false;
                state.error = action.payload;
            })
            // Update Media Folder
            .addCase(updateMediaFolderAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateMediaFolderAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.folders.findIndex(
                    (f) => f.folderId === action.payload.data.folderId
                );
                if (index !== -1) {
                    state.folders[index] = action.payload.data;
                }
                // Update in rootFolders if present
                const rootIndex = state.rootFolders.findIndex(
                    (f) => f.folderId === action.payload.data.folderId
                );
                if (rootIndex !== -1) {
                    state.rootFolders[rootIndex] = action.payload.data;
                }
                if (state.currentFolder?.folderId === action.payload.data.folderId) {
                    state.currentFolder = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateMediaFolderAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Media Folder
            .addCase(deleteMediaFolderAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteMediaFolderAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                const deletedId = action.meta.arg;
                state.folders = state.folders.filter((f) => f.folderId !== deletedId);
                state.rootFolders = state.rootFolders.filter((f) => f.folderId !== deletedId);
                if (state.currentFolder?.folderId === deletedId) {
                    state.currentFolder = null;
                }
                state.error = null;
            })
            .addCase(deleteMediaFolderAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    resetFilters,
    clearCurrentFolder,
    clearChildFolders,
    clearError,
} = mediaFolderSlice.actions;

// Selectors
export const selectMediaFolders = (state) => state.mediaFolder.folders;
export const selectCurrentMediaFolder = (state) => state.mediaFolder.currentFolder;
export const selectRootMediaFolders = (state) => state.mediaFolder.rootFolders;
export const selectChildMediaFolders = (state) => state.mediaFolder.childFolders;
export const selectMediaFolderPagination = (state) => state.mediaFolder.pagination;
export const selectMediaFolderLoadingGet = (state) => state.mediaFolder.loadingGet;
export const selectMediaFolderLoadingCreate = (state) => state.mediaFolder.loadingCreate;
export const selectMediaFolderLoadingUpdate = (state) => state.mediaFolder.loadingUpdate;
export const selectMediaFolderLoadingDelete = (state) => state.mediaFolder.loadingDelete;
export const selectMediaFolderLoadingRoots = (state) => state.mediaFolder.loadingRoots;
export const selectMediaFolderLoadingChildren = (state) => state.mediaFolder.loadingChildren;
export const selectMediaFolderError = (state) => state.mediaFolder.error;
export const selectMediaFolderFilters = (state) => state.mediaFolder.filters;

export default mediaFolderSlice.reducer;
