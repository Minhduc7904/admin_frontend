import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tuitionGradeBankAccountApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  mappings: [],
  loadingGet: false,
  loadingUpdate: false,
  error: null,
};

export const getTuitionGradeBankAccountsAsync = createAsyncThunk(
  'tuitionGradeBankAccount/getAll',
  (_, thunkAPI) => handleAsyncThunk(
    () => tuitionGradeBankAccountApi.getAll(),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể tải cấu hình tài khoản theo khối' },
  ),
);

export const updateTuitionGradeBankAccountsAsync = createAsyncThunk(
  'tuitionGradeBankAccount/update',
  (data, thunkAPI) => handleAsyncThunk(
    () => tuitionGradeBankAccountApi.update(data),
    thunkAPI,
    { successTitle: 'Đã cập nhật tài khoản nhận tiền theo khối', errorTitle: 'Không thể cập nhật tài khoản theo khối' },
  ),
);

const tuitionGradeBankAccountSlice = createSlice({
  name: 'tuitionGradeBankAccount',
  initialState,
  reducers: {
    clearTuitionGradeBankAccountError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTuitionGradeBankAccountsAsync.pending, (state) => {
        state.loadingGet = true;
        state.error = null;
      })
      .addCase(getTuitionGradeBankAccountsAsync.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.mappings = action.payload?.data || [];
      })
      .addCase(getTuitionGradeBankAccountsAsync.rejected, (state, action) => {
        state.loadingGet = false;
        state.error = action.payload;
      })
      .addCase(updateTuitionGradeBankAccountsAsync.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateTuitionGradeBankAccountsAsync.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.mappings = action.payload?.data || [];
      })
      .addCase(updateTuitionGradeBankAccountsAsync.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
      });
  },
});

export const { clearTuitionGradeBankAccountError } = tuitionGradeBankAccountSlice.actions;
export const selectTuitionGradeBankAccounts = (state) => state.tuitionGradeBankAccount.mappings;
export const selectTuitionGradeBankAccountsLoadingGet = (state) => state.tuitionGradeBankAccount.loadingGet;
export const selectTuitionGradeBankAccountsLoadingUpdate = (state) => state.tuitionGradeBankAccount.loadingUpdate;
export const selectTuitionGradeBankAccountsError = (state) => state.tuitionGradeBankAccount.error;
export default tuitionGradeBankAccountSlice.reducer;
