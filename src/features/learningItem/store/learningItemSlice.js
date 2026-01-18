import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { learningItemApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    learningItems: [],
    myLearningItems: [],
    currentLearningItem: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    myLearningItemsPagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingGetMyLearningItems: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    filters: {
        search: "",
        type: "", // VIDEO, DOCUMENT, HOMEWORK, YOUTUBE
        lessonId: "",
        createdBy: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
    myLearningItemsFilters: {
        search: "",
        type: "",
        lessonId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllLearningItemsAsync = createAsyncThunk(
    "learningItem/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => learningItemApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách tài liệu học tập",
        });
    }
);

export const getMyLearningItemsAsync = createAsyncThunk(
    "learningItem/getMyLearningItems",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => learningItemApi.getMyLearningItems(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách tài liệu của tôi",
        });
    }
);

export const getLearningItemByIdAsync = createAsyncThunk(
    "learningItem/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => learningItemApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin tài liệu học tập",
        });
    }
);

export const createLearningItemAsync = createAsyncThunk(
    "learningItem/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => learningItemApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo tài liệu học tập thành công",
            errorTitle: "Lỗi tạo tài liệu học tập",
        });
    }
);

export const updateLearningItemAsync = createAsyncThunk(
    "learningItem/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => learningItemApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật tài liệu học tập thành công",
            errorTitle: "Lỗi cập nhật tài liệu học tập",
        });
    }
);

export const deleteLearningItemAsync = createAsyncThunk(
    "learningItem/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => learningItemApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa tài liệu học tập thành công",
            errorTitle: "Lỗi xóa tài liệu học tập",
        });
    }
);

export const searchLearningItemsAsync = createAsyncThunk(
    "learningItem/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => learningItemApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm tài liệu học tập",
        });
    }
);

export const learningItemSlice = createSlice({
    name: "learningItem",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearCurrentLearningItem: (state) => {
            state.currentLearningItem = null;
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        resetPagination: (state) => {
            state.pagination = initialState.pagination;
        },

        setMyLearningItemsFilters: (state, action) => {
            state.myLearningItemsFilters = { ...state.myLearningItemsFilters, ...action.payload };
        },
        resetMyLearningItemsFilters: (state) => {
            state.myLearningItemsFilters = initialState.myLearningItemsFilters;
        },
        setMyLearningItemsPagination: (state, action) => {
            state.myLearningItemsPagination = { ...state.myLearningItemsPagination, ...action.payload };
        },
        resetMyLearningItemsPagination: (state) => {
            state.myLearningItemsPagination = initialState.myLearningItemsPagination;
        },
    },
    extraReducers: (builder) => {
        // Get all learning items
        builder
            .addCase(getAllLearningItemsAsync.pending, (state) => {
                state.learningItems = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllLearningItemsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.learningItems = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllLearningItemsAsync.rejected, (state, action) => {
                state.learningItems = [];
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get my learning items
            .addCase(getMyLearningItemsAsync.pending, (state) => {
                state.myLearningItems = [];
                state.loadingGetMyLearningItems = true;
                state.error = null;
            })
            .addCase(getMyLearningItemsAsync.fulfilled, (state, action) => {
                state.loadingGetMyLearningItems = false;
                state.myLearningItems = action.payload.data;
                state.myLearningItemsPagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getMyLearningItemsAsync.rejected, (state, action) => {
                state.myLearningItems = [];
                state.loadingGetMyLearningItems = false;
                state.error = action.payload;
            })

            // Get learning item by ID
            .addCase(getLearningItemByIdAsync.pending, (state) => {
                state.currentLearningItem = null;
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getLearningItemByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentLearningItem = action.payload.data;
                state.error = null;
            })
            .addCase(getLearningItemByIdAsync.rejected, (state, action) => {
                state.currentLearningItem = null;
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create learning item
            .addCase(createLearningItemAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createLearningItemAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.error = null;
            })
            .addCase(createLearningItemAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update learning item
            .addCase(updateLearningItemAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateLearningItemAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.learningItems.findIndex(
                    (item) => item.learningItemId === action.payload.data.learningItemId
                );
                if (index !== -1) {
                    state.learningItems[index] = action.payload.data;
                }
                if (
                    state.currentLearningItem &&
                    state.currentLearningItem.learningItemId === action.payload.data.learningItemId
                ) {
                    state.currentLearningItem = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateLearningItemAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete learning item
            .addCase(deleteLearningItemAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteLearningItemAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.learningItems = state.learningItems.filter(
                    (item) => item.learningItemId !== action.meta.arg
                );
                state.error = null;
            })
            .addCase(deleteLearningItemAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    clearCurrentLearningItem,
    resetFilters,
    setPagination,
    resetPagination,
    setMyLearningItemsFilters,
    resetMyLearningItemsFilters,
    setMyLearningItemsPagination,
    resetMyLearningItemsPagination,
} = learningItemSlice.actions;

export const selectLearningItems = (state) => state.learningItem.learningItems;
export const selectCurrentLearningItem = (state) => state.learningItem.currentLearningItem;
export const selectLearningItemPagination = (state) => state.learningItem.pagination;
export const selectLearningItemLoadingGet = (state) => state.learningItem.loadingGet;
export const selectLearningItemLoadingCreate = (state) => state.learningItem.loadingCreate;
export const selectLearningItemLoadingUpdate = (state) => state.learningItem.loadingUpdate;
export const selectLearningItemLoadingDelete = (state) => state.learningItem.loadingDelete;
export const selectLearningItemError = (state) => state.learningItem.error;
export const selectLearningItemFilters = (state) => state.learningItem.filters;

export const selectMyLearningItems = (state) => state.learningItem.myLearningItems;
export const selectMyLearningItemsPagination = (state) => state.learningItem.myLearningItemsPagination;
export const selectMyLearningItemsLoadingGet = (state) => state.learningItem.loadingGetMyLearningItems;
export const selectMyLearningItemsFilters = (state) => state.learningItem.myLearningItemsFilters;

export default learningItemSlice.reducer;
