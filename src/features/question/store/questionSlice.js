import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { questionApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    questions: [],
    currentQuestion: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingGetById: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    filters: {
        search: "",
        subjectId: "",
        type: "",
        difficulty: "",
        grade: "",
        visibility: "",
        createdBy: "",
        chapterId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// Async thunks
export const getAllQuestionsAsync = createAsyncThunk(
    "question/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách câu hỏi",
        });
    }
);

export const getQuestionByIdAsync = createAsyncThunk(
    "question/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin câu hỏi",
        });
    }
);

export const createQuestionAsync = createAsyncThunk(
    "question/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.create(data), thunkAPI, {
            successTitle: "Tạo câu hỏi thành công",
            successMessage: "Câu hỏi mới đã được tạo",
            errorTitle: "Tạo câu hỏi thất bại",
        });
    }
);

export const updateQuestionAsync = createAsyncThunk(
    "question/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.update(id, data), thunkAPI, {
            successTitle: "Cập nhật câu hỏi thành công",
            successMessage: "Thông tin câu hỏi đã được cập nhật",
            errorTitle: "Cập nhật câu hỏi thất bại",
        });
    }
);

export const deleteQuestionAsync = createAsyncThunk(
    "question/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.delete(id), thunkAPI, {
            successTitle: "Xóa câu hỏi thành công",
            successMessage: "Câu hỏi đã được xóa khỏi hệ thống",
            errorTitle: "Xóa câu hỏi thất bại",
        });
    }
);

export const getQuestionsByExamAsync = createAsyncThunk(
    "question/getByExam",
    async ({ examId, params }, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.getByExam(examId, params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách câu hỏi theo đề thi",
        });
    }
);

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentQuestion: (state) => {
            state.currentQuestion = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Questions
            .addCase(getAllQuestionsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllQuestionsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.questions = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getAllQuestionsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            // Get Question By ID
            .addCase(getQuestionByIdAsync.pending, (state) => {
                state.loadingGetById = true;
                state.error = null;
            })
            .addCase(getQuestionByIdAsync.fulfilled, (state, action) => {
                state.loadingGetById = false;
                state.currentQuestion = action.payload.data;
                state.error = null;
            })
            .addCase(getQuestionByIdAsync.rejected, (state, action) => {
                state.loadingGetById = false;
                state.error = action.payload;
            })
            // Create Question
            .addCase(createQuestionAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createQuestionAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.questions.unshift(action.payload.data);
                state.error = null;
            })
            .addCase(createQuestionAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })
            // Update Question
            .addCase(updateQuestionAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateQuestionAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.questions.findIndex(
                    (q) => q.questionId === action.payload.data.questionId
                );
                if (index !== -1) {
                    state.questions[index] = action.payload.data;
                }
                if (
                    state.currentQuestion?.questionId ===
                    action.payload.data.questionId
                ) {
                    state.currentQuestion = action.payload.data;
                }
                state.error = null;
            })
            .addCase(updateQuestionAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })
            // Delete Question
            .addCase(deleteQuestionAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteQuestionAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.questions = state.questions.filter(
                    (q) => q.questionId !== action.meta.arg
                );
                if (state.currentQuestion?.questionId === action.meta.arg) {
                    state.currentQuestion = null;
                }
                state.error = null;
            })
            .addCase(deleteQuestionAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })
            // Get Questions By Exam
            .addCase(getQuestionsByExamAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getQuestionsByExamAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.questions = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getQuestionsByExamAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, setPagination, resetFilters, clearCurrentQuestion, clearError } =
    questionSlice.actions;

// Selectors
export const selectQuestions = (state) => state.question.questions;
export const selectCurrentQuestion = (state) => state.question.currentQuestion;
export const selectQuestionPagination = (state) => state.question.pagination;
export const selectQuestionLoadingGet = (state) => state.question.loadingGet;
export const selectQuestionLoadingCreate = (state) => state.question.loadingCreate;
export const selectQuestionLoadingUpdate = (state) => state.question.loadingUpdate;
export const selectQuestionLoadingDelete = (state) => state.question.loadingDelete;
export const selectQuestionError = (state) => state.question.error;
export const selectQuestionFilters = (state) => state.question.filters;

export default questionSlice.reducer;
