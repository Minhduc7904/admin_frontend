import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tempQuestionApi } from "../../../core/api/tempQuestionApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

/* =========================
   Initial State
========================= */
const initialState = {
    tempQuestions: [],
    currentTempQuestion: null,

    loadingGet: false,
    loadingGetById: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    loadingReorder: false,
    loadingLinkSection: false,

    error: null,
};

/* =========================
   Async Thunks
========================= */

// ===== GET BY SESSION =====
export const getTempQuestionsBySessionAsync = createAsyncThunk(
    "tempQuestion/getBySession",
    async (sessionId, thunkAPI) => {
        return handleAsyncThunk(
            () => tempQuestionApi.getBySessionId(sessionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải danh sách câu hỏi tạm",
            }
        );
    }
);

// ===== GET BY ID =====
export const getTempQuestionByIdAsync = createAsyncThunk(
    "tempQuestion/getById",
    async (tempQuestionId, thunkAPI) => {
        return handleAsyncThunk(
            () => tempQuestionApi.getById(tempQuestionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải câu hỏi tạm",
            }
        );
    }
);

// ===== CREATE =====
export const createTempQuestionAsync = createAsyncThunk(
    "tempQuestion/create",
    async ({ sessionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => tempQuestionApi.create(sessionId, data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Tạo câu hỏi tạm thành công",
                errorTitle: "Lỗi tạo câu hỏi tạm",
            }
        );
    }
);

// ===== UPDATE =====
export const updateTempQuestionAsync = createAsyncThunk(
    "tempQuestion/update",
    async ({ tempQuestionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => tempQuestionApi.update(tempQuestionId, data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật câu hỏi tạm thành công",
                errorTitle: "Lỗi cập nhật câu hỏi tạm",
            }
        );
    }
);

// ===== DELETE =====
export const deleteTempQuestionAsync = createAsyncThunk(
    "tempQuestion/delete",
    async (tempQuestionId, thunkAPI) => {
        return handleAsyncThunk(
            () => tempQuestionApi.delete(tempQuestionId),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Xóa câu hỏi tạm thành công",
                errorTitle: "Lỗi xóa câu hỏi tạm",
            }
        );
    }
);

// ===== REORDER =====
export const reorderTempQuestionsAsync = createAsyncThunk(
    "tempQuestion/reorder",
    async (items, thunkAPI) => {
        return handleAsyncThunk(
            () => tempQuestionApi.reorder(items),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật thứ tự câu hỏi thành công",
                errorTitle: "Lỗi cập nhật thứ tự câu hỏi",
            }
        );
    }
);

// ===== LINK TO SECTION =====
export const linkQuestionToSectionAsync = createAsyncThunk(
    "tempQuestion/linkToSection",
    async ({ tempQuestionId, tempSectionId }, thunkAPI) => {
        return handleAsyncThunk(
            () => tempQuestionApi.linkToSection(tempQuestionId, tempSectionId),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: tempSectionId 
                    ? "Gắn câu hỏi vào section thành công" 
                    : "Gỡ câu hỏi khỏi section thành công",
                errorTitle: "Lỗi cập nhật section cho câu hỏi",
            }
        );
    }
);

/* =========================
   Slice
========================= */
export const tempQuestionSlice = createSlice({
    name: "tempQuestion",
    initialState,
    reducers: {
        clearTempQuestions: (state) => {
            state.tempQuestions = [];
        },
        setCurrentTempQuestion: (state, action) => {
            state.currentTempQuestion = action.payload;
        },
        clearCurrentTempQuestion: (state) => {
            state.currentTempQuestion = null;
        },
        updateStatementsOrder: (state, action) => {
            // action.payload = { questionId, items: [{ id, order }] }
            const { questionId, items } = action.payload;
            const question = state.tempQuestions.find(q => q.tempQuestionId === questionId);
            if (question && question.tempStatements) {
                // Update order for each statement
                items.forEach(item => {
                    const statement = question.tempStatements.find(s => s.tempStatementId === item.id);
                    if (statement) {
                        statement.order = item.order;
                    }
                });
                // Re-sort statements by order
                question.tempStatements.sort((a, b) => a.order - b.order);
            }
        },
        unlinkQuestionsFromSection: (state, action) => {
            // action.payload = sectionId
            const sectionId = action.payload;
            state.tempQuestions.forEach(question => {
                if (question.tempSectionId === sectionId) {
                    question.tempSectionId = null;
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder
            // ===== GET BY SESSION =====
            .addCase(getTempQuestionsBySessionAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getTempQuestionsBySessionAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.tempQuestions = action.payload.data;
            })
            .addCase(getTempQuestionsBySessionAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // ===== GET BY ID =====
            .addCase(getTempQuestionByIdAsync.pending, (state) => {
                state.loadingGetById = true;
                state.error = null;
            })
            .addCase(getTempQuestionByIdAsync.fulfilled, (state, action) => {
                state.loadingGetById = false;
                const updatedQuestion = action.payload.data;
                // Update question in list
                const index = state.tempQuestions.findIndex(
                    q => q.tempQuestionId === updatedQuestion.tempQuestionId
                );
                if (index !== -1) {
                    state.tempQuestions[index] = updatedQuestion;
                }
                // Update current if it's the same question
                if (state.currentTempQuestion?.tempQuestionId === updatedQuestion.tempQuestionId) {
                    state.currentTempQuestion = updatedQuestion;
                }
            })
            .addCase(getTempQuestionByIdAsync.rejected, (state, action) => {
                state.loadingGetById = false;
                state.error = action.payload;
            })

            // ===== CREATE =====
            .addCase(createTempQuestionAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createTempQuestionAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.tempQuestions.push(action.payload.data);
                state.currentTempQuestion = action.payload.data;
            })
            .addCase(createTempQuestionAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // ===== UPDATE =====
            .addCase(updateTempQuestionAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateTempQuestionAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const updatedQuestion = action.payload.data;
                const index = state.tempQuestions.findIndex(
                    q => q.tempQuestionId === updatedQuestion.tempQuestionId
                );
                if (index !== -1) {
                    state.tempQuestions[index] = updatedQuestion;
                }
                if (state.currentTempQuestion?.tempQuestionId === updatedQuestion.tempQuestionId) {
                    state.currentTempQuestion = updatedQuestion;
                }
            })
            .addCase(updateTempQuestionAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // ===== DELETE =====
            .addCase(deleteTempQuestionAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteTempQuestionAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                // Remove from list (need to pass tempQuestionId in meta)
                const tempQuestionId = action.meta.arg;
                state.tempQuestions = state.tempQuestions.filter(
                    q => q.tempQuestionId !== tempQuestionId
                );
                if (state.currentTempQuestion?.tempQuestionId === tempQuestionId) {
                    state.currentTempQuestion = null;
                }
            })
            .addCase(deleteTempQuestionAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            // ===== REORDER =====
            .addCase(reorderTempQuestionsAsync.pending, (state) => {
                state.loadingReorder = true;
                state.error = null;
            })
            .addCase(reorderTempQuestionsAsync.fulfilled, (state, action) => {
                state.loadingReorder = false;
                // Update order locally based on the items array from meta
                const items = action.meta.arg;
                items.forEach(item => {
                    const question = state.tempQuestions.find(q => q.tempQuestionId === item.id);
                    if (question) {
                        question.order = item.order;
                    }
                });
                // Re-sort by order
                state.tempQuestions.sort((a, b) => a.order - b.order);
            })
            .addCase(reorderTempQuestionsAsync.rejected, (state, action) => {
                state.loadingReorder = false;
                state.error = action.payload;
            })

            // ===== LINK TO SECTION =====
            .addCase(linkQuestionToSectionAsync.pending, (state) => {
                state.loadingLinkSection = true;
                state.error = null;
            })
            .addCase(linkQuestionToSectionAsync.fulfilled, (state, action) => {
                state.loadingLinkSection = false;
                const updatedQuestion = action.payload.data;
                // Update question in list
                const index = state.tempQuestions.findIndex(
                    q => q.tempQuestionId === updatedQuestion.tempQuestionId
                );
                if (index !== -1) {
                    state.tempQuestions[index] = updatedQuestion;
                }
                // Update current question if it's the same
                if (state.currentTempQuestion?.tempQuestionId === updatedQuestion.tempQuestionId) {
                    state.currentTempQuestion = updatedQuestion;
                }
            })
            .addCase(linkQuestionToSectionAsync.rejected, (state, action) => {
                state.loadingLinkSection = false;
                state.error = action.payload;
            });
    },
});

/* =========================
   Actions & Selectors
========================= */
export const {
    clearTempQuestions,
    setCurrentTempQuestion,
    clearCurrentTempQuestion,
    updateStatementsOrder,
    unlinkQuestionsFromSection,
} = tempQuestionSlice.actions;

export const selectTempQuestions = (state) => state.tempQuestion.tempQuestions;
export const selectCurrentTempQuestion = (state) => state.tempQuestion.currentTempQuestion;
export const selectTempQuestionLoadingGet = (state) => state.tempQuestion.loadingGet;
export const selectTempQuestionLoadingGetById = (state) => state.tempQuestion.loadingGetById;
export const selectTempQuestionLoadingCreate = (state) => state.tempQuestion.loadingCreate;
export const selectTempQuestionLoadingUpdate = (state) => state.tempQuestion.loadingUpdate;
export const selectTempQuestionLoadingDelete = (state) => state.tempQuestion.loadingDelete;
export const selectTempQuestionLoadingReorder = (state) => state.tempQuestion.loadingReorder;
export const selectTempQuestionLoadingLinkSection = (state) => state.tempQuestion.loadingLinkSection;
export const selectTempQuestionError = (state) => state.tempQuestion.error;

export default tempQuestionSlice.reducer;
