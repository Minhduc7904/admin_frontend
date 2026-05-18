import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { documentApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    documents: [],
    currentDocument: null,
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
        search: '',
        visibility: '',
        isFeatured: '',
        tagId: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    },
};

export const getAllDocumentsAsync = createAsyncThunk(
    'document/getAll',
    async (params, thunkAPI) =>
        handleAsyncThunk(() => documentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: 'Lỗi tải danh sách tài liệu',
        })
);

export const getDocumentByIdAsync = createAsyncThunk(
    'document/getById',
    async (id, thunkAPI) =>
        handleAsyncThunk(() => documentApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: 'Lỗi tải thông tin tài liệu',
        })
);

export const getDocumentBySlugAsync = createAsyncThunk(
    'document/getBySlug',
    async (slug, thunkAPI) =>
        handleAsyncThunk(() => documentApi.getBySlug(slug), thunkAPI, {
            showSuccess: false,
            errorTitle: 'Lỗi tải thông tin tài liệu',
        })
);

export const createDocumentAsync = createAsyncThunk(
    'document/create',
    async (data, thunkAPI) =>
        handleAsyncThunk(() => documentApi.create(data), thunkAPI, {
            successTitle: 'Tạo tài liệu thành công',
            successMessage: 'Tài liệu mới đã được tạo',
            errorTitle: 'Tạo tài liệu thất bại',
        })
);

export const updateDocumentAsync = createAsyncThunk(
    'document/update',
    async ({ id, data }, thunkAPI) =>
        handleAsyncThunk(() => documentApi.update(id, data), thunkAPI, {
            successTitle: 'Cập nhật tài liệu thành công',
            successMessage: 'Thông tin tài liệu đã được cập nhật',
            errorTitle: 'Cập nhật tài liệu thất bại',
        })
);

export const deleteDocumentAsync = createAsyncThunk(
    'document/delete',
    async (id, thunkAPI) =>
        handleAsyncThunk(() => documentApi.delete(id), thunkAPI, {
            successTitle: 'Xóa tài liệu thành công',
            successMessage: 'Tài liệu đã được xóa khỏi hệ thống',
            errorTitle: 'Xóa tài liệu thất bại',
        })
);

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearCurrentDocument: (state) => {
            state.currentDocument = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllDocumentsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllDocumentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.documents = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllDocumentsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            .addCase(getDocumentByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getDocumentByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentDocument = action.payload.data;
            })
            .addCase(getDocumentByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.currentDocument = null;
                state.error = action.payload;
            })
            .addCase(getDocumentBySlugAsync.fulfilled, (state, action) => {
                state.currentDocument = action.payload.data;
            })
            .addCase(createDocumentAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createDocumentAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.documents.unshift(action.payload.data);
            })
            .addCase(createDocumentAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            .addCase(updateDocumentAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateDocumentAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const updatedDocument = action.payload.data;
                const index = state.documents.findIndex(
                    (document) => document.documentId === updatedDocument.documentId
                );
                if (index !== -1) {
                    state.documents[index] = updatedDocument;
                }
                if (state.currentDocument?.documentId === updatedDocument.documentId) {
                    state.currentDocument = updatedDocument;
                }
            })
            .addCase(updateDocumentAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            .addCase(deleteDocumentAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteDocumentAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.documents = state.documents.filter(
                    (document) => document.documentId !== action.meta.arg
                );
                if (state.currentDocument?.documentId === action.meta.arg) {
                    state.currentDocument = null;
                }
            })
            .addCase(deleteDocumentAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, setPagination, clearCurrentDocument } = documentSlice.actions;

export const selectDocuments = (state) => state.document.documents;
export const selectCurrentDocument = (state) => state.document.currentDocument;
export const selectDocumentPagination = (state) => state.document.pagination;
export const selectDocumentFilters = (state) => state.document.filters;
export const selectDocumentLoadingGet = (state) => state.document.loadingGet;
export const selectDocumentLoadingCreate = (state) => state.document.loadingCreate;
export const selectDocumentLoadingUpdate = (state) => state.document.loadingUpdate;
export const selectDocumentLoadingDelete = (state) => state.document.loadingDelete;

export default documentSlice.reducer;
