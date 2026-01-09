import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chapterApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    chapters: [],
    chaptersBySubject: {},
    rootChapters: [],
    currentChapter: null,
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
        subjectId: null,
        parentChapterId: null,
        level: null,
        sortBy: "orderInParent",
        sortOrder: "asc",
    },
};

// Async thunks
export const getAllChaptersAsync = createAsyncThunk(
    "chapter/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => chapterApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách chương",
        });
    }
);

export const getChaptersBySubjectIdAsync = createAsyncThunk(
    "chapter/getBySubjectId",
    async ({ subjectId, params }, thunkAPI) => {
        return handleAsyncThunk(
            () => chapterApi.getBySubjectId(subjectId, params),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải danh sách chương theo môn học",
            }
        );
    }
);

export const getRootChaptersAsync = createAsyncThunk(
    "chapter/getRootChapters",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => chapterApi.getRootChapters(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách chương gốc",
        });
    }
);

export const getChapterByIdAsync = createAsyncThunk(
    "chapter/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => chapterApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin chương",
        });
    }
);

export const createChapterAsync = createAsyncThunk(
    "chapter/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => chapterApi.create(data), thunkAPI, {
            successTitle: "Tạo chương thành công",
            successMessage: "Chương mới đã được tạo",
            errorTitle: "Tạo chương thất bại",
        });
    }
);

export const updateChapterAsync = createAsyncThunk(
    "chapter/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => chapterApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật chương thành công",
            successMessage: "Thông tin chương đã được cập nhật",
            errorTitle: "Cập nhật chương thất bại",
        });
    }
);

export const deleteChapterAsync = createAsyncThunk(
    "chapter/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => chapterApi.delete(id), thunkAPI, {
            successTitle: "Xóa chương thành công",
            successMessage: "Chương đã được xóa khỏi hệ thống",
            errorTitle: "Xóa chương thất bại",
        });
    }
);

const chapterSlice = createSlice({
    name: "chapter",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentChapter: (state) => {
            state.currentChapter = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearChaptersBySubject: (state, action) => {
            if (action.payload) {
                delete state.chaptersBySubject[action.payload];
            } else {
                state.chaptersBySubject = {};
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Chapters
            .addCase(getAllChaptersAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllChaptersAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.chapters = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllChaptersAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Chapters By Subject ID
            .addCase(getChaptersBySubjectIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getChaptersBySubjectIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                const subjectId = action.meta.arg.subjectId;
                state.chaptersBySubject[subjectId] = action.payload.data;
                state.error = null;
            })
            .addCase(getChaptersBySubjectIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Root Chapters
            .addCase(getRootChaptersAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getRootChaptersAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.rootChapters = action.payload.data;
                state.error = null;
            })
            .addCase(getRootChaptersAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Chapter By ID
            .addCase(getChapterByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getChapterByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentChapter = action.payload.data;
                state.error = null;
            })
            .addCase(getChapterByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Create Chapter
            .addCase(createChapterAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createChapterAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.chapters.unshift(action.payload.data);
                // Update chaptersBySubject if exists
                const subjectId = action.payload.data.subjectId;
                if (state.chaptersBySubject[subjectId]) {
                    state.chaptersBySubject[subjectId].unshift(action.payload.data);
                }
                // Update rootChapters if this is a root chapter
                if (!action.payload.data.parentChapterId) {
                    state.rootChapters.unshift(action.payload.data);
                }
                state.error = null;
            })
            .addCase(createChapterAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update Chapter
            .addCase(updateChapterAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateChapterAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const updatedChapter = action.payload.data;
                
                // Update in chapters array
                const index = state.chapters.findIndex(
                    (c) => c.chapterId === updatedChapter.chapterId
                );
                if (index !== -1) {
                    state.chapters[index] = updatedChapter;
                }
                
                // Update in chaptersBySubject
                const subjectId = updatedChapter.subjectId;
                if (state.chaptersBySubject[subjectId]) {
                    const subjectIndex = state.chaptersBySubject[subjectId].findIndex(
                        (c) => c.chapterId === updatedChapter.chapterId
                    );
                    if (subjectIndex !== -1) {
                        state.chaptersBySubject[subjectId][subjectIndex] = updatedChapter;
                    }
                }
                
                // Update in rootChapters
                if (!updatedChapter.parentChapterId) {
                    const rootIndex = state.rootChapters.findIndex(
                        (c) => c.chapterId === updatedChapter.chapterId
                    );
                    if (rootIndex !== -1) {
                        state.rootChapters[rootIndex] = updatedChapter;
                    }
                }
                
                // Update currentChapter
                if (state.currentChapter?.chapterId === updatedChapter.chapterId) {
                    state.currentChapter = updatedChapter;
                }
                
                state.error = null;
            })
            .addCase(updateChapterAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Chapter
            .addCase(deleteChapterAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteChapterAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                const chapterId = action.meta.arg;
                
                // Remove from chapters array
                state.chapters = state.chapters.filter((c) => c.chapterId !== chapterId);
                
                // Remove from chaptersBySubject
                Object.keys(state.chaptersBySubject).forEach((subjectId) => {
                    state.chaptersBySubject[subjectId] = state.chaptersBySubject[
                        subjectId
                    ].filter((c) => c.chapterId !== chapterId);
                });
                
                // Remove from rootChapters
                state.rootChapters = state.rootChapters.filter(
                    (c) => c.chapterId !== chapterId
                );
                
                // Clear currentChapter if it's the deleted one
                if (state.currentChapter?.chapterId === chapterId) {
                    state.currentChapter = null;
                }
                
                state.error = null;
            })
            .addCase(deleteChapterAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    resetFilters,
    clearCurrentChapter,
    clearError,
    clearChaptersBySubject,
} = chapterSlice.actions;

// Selectors
export const selectChapters = (state) => state.chapter.chapters;
export const selectChaptersBySubject = (subjectId) => (state) =>
    state.chapter.chaptersBySubject[subjectId] || [];
export const selectRootChapters = (state) => state.chapter.rootChapters;
export const selectCurrentChapter = (state) => state.chapter.currentChapter;
export const selectChapterPagination = (state) => state.chapter.pagination;
export const selectChapterFilters = (state) => state.chapter.filters;
export const selectChapterLoadingGet = (state) => state.chapter.loadingGet;
export const selectChapterLoadingCreate = (state) => state.chapter.loadingCreate;
export const selectChapterLoadingUpdate = (state) => state.chapter.loadingUpdate;
export const selectChapterLoadingDelete = (state) => state.chapter.loadingDelete;
export const selectChapterError = (state) => state.chapter.error;

export default chapterSlice.reducer;
