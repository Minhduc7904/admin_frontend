import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseEnrollmentApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    enrollments: [],
    currentEnrollment: null,
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
        search: "",
        courseId: "",
        studentId: "",
        status: "",          // active | completed | dropped
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// ======================
// Async thunks
// ======================

export const getAllEnrollmentsAsync = createAsyncThunk(
    "courseEnrollment/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseEnrollmentApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách ghi danh",
        });
    }
);

export const getEnrollmentByIdAsync = createAsyncThunk(
    "courseEnrollment/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => courseEnrollmentApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin ghi danh",
        });
    }
);

export const createEnrollmentAsync = createAsyncThunk(
    "courseEnrollment/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => courseEnrollmentApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Ghi danh thành công",
            errorTitle: "Lỗi ghi danh",
        });
    }
);

export const updateEnrollmentAsync = createAsyncThunk(
    "courseEnrollment/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => courseEnrollmentApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật ghi danh thành công",
            errorTitle: "Lỗi cập nhật ghi danh",
        });
    }
);

export const deleteEnrollmentAsync = createAsyncThunk(
    "courseEnrollment/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => courseEnrollmentApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Hủy ghi danh thành công",
            errorTitle: "Lỗi hủy ghi danh",
        });
    }
);

// ======================
// Slice
// ======================

export const courseEnrollmentSlice = createSlice({
    name: "courseEnrollment",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentEnrollment: (state) => {
            state.currentEnrollment = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all
            .addCase(getAllEnrollmentsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllEnrollmentsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.enrollments = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllEnrollmentsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(getEnrollmentByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getEnrollmentByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentEnrollment = action.payload.data;
            })
            .addCase(getEnrollmentByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createEnrollmentAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createEnrollmentAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.enrollments.unshift(action.payload.data);
            })
            .addCase(createEnrollmentAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateEnrollmentAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateEnrollmentAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.enrollments.findIndex(
                    (en) => en.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.enrollments[index] = action.payload.data;
                }
                if (
                    state.currentEnrollment &&
                    state.currentEnrollment.id === action.payload.data.id
                ) {
                    state.currentEnrollment = action.payload.data;
                }
            })
            .addCase(updateEnrollmentAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteEnrollmentAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteEnrollmentAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.enrollments = state.enrollments.filter(
                    (en) => en.id !== action.meta.arg
                );
            })
            .addCase(deleteEnrollmentAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

// ======================
// Selectors
// ======================

export const {
    setFilters,
    resetFilters,
    clearCurrentEnrollment,
} = courseEnrollmentSlice.actions;

export const selectEnrollments = (state) => state.courseEnrollment.enrollments;
export const selectCurrentEnrollment = (state) =>
    state.courseEnrollment.currentEnrollment;
export const selectEnrollmentPagination = (state) =>
    state.courseEnrollment.pagination;
export const selectEnrollmentLoadingGet = (state) =>
    state.courseEnrollment.loadingGet;
export const selectEnrollmentLoadingCreate = (state) =>
    state.courseEnrollment.loadingCreate;
export const selectEnrollmentLoadingUpdate = (state) =>
    state.courseEnrollment.loadingUpdate;
export const selectEnrollmentLoadingDelete = (state) =>
    state.courseEnrollment.loadingDelete;
export const selectEnrollmentError = (state) =>
    state.courseEnrollment.error;
export const selectEnrollmentFilters = (state) =>
    state.courseEnrollment.filters;

export default courseEnrollmentSlice.reducer;
