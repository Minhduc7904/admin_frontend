import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { permissionApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    permissions: [],
    currentPermission: null,
    groups: [],
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
    loadingGroups: false,
    error: null,
    filters: {
        search: "",
        group: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllPermissionsAsync = createAsyncThunk(
    "permission/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => permissionApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách quyền",
        });
    }
);

export const getPermissionByIdAsync = createAsyncThunk(
    "permission/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => permissionApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin quyền",
        });
    }
);

export const getPermissionGroupsAsync = createAsyncThunk(
    "permission/getGroups",
    async (_, thunkAPI) => {
        return handleAsyncThunk(() => permissionApi.getGroups(), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách nhóm quyền",
        });
    }
);

export const createPermissionAsync = createAsyncThunk(
    "permission/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => permissionApi.create(data), thunkAPI, {
            successTitle: "Tạo quyền thành công",
            successMessage: "Quyền mới đã được tạo",
            errorTitle: "Tạo quyền thất bại",
        });
    }
);

export const updatePermissionAsync = createAsyncThunk(
    "permission/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => permissionApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật quyền thành công",
            successMessage: "Thông tin quyền đã được cập nhật",
            errorTitle: "Cập nhật quyền thất bại",
        });
    }
);

export const deletePermissionAsync = createAsyncThunk(
    "permission/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => permissionApi.delete(id), thunkAPI, {
            successTitle: "Xóa quyền thành công",
            successMessage: "Quyền đã được xóa khỏi hệ thống",
            errorTitle: "Xóa quyền thất bại",
        });
    }
);

const permissionSlice = createSlice({
    name: "permission",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentPermission: (state) => {
            state.currentPermission = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Permissions
            .addCase(getAllPermissionsAsync.pending, (state) => {
                state.permissions = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllPermissionsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.permissions = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllPermissionsAsync.rejected, (state, action) => {
                state.permissions = [];
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Permission By ID
            .addCase(getPermissionByIdAsync.pending, (state) => {
                state.currentPermission = null;
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getPermissionByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentPermission = action.payload.data;
                state.error = null;
            })
            .addCase(getPermissionByIdAsync.rejected, (state, action) => {
                state.currentPermission = null;
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Permission Groups
            .addCase(getPermissionGroupsAsync.pending, (state) => {
                state.groups = [];
                state.loadingGroups = true;
                state.error = null;
            })
            .addCase(getPermissionGroupsAsync.fulfilled, (state, action) => {
                state.loadingGroups = false;
                state.groups = action.payload.data;
                state.error = null;
            })
            .addCase(getPermissionGroupsAsync.rejected, (state, action) => {
                state.groups = [];
                state.loadingGroups = false;
                state.error = action.payload;
            })
            // Create Permission
            .addCase(createPermissionAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createPermissionAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.permissions.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createPermissionAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update Permission
            .addCase(updatePermissionAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updatePermissionAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.permissions.findIndex(
                    (p) => p.permissionId === action.payload.data.permissionId
                );
                if (index !== -1) {
                    state.permissions[index] = action.payload.data;
                }
                if (
                    state.currentPermission?.permissionId ===
                    action.payload.data.permissionId
                ) {
                    state.currentPermission = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updatePermissionAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Permission
            .addCase(deletePermissionAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deletePermissionAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.permissions = state.permissions.filter(
                    (p) => p.permissionId !== action.meta.arg
                );
                state.error = null;
            })
            .addCase(deletePermissionAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    resetFilters,
    clearCurrentPermission,
    clearError,
} = permissionSlice.actions;

// Selectors
export const selectPermissions = (state) => state.permission.permissions;
export const selectCurrentPermission = (state) =>
    state.permission.currentPermission;
export const selectPermissionGroups = (state) => state.permission.groups;
export const selectPermissionPagination = (state) =>
    state.permission.pagination;
export const selectPermissionLoadingGet = (state) => state.permission.loadingGet;
export const selectPermissionLoadingCreate = (state) => state.permission.loadingCreate;
export const selectPermissionLoadingUpdate = (state) => state.permission.loadingUpdate;
export const selectPermissionLoadingDelete = (state) => state.permission.loadingDelete;
export const selectPermissionLoadingGroups = (state) => state.permission.loadingGroups;
export const selectPermissionError = (state) => state.permission.error;
export const selectPermissionFilters = (state) => state.permission.filters;

export default permissionSlice.reducer;
