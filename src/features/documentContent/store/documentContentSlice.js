import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { documentContentApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    documentContents: [],
    currentDocumentContent: null,
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
export const getAllDocumentContentsAsync = createAsyncThunk(
    "documentContent/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => documentContentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách nội dung tài liệu",
        });
    }
);

export const getDocumentContentByIdAsync = createAsyncThunk(
    "documentContent/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => documentContentApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin nội dung tài liệu",
        });
    }
);

export const createDocumentContentAsync = createAsyncThunk(
    "documentContent/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => documentContentApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo nội dung tài liệu thành công",
            errorTitle: "Lỗi tạo nội dung tài liệu",
        });
    }
);

export const updateDocumentContentAsync = createAsyncThunk(
    "documentContent/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => documentContentApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật nội dung tài liệu thành công",
            errorTitle: "Lỗi cập nhật nội dung tài liệu",
        });
    }
);

export const deleteDocumentContentAsync = createAsyncThunk(
    "documentContent/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => documentContentApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa nội dung tài liệu thành công",
            errorTitle: "Lỗi xóa nội dung tài liệu",
        });
    }
);

export const searchDocumentContentsAsync = createAsyncThunk(
    "documentContent/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => documentContentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm nội dung tài liệu",
        });
    }
);

export const documentContentSlice = createSlice({
    name: "documentContent",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearCurrentDocumentContent: (state) => {
            state.currentDocumentContent = null;
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
        // Get all document contents
        builder
            .addCase(getAllDocumentContentsAsync.pending, (state) => {
                state.documentContents = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllDocumentContentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.documentContents = action.payload.data.documentContents;
                state.pagination = action.payload.data.pagination;
                state.error = null;
            })
            .addCase(getAllDocumentContentsAsync.rejected, (state, action) => {
                state.documentContents = [];
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get document content by ID
            .addCase(getDocumentContentByIdAsync.pending, (state) => {
                state.currentDocumentContent = null;
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getDocumentContentByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentDocumentContent = action.payload.data;
                state.error = null;
            })
            .addCase(getDocumentContentByIdAsync.rejected, (state, action) => {
                state.currentDocumentContent = null;
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create document content
            .addCase(createDocumentContentAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createDocumentContentAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.documentContents.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createDocumentContentAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update document content
            .addCase(updateDocumentContentAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateDocumentContentAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.documentContents.findIndex(
                    (item) => item.documentContentId === action.payload.data.documentContentId
                );
                if (index !== -1) {
                    state.documentContents[index] = action.payload.data;
                }
                if (state.currentDocumentContent?.documentContentId === action.payload.data.documentContentId) {
                    state.currentDocumentContent = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateDocumentContentAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete document content
            .addCase(deleteDocumentContentAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteDocumentContentAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.documentContents = state.documentContents.filter(
                    (item) => item.documentContentId !== action.meta.arg
                );
                if (state.currentDocumentContent?.documentContentId === action.meta.arg) {
                    state.currentDocumentContent = null;
                }
                state.error = null;
            })
            .addCase(deleteDocumentContentAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            // Search document contents
            .addCase(searchDocumentContentsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(searchDocumentContentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.documentContents = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(searchDocumentContentsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    clearCurrentDocumentContent,
    resetFilters,
    setPagination,
    resetPagination,
} = documentContentSlice.actions;

// Selectors
export const selectDocumentContents = (state) => state.documentContent?.documentContents || [];
export const selectCurrentDocumentContent = (state) => state.documentContent?.currentDocumentContent;
export const selectDocumentContentPagination = (state) => state.documentContent?.pagination || {};
export const selectDocumentContentFilters = (state) => state.documentContent?.filters || {};
export const selectDocumentContentLoadingGet = (state) => state.documentContent?.loadingGet || false;
export const selectDocumentContentLoadingCreate = (state) => state.documentContent?.loadingCreate || false;
export const selectDocumentContentLoadingUpdate = (state) => state.documentContent?.loadingUpdate || false;
export const selectDocumentContentLoadingDelete = (state) => state.documentContent?.loadingDelete || false;
export const selectDocumentContentError = (state) => state.documentContent?.error;

export default documentContentSlice.reducer;
