import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { superAdminApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    loadingResetPasswordByDateRange: false,
    errorResetPasswordByDateRange: null,
    resetPasswordByDateRangeResult: null,
    loadingUpdateAdminDirect: false,
    errorUpdateAdminDirect: null,
    updateAdminDirectResult: null,
    loadingCleanupUnusedMediaOlderThan30Days: false,
    errorCleanupUnusedMediaOlderThan30Days: null,
    cleanupUnusedMediaOlderThan30DaysResult: null,
    loadingGenerateMissingExamSlugs: false,
    errorGenerateMissingExamSlugs: null,
    generateMissingExamSlugsResult: null,
    loadingRegenerateQuestionSlugs: false,
    errorRegenerateQuestionSlugs: null,
    regenerateQuestionSlugsResult: null,
    loadingSeedDefaultTags: false,
    errorSeedDefaultTags: null,
    seedDefaultTagsResult: null,
    loadingPromoteStudentGradeByGraduationYear: false,
    errorPromoteStudentGradeByGraduationYear: null,
    promoteStudentGradeByGraduationYearResult: null,
    loadingUpdateStudentGraduationYearByGrade: false,
    errorUpdateStudentGraduationYearByGrade: null,
    updateStudentGraduationYearByGradeResult: null,
};

export const resetPasswordByDateRangeAsync = createAsyncThunk(
    "superAdmin/resetPasswordByDateRange",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(() => superAdminApi.resetPasswordByDateRange(payload), thunkAPI, {
            showSuccess: true,
            successTitle: "Reset mật khẩu theo khoảng ngày thành công",
            errorTitle: "Lỗi reset mật khẩu theo khoảng ngày",
        });
    }
);

export const updateAdminDirectAsync = createAsyncThunk(
    "superAdmin/updateAdminDirect",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(() => superAdminApi.updateAdminDirect(payload), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật admin trực tiếp thành công",
            errorTitle: "Lỗi cập nhật admin trực tiếp",
        });
    }
);

export const cleanupUnusedMediaOlderThan30DaysAsync = createAsyncThunk(
    "superAdmin/cleanupUnusedMediaOlderThan30Days",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(
            () => superAdminApi.cleanupUnusedMediaOlderThan30Days(payload),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Dọn dẹp media không dùng (hơn 30 ngày) thành công",
                errorTitle: "Lỗi dọn dẹp media không dùng (hơn 30 ngày)",
            }
        );
    }
);

export const generateMissingExamSlugsAsync = createAsyncThunk(
    "superAdmin/generateMissingExamSlugs",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(
            () => superAdminApi.generateMissingExamSlugs(payload),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Tao slug cho exam chua co slug thanh cong",
                errorTitle: "Loi tao slug cho exam chua co slug",
            }
        );
    }
);

export const regenerateQuestionSlugsAsync = createAsyncThunk(
    "superAdmin/regenerateQuestionSlugs",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(
            () => superAdminApi.regenerateQuestionSlugs(payload),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Regenerate slug cho question thanh cong",
                errorTitle: "Loi regenerate slug cho question",
            }
        );
    }
);

export const seedDefaultTagsAsync = createAsyncThunk(
    "superAdmin/seedDefaultTags",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(
            () => superAdminApi.seedDefaultTags(payload),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Seed tag mặc định thành công",
                errorTitle: "Lỗi seed tag mặc định",
            }
        );
    }
);

export const promoteStudentGradeByGraduationYearAsync = createAsyncThunk(
    "superAdmin/promoteStudentGradeByGraduationYear",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(
            () => superAdminApi.promoteStudentGradeByGraduationYear(payload),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Tang khoi hoc sinh theo nam tot nghiep thanh cong",
                errorTitle: "Loi tang khoi hoc sinh theo nam tot nghiep",
            }
        );
    }
);

export const updateStudentGraduationYearByGradeAsync = createAsyncThunk(
    "superAdmin/updateStudentGraduationYearByGrade",
    async (payload, thunkAPI) => {
        return handleAsyncThunk(
            () => superAdminApi.updateStudentGraduationYearByGrade(payload),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cap nhat nam tot nghiep hoc sinh theo khoi thanh cong",
                errorTitle: "Loi cap nhat nam tot nghiep hoc sinh theo khoi",
            }
        );
    }
);

export const superAdminSlice = createSlice({
    name: "superAdmin",
    initialState,
    reducers: {
        clearResetPasswordByDateRangeState: (state) => {
            state.errorResetPasswordByDateRange = null;
            state.resetPasswordByDateRangeResult = null;
        },
        clearUpdateAdminDirectState: (state) => {
            state.errorUpdateAdminDirect = null;
            state.updateAdminDirectResult = null;
        },
        clearCleanupUnusedMediaOlderThan30DaysState: (state) => {
            state.errorCleanupUnusedMediaOlderThan30Days = null;
            state.cleanupUnusedMediaOlderThan30DaysResult = null;
        },
        clearGenerateMissingExamSlugsState: (state) => {
            state.errorGenerateMissingExamSlugs = null;
            state.generateMissingExamSlugsResult = null;
        },
        clearRegenerateQuestionSlugsState: (state) => {
            state.errorRegenerateQuestionSlugs = null;
            state.regenerateQuestionSlugsResult = null;
        },
        clearSeedDefaultTagsState: (state) => {
            state.errorSeedDefaultTags = null;
            state.seedDefaultTagsResult = null;
        },
        clearPromoteStudentGradeByGraduationYearState: (state) => {
            state.errorPromoteStudentGradeByGraduationYear = null;
            state.promoteStudentGradeByGraduationYearResult = null;
        },
        clearUpdateStudentGraduationYearByGradeState: (state) => {
            state.errorUpdateStudentGraduationYearByGrade = null;
            state.updateStudentGraduationYearByGradeResult = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetPasswordByDateRangeAsync.pending, (state) => {
                state.loadingResetPasswordByDateRange = true;
                state.errorResetPasswordByDateRange = null;
            })
            .addCase(resetPasswordByDateRangeAsync.fulfilled, (state, action) => {
                state.loadingResetPasswordByDateRange = false;
                state.resetPasswordByDateRangeResult = action.payload || null;
            })
            .addCase(resetPasswordByDateRangeAsync.rejected, (state, action) => {
                state.loadingResetPasswordByDateRange = false;
                state.errorResetPasswordByDateRange = action.payload;
            })
            .addCase(updateAdminDirectAsync.pending, (state) => {
                state.loadingUpdateAdminDirect = true;
                state.errorUpdateAdminDirect = null;
            })
            .addCase(updateAdminDirectAsync.fulfilled, (state, action) => {
                state.loadingUpdateAdminDirect = false;
                state.updateAdminDirectResult = action.payload || null;
            })
            .addCase(updateAdminDirectAsync.rejected, (state, action) => {
                state.loadingUpdateAdminDirect = false;
                state.errorUpdateAdminDirect = action.payload;
            })
            .addCase(cleanupUnusedMediaOlderThan30DaysAsync.pending, (state) => {
                state.loadingCleanupUnusedMediaOlderThan30Days = true;
                state.errorCleanupUnusedMediaOlderThan30Days = null;
            })
            .addCase(cleanupUnusedMediaOlderThan30DaysAsync.fulfilled, (state, action) => {
                state.loadingCleanupUnusedMediaOlderThan30Days = false;
                state.cleanupUnusedMediaOlderThan30DaysResult = action.payload || null;
            })
            .addCase(cleanupUnusedMediaOlderThan30DaysAsync.rejected, (state, action) => {
                state.loadingCleanupUnusedMediaOlderThan30Days = false;
                state.errorCleanupUnusedMediaOlderThan30Days = action.payload;
            })
            .addCase(generateMissingExamSlugsAsync.pending, (state) => {
                state.loadingGenerateMissingExamSlugs = true;
                state.errorGenerateMissingExamSlugs = null;
            })
            .addCase(generateMissingExamSlugsAsync.fulfilled, (state, action) => {
                state.loadingGenerateMissingExamSlugs = false;
                state.generateMissingExamSlugsResult = action.payload || null;
            })
            .addCase(generateMissingExamSlugsAsync.rejected, (state, action) => {
                state.loadingGenerateMissingExamSlugs = false;
                state.errorGenerateMissingExamSlugs = action.payload;
            })
            .addCase(regenerateQuestionSlugsAsync.pending, (state) => {
                state.loadingRegenerateQuestionSlugs = true;
                state.errorRegenerateQuestionSlugs = null;
            })
            .addCase(regenerateQuestionSlugsAsync.fulfilled, (state, action) => {
                state.loadingRegenerateQuestionSlugs = false;
                state.regenerateQuestionSlugsResult = action.payload || null;
            })
            .addCase(regenerateQuestionSlugsAsync.rejected, (state, action) => {
                state.loadingRegenerateQuestionSlugs = false;
                state.errorRegenerateQuestionSlugs = action.payload;
            })
            .addCase(seedDefaultTagsAsync.pending, (state) => {
                state.loadingSeedDefaultTags = true;
                state.errorSeedDefaultTags = null;
            })
            .addCase(seedDefaultTagsAsync.fulfilled, (state, action) => {
                state.loadingSeedDefaultTags = false;
                state.seedDefaultTagsResult = action.payload || null;
            })
            .addCase(seedDefaultTagsAsync.rejected, (state, action) => {
                state.loadingSeedDefaultTags = false;
                state.errorSeedDefaultTags = action.payload;
            })
            .addCase(promoteStudentGradeByGraduationYearAsync.pending, (state) => {
                state.loadingPromoteStudentGradeByGraduationYear = true;
                state.errorPromoteStudentGradeByGraduationYear = null;
            })
            .addCase(promoteStudentGradeByGraduationYearAsync.fulfilled, (state, action) => {
                state.loadingPromoteStudentGradeByGraduationYear = false;
                state.promoteStudentGradeByGraduationYearResult = action.payload || null;
            })
            .addCase(promoteStudentGradeByGraduationYearAsync.rejected, (state, action) => {
                state.loadingPromoteStudentGradeByGraduationYear = false;
                state.errorPromoteStudentGradeByGraduationYear = action.payload;
            })
            .addCase(updateStudentGraduationYearByGradeAsync.pending, (state) => {
                state.loadingUpdateStudentGraduationYearByGrade = true;
                state.errorUpdateStudentGraduationYearByGrade = null;
            })
            .addCase(updateStudentGraduationYearByGradeAsync.fulfilled, (state, action) => {
                state.loadingUpdateStudentGraduationYearByGrade = false;
                state.updateStudentGraduationYearByGradeResult = action.payload || null;
            })
            .addCase(updateStudentGraduationYearByGradeAsync.rejected, (state, action) => {
                state.loadingUpdateStudentGraduationYearByGrade = false;
                state.errorUpdateStudentGraduationYearByGrade = action.payload;
            });
    },
});

export const {
    clearResetPasswordByDateRangeState,
    clearUpdateAdminDirectState,
    clearCleanupUnusedMediaOlderThan30DaysState,
    clearGenerateMissingExamSlugsState,
    clearRegenerateQuestionSlugsState,
    clearSeedDefaultTagsState,
    clearPromoteStudentGradeByGraduationYearState,
    clearUpdateStudentGraduationYearByGradeState,
} = superAdminSlice.actions;

export const selectSuperAdminLoadingResetPasswordByDateRange = (state) =>
    state.superAdmin.loadingResetPasswordByDateRange;
export const selectSuperAdminErrorResetPasswordByDateRange = (state) =>
    state.superAdmin.errorResetPasswordByDateRange;
export const selectSuperAdminResetPasswordByDateRangeResult = (state) =>
    state.superAdmin.resetPasswordByDateRangeResult;

export const selectSuperAdminLoadingUpdateAdminDirect = (state) =>
    state.superAdmin.loadingUpdateAdminDirect;
export const selectSuperAdminErrorUpdateAdminDirect = (state) =>
    state.superAdmin.errorUpdateAdminDirect;
export const selectSuperAdminUpdateAdminDirectResult = (state) =>
    state.superAdmin.updateAdminDirectResult;

export const selectSuperAdminLoadingCleanupUnusedMediaOlderThan30Days = (state) =>
    state.superAdmin.loadingCleanupUnusedMediaOlderThan30Days;
export const selectSuperAdminErrorCleanupUnusedMediaOlderThan30Days = (state) =>
    state.superAdmin.errorCleanupUnusedMediaOlderThan30Days;
export const selectSuperAdminCleanupUnusedMediaOlderThan30DaysResult = (state) =>
    state.superAdmin.cleanupUnusedMediaOlderThan30DaysResult;

export const selectSuperAdminLoadingGenerateMissingExamSlugs = (state) =>
    state.superAdmin.loadingGenerateMissingExamSlugs;
export const selectSuperAdminErrorGenerateMissingExamSlugs = (state) =>
    state.superAdmin.errorGenerateMissingExamSlugs;
export const selectSuperAdminGenerateMissingExamSlugsResult = (state) =>
    state.superAdmin.generateMissingExamSlugsResult;

export const selectSuperAdminLoadingRegenerateQuestionSlugs = (state) =>
    state.superAdmin.loadingRegenerateQuestionSlugs;
export const selectSuperAdminErrorRegenerateQuestionSlugs = (state) =>
    state.superAdmin.errorRegenerateQuestionSlugs;
export const selectSuperAdminRegenerateQuestionSlugsResult = (state) =>
    state.superAdmin.regenerateQuestionSlugsResult;

export const selectSuperAdminLoadingSeedDefaultTags = (state) =>
    state.superAdmin.loadingSeedDefaultTags;
export const selectSuperAdminErrorSeedDefaultTags = (state) =>
    state.superAdmin.errorSeedDefaultTags;
export const selectSuperAdminSeedDefaultTagsResult = (state) =>
    state.superAdmin.seedDefaultTagsResult;

export const selectSuperAdminLoadingPromoteStudentGradeByGraduationYear = (state) =>
    state.superAdmin.loadingPromoteStudentGradeByGraduationYear;
export const selectSuperAdminErrorPromoteStudentGradeByGraduationYear = (state) =>
    state.superAdmin.errorPromoteStudentGradeByGraduationYear;
export const selectSuperAdminPromoteStudentGradeByGraduationYearResult = (state) =>
    state.superAdmin.promoteStudentGradeByGraduationYearResult;

export const selectSuperAdminLoadingUpdateStudentGraduationYearByGrade = (state) =>
    state.superAdmin.loadingUpdateStudentGraduationYearByGrade;
export const selectSuperAdminErrorUpdateStudentGraduationYearByGrade = (state) =>
    state.superAdmin.errorUpdateStudentGraduationYearByGrade;
export const selectSuperAdminUpdateStudentGraduationYearByGradeResult = (state) =>
    state.superAdmin.updateStudentGraduationYearByGradeResult;

export default superAdminSlice.reducer;
