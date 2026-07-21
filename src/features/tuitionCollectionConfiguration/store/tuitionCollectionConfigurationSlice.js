import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tuitionCollectionConfigurationApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  configuration: null,
  loadingGet: false,
  loadingUpdate: false,
  error: null,
};

export const getTuitionCollectionConfigurationAsync = createAsyncThunk(
  'tuitionCollectionConfiguration/get',
  (_, thunkAPI) => handleAsyncThunk(
    () => tuitionCollectionConfigurationApi.get(),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể tải cấu hình thu học phí' },
  ),
);

export const updateTuitionCollectionConfigurationAsync = createAsyncThunk(
  'tuitionCollectionConfiguration/update',
  (data, thunkAPI) => handleAsyncThunk(
    () => tuitionCollectionConfigurationApi.update(data),
    thunkAPI,
    { successTitle: 'Đã cập nhật cấu hình thu học phí', errorTitle: 'Không thể cập nhật cấu hình thu học phí' },
  ),
);

const getPayloadData = (payload) => payload?.data ?? payload;

const tuitionCollectionConfigurationSlice = createSlice({
  name: 'tuitionCollectionConfiguration',
  initialState,
  reducers: {
    clearTuitionCollectionConfigurationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTuitionCollectionConfigurationAsync.pending, (state) => {
        state.loadingGet = true;
        state.error = null;
      })
      .addCase(getTuitionCollectionConfigurationAsync.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.configuration = getPayloadData(action.payload);
      })
      .addCase(getTuitionCollectionConfigurationAsync.rejected, (state, action) => {
        state.loadingGet = false;
        state.error = action.payload;
      })
      .addCase(updateTuitionCollectionConfigurationAsync.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateTuitionCollectionConfigurationAsync.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.configuration = getPayloadData(action.payload);
      })
      .addCase(updateTuitionCollectionConfigurationAsync.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
      });
  },
});

export const { clearTuitionCollectionConfigurationError } = tuitionCollectionConfigurationSlice.actions;
export const selectTuitionCollectionConfiguration = (state) => state.tuitionCollectionConfiguration.configuration;
export const selectTuitionCollectionConfigurationLoadingGet = (state) => state.tuitionCollectionConfiguration.loadingGet;
export const selectTuitionCollectionConfigurationLoadingUpdate = (state) => state.tuitionCollectionConfiguration.loadingUpdate;
export const selectTuitionCollectionConfigurationError = (state) => state.tuitionCollectionConfiguration.error;
export default tuitionCollectionConfigurationSlice.reducer;
