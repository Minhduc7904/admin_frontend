import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sepayTransactionSyncCursorApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const initialState = { cursors: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasPrevious: false, hasNext: false }, updatingScope: null, loadingList: false, error: null };
export const getSepayTransactionSyncCursorsAsync = createAsyncThunk('sepaySyncCursor/getAll', (params, thunkAPI) => handleAsyncThunk(
  () => sepayTransactionSyncCursorApi.getAll(params), thunkAPI, { showSuccess: false, errorTitle: 'Không thể tải cấu hình đồng bộ SePay' },
));
export const updateSepayTransactionSyncCursorAsync = createAsyncThunk('sepaySyncCursor/update', ({ scope, data }, thunkAPI) => handleAsyncThunk(
  () => sepayTransactionSyncCursorApi.update(scope, data), thunkAPI, { successTitle: 'Đã cập nhật checkpoint SePay', errorTitle: 'Không thể cập nhật checkpoint SePay' },
));
const slice = createSlice({ name: 'sepaySyncCursor', initialState, reducers: {}, extraReducers: (builder) => builder
  .addCase(getSepayTransactionSyncCursorsAsync.pending, (state) => { state.loadingList = true; state.error = null; })
  .addCase(getSepayTransactionSyncCursorsAsync.fulfilled, (state, action) => { state.loadingList = false; state.cursors = action.payload?.data || []; state.pagination = { ...state.pagination, ...(action.payload?.meta || {}) }; })
  .addCase(getSepayTransactionSyncCursorsAsync.rejected, (state, action) => { state.loadingList = false; state.error = action.payload; })
  .addCase(updateSepayTransactionSyncCursorAsync.pending, (state, action) => { state.updatingScope = action.meta.arg.scope; })
  .addCase(updateSepayTransactionSyncCursorAsync.fulfilled, (state, action) => { state.updatingScope = null; const cursor = action.payload?.data; const index = state.cursors.findIndex((item) => item.scope === cursor?.scope); if (index >= 0) state.cursors[index] = cursor; })
  .addCase(updateSepayTransactionSyncCursorAsync.rejected, (state, action) => { state.updatingScope = null; state.error = action.payload; }),
});
export const selectSepayTransactionSyncCursors = (state) => state.sepayTransactionSyncCursor.cursors;
export const selectSepayTransactionSyncCursorPagination = (state) => state.sepayTransactionSyncCursor.pagination;
export const selectSepayTransactionSyncCursorLoadingList = (state) => state.sepayTransactionSyncCursor.loadingList;
export const selectSepayTransactionSyncCursorUpdatingScope = (state) => state.sepayTransactionSyncCursor.updatingScope;
export default slice.reducer;
