import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { paymentIntentApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const initialState = { creatingTuitionPaymentId: null, creatingBulk: false, error: null };
export const createPaymentIntentForTuitionPaymentAsync = createAsyncThunk(
  'paymentIntent/createForTuitionPayment',
  (tuitionPaymentId, thunkAPI) => handleAsyncThunk(
    () => paymentIntentApi.createForTuitionPayment(tuitionPaymentId),
    thunkAPI,
    { successTitle: 'Đã tạo payment intent', errorTitle: 'Không thể tạo payment intent' },
  ),
);
export const createPaymentIntentsForGradePeriodAsync = createAsyncThunk(
  'paymentIntent/createBulkForGradePeriod',
  (data, thunkAPI) => handleAsyncThunk(
    () => paymentIntentApi.createBulkForGradePeriod(data),
    thunkAPI,
    { successTitle: 'Đã tạo payment intent theo khối và kỳ học', errorTitle: 'Không thể tạo payment intent hàng loạt' },
  ),
);
const slice = createSlice({ name: 'paymentIntent', initialState, reducers: {}, extraReducers: (builder) => builder
  .addCase(createPaymentIntentForTuitionPaymentAsync.pending, (state, action) => { state.creatingTuitionPaymentId = action.meta.arg; })
  .addCase(createPaymentIntentForTuitionPaymentAsync.fulfilled, (state) => { state.creatingTuitionPaymentId = null; })
  .addCase(createPaymentIntentForTuitionPaymentAsync.rejected, (state, action) => { state.creatingTuitionPaymentId = null; state.error = action.payload; })
  .addCase(createPaymentIntentsForGradePeriodAsync.pending, (state) => { state.creatingBulk = true; })
  .addCase(createPaymentIntentsForGradePeriodAsync.fulfilled, (state) => { state.creatingBulk = false; })
  .addCase(createPaymentIntentsForGradePeriodAsync.rejected, (state, action) => { state.creatingBulk = false; state.error = action.payload; }),
});
export const selectPaymentIntentCreatingTuitionPaymentId = (state) => state.paymentIntent.creatingTuitionPaymentId;
export const selectPaymentIntentCreatingBulk = (state) => state.paymentIntent.creatingBulk;
export default slice.reducer;
