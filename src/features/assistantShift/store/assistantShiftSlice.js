import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { assistantShiftApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const initialState = { series: [], shiftsBySeries: {}, detail: null, loadingSeries: false, loadingShifts: false, loadingDetail: false, saving: false, assignmentLoading: false, error: null };
const call = (request, thunkAPI, successTitle, errorTitle) => handleAsyncThunk(request, thunkAPI, { successTitle, errorTitle });
const getCall = (request, thunkAPI, errorTitle) => handleAsyncThunk(request, thunkAPI, { showSuccess: false, errorTitle });

export const getAssistantShiftSeriesAsync = createAsyncThunk('assistantShift/getSeries', (_, thunkAPI) => getCall(() => assistantShiftApi.getSeries(), thunkAPI, 'Không thể tải chuỗi lịch'));
export const createAssistantShiftSeriesAsync = createAsyncThunk('assistantShift/createSeries', (data, thunkAPI) => call(() => assistantShiftApi.createSeries(data), thunkAPI, 'Đã tạo chuỗi lịch', 'Không thể tạo chuỗi lịch'));
export const updateAssistantShiftSeriesAsync = createAsyncThunk('assistantShift/updateSeries', ({ id, data }, thunkAPI) => call(() => assistantShiftApi.updateSeries(id, data), thunkAPI, 'Đã cập nhật chuỗi lịch', 'Không thể cập nhật chuỗi lịch'));
export const deleteAssistantShiftSeriesAsync = createAsyncThunk('assistantShift/deleteSeries', (id, thunkAPI) => call(() => assistantShiftApi.deleteSeries(id), thunkAPI, 'Đã xóa chuỗi lịch', 'Không thể xóa chuỗi lịch'));
export const getAssistantShiftsBySeriesAsync = createAsyncThunk('assistantShift/getBySeries', ({ seriesId, params }, thunkAPI) => getCall(() => assistantShiftApi.getBySeries(seriesId, params), thunkAPI, 'Không thể tải các ca trợ giảng'));
export const getAssistantShiftByIdAsync = createAsyncThunk('assistantShift/getById', (id, thunkAPI) => getCall(() => assistantShiftApi.getById(id), thunkAPI, 'Không thể tải chi tiết ca'));
export const createAssistantShiftAsync = createAsyncThunk('assistantShift/create', (data, thunkAPI) => call(() => assistantShiftApi.create(data), thunkAPI, 'Đã tạo ca trợ giảng', 'Không thể tạo ca trợ giảng'));
export const updateAssistantShiftAsync = createAsyncThunk('assistantShift/update', ({ id, data }, thunkAPI) => call(() => assistantShiftApi.update(id, data), thunkAPI, 'Đã cập nhật ca trợ giảng', 'Không thể cập nhật ca trợ giảng'));
export const deleteAssistantShiftAsync = createAsyncThunk('assistantShift/delete', (id, thunkAPI) => call(() => assistantShiftApi.delete(id), thunkAPI, 'Đã xóa ca trợ giảng', 'Không thể xóa ca trợ giảng'));
export const createAssistantShiftAssignmentAsync = createAsyncThunk('assistantShift/createAssignment', ({ shiftId, data }, thunkAPI) => call(() => assistantShiftApi.createAssignment(shiftId, data), thunkAPI, 'Đã phân công trợ giảng', 'Không thể phân công trợ giảng'));
export const updateAssistantShiftAssignmentAsync = createAsyncThunk('assistantShift/updateAssignment', ({ shiftId, adminId, data }, thunkAPI) => call(() => assistantShiftApi.updateAssignment(shiftId, adminId, data), thunkAPI, 'Đã cập nhật phân công', 'Không thể cập nhật phân công'));
export const deleteAssistantShiftAssignmentAsync = createAsyncThunk('assistantShift/deleteAssignment', ({ shiftId, adminId }, thunkAPI) => call(() => assistantShiftApi.deleteAssignment(shiftId, adminId), thunkAPI, 'Đã bỏ phân công trợ giảng', 'Không thể bỏ phân công trợ giảng'));
export const copyAssistantShiftWeekAsync = createAsyncThunk('assistantShift/copyWeek', ({ seriesId, data }, thunkAPI) => call(() => assistantShiftApi.copyBySeries(seriesId, data), thunkAPI, 'Đã sao chép lịch tuần', 'Không thể sao chép lịch tuần'));
export const lockAssistantShiftWeekAsync = createAsyncThunk('assistantShift/lockWeek', ({ seriesId, data }, thunkAPI) => call(() => assistantShiftApi.lockBySeries(seriesId, data), thunkAPI, 'Đã khóa các ca trong tuần', 'Không thể khóa các ca trong tuần'));
export const unlockAssistantShiftWeekAsync = createAsyncThunk('assistantShift/unlockWeek', ({ seriesId, data }, thunkAPI) => call(() => assistantShiftApi.unlockBySeries(seriesId, data), thunkAPI, 'Đã mở khóa các ca trong tuần', 'Không thể mở khóa các ca trong tuần'));
export const setAssistantShiftRegistrationWindowAsync = createAsyncThunk('assistantShift/setRegistrationWindow', ({ seriesId, data }, thunkAPI) => call(() => assistantShiftApi.setSelfRegistrationWindowBySeries(seriesId, data), thunkAPI, 'Đã đặt cửa sổ tự đăng ký', 'Không thể đặt cửa sổ tự đăng ký'));

const slice = createSlice({
  name: 'assistantShift', initialState,
  reducers: { clearAssistantShiftDetail: (state) => { state.detail = null; } },
  extraReducers: (builder) => builder
    .addCase(getAssistantShiftSeriesAsync.pending, (state) => { state.loadingSeries = true; state.error = null; })
    .addCase(getAssistantShiftSeriesAsync.fulfilled, (state, action) => { state.loadingSeries = false; state.series = action.payload?.data || []; })
    .addCase(getAssistantShiftSeriesAsync.rejected, (state, action) => { state.loadingSeries = false; state.error = action.payload; })
    .addCase(getAssistantShiftsBySeriesAsync.pending, (state) => { state.loadingShifts = true; })
    .addCase(getAssistantShiftsBySeriesAsync.fulfilled, (state, action) => { state.loadingShifts = false; state.shiftsBySeries[action.meta.arg.seriesId] = action.payload?.data || []; })
    .addCase(getAssistantShiftsBySeriesAsync.rejected, (state, action) => { state.loadingShifts = false; state.error = action.payload; })
    .addCase(getAssistantShiftByIdAsync.pending, (state) => { state.loadingDetail = true; state.detail = null; })
    .addCase(getAssistantShiftByIdAsync.fulfilled, (state, action) => { state.loadingDetail = false; state.detail = action.payload?.data || null; })
    .addCase(getAssistantShiftByIdAsync.rejected, (state, action) => { state.loadingDetail = false; state.error = action.payload; })
    .addMatcher((action) => action.type.startsWith('assistantShift/createSeries/') || action.type.startsWith('assistantShift/updateSeries/') || action.type.startsWith('assistantShift/deleteSeries/') || action.type.startsWith('assistantShift/create/') || action.type.startsWith('assistantShift/update/') || action.type.startsWith('assistantShift/delete/') || action.type.startsWith('assistantShift/copyWeek/') || action.type.startsWith('assistantShift/lockWeek/') || action.type.startsWith('assistantShift/unlockWeek/') || action.type.startsWith('assistantShift/setRegistrationWindow/'), (state, action) => { state.saving = action.type.endsWith('/pending'); })
    .addMatcher((action) => action.type.startsWith('assistantShift/createAssignment/') || action.type.startsWith('assistantShift/updateAssignment/') || action.type.startsWith('assistantShift/deleteAssignment/'), (state, action) => { state.assignmentLoading = action.type.endsWith('/pending'); }),
});

export const { clearAssistantShiftDetail } = slice.actions;
export const selectAssistantShiftSeries = (state) => state.assistantShift.series;
export const selectAssistantShiftMap = (state) => state.assistantShift.shiftsBySeries;
export const selectAssistantShiftDetail = (state) => state.assistantShift.detail;
export const selectAssistantShiftLoadingSeries = (state) => state.assistantShift.loadingSeries;
export const selectAssistantShiftLoadingShifts = (state) => state.assistantShift.loadingShifts;
export const selectAssistantShiftLoadingDetail = (state) => state.assistantShift.loadingDetail;
export const selectAssistantShiftSaving = (state) => state.assistantShift.saving;
export const selectAssistantShiftAssignmentLoading = (state) => state.assistantShift.assignmentLoading;
export const selectAssistantShiftError = (state) => state.assistantShift.error;
export default slice.reducer;
