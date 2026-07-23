import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { assistantShiftApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const getRequest = (call, thunkAPI, errorTitle) => handleAsyncThunk(call, thunkAPI, { showSuccess: false, errorTitle });
const request = (call, thunkAPI, successTitle, errorTitle) => handleAsyncThunk(call, thunkAPI, { successTitle, errorTitle });
const initialState = { series: [], shifts: [], loadingSeries: false, loadingShifts: false, actionShiftId: null, error: null };
export const getAvailableAssistantShiftSeriesAsync = createAsyncThunk('assistantShiftRegistration/getSeries', (_, thunkAPI) => getRequest(() => assistantShiftApi.getSeries(), thunkAPI, 'Không thể tải chuỗi lịch có thể đăng ký'));
export const getAvailableAssistantShiftsAsync = createAsyncThunk('assistantShiftRegistration/getShifts', ({ seriesId, params }, thunkAPI) => getRequest(() => assistantShiftApi.getBySeries(seriesId, params), thunkAPI, 'Không thể tải các ca có thể đăng ký'));
export const registerAssistantShiftAsync = createAsyncThunk('assistantShiftRegistration/register', (id, thunkAPI) => request(() => assistantShiftApi.register(id), thunkAPI, 'Đã đăng ký ca trợ giảng', 'Không thể đăng ký ca trợ giảng'));
export const cancelAssistantShiftRegistrationAsync = createAsyncThunk('assistantShiftRegistration/cancel', (id, thunkAPI) => request(() => assistantShiftApi.cancelRegistration(id), thunkAPI, 'Đã hủy đăng ký ca', 'Không thể hủy đăng ký ca'));
const slice = createSlice({ name: 'assistantShiftRegistration', initialState, reducers: {}, extraReducers: (builder) => builder
  .addCase(getAvailableAssistantShiftSeriesAsync.pending, (state) => { state.loadingSeries = true; state.error = null; })
  .addCase(getAvailableAssistantShiftSeriesAsync.fulfilled, (state, action) => { state.loadingSeries = false; state.series = action.payload?.data || []; })
  .addCase(getAvailableAssistantShiftSeriesAsync.rejected, (state, action) => { state.loadingSeries = false; state.error = action.payload; })
  .addCase(getAvailableAssistantShiftsAsync.pending, (state) => { state.loadingShifts = true; state.error = null; })
  .addCase(getAvailableAssistantShiftsAsync.fulfilled, (state, action) => { state.loadingShifts = false; state.shifts = action.payload?.data || []; })
  .addCase(getAvailableAssistantShiftsAsync.rejected, (state, action) => { state.loadingShifts = false; state.error = action.payload; })
  .addMatcher((action) => action.type.startsWith('assistantShiftRegistration/register/') || action.type.startsWith('assistantShiftRegistration/cancel/'), (state, action) => { state.actionShiftId = action.type.endsWith('/pending') ? action.meta.arg : null; }), });
export const selectRegistrationSeries = (state) => state.assistantShiftRegistration.series;
export const selectRegistrationShifts = (state) => state.assistantShiftRegistration.shifts;
export const selectRegistrationLoadingSeries = (state) => state.assistantShiftRegistration.loadingSeries;
export const selectRegistrationLoadingShifts = (state) => state.assistantShiftRegistration.loadingShifts;
export const selectRegistrationActionShiftId = (state) => state.assistantShiftRegistration.actionShiftId;
export const selectRegistrationError = (state) => state.assistantShiftRegistration.error;
export default slice.reducer;
