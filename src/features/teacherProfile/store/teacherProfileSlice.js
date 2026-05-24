import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { teacherProfileApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    teacherProfiles: [],
    currentTeacherProfile: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    filters: {
        search: '',
        visibility: '',
        isFeatured: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    },
};

export const getAllTeacherProfilesAsync = createAsyncThunk(
    'teacherProfile/getAll',
    async (params, thunkAPI) =>
        handleAsyncThunk(() => teacherProfileApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: 'Lỗi tải danh sách hồ sơ giáo viên',
        })
);

export const getTeacherProfileByIdAsync = createAsyncThunk(
    'teacherProfile/getById',
    async (id, thunkAPI) =>
        handleAsyncThunk(() => teacherProfileApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: 'Lỗi tải hồ sơ giáo viên',
        })
);

export const createTeacherProfileAsync = createAsyncThunk(
    'teacherProfile/create',
    async (data, thunkAPI) =>
        handleAsyncThunk(() => teacherProfileApi.create(data), thunkAPI, {
            successTitle: 'Tạo hồ sơ giáo viên thành công',
            successMessage: 'Hồ sơ giáo viên mới đã được tạo',
            errorTitle: 'Tạo hồ sơ giáo viên thất bại',
        })
);

export const updateTeacherProfileAsync = createAsyncThunk(
    'teacherProfile/update',
    async ({ id, data }, thunkAPI) =>
        handleAsyncThunk(() => teacherProfileApi.update(id, data), thunkAPI, {
            successTitle: 'Cập nhật hồ sơ giáo viên thành công',
            successMessage: 'Thông tin hồ sơ giáo viên đã được cập nhật',
            errorTitle: 'Cập nhật hồ sơ giáo viên thất bại',
        })
);

export const deleteTeacherProfileAsync = createAsyncThunk(
    'teacherProfile/delete',
    async (id, thunkAPI) =>
        handleAsyncThunk(() => teacherProfileApi.delete(id), thunkAPI, {
            successTitle: 'Xóa hồ sơ giáo viên thành công',
            successMessage: 'Hồ sơ giáo viên đã được xóa khỏi hệ thống',
            errorTitle: 'Xóa hồ sơ giáo viên thất bại',
        })
);

const teacherProfileSlice = createSlice({
    name: 'teacherProfile',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearCurrentTeacherProfile: (state) => {
            state.currentTeacherProfile = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllTeacherProfilesAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllTeacherProfilesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.teacherProfiles = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllTeacherProfilesAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            .addCase(getTeacherProfileByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getTeacherProfileByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentTeacherProfile = action.payload.data;
            })
            .addCase(getTeacherProfileByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.currentTeacherProfile = null;
                state.error = action.payload;
            })
            .addCase(createTeacherProfileAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createTeacherProfileAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.teacherProfiles.unshift(action.payload.data);
            })
            .addCase(createTeacherProfileAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            .addCase(updateTeacherProfileAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateTeacherProfileAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const updatedProfile = action.payload.data;
                const index = state.teacherProfiles.findIndex(
                    (profile) => profile.teacherProfileId === updatedProfile.teacherProfileId
                );
                if (index !== -1) {
                    state.teacherProfiles[index] = updatedProfile;
                }
                if (state.currentTeacherProfile?.teacherProfileId === updatedProfile.teacherProfileId) {
                    state.currentTeacherProfile = updatedProfile;
                }
            })
            .addCase(updateTeacherProfileAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            .addCase(deleteTeacherProfileAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteTeacherProfileAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.teacherProfiles = state.teacherProfiles.filter(
                    (profile) => profile.teacherProfileId !== action.meta.arg
                );
                if (state.currentTeacherProfile?.teacherProfileId === action.meta.arg) {
                    state.currentTeacherProfile = null;
                }
            })
            .addCase(deleteTeacherProfileAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, setPagination, clearCurrentTeacherProfile } = teacherProfileSlice.actions;

export const selectTeacherProfiles = (state) => state.teacherProfile.teacherProfiles;
export const selectCurrentTeacherProfile = (state) => state.teacherProfile.currentTeacherProfile;
export const selectTeacherProfilePagination = (state) => state.teacherProfile.pagination;
export const selectTeacherProfileFilters = (state) => state.teacherProfile.filters;
export const selectTeacherProfileLoadingGet = (state) => state.teacherProfile.loadingGet;
export const selectTeacherProfileLoadingCreate = (state) => state.teacherProfile.loadingCreate;
export const selectTeacherProfileLoadingUpdate = (state) => state.teacherProfile.loadingUpdate;
export const selectTeacherProfileLoadingDelete = (state) => state.teacherProfile.loadingDelete;

export default teacherProfileSlice.reducer;
