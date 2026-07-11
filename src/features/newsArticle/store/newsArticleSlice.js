import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { newsArticleApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    articles: [],
    currentArticle: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasPrevious: false, hasNext: false },
    filters: { search: '', type: '', visibility: '', isFeatured: '', sortBy: 'publishedAt', sortOrder: 'desc' },
    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
};

const request = (apiCall, thunkAPI, options) => handleAsyncThunk(apiCall, thunkAPI, options);

export const getAllNewsArticlesAsync = createAsyncThunk(
    'newsArticle/getAll',
    async (params, thunkAPI) => request(() => newsArticleApi.getAll(params), thunkAPI, {
        showSuccess: false, errorTitle: 'Không thể tải danh sách bài viết',
    })
);
export const getNewsArticleByIdAsync = createAsyncThunk(
    'newsArticle/getById',
    async (id, thunkAPI) => request(() => newsArticleApi.getById(id), thunkAPI, {
        showSuccess: false, errorTitle: 'Không thể tải bài viết',
    })
);
export const createNewsArticleAsync = createAsyncThunk(
    'newsArticle/create',
    async (data, thunkAPI) => request(() => newsArticleApi.create(data), thunkAPI, {
        successTitle: 'Tạo bài viết thành công', successMessage: 'Bài viết tin tức mới đã được tạo.', errorTitle: 'Tạo bài viết thất bại',
    })
);
export const updateNewsArticleAsync = createAsyncThunk(
    'newsArticle/update',
    async ({ id, data }, thunkAPI) => request(() => newsArticleApi.update(id, data), thunkAPI, {
        successTitle: 'Cập nhật bài viết thành công', successMessage: 'Các thay đổi đã được lưu.', errorTitle: 'Cập nhật bài viết thất bại',
    })
);
export const deleteNewsArticleAsync = createAsyncThunk(
    'newsArticle/delete',
    async (id, thunkAPI) => request(() => newsArticleApi.delete(id), thunkAPI, {
        successTitle: 'Đã xóa bài viết', successMessage: 'Bài viết và các liên kết media đã được gỡ.', errorTitle: 'Xóa bài viết thất bại',
    })
);

const newsArticleSlice = createSlice({
    name: 'newsArticle',
    initialState,
    reducers: {
        setNewsArticleFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
        setNewsArticlePagination: (state, action) => { state.pagination = { ...state.pagination, ...action.payload }; },
        clearCurrentNewsArticle: (state) => { state.currentArticle = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllNewsArticlesAsync.pending, (state) => { state.loadingGet = true; state.error = null; })
            .addCase(getAllNewsArticlesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.articles = action.payload.data || [];
                state.pagination = { ...state.pagination, ...action.payload.meta };
            })
            .addCase(getAllNewsArticlesAsync.rejected, (state, action) => { state.loadingGet = false; state.error = action.payload; })
            .addCase(getNewsArticleByIdAsync.pending, (state) => { state.loadingGet = true; state.error = null; })
            .addCase(getNewsArticleByIdAsync.fulfilled, (state, action) => { state.loadingGet = false; state.currentArticle = action.payload.data; })
            .addCase(getNewsArticleByIdAsync.rejected, (state, action) => { state.loadingGet = false; state.currentArticle = null; state.error = action.payload; })
            .addCase(createNewsArticleAsync.pending, (state) => { state.loadingCreate = true; state.error = null; })
            .addCase(createNewsArticleAsync.fulfilled, (state, action) => { state.loadingCreate = false; state.articles.unshift(action.payload.data); })
            .addCase(createNewsArticleAsync.rejected, (state, action) => { state.loadingCreate = false; state.error = action.payload; })
            .addCase(updateNewsArticleAsync.pending, (state) => { state.loadingUpdate = true; state.error = null; })
            .addCase(updateNewsArticleAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const article = action.payload.data;
                const index = state.articles.findIndex((item) => item.newsArticleId === article.newsArticleId);
                if (index !== -1) state.articles[index] = article;
                if (state.currentArticle?.newsArticleId === article.newsArticleId) state.currentArticle = article;
            })
            .addCase(updateNewsArticleAsync.rejected, (state, action) => { state.loadingUpdate = false; state.error = action.payload; })
            .addCase(deleteNewsArticleAsync.pending, (state) => { state.loadingDelete = true; state.error = null; })
            .addCase(deleteNewsArticleAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.articles = state.articles.filter((item) => item.newsArticleId !== action.meta.arg);
                if (state.currentArticle?.newsArticleId === action.meta.arg) state.currentArticle = null;
            })
            .addCase(deleteNewsArticleAsync.rejected, (state, action) => { state.loadingDelete = false; state.error = action.payload; });
    },
});

export const { setNewsArticleFilters, setNewsArticlePagination, clearCurrentNewsArticle } = newsArticleSlice.actions;
export const selectNewsArticles = (state) => state.newsArticle.articles;
export const selectCurrentNewsArticle = (state) => state.newsArticle.currentArticle;
export const selectNewsArticlePagination = (state) => state.newsArticle.pagination;
export const selectNewsArticleFilters = (state) => state.newsArticle.filters;
export const selectNewsArticleLoadingGet = (state) => state.newsArticle.loadingGet;
export const selectNewsArticleLoadingCreate = (state) => state.newsArticle.loadingCreate;
export const selectNewsArticleLoadingUpdate = (state) => state.newsArticle.loadingUpdate;
export const selectNewsArticleLoadingDelete = (state) => state.newsArticle.loadingDelete;

export default newsArticleSlice.reducer;
