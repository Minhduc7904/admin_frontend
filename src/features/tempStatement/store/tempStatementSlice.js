import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tempStatementApi } from "../../../core/api/tempStatementApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

/* =========================
   Initial State
========================= */
const initialState = {
    tempStatements: [],
    currentTempStatement: null,

    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    loadingReorder: false,

    error: null,
};

/* =========================
   Async Thunks
========================= */

// ===== CREATE =====
export const createTempStatementAsync = createAsyncThunk(
    "tempStatement/create",
    async ({ tempQuestionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => tempStatementApi.create(tempQuestionId, data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Tạo đáp án tạm thành công",
                errorTitle: "Lỗi tạo đáp án tạm",
            }
        );
    }
);

// ===== UPDATE =====
export const updateTempStatementAsync = createAsyncThunk(
    "tempStatement/update",
    async ({ tempStatementId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => tempStatementApi.update(tempStatementId, data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật đáp án tạm thành công",
                errorTitle: "Lỗi cập nhật đáp án tạm",
            }
        );
    }
);

// ===== DELETE =====
export const deleteTempStatementAsync = createAsyncThunk(
    "tempStatement/delete",
    async (tempStatementId, thunkAPI) => {
        return handleAsyncThunk(
            () => tempStatementApi.delete(tempStatementId),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Xóa đáp án tạm thành công",
                errorTitle: "Lỗi xóa đáp án tạm",
            }
        );
    }
);

// ===== REORDER =====
export const reorderTempStatementsAsync = createAsyncThunk(
    "tempStatement/reorder",
    async (items, thunkAPI) => {
        return handleAsyncThunk(
            () => tempStatementApi.reorder(items),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật thứ tự đáp án thành công",
                errorTitle: "Lỗi cập nhật thứ tự đáp án",
            }
        );
    }
);

/* =========================
   Slice
========================= */
export const tempStatementSlice = createSlice({
    name: "tempStatement",
    initialState,
    reducers: {
        setTempStatements: (state, action) => {
            state.tempStatements = action.payload;
        },
        clearTempStatements: (state) => {
            state.tempStatements = [];
        },
        setCurrentTempStatement: (state, action) => {
            state.currentTempStatement = action.payload;
        },
        clearCurrentTempStatement: (state) => {
            state.currentTempStatement = null;
        },
        addTempStatementToList: (state, action) => {
            state.tempStatements.push(action.payload);
        },
        updateTempStatementInList: (state, action) => {
            const index = state.tempStatements.findIndex(
                s => s.tempStatementId === action.payload.tempStatementId
            );
            if (index !== -1) {
                state.tempStatements[index] = action.payload;
            }
        },
        removeTempStatementFromList: (state, action) => {
            state.tempStatements = state.tempStatements.filter(
                s => s.tempStatementId !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder
            // ===== CREATE =====
            .addCase(createTempStatementAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createTempStatementAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.tempStatements.push(action.payload.data);
                state.currentTempStatement = action.payload.data;
            })
            .addCase(createTempStatementAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // ===== UPDATE =====
            .addCase(updateTempStatementAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateTempStatementAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const updatedStatement = action.payload.data;
                const index = state.tempStatements.findIndex(
                    s => s.tempStatementId === updatedStatement.tempStatementId
                );
                if (index !== -1) {
                    state.tempStatements[index] = updatedStatement;
                }
                if (state.currentTempStatement?.tempStatementId === updatedStatement.tempStatementId) {
                    state.currentTempStatement = updatedStatement;
                }
            })
            .addCase(updateTempStatementAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // ===== DELETE =====
            .addCase(deleteTempStatementAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteTempStatementAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                // Remove from list (need to pass tempStatementId in meta)
                const tempStatementId = action.meta.arg;
                state.tempStatements = state.tempStatements.filter(
                    s => s.tempStatementId !== tempStatementId
                );
                if (state.currentTempStatement?.tempStatementId === tempStatementId) {
                    state.currentTempStatement = null;
                }
            })
            .addCase(deleteTempStatementAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            // ===== REORDER =====
            .addCase(reorderTempStatementsAsync.pending, (state) => {
                state.loadingReorder = true;
                state.error = null;
            })
            .addCase(reorderTempStatementsAsync.fulfilled, (state, action) => {
                state.loadingReorder = false;
                // Update order locally based on the items array from meta
                const items = action.meta.arg;
                items.forEach(item => {
                    const statement = state.tempStatements.find(s => s.tempStatementId === item.id);
                    if (statement) {
                        statement.order = item.order;
                    }
                });
                // Re-sort by order
                state.tempStatements.sort((a, b) => a.order - b.order);
            })
            .addCase(reorderTempStatementsAsync.rejected, (state, action) => {
                state.loadingReorder = false;
                state.error = action.payload;
            });
    },
});

/* =========================
   Actions & Selectors
========================= */
export const {
    setTempStatements,
    clearTempStatements,
    setCurrentTempStatement,
    clearCurrentTempStatement,
    addTempStatementToList,
    updateTempStatementInList,
    removeTempStatementFromList,
} = tempStatementSlice.actions;

export const selectTempStatements = (state) => state.tempStatement.tempStatements;
export const selectCurrentTempStatement = (state) => state.tempStatement.currentTempStatement;
export const selectTempStatementLoadingCreate = (state) => state.tempStatement.loadingCreate;
export const selectTempStatementLoadingUpdate = (state) => state.tempStatement.loadingUpdate;
export const selectTempStatementLoadingDelete = (state) => state.tempStatement.loadingDelete;
export const selectTempStatementLoadingReorder = (state) => state.tempStatement.loadingReorder;
export const selectTempStatementError = (state) => state.tempStatement.error;

export default tempStatementSlice.reducer;
