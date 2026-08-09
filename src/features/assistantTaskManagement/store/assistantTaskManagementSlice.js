import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { assistantTaskApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils';

const getRequest = (call, thunkAPI, errorTitle) => handleAsyncThunk(call, thunkAPI, { showSuccess: false, errorTitle });
const initialState = {
  tasks: [],
  meta: null,
  loading: false,
  saving: false,
  error: null,
};

export const getAssistantTasksAsync = createAsyncThunk(
  'assistantTaskManagement/getTasks',
  (params, thunkAPI) => getRequest(() => assistantTaskApi.getAll(params), thunkAPI, 'Không thể tải danh sách công việc trợ giảng'),
);

export const createAssistantTaskAsync = createAsyncThunk(
  'assistantTaskManagement/createTask',
  (data, thunkAPI) => handleAsyncThunk(
    () => assistantTaskApi.create(data),
    thunkAPI,
    { successTitle: 'Đã tạo task trợ giảng', errorTitle: 'Không thể tạo task trợ giảng' },
  ),
);

const slice = createSlice({
  name: 'assistantTaskManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(getAssistantTasksAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAssistantTasksAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload?.data || [];
      state.meta = action.payload?.meta || null;
    })
    .addCase(getAssistantTasksAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(createAssistantTaskAsync.pending, (state) => {
      state.saving = true;
    })
    .addCase(createAssistantTaskAsync.fulfilled, (state) => {
      state.saving = false;
    })
    .addCase(createAssistantTaskAsync.rejected, (state) => {
      state.saving = false;
    }),
});

export const selectAssistantTasks = (state) => state.assistantTaskManagement.tasks;
export const selectAssistantTasksMeta = (state) => state.assistantTaskManagement.meta;
export const selectAssistantTasksLoading = (state) => state.assistantTaskManagement.loading;
export const selectAssistantTasksSaving = (state) => state.assistantTaskManagement.saving;
export const selectAssistantTasksError = (state) => state.assistantTaskManagement.error;
export default slice.reducer;
