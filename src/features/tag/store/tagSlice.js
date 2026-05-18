import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tagApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    tags: [],
    tagsByType: {
        LEVEL: [],
        GRADE: [],
        DOCUMENT_TYPE: [],
        SUBJECT: [],
    },
    loadedTagTypes: {
        LEVEL: false,
        GRADE: false,
        DOCUMENT_TYPE: false,
        SUBJECT: false,
    },
    loadingTagTypes: {
        LEVEL: false,
        GRADE: false,
        DOCUMENT_TYPE: false,
        SUBJECT: false,
    },
    currentTag: null,
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
        type: '',
        isActive: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    },
};

export const getAllTagsAsync = createAsyncThunk(
    'tag/getAll',
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => tagApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: 'Lỗi tải danh sách tag',
        });
    }
);

const createGetTagsByTypeThunk = (type) =>
    createAsyncThunk(
        `tag/getByType/${type}`,
        async (_, thunkAPI) => {
            return handleAsyncThunk(
                () =>
                    tagApi.getAll({
                        page: 1,
                        limit: 1000,
                        type,
                        isActive: true,
                    }),
                thunkAPI,
                {
                    showSuccess: false,
                    errorTitle: 'Lỗi tải danh sách tag',
                }
            );
        },
        {
            condition: (_, { getState }) => {
                const { loadedTagTypes, loadingTagTypes } = getState().tag;
                return !loadedTagTypes[type] && !loadingTagTypes[type];
            },
        }
    );

export const getLevelTagsAsync = createGetTagsByTypeThunk('LEVEL');
export const getGradeTagsAsync = createGetTagsByTypeThunk('GRADE');
export const getDocumentTypeTagsAsync = createGetTagsByTypeThunk('DOCUMENT_TYPE');
export const getSubjectTagsAsync = createGetTagsByTypeThunk('SUBJECT');

export const getTagByIdAsync = createAsyncThunk(
    'tag/getById',
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => tagApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: 'Lỗi tải thông tin tag',
        });
    }
);

export const createTagAsync = createAsyncThunk(
    'tag/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => tagApi.create(data), thunkAPI, {
            successTitle: 'Tạo tag thành công',
            successMessage: 'Tag mới đã được tạo',
            errorTitle: 'Tạo tag thất bại',
        });
    }
);

export const updateTagAsync = createAsyncThunk(
    'tag/update',
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => tagApi.update(id, data), thunkAPI, {
            successTitle: 'Cập nhật tag thành công',
            successMessage: 'Thông tin tag đã được cập nhật',
            errorTitle: 'Cập nhật tag thất bại',
        });
    }
);

export const deleteTagAsync = createAsyncThunk(
    'tag/delete',
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => tagApi.delete(id), thunkAPI, {
            successTitle: 'Xóa tag thành công',
            successMessage: 'Tag đã được xóa khỏi hệ thống',
            errorTitle: 'Xóa tag thất bại',
        });
    }
);

const tagSlice = createSlice({
    name: 'tag',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentTag: (state) => {
            state.currentTag = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllTagsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllTagsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.tags = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllTagsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            .addCase(getLevelTagsAsync.pending, (state) => {
                state.loadingTagTypes.LEVEL = true;
            })
            .addCase(getLevelTagsAsync.fulfilled, (state, action) => {
                state.tagsByType.LEVEL = action.payload.data;
                state.loadedTagTypes.LEVEL = true;
                state.loadingTagTypes.LEVEL = false;
            })
            .addCase(getLevelTagsAsync.rejected, (state) => {
                state.loadingTagTypes.LEVEL = false;
            })
            .addCase(getGradeTagsAsync.pending, (state) => {
                state.loadingTagTypes.GRADE = true;
            })
            .addCase(getGradeTagsAsync.fulfilled, (state, action) => {
                state.tagsByType.GRADE = action.payload.data;
                state.loadedTagTypes.GRADE = true;
                state.loadingTagTypes.GRADE = false;
            })
            .addCase(getGradeTagsAsync.rejected, (state) => {
                state.loadingTagTypes.GRADE = false;
            })
            .addCase(getDocumentTypeTagsAsync.pending, (state) => {
                state.loadingTagTypes.DOCUMENT_TYPE = true;
            })
            .addCase(getDocumentTypeTagsAsync.fulfilled, (state, action) => {
                state.tagsByType.DOCUMENT_TYPE = action.payload.data;
                state.loadedTagTypes.DOCUMENT_TYPE = true;
                state.loadingTagTypes.DOCUMENT_TYPE = false;
            })
            .addCase(getDocumentTypeTagsAsync.rejected, (state) => {
                state.loadingTagTypes.DOCUMENT_TYPE = false;
            })
            .addCase(getSubjectTagsAsync.pending, (state) => {
                state.loadingTagTypes.SUBJECT = true;
            })
            .addCase(getSubjectTagsAsync.fulfilled, (state, action) => {
                state.tagsByType.SUBJECT = action.payload.data;
                state.loadedTagTypes.SUBJECT = true;
                state.loadingTagTypes.SUBJECT = false;
            })
            .addCase(getSubjectTagsAsync.rejected, (state) => {
                state.loadingTagTypes.SUBJECT = false;
            })
            .addCase(getTagByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getTagByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentTag = action.payload.data;
                state.error = null;
            })
            .addCase(getTagByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            .addCase(createTagAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createTagAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.tags.unshift(action.payload.data);
                const createdTag = action.payload.data;
                if (state.loadedTagTypes[createdTag.type] && createdTag.isActive) {
                    state.tagsByType[createdTag.type]?.unshift(createdTag);
                }
                state.error = null;
            })
            .addCase(createTagAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            .addCase(updateTagAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateTagAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const updatedTag = action.payload.data;
                const index = state.tags.findIndex((tag) => tag.tagId === updatedTag.tagId);

                if (index !== -1) {
                    state.tags[index] = updatedTag;
                }

                if (state.currentTag?.tagId === updatedTag.tagId) {
                    state.currentTag = updatedTag;
                }

                Object.keys(state.tagsByType).forEach((type) => {
                    state.tagsByType[type] = state.tagsByType[type].filter(
                        (tag) => tag.tagId !== updatedTag.tagId
                    );
                });

                if (state.loadedTagTypes[updatedTag.type] && updatedTag.isActive) {
                    state.tagsByType[updatedTag.type]?.unshift(updatedTag);
                }

                state.error = null;
            })
            .addCase(updateTagAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            .addCase(deleteTagAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteTagAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.tags = state.tags.filter((tag) => tag.tagId !== action.meta.arg);
                Object.keys(state.tagsByType).forEach((type) => {
                    state.tagsByType[type] = state.tagsByType[type].filter(
                        (tag) => tag.tagId !== action.meta.arg
                    );
                });

                if (state.currentTag?.tagId === action.meta.arg) {
                    state.currentTag = null;
                }

                state.error = null;
            })
            .addCase(deleteTagAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    resetFilters,
    clearCurrentTag,
    clearError,
} = tagSlice.actions;

export const selectTags = (state) => state.tag.tags;
export const selectLevelTags = (state) => state.tag.tagsByType.LEVEL;
export const selectGradeTags = (state) => state.tag.tagsByType.GRADE;
export const selectDocumentTypeTags = (state) => state.tag.tagsByType.DOCUMENT_TYPE;
export const selectSubjectTags = (state) => state.tag.tagsByType.SUBJECT;
export const selectCurrentTag = (state) => state.tag.currentTag;
export const selectTagPagination = (state) => state.tag.pagination;
export const selectTagFilters = (state) => state.tag.filters;
export const selectTagLoadingGet = (state) => state.tag.loadingGet;
export const selectTagLoadingCreate = (state) => state.tag.loadingCreate;
export const selectTagLoadingUpdate = (state) => state.tag.loadingUpdate;
export const selectTagLoadingDelete = (state) => state.tag.loadingDelete;
export const selectTagError = (state) => state.tag.error;

export default tagSlice.reducer;
