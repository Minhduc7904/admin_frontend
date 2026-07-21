import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { bankTransferTransactionApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  transactions: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasPrevious: false, hasNext: false },
  searchResults: [],
  searchPagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasPrevious: false, hasNext: false },
  statistics: null,
  selectedTransaction: null,
  loadingList: false,
  loadingSearch: false,
  loadingTuitionPaymentSearch: false,
  loadingSyncSepay: false,
  loadingStatistics: false,
  loadingDetail: false,
  error: null,
};

export const getBankTransferTransactionsAsync = createAsyncThunk(
  'bankTransferTransaction/getAll',
  (params, thunkAPI) => handleAsyncThunk(
    () => bankTransferTransactionApi.getAll(params),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể tải danh sách giao dịch ngân hàng' },
  ),
);

export const searchBankTransferTransactionsAsync = createAsyncThunk(
  'bankTransferTransaction/search',
  (params, thunkAPI) => handleAsyncThunk(
    () => bankTransferTransactionApi.getAll(params),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể tìm giao dịch ngân hàng để đối soát' },
  ),
);

export const searchBankTransferTransactionsForTuitionPaymentAsync = createAsyncThunk(
  'bankTransferTransaction/searchForTuitionPayment',
  ({ tuitionPaymentId, params }, thunkAPI) => handleAsyncThunk(
    () => bankTransferTransactionApi.getForTuitionPayment(tuitionPaymentId, params),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể tải giao dịch dùng để đối soát học phí' },
  ),
);

export const syncBankTransferTransactionsFromSepayAsync = createAsyncThunk(
  'bankTransferTransaction/syncSepay',
  (_, thunkAPI) => handleAsyncThunk(
    () => bankTransferTransactionApi.syncSepay(),
    thunkAPI,
    { successTitle: 'Đã đồng bộ giao dịch SePay', errorTitle: 'Không thể đồng bộ giao dịch SePay' },
  ),
);

export const getBankTransferTransactionStatisticsAsync = createAsyncThunk(
  'bankTransferTransaction/getStatistics',
  (params, thunkAPI) => handleAsyncThunk(
    () => bankTransferTransactionApi.getStatistics(params),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể tải thống kê giao dịch ngân hàng' },
  ),
);

export const getBankTransferTransactionDetailAsync = createAsyncThunk(
  'bankTransferTransaction/getDetail',
  (id, thunkAPI) => handleAsyncThunk(
    () => bankTransferTransactionApi.getById(id),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể tải chi tiết giao dịch ngân hàng' },
  ),
);

const bankTransferTransactionSlice = createSlice({
  name: 'bankTransferTransaction',
  initialState,
  reducers: {
    clearBankTransferTransactionDetail: (state) => {
      state.selectedTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBankTransferTransactionsAsync.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(getBankTransferTransactionsAsync.fulfilled, (state, action) => {
        state.loadingList = false;
        state.transactions = action.payload?.data || [];
        state.pagination = { ...state.pagination, ...(action.payload?.meta || {}) };
      })
      .addCase(getBankTransferTransactionsAsync.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload;
      })
      .addCase(searchBankTransferTransactionsAsync.pending, (state) => {
        state.loadingSearch = true;
      })
      .addCase(searchBankTransferTransactionsAsync.fulfilled, (state, action) => {
        state.loadingSearch = false;
        state.searchResults = action.payload?.data || [];
        state.searchPagination = { ...state.searchPagination, ...(action.payload?.meta || {}) };
      })
      .addCase(searchBankTransferTransactionsAsync.rejected, (state, action) => {
        state.loadingSearch = false;
        state.error = action.payload;
      })
      .addCase(searchBankTransferTransactionsForTuitionPaymentAsync.pending, (state) => {
        state.loadingTuitionPaymentSearch = true;
      })
      .addCase(searchBankTransferTransactionsForTuitionPaymentAsync.fulfilled, (state, action) => {
        state.loadingTuitionPaymentSearch = false;
        state.searchResults = action.payload?.data || [];
        state.searchPagination = { ...state.searchPagination, ...(action.payload?.meta || {}) };
      })
      .addCase(searchBankTransferTransactionsForTuitionPaymentAsync.rejected, (state, action) => {
        state.loadingTuitionPaymentSearch = false;
        state.error = action.payload;
      })
      .addCase(syncBankTransferTransactionsFromSepayAsync.pending, (state) => {
        state.loadingSyncSepay = true;
      })
      .addCase(syncBankTransferTransactionsFromSepayAsync.fulfilled, (state) => {
        state.loadingSyncSepay = false;
      })
      .addCase(syncBankTransferTransactionsFromSepayAsync.rejected, (state, action) => {
        state.loadingSyncSepay = false;
        state.error = action.payload;
      })
      .addCase(getBankTransferTransactionStatisticsAsync.pending, (state) => {
        state.loadingStatistics = true;
      })
      .addCase(getBankTransferTransactionStatisticsAsync.fulfilled, (state, action) => {
        state.loadingStatistics = false;
        state.statistics = action.payload?.data || action.payload || null;
      })
      .addCase(getBankTransferTransactionStatisticsAsync.rejected, (state, action) => {
        state.loadingStatistics = false;
        state.error = action.payload;
      })
      .addCase(getBankTransferTransactionDetailAsync.pending, (state) => {
        state.loadingDetail = true;
        state.selectedTransaction = null;
      })
      .addCase(getBankTransferTransactionDetailAsync.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedTransaction = action.payload?.data || action.payload || null;
      })
      .addCase(getBankTransferTransactionDetailAsync.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      });
  },
});

export const { clearBankTransferTransactionDetail } = bankTransferTransactionSlice.actions;
export const selectBankTransferTransactions = (state) => state.bankTransferTransaction.transactions;
export const selectBankTransferTransactionPagination = (state) => state.bankTransferTransaction.pagination;
export const selectBankTransferTransactionSearchResults = (state) => state.bankTransferTransaction.searchResults;
export const selectBankTransferTransactionSearchPagination = (state) => state.bankTransferTransaction.searchPagination;
export const selectBankTransferTransactionStatistics = (state) => state.bankTransferTransaction.statistics;
export const selectBankTransferTransactionDetail = (state) => state.bankTransferTransaction.selectedTransaction;
export const selectBankTransferTransactionLoadingList = (state) => state.bankTransferTransaction.loadingList;
export const selectBankTransferTransactionLoadingSearch = (state) => state.bankTransferTransaction.loadingSearch;
export const selectBankTransferTransactionLoadingTuitionPaymentSearch = (state) => state.bankTransferTransaction.loadingTuitionPaymentSearch;
export const selectBankTransferTransactionLoadingSyncSepay = (state) => state.bankTransferTransaction.loadingSyncSepay;
export const selectBankTransferTransactionLoadingStatistics = (state) => state.bankTransferTransaction.loadingStatistics;
export const selectBankTransferTransactionLoadingDetail = (state) => state.bankTransferTransaction.loadingDetail;
export default bankTransferTransactionSlice.reducer;
