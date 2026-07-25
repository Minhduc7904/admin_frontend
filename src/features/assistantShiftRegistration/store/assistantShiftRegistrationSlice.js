import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { assistantShiftApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const getRequest = (call, thunkAPI, errorTitle) => handleAsyncThunk(call, thunkAPI, { showSuccess: false, errorTitle });
const request = (call, thunkAPI, successTitle, errorTitle) => handleAsyncThunk(call, thunkAPI, { successTitle, errorTitle });
const dateString = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const defaultWeekRange = () => { const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); const end = new Date(start); end.setDate(end.getDate() + 6); return { startAt: dateString(start), endAt: dateString(end) }; };
const initialState = {
  series: [], shifts: [], eligibleAssistants: [], swapShifts: [], loadingSeries: false, loadingShifts: false,
  loadingEligibleAssistants: false, loadingSwapShifts: false, actionShiftId: null, error: null, selectedSeriesId: null, ...defaultWeekRange(),
};

export const getAvailableAssistantShiftSeriesAsync = createAsyncThunk('assistantShiftRegistration/getSeries', (_, thunkAPI) => getRequest(() => assistantShiftApi.getAvailableSeries(), thunkAPI, 'Không thể tải chuỗi lịch có thể đăng ký'));
export const getAvailableAssistantShiftsAsync = createAsyncThunk('assistantShiftRegistration/getShifts', ({ seriesId, params }, thunkAPI) => getRequest(() => assistantShiftApi.getAvailableBySeries(seriesId, params), thunkAPI, 'Không thể tải các ca có thể đăng ký'));
export const getEligibleAssistantsAsync = createAsyncThunk(
  'assistantShiftRegistration/getEligibleAssistants',
  async (params = {}, thunkAPI) => {
    return getRequest(() => assistantShiftApi.getEligibleAssistants(params), thunkAPI, 'Không thể tải danh sách trợ giảng');
  },
  { condition: (_, { getState }) => !getState().assistantShiftRegistration.loadingEligibleAssistants },
);
export const getPendingMyAssistantShiftsAsync = createAsyncThunk('assistantShiftRegistration/getPendingMyShifts', (params, thunkAPI) => getRequest(() => assistantShiftApi.getMySchedule({ ...params, attendanceStatus: 'PENDING' }), thunkAPI, 'Không thể tải lịch có thể đổi ca'));
export const registerAssistantShiftAsync = createAsyncThunk('assistantShiftRegistration/register', (id, thunkAPI) => request(() => assistantShiftApi.register(id), thunkAPI, 'Đã đăng ký ca trợ giảng', 'Không thể đăng ký ca trợ giảng'));
export const cancelAssistantShiftRegistrationAsync = createAsyncThunk('assistantShiftRegistration/cancel', (id, thunkAPI) => request(() => assistantShiftApi.cancelRegistration(id), thunkAPI, 'Đã hủy đăng ký ca', 'Không thể hủy đăng ký ca'));
export const requestAssistantShiftTransferAsync = createAsyncThunk('assistantShiftRegistration/transfer', (data, thunkAPI) => request(() => assistantShiftApi.requestTransfer(data), thunkAPI, 'Đã gửi đề nghị nhường ca', 'Không thể gửi đề nghị nhường ca'));
export const requestAssistantShiftSwapAsync = createAsyncThunk('assistantShiftRegistration/swap', (data, thunkAPI) => request(() => assistantShiftApi.requestSwap(data), thunkAPI, 'Đã gửi đề nghị đổi ca', 'Không thể gửi đề nghị đổi ca'));

const slice = createSlice({ name: 'assistantShiftRegistration', initialState, reducers: {
  setRegistrationDateRange: (state, action) => { state.startAt = action.payload.startAt; state.endAt = action.payload.endAt; },
  setRegistrationSelectedSeriesId: (state, action) => { state.selectedSeriesId = action.payload; },
}, extraReducers: (builder) => builder
  .addCase(getAvailableAssistantShiftSeriesAsync.pending, (state) => { state.loadingSeries = true; state.error = null; })
  .addCase(getAvailableAssistantShiftSeriesAsync.fulfilled, (state, action) => { state.loadingSeries = false; state.series = action.payload?.data || []; })
  .addCase(getAvailableAssistantShiftSeriesAsync.rejected, (state, action) => { state.loadingSeries = false; state.error = action.payload; })
  .addCase(getAvailableAssistantShiftsAsync.pending, (state) => { state.loadingShifts = true; state.error = null; })
  .addCase(getAvailableAssistantShiftsAsync.fulfilled, (state, action) => { state.loadingShifts = false; state.shifts = action.payload?.data || []; })
  .addCase(getAvailableAssistantShiftsAsync.rejected, (state, action) => { state.loadingShifts = false; state.error = action.payload; })
  .addCase(getEligibleAssistantsAsync.pending, (state) => { state.loadingEligibleAssistants = true; })
  .addCase(getEligibleAssistantsAsync.fulfilled, (state, action) => { state.loadingEligibleAssistants = false; state.eligibleAssistants = action.payload?.data || []; })
  .addCase(getEligibleAssistantsAsync.rejected, (state) => { state.loadingEligibleAssistants = false; })
  .addCase(getPendingMyAssistantShiftsAsync.pending, (state) => { state.loadingSwapShifts = true; })
  .addCase(getPendingMyAssistantShiftsAsync.fulfilled, (state, action) => { state.loadingSwapShifts = false; state.swapShifts = action.payload?.data || []; })
  .addCase(getPendingMyAssistantShiftsAsync.rejected, (state) => { state.loadingSwapShifts = false; })
  .addMatcher((action) => /assistantShiftRegistration\/(register|cancel|transfer|swap)\/(pending|fulfilled|rejected)$/.test(action.type), (state, action) => { state.actionShiftId = action.type.endsWith('/pending') ? action.meta.arg?.assistantShiftId || action.meta.arg : null; }),
});

export const selectRegistrationSeries = (state) => state.assistantShiftRegistration.series;
export const selectRegistrationShifts = (state) => state.assistantShiftRegistration.shifts;
export const selectRegistrationEligibleAssistants = (state) => state.assistantShiftRegistration.eligibleAssistants;
export const selectRegistrationSwapShifts = (state) => state.assistantShiftRegistration.swapShifts;
export const selectRegistrationLoadingSeries = (state) => state.assistantShiftRegistration.loadingSeries;
export const selectRegistrationLoadingShifts = (state) => state.assistantShiftRegistration.loadingShifts;
export const selectRegistrationLoadingEligibleAssistants = (state) => state.assistantShiftRegistration.loadingEligibleAssistants;
export const selectRegistrationLoadingSwapShifts = (state) => state.assistantShiftRegistration.loadingSwapShifts;
export const selectRegistrationActionShiftId = (state) => state.assistantShiftRegistration.actionShiftId;
export const selectRegistrationError = (state) => state.assistantShiftRegistration.error;
export const selectRegistrationStartAt = (state) => state.assistantShiftRegistration.startAt;
export const selectRegistrationEndAt = (state) => state.assistantShiftRegistration.endAt;
export const selectRegistrationSelectedSeriesId = (state) => state.assistantShiftRegistration.selectedSeriesId;
export const { setRegistrationDateRange, setRegistrationSelectedSeriesId } = slice.actions;
export default slice.reducer;
