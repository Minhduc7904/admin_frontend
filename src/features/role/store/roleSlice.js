import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { roleApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    roles: [],
    currentRole: null,
    userRoles: [],
    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    loadingAssign: false,
    loadingToggle: false,
    loadingPermissionIds: [],
    error: null,
};

// Async thunks
export const getAllRolesAsync = createAsyncThunk(
    "role/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => roleApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách vai trò",
        });
    }
);

export const getRoleByIdAsync = createAsyncThunk(
    "role/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => roleApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin vai trò",
        });
    }
);

export const createRoleAsync = createAsyncThunk(
    "role/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => roleApi.create(data), thunkAPI, {
            successTitle: "Tạo vai trò thành công",
            successMessage: "Vai trò mới đã được tạo",
            errorTitle: "Tạo vai trò thất bại",
        });
    }
);

export const updateRoleAsync = createAsyncThunk(
    "role/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => roleApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật vai trò thành công",
            successMessage: "Thông tin vai trò đã được cập nhật",
            errorTitle: "Cập nhật vai trò thất bại",
        });
    }
);

export const deleteRoleAsync = createAsyncThunk(
    "role/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => roleApi.delete(id), thunkAPI, {
            successTitle: "Xóa vai trò thành công",
            successMessage: "Vai trò đã được xóa khỏi hệ thống",
            errorTitle: "Xóa vai trò thất bại",
        });
    }
);

export const assignRoleToUserAsync = createAsyncThunk(
    "role/assignToUser",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => roleApi.assignToUser(data), thunkAPI, {
            successTitle: "Gán vai trò thành công",
            successMessage: "Vai trò đã được gán cho người dùng",
            errorTitle: "Gán vai trò thất bại",
        });
    }
);

export const removeRoleFromUserAsync = createAsyncThunk(
    "role/removeFromUser",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => roleApi.removeFromUser(data), thunkAPI, {
            successTitle: "Gỡ vai trò thành công",
            successMessage: "Vai trò đã được gỡ khỏi người dùng",
            errorTitle: "Gỡ vai trò thất bại",
        });
    }
);

export const getUserRolesAsync = createAsyncThunk(
    "role/getUserRoles",
    async (userId, thunkAPI) => {
        return handleAsyncThunk(() => roleApi.getUserRoles(userId), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải vai trò người dùng",
        });
    }
);

export const toggleRolePermissionAsync = createAsyncThunk(
    "role/togglePermission",
    async ({ roleId, permissionId }, thunkAPI) => {
        return handleAsyncThunk(
            () => roleApi.togglePermission(roleId, permissionId),
            thunkAPI,
            {
                successTitle: "Thao tác thành công",
                successMessage: (response) => {
                    console.log('Toggle response:', response);
                    return response.data.data.action === 'added'
                        ? 'Đã thêm quyền vào vai trò'
                        : 'Đã xóa quyền khỏi vai trò';
                },
                errorTitle: "Thao tác thất bại",
            }
        );
    }
);

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        clearCurrentRole: (state) => {
            state.currentRole = null;
        },
        clearUserRoles: (state) => {
            state.userRoles = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Roles
            .addCase(getAllRolesAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllRolesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.roles = action.payload.data;
                state.error = null;
            })
            .addCase(getAllRolesAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Role By ID
            .addCase(getRoleByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getRoleByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentRole = action.payload.data;
                state.error = null;
            })
            .addCase(getRoleByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Create Role
            .addCase(createRoleAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createRoleAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.roles.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createRoleAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update Role
            .addCase(updateRoleAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateRoleAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.roles.findIndex(
                    (r) => r.roleId === action.payload.data.roleId
                );
                if (index !== -1) {
                    state.roles[index] = action.payload.data;
                }
                if (state.currentRole?.roleId === action.payload.data.roleId) {
                    state.currentRole = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateRoleAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Role
            .addCase(deleteRoleAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteRoleAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.roles = state.roles.filter((r) => r.roleId !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteRoleAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })
            // Assign Role To User
            .addCase(assignRoleToUserAsync.pending, (state) => {
                state.loadingAssign = true;
                state.error = null;
            })
            .addCase(assignRoleToUserAsync.fulfilled, (state) => {
                state.loadingAssign = false;
                state.error = null;
            })
            .addCase(assignRoleToUserAsync.rejected, (state, action) => {
                state.loadingAssign = false;
                state.error = action.payload;
            })
            // Remove Role From User
            .addCase(removeRoleFromUserAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(removeRoleFromUserAsync.fulfilled, (state) => {
                state.loadingDelete = false;
                state.error = null;
            })
            .addCase(removeRoleFromUserAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })
            // Get User Roles
            .addCase(getUserRolesAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getUserRolesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.userRoles = action.payload.data;
                state.error = null;
            })
            .addCase(getUserRolesAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Toggle Role Permission
            .addCase(toggleRolePermissionAsync.pending, (state, action) => {
                state.loadingToggle = true;
                state.loadingPermissionIds.push(action.meta.arg.permissionId);
                state.error = null;

            })
            .addCase(toggleRolePermissionAsync.fulfilled, (state, action) => {
                state.loadingToggle = false;
                // console.log('Permission toggled successfully', action.payload);
                const { roleId, permissionId, action: toggleAction } = action.payload.data;
                // Update currentRole permissions if it matches
                if (state.currentRole?.roleId === roleId) {
                    if (toggleAction === 'added') {
                        state.currentRole.permissions.push(
                            {
                                permissionId,
                            }
                        );
                    } else if (toggleAction === 'removed') {
                        state.currentRole.permissions = state.currentRole.permissions.filter(
                            (p) => p.permissionId !== permissionId
                        );
                    }
                }
                state.error = null;
                state.loadingPermissionIds = state.loadingPermissionIds.filter(id => id !== permissionId);
            })
            .addCase(toggleRolePermissionAsync.rejected, (state, action) => {
                state.loadingToggle = false;
                state.error = action.payload;
                state.loadingPermissionIds = state.loadingPermissionIds.filter(id => id !== action.meta.arg.permissionId);
            });
    },
});

export const { clearCurrentRole, clearUserRoles, clearError } =
    roleSlice.actions;

// Selectors
export const selectRoles = (state) => state.role.roles;
export const selectCurrentRole = (state) => state.role.currentRole;
export const selectUserRoles = (state) => state.role.userRoles;
export const selectRoleLoadingGet = (state) => state.role.loadingGet;
export const selectRoleLoadingCreate = (state) => state.role.loadingCreate;
export const selectRoleLoadingUpdate = (state) => state.role.loadingUpdate;
export const selectRoleLoadingDelete = (state) => state.role.loadingDelete;
export const selectRoleLoadingAssign = (state) => state.role.loadingAssign;
export const selectRoleLoadingToggle = (state) => state.role.loadingToggle;
export const selectRoleLoadingPermissionIds = (state) => state.role.loadingPermissionIds;
export const selectRoleError = (state) => state.role.error;

export default roleSlice.reducer;
