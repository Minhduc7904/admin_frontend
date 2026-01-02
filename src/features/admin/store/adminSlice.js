import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    admins: [],
    currentAdmin: null,
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
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllAdminsAsync = createAsyncThunk(
    "admin/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => adminApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách quản trị viên",
        });
    }
);

export const getAdminByIdAsync = createAsyncThunk(
    "admin/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => adminApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin quản trị viên",
        });
    }
);

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdminFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentAdmin: (state) => {
            state.currentAdmin = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            // Get all admins
            .addCase(getAllAdminsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllAdminsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.admins = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllAdminsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get admin by ID
            .addCase(getAdminByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAdminByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentAdmin = action.payload.data;
            })
            .addCase(getAdminByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            });
    },
});

export const {
    setAdminFilters,
    resetFilters,
    setFilters,
    clearCurrentAdmin,
    clearError,
} = adminSlice.actions;

export const selectAdmins = (state) => state.admin.admins;
export const selectAdminPagination = (state) => state.admin.pagination;
export const selectAdminLoadingGet = (state) => state.admin.loadingGet;
export const selectAdminLoadingCreate = (state) => state.admin.loadingCreate;
export const selectAdminLoadingUpdate = (state) => state.admin.loadingUpdate;
export const selectAdminLoadingDelete = (state) => state.admin.loadingDelete;
export const selectAdminError = (state) => state.admin.error;
export const selectAdminFilters = (state) => state.admin.filters;
export const selectCurrentAdmin = (state) => state.admin.currentAdmin;

export default adminSlice.reducer;