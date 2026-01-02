import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auditLogApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    auditLogs: [],
    currentAuditLog: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingRollback: false,
    error: null,
    filters: {
        search: "",
        adminId: null,
        actionKey: "",
        resourceType: "",
        resourceId: "",
        status: "",
        fromDate: "",
        toDate: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllAuditLogsAsync = createAsyncThunk(
    "auditLog/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => auditLogApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách audit logs",
        });
    }
);

export const getAuditLogByIdAsync = createAsyncThunk(
    "auditLog/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => auditLogApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin audit log",
        });
    }
);

export const rollbackAuditLogAsync = createAsyncThunk(
    "auditLog/rollback",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => auditLogApi.rollback(id), thunkAPI, {
            successTitle: "Rollback thành công",
            successMessage: "Dữ liệu đã được khôi phục",
            errorTitle: "Rollback thất bại",
        });
    }
);

const auditLogSlice = createSlice({
    name: "auditLog",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentAuditLog: (state) => {
            state.currentAuditLog = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Audit Logs
            .addCase(getAllAuditLogsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllAuditLogsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.auditLogs = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllAuditLogsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Audit Log By ID
            .addCase(getAuditLogByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAuditLogByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentAuditLog = action.payload.data;
                state.error = null;
            })
            .addCase(getAuditLogByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Rollback Audit Log
            .addCase(rollbackAuditLogAsync.pending, (state) => {
                state.loadingRollback = true;
                state.error = null;
            })
            .addCase(rollbackAuditLogAsync.fulfilled, (state, action) => {
                state.loadingRollback = false;
                // Update the status of the rollbacked log
                const logId = action.meta.arg;
                const logIndex = state.auditLogs.findIndex(
                    (log) => log.logId === logId
                );
                if (logIndex !== -1) {
                    state.auditLogs[logIndex].status = "ROLLBACK";
                }
                if (state.currentAuditLog?.logId === logId) {
                    state.currentAuditLog.status = "ROLLBACK";
                }
                state.error = null;
            })
            .addCase(rollbackAuditLogAsync.rejected, (state, action) => {
                state.loadingRollback = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    resetFilters,
    clearCurrentAuditLog,
    clearError,
} = auditLogSlice.actions;

// Selectors
export const selectAuditLogs = (state) => state.auditLog.auditLogs;
export const selectCurrentAuditLog = (state) => state.auditLog.currentAuditLog;
export const selectAuditLogPagination = (state) => state.auditLog.pagination;
export const selectAuditLogLoadingGet = (state) => state.auditLog.loadingGet;
export const selectAuditLogLoadingRollback = (state) => state.auditLog.loadingRollback;
export const selectAuditLogError = (state) => state.auditLog.error;
export const selectAuditLogFilters = (state) => state.auditLog.filters;

export default auditLogSlice.reducer;
