import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { studentPointLogApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    logs: [],
    currentLog: null,
    totalPoint: 0,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    filters: {
        search: "",
        type: "",
        source: "",
        referenceType: "",
        referenceId: "",
        fromDate: "",
        toDate: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
};

export const getStudentPointLogsByStudentAsync = createAsyncThunk(
    "studentPointLog/getByStudent",
    async ({ studentId, params }, thunkAPI) => {
        return handleAsyncThunk(() => studentPointLogApi.getByStudent(studentId, params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải lịch sử điểm",
        });
    }
);

export const createStudentPointLogAsync = createAsyncThunk(
    "studentPointLog/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => studentPointLogApi.create(data), thunkAPI, {
            successTitle: "Tạo log điểm thành công",
            errorTitle: "Lỗi tạo log điểm",
        });
    }
);

export const updateStudentPointLogAsync = createAsyncThunk(
    "studentPointLog/update",
    async ({ pointLogId, data }, thunkAPI) => {
        return handleAsyncThunk(() => studentPointLogApi.update(pointLogId, data), thunkAPI, {
            successTitle: "Cập nhật log điểm thành công",
            errorTitle: "Lỗi cập nhật log điểm",
        });
    }
);

export const deleteStudentPointLogAsync = createAsyncThunk(
    "studentPointLog/delete",
    async (pointLogId, thunkAPI) => {
        return handleAsyncThunk(() => studentPointLogApi.delete(pointLogId), thunkAPI, {
            successTitle: "Xóa log điểm thành công",
            errorTitle: "Lỗi xóa log điểm",
        });
    }
);

export const studentPointLogSlice = createSlice({
    name: "studentPointLog",
    initialState,
    reducers: {
        setStudentPointLogFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetStudentPointLogFilters: (state) => {
            state.filters = initialState.filters;
        },
        setCurrentStudentPointLog: (state, action) => {
            state.currentLog = action.payload;
        },
        clearCurrentStudentPointLog: (state) => {
            state.currentLog = null;
        },
        clearStudentPointLogError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudentPointLogsByStudentAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getStudentPointLogsByStudentAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.logs = action.payload?.data || [];
                state.pagination = action.payload?.meta || initialState.pagination;
                state.totalPoint = action.payload?.totalPoint ?? 0;
            })
            .addCase(getStudentPointLogsByStudentAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.logs = [];
                state.error = action.payload;
            })
            .addCase(createStudentPointLogAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createStudentPointLogAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                const pointLog = action.payload?.data?.pointLog;
                if (pointLog) {
                    state.logs = [pointLog, ...state.logs];
                    state.pagination.total += 1;
                }
                if (action.payload?.data?.totalPoint !== undefined) {
                    state.totalPoint = action.payload.data.totalPoint;
                }
            })
            .addCase(createStudentPointLogAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            .addCase(updateStudentPointLogAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateStudentPointLogAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const pointLog = action.payload?.data?.pointLog;
                if (pointLog) {
                    const index = state.logs.findIndex((log) => log.pointLogId === pointLog.pointLogId);
                    if (index !== -1) {
                        state.logs[index] = pointLog;
                    }
                    state.currentLog = pointLog;
                }
                if (action.payload?.data?.totalPoint !== undefined) {
                    state.totalPoint = action.payload.data.totalPoint;
                }
            })
            .addCase(updateStudentPointLogAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            .addCase(deleteStudentPointLogAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteStudentPointLogAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                const deletedPointLog = action.payload?.data?.deletedPointLog;
                if (deletedPointLog) {
                    state.logs = state.logs.filter((log) => log.pointLogId !== deletedPointLog.pointLogId);
                    state.pagination.total = Math.max((state.pagination.total || 0) - 1, 0);
                }
                if (action.payload?.data?.totalPoint !== undefined) {
                    state.totalPoint = action.payload.data.totalPoint;
                }
            })
            .addCase(deleteStudentPointLogAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setStudentPointLogFilters,
    resetStudentPointLogFilters,
    setCurrentStudentPointLog,
    clearCurrentStudentPointLog,
    clearStudentPointLogError,
} = studentPointLogSlice.actions;

export const selectStudentPointLogs = (state) => state.studentPointLog.logs;
export const selectStudentPointLogPagination = (state) => state.studentPointLog.pagination;
export const selectStudentPointLogFilters = (state) => state.studentPointLog.filters;
export const selectStudentPointLogTotalPoint = (state) => state.studentPointLog.totalPoint;
export const selectStudentPointLogLoadingGet = (state) => state.studentPointLog.loadingGet;
export const selectStudentPointLogLoadingCreate = (state) => state.studentPointLog.loadingCreate;
export const selectStudentPointLogLoadingUpdate = (state) => state.studentPointLog.loadingUpdate;
export const selectStudentPointLogLoadingDelete = (state) => state.studentPointLog.loadingDelete;
export const selectStudentPointLogError = (state) => state.studentPointLog.error;

export default studentPointLogSlice.reducer;
