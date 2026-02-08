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
    // Separate state for search functionality
    searchResults: [],
    searchFilters: {
        search: "",
        difficulty: "",
        type: "",
        grade: "",
        subjectId: null,
        chapterIds: [],
    },
    searchPagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
    },
    loadingGet: false,
    loadingSearch: false,
    loadingGetById: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    loadingReorder: false,
    loadingRemoveFromExam: false,
    loadingAddToExam: false,
    loadingAddToSection: false,
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

export const getMyQuestionsAsync = createAsyncThunk(
    "question/getMyQuestions",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.getMyQuestions(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách câu hỏi của tôi",
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

export const searchQuestionsAsync = createAsyncThunk(
    "question/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.search(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm câu hỏi",
        });
    }
);

export const reorderQuestionsAsync = createAsyncThunk(
    "question/reorder",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.reorder(data), thunkAPI, {
            successTitle: "Cập nhật thứ tự thành công",
            successMessage: "Thứ tự câu hỏi đã được cập nhật",
            errorTitle: "Cập nhật thứ tự thất bại",
        });
    }
);

export const removeQuestionFromExamAsync = createAsyncThunk(
    "question/removeFromExam",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.removeFromExam(data), thunkAPI, {
            successTitle: "Xóa câu hỏi thành công",
            successMessage: "Câu hỏi đã được xóa khỏi đề thi",
            errorTitle: "Xóa câu hỏi thất bại",
        });
    }
);

export const addQuestionToSectionAsync = createAsyncThunk(
    "question/addToSection",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.addToSection(data), thunkAPI, {
            successTitle: "Thêm câu hỏi thành công",
            successMessage: "Câu hỏi đã được thêm vào phần thi",
            errorTitle: "Thêm câu hỏi thất bại",
        });
    }
);

export const addQuestionToExamAsync = createAsyncThunk(
    "question/addToExam",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => questionApi.addToExam(data), thunkAPI, {
            successTitle: "Thêm câu hỏi thành công",
            successMessage: "Câu hỏi đã được thêm vào đề thi",
            errorTitle: "Thêm câu hỏi thất bại",
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
        setSearchFilters: (state, action) => {
            state.searchFilters = { ...state.searchFilters, ...action.payload };
        },
        setSearchPagination: (state, action) => {
            state.searchPagination = { ...state.searchPagination, ...action.payload };
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchPagination = initialState.searchPagination;
        },
        updateQuestionSectionInfo: (state, action) => {
            const { questionId, sectionId, order } = action.payload;
            const question = state.questions.find(q => q.questionId === questionId);
            if (question) {
                question.sectionId = sectionId;
                if (order !== undefined) {
                    question.order = order;
                }
            }
        },
        updateQuestionsOrder: (state, action) => {
            const { items } = action.payload;
            items.forEach(({ questionId, order }) => {
                const question = state.questions.find(q => q.questionId === questionId);
                if (question) {
                    question.order = order;
                }
            });
        },
        addQuestionToExamLocally: (state, action) => {
            const { question } = action.payload;
            // Add question to the questions array (uncategorized)
            state.questions.push(question);
        },
        removeQuestionFromSearchResults: (state, action) => {
            const { questionId } = action.payload;
            // Remove from search results
            state.searchResults = state.searchResults.filter(
                q => q.questionId !== questionId
            );
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
            // Get My Questions
            .addCase(getMyQuestionsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getMyQuestionsAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.questions = action.payload.data;
                state.pagination = action.payload.meta;
                state.error = null;
            })
            .addCase(getMyQuestionsAsync.rejected, (state, action) => {
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
            })
            // Search Questions
            .addCase(searchQuestionsAsync.pending, (state) => {
                state.loadingSearch = true;
                state.error = null;
            })
            .addCase(searchQuestionsAsync.fulfilled, (state, action) => {
                state.loadingSearch = false;
                // If page 1, replace results; otherwise append for infinite scroll
                if (action.payload.meta.page === 1) {
                    state.searchResults = action.payload.data;
                } else {
                    state.searchResults = [...state.searchResults, ...action.payload.data];
                }
                state.searchPagination = {
                    page: action.payload.meta.page,
                    limit: action.payload.meta.limit,
                    total: action.payload.meta.total,
                    totalPages: action.payload.meta.totalPages,
                    hasNext: action.payload.meta.hasNext,
                };
                state.error = null;
            })
            .addCase(searchQuestionsAsync.rejected, (state, action) => {
                state.loadingSearch = false;
                state.error = action.payload;
            })
            // Reorder Questions
            .addCase(reorderQuestionsAsync.pending, (state) => {
                state.loadingReorder = true;
                state.error = null;
            })
            .addCase(reorderQuestionsAsync.fulfilled, (state, action) => {
                state.loadingReorder = false;
                // Update local state with new order if items are provided
                const { items } = action.meta.arg;
                if (items && Array.isArray(items)) {
                    items.forEach(({ questionId, order }) => {
                        const question = state.questions.find(q => q.questionId === questionId);
                        if (question) {
                            question.order = order;
                        }
                    });
                    // Sort questions by order
                    state.questions.sort((a, b) => (a.order || 0) - (b.order || 0));
                }
                state.error = null;
            })
            .addCase(reorderQuestionsAsync.rejected, (state, action) => {
                state.loadingReorder = false;
                state.error = action.payload;
            })
            // Remove Question From Exam
            .addCase(removeQuestionFromExamAsync.pending, (state) => {
                state.loadingRemoveFromExam = true;
                state.error = null;
            })
            .addCase(removeQuestionFromExamAsync.fulfilled, (state, action) => {
                state.loadingRemoveFromExam = false;
                // Remove question from local state
                const { questionId } = action.meta.arg;
                state.questions = state.questions.filter(
                    (q) => q.questionId !== questionId
                );
                if (state.currentQuestion?.questionId === questionId) {
                    state.currentQuestion = null;
                }
                state.error = null;
            })
            .addCase(removeQuestionFromExamAsync.rejected, (state, action) => {
                state.loadingRemoveFromExam = false;
                state.error = action.payload;
            })
            // Add Question To Section
            .addCase(addQuestionToSectionAsync.pending, (state) => {
                state.loadingAddToSection = true;
                state.error = null;
            })
            .addCase(addQuestionToSectionAsync.fulfilled, (state, action) => {
                state.loadingAddToSection = false;
                // Question was added/moved to section successfully
                // We could optionally update local state here if needed
                state.error = null;
            })
            .addCase(addQuestionToSectionAsync.rejected, (state, action) => {
                state.loadingAddToSection = false;
                state.error = action.payload;
            })
            // Add Question To Exam
            .addCase(addQuestionToExamAsync.pending, (state) => {
                state.loadingAddToExam = true;
                state.error = null;
            })
            .addCase(addQuestionToExamAsync.fulfilled, (state, action) => {
                state.loadingAddToExam = false;
                // Question was added to exam successfully
                state.error = null;
            })
            .addCase(addQuestionToExamAsync.rejected, (state, action) => {
                state.loadingAddToExam = false;
                state.error = action.payload;
            });
    },
});

export const { 
    setFilters, 
    setPagination, 
    resetFilters, 
    clearCurrentQuestion, 
    clearError, 
    updateQuestionSectionInfo, 
    updateQuestionsOrder,
    setSearchFilters,
    setSearchPagination,
    clearSearchResults,
    addQuestionToExamLocally,
    removeQuestionFromSearchResults,
} = questionSlice.actions;

// Selectors
export const selectQuestions = (state) => state.question.questions;
export const selectCurrentQuestion = (state) => state.question.currentQuestion;
export const selectQuestionPagination = (state) => state.question.pagination;
export const selectSearchResults = (state) => state.question.searchResults;
export const selectSearchFilters = (state) => state.question.searchFilters;
export const selectSearchPagination = (state) => state.question.searchPagination;
export const selectQuestionLoadingGet = (state) => state.question.loadingGet;
export const selectQuestionLoadingSearch = (state) => state.question.loadingSearch;
export const selectQuestionLoadingCreate = (state) => state.question.loadingCreate;
export const selectQuestionLoadingUpdate = (state) => state.question.loadingUpdate;
export const selectQuestionLoadingDelete = (state) => state.question.loadingDelete;
export const selectQuestionLoadingReorder = (state) => state.question.loadingReorder;
export const selectQuestionLoadingRemoveFromExam = (state) => state.question.loadingRemoveFromExam;
export const selectQuestionLoadingAddToExam = (state) => state.question.loadingAddToExam;
export const selectQuestionLoadingAddToSection = (state) => state.question.loadingAddToSection;
export const selectQuestionError = (state) => state.question.error;
export const selectQuestionFilters = (state) => state.question.filters;

export default questionSlice.reducer;
