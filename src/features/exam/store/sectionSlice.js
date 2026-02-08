import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sectionApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    sections: [],
    currentSection: null,
    loadingGet: false,
    loadingGetById: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
};

// Async thunks
export const getSectionsByExamAsync = createAsyncThunk(
    "section/getByExam",
    async (examId, thunkAPI) => {
        return handleAsyncThunk(() => sectionApi.getByExam(examId), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách phần",
        });
    }
);

export const getSectionByIdAsync = createAsyncThunk(
    "section/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => sectionApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin phần",
        });
    }
);

export const createSectionAsync = createAsyncThunk(
    "section/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => sectionApi.create(data), thunkAPI, {
            successTitle: "Tạo phần thành công",
            successMessage: "Phần mới đã được tạo",
            errorTitle: "Tạo phần thất bại",
        });
    }
);

export const updateSectionAsync = createAsyncThunk(
    "section/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => sectionApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật phần thành công",
            successMessage: "Thông tin phần đã được cập nhật",
            errorTitle: "Cập nhật phần thất bại",
        });
    }
);

export const deleteSectionAsync = createAsyncThunk(
    "section/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => sectionApi.delete(id), thunkAPI, {
            successTitle: "Xóa phần thành công",
            successMessage: "Phần đã được xóa khỏi hệ thống",
            errorTitle: "Xóa phần thất bại",
        });
    }
);

const sectionSlice = createSlice({
    name: "section",
    initialState,
    reducers: {
        clearCurrentSection: (state) => {
            state.currentSection = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSections: (state) => {
            state.sections = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Sections By Exam
            .addCase(getSectionsByExamAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getSectionsByExamAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.sections = action.payload.data;
                state.error = null;
            })
            .addCase(getSectionsByExamAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Section By ID
            .addCase(getSectionByIdAsync.pending, (state) => {
                state.loadingGetById = true;
                state.error = null;
            })
            .addCase(getSectionByIdAsync.fulfilled, (state, action) => {
                state.loadingGetById = false;
                state.currentSection = action.payload.data;
                state.error = null;
            })
            .addCase(getSectionByIdAsync.rejected, (state, action) => {
                state.loadingGetById = false;
                state.error = action.payload;
            })
            // Create Section
            .addCase(createSectionAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createSectionAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.sections.push(action.payload.data);
                state.sections.sort((a, b) => a.order - b.order);
                state.error = null;
            })
            .addCase(createSectionAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update Section
            .addCase(updateSectionAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateSectionAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.sections.findIndex(
                    (s) => s.sectionId === action.payload.data.sectionId
                );
                if (index !== -1) {
                    state.sections[index] = action.payload.data;
                    state.sections.sort((a, b) => a.order - b.order);
                }
                if (state.currentSection?.sectionId === action.payload.data.sectionId) {
                    state.currentSection = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateSectionAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Section
            .addCase(deleteSectionAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteSectionAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.sections = state.sections.filter(
                    (s) => s.sectionId !== action.meta.arg
                );
                if (state.currentSection?.sectionId === action.meta.arg) {
                    state.currentSection = null;
                }
                state.error = null;
            })
            .addCase(deleteSectionAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentSection, clearError, clearSections } = sectionSlice.actions;

// Selectors
export const selectSections = (state) => state.section.sections;
export const selectCurrentSection = (state) => state.section.currentSection;
export const selectSectionLoadingGet = (state) => state.section.loadingGet;
export const selectSectionLoadingGetById = (state) => state.section.loadingGetById;
export const selectSectionLoadingCreate = (state) => state.section.loadingCreate;
export const selectSectionLoadingUpdate = (state) => state.section.loadingUpdate;
export const selectSectionLoadingDelete = (state) => state.section.loadingDelete;
export const selectSectionError = (state) => state.section.error;

export default sectionSlice.reducer;
