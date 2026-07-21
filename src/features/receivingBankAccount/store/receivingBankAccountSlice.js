import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { receivingBankAccountApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  accounts: [],
  searchResults: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasPrevious: false, hasNext: false },
  loadingList: false,
  loadingSearch: false,
  loadingSave: false,
  syncingFromSepay: false,
  updatingStatusId: null,
  balancesByAccountId: {},
  balanceRequestStates: {},
  error: null,
};

export const getReceivingBankAccountsAsync = createAsyncThunk(
  'receivingBankAccount/getAll',
  (params, thunkAPI) => handleAsyncThunk(
    () => receivingBankAccountApi.getAll(params),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể tải danh sách tài khoản nhận tiền' },
  ),
);

export const searchReceivingBankAccountsAsync = createAsyncThunk(
  'receivingBankAccount/search',
  (params, thunkAPI) => handleAsyncThunk(
    () => receivingBankAccountApi.getAll(params),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể tìm kiếm tài khoản nhận tiền' },
  ),
);

export const createReceivingBankAccountAsync = createAsyncThunk(
  'receivingBankAccount/create',
  (data, thunkAPI) => handleAsyncThunk(
    () => receivingBankAccountApi.create(data),
    thunkAPI,
    { successTitle: 'Đã tạo tài khoản nhận tiền', errorTitle: 'Không thể tạo tài khoản nhận tiền' },
  ),
);

export const updateReceivingBankAccountAsync = createAsyncThunk(
  'receivingBankAccount/update',
  ({ id, data }, thunkAPI) => handleAsyncThunk(
    () => receivingBankAccountApi.update(id, data),
    thunkAPI,
    { successTitle: 'Đã cập nhật tài khoản nhận tiền', errorTitle: 'Không thể cập nhật tài khoản nhận tiền' },
  ),
);

export const setReceivingBankAccountStatusAsync = createAsyncThunk(
  'receivingBankAccount/setStatus',
  ({ id, active }, thunkAPI) => handleAsyncThunk(
    () => active ? receivingBankAccountApi.activate(id) : receivingBankAccountApi.deactivate(id),
    thunkAPI,
    {
      successTitle: active ? 'Đã kích hoạt tài khoản' : 'Đã ngừng kích hoạt tài khoản',
      errorTitle: active ? 'Không thể kích hoạt tài khoản' : 'Không thể ngừng kích hoạt tài khoản',
    },
  ),
);

export const syncReceivingBankAccountsFromSepayAsync = createAsyncThunk(
  'receivingBankAccount/syncFromSepay',
  (_, thunkAPI) => handleAsyncThunk(
    () => receivingBankAccountApi.syncFromSepay(),
    thunkAPI,
    {
      successTitle: 'Đồng bộ SePay thành công',
      successMessage: (response) => {
        const result = response?.data?.data || {};
        return `Tạo mới ${result.created || 0}, cập nhật ${result.updated || 0}, không đổi ${result.unchanged || 0}.`;
      },
      errorTitle: 'Không thể đồng bộ tài khoản từ SePay',
    },
  ),
);

export const getReceivingBankAccountSepayBalanceAsync = createAsyncThunk(
  'receivingBankAccount/getSepayBalance',
  (id, thunkAPI) => handleAsyncThunk(
    () => receivingBankAccountApi.getSepayBalance(id),
    thunkAPI,
    { showSuccess: false, errorTitle: 'Không thể lấy số dư tài khoản SePay' },
  ),
);

const getPayloadData = (payload) => payload?.data ?? payload;

const receivingBankAccountSlice = createSlice({
  name: 'receivingBankAccount',
  initialState,
  reducers: {
    clearReceivingBankAccountError: (state) => { state.error = null; },
    clearReceivingBankAccountBalances: (state) => {
      state.balancesByAccountId = {};
      state.balanceRequestStates = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReceivingBankAccountsAsync.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(getReceivingBankAccountsAsync.fulfilled, (state, action) => {
        state.loadingList = false;
        const result = action.payload || {};
        state.accounts = result?.data || [];
        state.pagination = { ...state.pagination, ...(result?.meta || {}) };
      })
      .addCase(getReceivingBankAccountsAsync.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload;
      })
      .addCase(searchReceivingBankAccountsAsync.pending, (state) => {
        state.loadingSearch = true;
      })
      .addCase(searchReceivingBankAccountsAsync.fulfilled, (state, action) => {
        state.loadingSearch = false;
        state.searchResults = action.payload?.data || [];
      })
      .addCase(searchReceivingBankAccountsAsync.rejected, (state, action) => {
        state.loadingSearch = false;
        state.error = action.payload;
      })
      .addCase(createReceivingBankAccountAsync.pending, (state) => { state.loadingSave = true; })
      .addCase(createReceivingBankAccountAsync.fulfilled, (state) => { state.loadingSave = false; })
      .addCase(createReceivingBankAccountAsync.rejected, (state, action) => {
        state.loadingSave = false;
        state.error = action.payload;
      })
      .addCase(updateReceivingBankAccountAsync.pending, (state) => { state.loadingSave = true; })
      .addCase(updateReceivingBankAccountAsync.fulfilled, (state) => { state.loadingSave = false; })
      .addCase(updateReceivingBankAccountAsync.rejected, (state, action) => {
        state.loadingSave = false;
        state.error = action.payload;
      })
      .addCase(setReceivingBankAccountStatusAsync.pending, (state, action) => {
        state.updatingStatusId = action.meta.arg.id;
      })
      .addCase(setReceivingBankAccountStatusAsync.fulfilled, (state, action) => {
        state.updatingStatusId = null;
        const updated = getPayloadData(action.payload);
        const account = updated?.data || updated;
        const index = state.accounts.findIndex((item) => item.receivingBankAccountId === action.meta.arg.id);
        if (index >= 0 && account?.receivingBankAccountId) state.accounts[index] = account;
      })
      .addCase(setReceivingBankAccountStatusAsync.rejected, (state, action) => {
        state.updatingStatusId = null;
        state.error = action.payload;
      })
      .addCase(syncReceivingBankAccountsFromSepayAsync.pending, (state) => {
        state.syncingFromSepay = true;
      })
      .addCase(syncReceivingBankAccountsFromSepayAsync.fulfilled, (state) => {
        state.syncingFromSepay = false;
        state.balancesByAccountId = {};
        state.balanceRequestStates = {};
      })
      .addCase(syncReceivingBankAccountsFromSepayAsync.rejected, (state, action) => {
        state.syncingFromSepay = false;
        state.error = action.payload;
      })
      .addCase(getReceivingBankAccountSepayBalanceAsync.pending, (state, action) => {
        state.balanceRequestStates[action.meta.arg] = 'pending';
      })
      .addCase(getReceivingBankAccountSepayBalanceAsync.fulfilled, (state, action) => {
        const balance = getPayloadData(action.payload);
        const accountId = balance?.receivingBankAccountId || action.meta.arg;
        state.balancesByAccountId[accountId] = balance;
        state.balanceRequestStates[action.meta.arg] = 'success';
      })
      .addCase(getReceivingBankAccountSepayBalanceAsync.rejected, (state, action) => {
        state.balanceRequestStates[action.meta.arg] = 'error';
        state.error = action.payload;
      });
  },
});

export const { clearReceivingBankAccountError, clearReceivingBankAccountBalances } = receivingBankAccountSlice.actions;
export const selectReceivingBankAccounts = (state) => state.receivingBankAccount.accounts;
export const selectReceivingBankAccountSearchResults = (state) => state.receivingBankAccount.searchResults;
export const selectReceivingBankAccountLoadingSearch = (state) => state.receivingBankAccount.loadingSearch;
export const selectReceivingBankAccountPagination = (state) => state.receivingBankAccount.pagination;
export const selectReceivingBankAccountLoadingList = (state) => state.receivingBankAccount.loadingList;
export const selectReceivingBankAccountLoadingSave = (state) => state.receivingBankAccount.loadingSave;
export const selectReceivingBankAccountUpdatingStatusId = (state) => state.receivingBankAccount.updatingStatusId;
export const selectReceivingBankAccountSyncingFromSepay = (state) => state.receivingBankAccount.syncingFromSepay;
export const selectReceivingBankAccountBalances = (state) => state.receivingBankAccount.balancesByAccountId;
export const selectReceivingBankAccountBalanceRequestStates = (state) => state.receivingBankAccount.balanceRequestStates;
export default receivingBankAccountSlice.reducer;
