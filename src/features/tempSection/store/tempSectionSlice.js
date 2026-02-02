import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tempSectionApi } from "../../../core/api/tempSectionApi";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

/* =========================
   Initial State
========================= */
const initialState = {
    tempSections: [],
    currentTempSection: null,

    loadingGet: false,
    loadingGetById: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    loadingReorder: false,

    error: null,
};

/* =========================
   Async Thunks
========================= */

// ===== GET BY SESSION =====
export const getTempSectionsBySessionAsync = createAsyncThunk(
    "tempSection/getBySession",
    async (sessionId, thunkAPI) => {
        return handleAsyncThunk(
            () => tempSectionApi.getBySessionId(sessionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải danh sách section tạm",
            }
        );
    }
);

// ===== GET BY ID =====
export const getTempSectionByIdAsync = createAsyncThunk(
    "tempSection/getById",
    async (tempSectionId, thunkAPI) => {
        return handleAsyncThunk(
            () => tempSectionApi.getById(tempSectionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải section tạm",
            }
        );
    }
);

// ===== CREATE =====
export const createTempSectionAsync = createAsyncThunk(
    "tempSection/create",
    async ({ sessionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => tempSectionApi.create(sessionId, data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Tạo section tạm thành công",
                errorTitle: "Lỗi tạo section tạm",
            }
        );
    }
);

// ===== UPDATE =====
export const updateTempSectionAsync = createAsyncThunk(
    "tempSection/update",
    async ({ tempSectionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => tempSectionApi.update(tempSectionId, data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật section tạm thành công",
                errorTitle: "Lỗi cập nhật section tạm",
            }
        );
    }
);

// ===== DELETE =====
export const deleteTempSectionAsync = createAsyncThunk(
    "tempSection/delete",
    async (tempSectionId, thunkAPI) => {
        return handleAsyncThunk(
            () => tempSectionApi.delete(tempSectionId),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Xóa section tạm thành công",
                errorTitle: "Lỗi xóa section tạm",
            }
        );
    }
);

// ===== REORDER =====
export const reorderTempSectionsAsync = createAsyncThunk(
    "tempSection/reorder",
    async (items, thunkAPI) => {
        return handleAsyncThunk(
            () => tempSectionApi.reorder(items),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật thứ tự section thành công",
                errorTitle: "Lỗi cập nhật thứ tự section",
            }
        );
    }
);

/* =========================
   Slice
========================= */
export const tempSectionSlice = createSlice({
    name: "tempSection",
    initialState,
    reducers: {
        clearTempSections: (state) => {
            state.tempSections = [];
        },
        setCurrentTempSection: (state, action) => {
            state.currentTempSection = action.payload;
        },
        clearCurrentTempSection: (state) => {
            state.currentTempSection = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ===== GET BY SESSION =====
            .addCase(getTempSectionsBySessionAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getTempSectionsBySessionAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.tempSections = action.payload.data;
            })
            .addCase(getTempSectionsBySessionAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // ===== GET BY ID =====
            .addCase(getTempSectionByIdAsync.pending, (state) => {
                state.loadingGetById = true;
                state.error = null;
            })
            .addCase(getTempSectionByIdAsync.fulfilled, (state, action) => {
                state.loadingGetById = false;
                const updatedSection = action.payload.data;
                // Update section in list
                const index = state.tempSections.findIndex(
                    s => s.tempSectionId === updatedSection.tempSectionId
                );
                if (index !== -1) {
                    state.tempSections[index] = updatedSection;
                }
                // Update current if it's the same section
                if (state.currentTempSection?.tempSectionId === updatedSection.tempSectionId) {
                    state.currentTempSection = updatedSection;
                }
            })
            .addCase(getTempSectionByIdAsync.rejected, (state, action) => {
                state.loadingGetById = false;
                state.error = action.payload;
            })

            // ===== CREATE =====
            .addCase(createTempSectionAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createTempSectionAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.tempSections.push(action.payload.data);
                state.currentTempSection = action.payload.data;
            })
            .addCase(createTempSectionAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // ===== UPDATE =====
            .addCase(updateTempSectionAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateTempSectionAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const updatedSection = action.payload.data;
                const index = state.tempSections.findIndex(
                    s => s.tempSectionId === updatedSection.tempSectionId
                );
                if (index !== -1) {
                    state.tempSections[index] = updatedSection;
                }
                if (state.currentTempSection?.tempSectionId === updatedSection.tempSectionId) {
                    state.currentTempSection = updatedSection;
                }
            })
            .addCase(updateTempSectionAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // ===== DELETE =====
            .addCase(deleteTempSectionAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteTempSectionAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                const tempSectionId = action.meta.arg;
                state.tempSections = state.tempSections.filter(
                    s => s.tempSectionId !== tempSectionId
                );
                if (state.currentTempSection?.tempSectionId === tempSectionId) {
                    state.currentTempSection = null;
                }
            })
            .addCase(deleteTempSectionAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            // ===== REORDER =====
            .addCase(reorderTempSectionsAsync.pending, (state) => {
                state.loadingReorder = true;
                state.error = null;
            })
            .addCase(reorderTempSectionsAsync.fulfilled, (state, action) => {
                state.loadingReorder = false;
                // Update order locally based on the items array from meta
                const items = action.meta.arg;
                items.forEach(item => {
                    const section = state.tempSections.find(s => s.tempSectionId === item.id);
                    if (section) {
                        section.order = item.order;
                    }
                });
                // Re-sort by order
                state.tempSections.sort((a, b) => a.order - b.order);
            })
            .addCase(reorderTempSectionsAsync.rejected, (state, action) => {
                state.loadingReorder = false;
                state.error = action.payload;
            });
    },
});

/* =========================
   Actions & Selectors
========================= */
export const {
    clearTempSections,
    setCurrentTempSection,
    clearCurrentTempSection,
} = tempSectionSlice.actions;

export const selectTempSections = (state) => state.tempSection.tempSections;
export const selectCurrentTempSection = (state) => state.tempSection.currentTempSection;
export const selectTempSectionLoadingGet = (state) => state.tempSection.loadingGet;
export const selectTempSectionLoadingGetById = (state) => state.tempSection.loadingGetById;
export const selectTempSectionLoadingCreate = (state) => state.tempSection.loadingCreate;
export const selectTempSectionLoadingUpdate = (state) => state.tempSection.loadingUpdate;
export const selectTempSectionLoadingDelete = (state) => state.tempSection.loadingDelete;
export const selectTempSectionLoadingReorder = (state) => state.tempSection.loadingReorder;
export const selectTempSectionError = (state) => state.tempSection.error;

export default tempSectionSlice.reducer;
