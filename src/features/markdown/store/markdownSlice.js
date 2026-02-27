import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { markdownApi } from '../../../core/api/markdownApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
    fixedContent: null,
    processingTimeMs: null,
    usage: null,
    loadingFixSpelling: false,
    error: null,
};

// ─── Async Thunks ──────────────────────────────────────────────────────────────

/**
 * Sửa chính tả và ngữ pháp đoạn Markdown.
 * @param {string} content - Nội dung Markdown cần sửa (tối đa 50.000 ký tự)
 */
export const fixMarkdownSpellingAsync = createAsyncThunk(
    'markdown/fixSpelling',
    async (content, thunkAPI) => {
        return handleAsyncThunk(
            () => markdownApi.fixSpelling(content),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Sửa chính tả thất bại',
            }
        );
    }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const markdownSlice = createSlice({
    name: 'markdown',
    initialState,
    reducers: {
        clearFixedContent: (state) => {
            state.fixedContent = null;
            state.processingTimeMs = null;
            state.usage = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fix Spelling
            .addCase(fixMarkdownSpellingAsync.pending, (state) => {
                state.loadingFixSpelling = true;
                state.fixedContent = null;
                state.processingTimeMs = null;
                state.usage = null;
                state.error = null;
            })
            .addCase(fixMarkdownSpellingAsync.fulfilled, (state, action) => {
                state.loadingFixSpelling = false;
                state.fixedContent = action.payload.data.fixedContent;
                state.processingTimeMs = action.payload.data.processingTimeMs;
                state.usage = action.payload.data.usage;
                state.error = null;
            })
            .addCase(fixMarkdownSpellingAsync.rejected, (state, action) => {
                state.loadingFixSpelling = false;
                state.error = action.payload;
            });
    },
});

export const { clearFixedContent, clearError } = markdownSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectMarkdownFixedContent = (state) => state.markdown.fixedContent;
export const selectMarkdownProcessingTimeMs = (state) => state.markdown.processingTimeMs;
export const selectMarkdownUsage = (state) => state.markdown.usage;
export const selectMarkdownLoadingFixSpelling = (state) => state.markdown.loadingFixSpelling;
export const selectMarkdownError = (state) => state.markdown.error;

export default markdownSlice.reducer;
