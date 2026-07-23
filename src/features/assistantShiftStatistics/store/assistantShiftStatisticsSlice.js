import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { assistantShiftApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const getRequest = (call, thunkAPI, errorTitle) => handleAsyncThunk(call, thunkAPI, { showSuccess: false, errorTitle });
const initialState = { statistics: null, loading: false, error: null };

export const getAssistantShiftStatisticsAsync = createAsyncThunk(
  'assistantShiftStatistics/getStatistics',
  (params, thunkAPI) => getRequest(() => assistantShiftApi.getStatistics(params), thunkAPI, 'Không thể tải thống kê lịch trợ giảng'),
);

const slice = createSlice({
  name: 'assistantShiftStatistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(getAssistantShiftStatisticsAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAssistantShiftStatisticsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.statistics = action.payload?.data || null;
    })
    .addCase(getAssistantShiftStatisticsAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }),
});

export const selectAssistantShiftStatistics = (state) => state.assistantShiftStatistics.statistics;
export const selectAssistantShiftStatisticsLoading = (state) => state.assistantShiftStatistics.loading;
export const selectAssistantShiftStatisticsError = (state) => state.assistantShiftStatistics.error;
export default slice.reducer;
