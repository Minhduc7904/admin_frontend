import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { assistantShiftApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const getRequest = (call, thunkAPI, errorTitle) => handleAsyncThunk(call, thunkAPI, { showSuccess: false, errorTitle });
const dateString = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const mondayOf = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return date; };
const defaultView = () => { const cursor = new Date(); const start = mondayOf(cursor); const end = new Date(start); end.setDate(end.getDate() + 6); return { mode: 'week', cursor: dateString(cursor), startAt: dateString(start), endAt: dateString(end) }; };
const initialState = { shifts: [], statistics: null, loadingSchedule: false, loadingStatistics: false, error: null, view: defaultView() };
export const getMyAssistantScheduleAsync = createAsyncThunk('myAssistantSchedule/getSchedule', (params, thunkAPI) => getRequest(() => assistantShiftApi.getMySchedule(params), thunkAPI, 'Không thể tải lịch của bạn'));
export const getMyAssistantMonthlyStatisticsAsync = createAsyncThunk('myAssistantSchedule/getStatistics', (_, thunkAPI) => getRequest(() => assistantShiftApi.getMyMonthlyStatistics(), thunkAPI, 'Không thể tải thống kê tháng'));
const slice = createSlice({ name: 'myAssistantSchedule', initialState, reducers: { setMyAssistantScheduleView: (state, action) => { state.view = action.payload; } }, extraReducers: (builder) => builder
  .addCase(getMyAssistantScheduleAsync.pending, (state) => { state.loadingSchedule = true; state.error = null; })
  .addCase(getMyAssistantScheduleAsync.fulfilled, (state, action) => { state.loadingSchedule = false; state.shifts = action.payload?.data || []; })
  .addCase(getMyAssistantScheduleAsync.rejected, (state, action) => { state.loadingSchedule = false; state.error = action.payload; })
  .addCase(getMyAssistantMonthlyStatisticsAsync.pending, (state) => { state.loadingStatistics = true; })
  .addCase(getMyAssistantMonthlyStatisticsAsync.fulfilled, (state, action) => { state.loadingStatistics = false; state.statistics = action.payload?.data || null; })
  .addCase(getMyAssistantMonthlyStatisticsAsync.rejected, (state, action) => { state.loadingStatistics = false; state.error = action.payload; }), });
export const selectMyAssistantSchedule = (state) => state.myAssistantSchedule.shifts;
export const selectMyAssistantStatistics = (state) => state.myAssistantSchedule.statistics;
export const selectMyAssistantScheduleLoading = (state) => state.myAssistantSchedule.loadingSchedule;
export const selectMyAssistantStatisticsLoading = (state) => state.myAssistantSchedule.loadingStatistics;
export const selectMyAssistantScheduleError = (state) => state.myAssistantSchedule.error;
export const selectMyAssistantScheduleView = (state) => state.myAssistantSchedule.view;
export const { setMyAssistantScheduleView } = slice.actions;
export default slice.reducer;
