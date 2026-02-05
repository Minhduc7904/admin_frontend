import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { statementApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    statements: [],
    currentStatement: null,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
};

// Async thunks
export const createStatementAsync = createAsyncThunk(
    "statement/create",
    async ({ questionId, data }, thunkAPI) => {
        return handleAsyncThunk(() => statementApi.create(questionId, data), thunkAPI, {
            successTitle: "Tạo đáp án thành công",
            successMessage: "Đáp án mới đã được tạo",
            errorTitle: "Tạo đáp án thất bại",
        });
    }
);

export const updateStatementAsync = createAsyncThunk(
    "statement/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => statementApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật đáp án thành công",
            successMessage: "Thông tin đáp án đã được cập nhật",
            errorTitle: "Cập nhật đáp án thất bại",
        });
    }
);

export const deleteStatementAsync = createAsyncThunk(
    "statement/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => statementApi.delete(id), thunkAPI, {
            successTitle: "Xóa đáp án thành công",
            successMessage: "Đáp án đã được xóa khỏi hệ thống",
            errorTitle: "Xóa đáp án thất bại",
        });
    }
);

const statementSlice = createSlice({
    name: "statement",
    initialState,
    reducers: {
        clearCurrentStatement: (state) => {
            state.currentStatement = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Statement
            .addCase(createStatementAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createStatementAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.statements.push(action.payload.data);
                state.error = null;
            })
            .addCase(createStatementAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update Statement
            .addCase(updateStatementAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateStatementAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.statements.findIndex(
                    (s) => s.statementId === action.payload.data.statementId
                );
                if (index !== -1) {
                    state.statements[index] = action.payload.data;
                }
                if (
                    state.currentStatement?.statementId ===
                    action.payload.data.statementId
                ) {
                    state.currentStatement = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateStatementAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Statement
            .addCase(deleteStatementAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteStatementAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.statements = state.statements.filter(
                    (s) => s.statementId !== action.meta.arg
                );
                if (state.currentStatement?.statementId === action.meta.arg) {
                    state.currentStatement = null;
                }
                state.error = null;
            })
            .addCase(deleteStatementAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentStatement, clearError } = statementSlice.actions;

// Selectors
export const selectStatements = (state) => state.statement.statements;
export const selectCurrentStatement = (state) => state.statement.currentStatement;
export const selectStatementLoadingCreate = (state) => state.statement.loadingCreate;
export const selectStatementLoadingUpdate = (state) => state.statement.loadingUpdate;
export const selectStatementLoadingDelete = (state) => state.statement.loadingDelete;
export const selectStatementError = (state) => state.statement.error;

export default statementSlice.reducer;
