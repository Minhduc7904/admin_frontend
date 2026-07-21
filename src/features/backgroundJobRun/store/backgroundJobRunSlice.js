import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { backgroundJobRunApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const initialState = { runs: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasPrevious: false, hasNext: false }, detail: null, loadingList: false, loadingDetail: false, error: null };
export const getBackgroundJobRunsAsync = createAsyncThunk('backgroundJobRun/getAll', (params, thunkAPI) => handleAsyncThunk(
  () => backgroundJobRunApi.getAll(params), thunkAPI, { showSuccess: false, errorTitle: 'Không thể tải lịch sử chạy job nền' },
));
export const getBackgroundJobRunByIdAsync = createAsyncThunk('backgroundJobRun/getById', (id, thunkAPI) => handleAsyncThunk(
  () => backgroundJobRunApi.getById(id), thunkAPI, { showSuccess: false, errorTitle: 'Không thể tải chi tiết lần chạy' },
));
const slice = createSlice({ name: 'backgroundJobRun', initialState, reducers: { clearBackgroundJobRunDetail: (state) => { state.detail = null; } }, extraReducers: (builder) => builder
  .addCase(getBackgroundJobRunsAsync.pending, (state) => { state.loadingList = true; state.error = null; })
  .addCase(getBackgroundJobRunsAsync.fulfilled, (state, action) => { state.loadingList = false; state.runs = action.payload?.data || []; state.pagination = { ...state.pagination, ...(action.payload?.meta || {}) }; })
  .addCase(getBackgroundJobRunsAsync.rejected, (state, action) => { state.loadingList = false; state.error = action.payload; })
  .addCase(getBackgroundJobRunByIdAsync.pending, (state) => { state.loadingDetail = true; state.detail = null; })
  .addCase(getBackgroundJobRunByIdAsync.fulfilled, (state, action) => { state.loadingDetail = false; state.detail = action.payload?.data || null; })
  .addCase(getBackgroundJobRunByIdAsync.rejected, (state, action) => { state.loadingDetail = false; state.error = action.payload; }),
});
export const { clearBackgroundJobRunDetail } = slice.actions;
export const selectBackgroundJobRuns = (state) => state.backgroundJobRun.runs;
export const selectBackgroundJobRunPagination = (state) => state.backgroundJobRun.pagination;
export const selectBackgroundJobRunDetail = (state) => state.backgroundJobRun.detail;
export const selectBackgroundJobRunLoadingList = (state) => state.backgroundJobRun.loadingList;
export const selectBackgroundJobRunLoadingDetail = (state) => state.backgroundJobRun.loadingDetail;
export default slice.reducer;
