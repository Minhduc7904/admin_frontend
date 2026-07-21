import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { backgroundJobApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const initialState = {
  jobs: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasPrevious: false, hasNext: false },
  detail: null,
  loadingList: false,
  loadingDetail: false,
  updatingId: null,
  error: null,
};

export const getBackgroundJobsAsync = createAsyncThunk('backgroundJob/getAll', (params, thunkAPI) => handleAsyncThunk(
  () => backgroundJobApi.getAll(params), thunkAPI, { showSuccess: false, errorTitle: 'Không thể tải danh sách job nền' },
));
export const getBackgroundJobByIdAsync = createAsyncThunk('backgroundJob/getById', (id, thunkAPI) => handleAsyncThunk(
  () => backgroundJobApi.getById(id), thunkAPI, { showSuccess: false, errorTitle: 'Không thể tải chi tiết job nền' },
));
export const updateBackgroundJobAsync = createAsyncThunk('backgroundJob/update', ({ id, data }, thunkAPI) => handleAsyncThunk(
  () => backgroundJobApi.update(id, data), thunkAPI, { successTitle: 'Đã cập nhật job nền', errorTitle: 'Không thể cập nhật job nền' },
));

const slice = createSlice({
  name: 'backgroundJob', initialState,
  reducers: { clearBackgroundJobDetail: (state) => { state.detail = null; } },
  extraReducers: (builder) => builder
    .addCase(getBackgroundJobsAsync.pending, (state) => { state.loadingList = true; state.error = null; })
    .addCase(getBackgroundJobsAsync.fulfilled, (state, action) => { state.loadingList = false; state.jobs = action.payload?.data || []; state.pagination = { ...state.pagination, ...(action.payload?.meta || {}) }; })
    .addCase(getBackgroundJobsAsync.rejected, (state, action) => { state.loadingList = false; state.error = action.payload; })
    .addCase(getBackgroundJobByIdAsync.pending, (state) => { state.loadingDetail = true; state.detail = null; })
    .addCase(getBackgroundJobByIdAsync.fulfilled, (state, action) => { state.loadingDetail = false; state.detail = action.payload?.data || null; })
    .addCase(getBackgroundJobByIdAsync.rejected, (state, action) => { state.loadingDetail = false; state.error = action.payload; })
    .addCase(updateBackgroundJobAsync.pending, (state, action) => { state.updatingId = action.meta.arg.id; })
    .addCase(updateBackgroundJobAsync.fulfilled, (state, action) => { state.updatingId = null; const job = action.payload?.data; const index = state.jobs.findIndex((item) => item.backgroundJobId === job?.backgroundJobId); if (index >= 0) state.jobs[index] = job; if (state.detail?.backgroundJobId === job?.backgroundJobId) state.detail = job; })
    .addCase(updateBackgroundJobAsync.rejected, (state, action) => { state.updatingId = null; state.error = action.payload; }),
});

export const { clearBackgroundJobDetail } = slice.actions;
export const selectBackgroundJobs = (state) => state.backgroundJob.jobs;
export const selectBackgroundJobPagination = (state) => state.backgroundJob.pagination;
export const selectBackgroundJobDetail = (state) => state.backgroundJob.detail;
export const selectBackgroundJobLoadingList = (state) => state.backgroundJob.loadingList;
export const selectBackgroundJobLoadingDetail = (state) => state.backgroundJob.loadingDetail;
export const selectBackgroundJobUpdatingId = (state) => state.backgroundJob.updatingId;
export default slice.reducer;
