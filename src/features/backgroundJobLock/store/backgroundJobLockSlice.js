import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { backgroundJobLockApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const initialState = { locks: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 }, loading: false, error: null };
export const getBackgroundJobLocksAsync = createAsyncThunk('backgroundJobLock/getAll', (params, thunkAPI) => handleAsyncThunk(
  () => backgroundJobLockApi.getAll(params), thunkAPI, { showSuccess: false, errorTitle: 'Không thể tải trạng thái khóa job nền' },
));
const slice = createSlice({ name: 'backgroundJobLock', initialState, reducers: {}, extraReducers: (builder) => builder
  .addCase(getBackgroundJobLocksAsync.pending, (state) => { state.loading = true; })
  .addCase(getBackgroundJobLocksAsync.fulfilled, (state, action) => { state.loading = false; state.locks = action.payload?.data || []; state.pagination = { ...state.pagination, ...(action.payload?.meta || {}) }; })
  .addCase(getBackgroundJobLocksAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload; }),
});
export const selectBackgroundJobLocks = (state) => state.backgroundJobLock.locks;
export const selectBackgroundJobLockLoading = (state) => state.backgroundJobLock.loading;
export default slice.reducer;
