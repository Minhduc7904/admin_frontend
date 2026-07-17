import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { homeworkSubmitApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    submits: [],
    currentDetail: null,
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    loadingGet: false,
    loadingDetail: false,
    loadingGrade: false,
    loadingUpdateCompetitionFeedback: false,
    loadingUngrade: false,
    loadingUpdateMediaAlt: false,
    competitionAttempts: [],
    loadingCompetitionAttempts: false,
    loadingCreateFromCompetition: false,
    loadingUpdateCompetitionSubmit: false,
    error: null,
};

export const getAllHomeworkSubmitsAsync = createAsyncThunk(
    'homeworkSubmit/getAll',
    async (params, thunkAPI) => handleAsyncThunk(
        () => homeworkSubmitApi.getAll(params),
        thunkAPI,
        { showSuccess: false, errorTitle: 'Lỗi tải danh sách bài nộp' },
    ),
);

export const getAdminHomeworkSubmitDetailAsync = createAsyncThunk(
    'homeworkSubmit/getAdminDetail',
    async (id, thunkAPI) => handleAsyncThunk(
        () => homeworkSubmitApi.getAdminDetail(id),
        thunkAPI,
        { showSuccess: false, errorTitle: 'Lỗi tải chi tiết bài nộp' },
    ),
);

export const gradeHomeworkSubmitAsync = createAsyncThunk(
    'homeworkSubmit/grade',
    async ({ id, data }, thunkAPI) => handleAsyncThunk(
        () => homeworkSubmitApi.grade(id, data),
        thunkAPI,
        {
            successTitle: 'Chấm bài thành công',
            successMessage: 'Điểm và nhận xét đã được lưu cho học sinh.',
            errorTitle: 'Không thể chấm bài',
        },
    ),
);

export const updateCompetitionHomeworkFeedbackAsync = createAsyncThunk(
    'homeworkSubmit/updateCompetitionFeedback',
    async ({ id, feedback }, thunkAPI) => handleAsyncThunk(
        () => homeworkSubmitApi.grade(id, { feedback }),
        thunkAPI,
        {
            successTitle: 'Đã lưu nhận xét',
            successMessage: 'Nhận xét cho bài tập Competition đã được cập nhật.',
            errorTitle: 'Không thể cập nhật nhận xét',
        },
    ),
);

export const getStudentCompetitionAttemptsAsync = createAsyncThunk(
    'homeworkSubmit/getStudentCompetitionAttempts',
    async (studentId, thunkAPI) => handleAsyncThunk(
        () => homeworkSubmitApi.getStudentCompetitionAttempts(studentId),
        thunkAPI,
        { showSuccess: false, errorTitle: 'Không thể tải danh sách lượt thi đã nộp' },
    ),
);

export const createHomeworkSubmitFromCompetitionAsync = createAsyncThunk(
    'homeworkSubmit/createFromCompetition',
    async (data, thunkAPI) => handleAsyncThunk(
        () => homeworkSubmitApi.createFromCompetition(data),
        thunkAPI,
        {
            successTitle: 'Đã tạo bài nộp',
            successMessage: 'Bài nộp bài tập đã được liên kết từ lượt thi Competition.',
            errorTitle: 'Không thể tạo bài nộp từ Competition',
        },
    ),
);

export const updateHomeworkSubmitCompetitionAsync = createAsyncThunk(
    'homeworkSubmit/updateCompetitionSubmit',
    async ({ id, data }, thunkAPI) => handleAsyncThunk(
        () => homeworkSubmitApi.updateCompetitionSubmit(id, data),
        thunkAPI,
        {
            successTitle: 'Đã đổi lượt thi',
            successMessage: 'Bài nộp đã được cập nhật theo lượt thi Competition đã chọn.',
            errorTitle: 'Không thể đổi lượt thi',
        },
    ),
);

export const updateHomeworkSubmitMediaAltAsync = createAsyncThunk(
    'homeworkSubmit/updateMediaAlt',
    async ({ homeworkSubmitId, mediaId, alt }, thunkAPI) => handleAsyncThunk(
        () => homeworkSubmitApi.updateMediaAlt(homeworkSubmitId, mediaId, { alt }),
        thunkAPI,
        {
            successTitle: 'Đã lưu nhận xét cho tệp ảnh',
            errorTitle: 'Không thể lưu nhận xét cho tệp ảnh',
        },
    ),
);

export const ungradeHomeworkSubmitAsync = createAsyncThunk(
    'homeworkSubmit/ungrade',
    async (id, thunkAPI) => handleAsyncThunk(
        () => homeworkSubmitApi.ungrade(id),
        thunkAPI,
        {
            successTitle: 'Đã gỡ chấm điểm',
            successMessage: 'Học sinh có thể nộp lại bài này.',
            errorTitle: 'Không thể gỡ chấm điểm',
        },
    ),
);

const homeworkSubmitSlice = createSlice({
    name: 'homeworkSubmit',
    initialState,
    reducers: {
        clearHomeworkSubmitDetail: (state) => {
            state.currentDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllHomeworkSubmitsAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllHomeworkSubmitsAsync.fulfilled, (state, action) => {
                const data = action.payload.data ?? {};
                state.loadingGet = false;
                state.submits = data.homeworkSubmits ?? (Array.isArray(data) ? data : []);
                state.pagination = data.pagination ?? action.payload.meta ?? initialState.pagination;
            })
            .addCase(getAllHomeworkSubmitsAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })
            .addCase(getAdminHomeworkSubmitDetailAsync.pending, (state) => {
                state.loadingDetail = true;
                state.currentDetail = null;
                state.error = null;
            })
            .addCase(getAdminHomeworkSubmitDetailAsync.fulfilled, (state, action) => {
                state.loadingDetail = false;
                state.currentDetail = action.payload.data;
            })
            .addCase(getAdminHomeworkSubmitDetailAsync.rejected, (state, action) => {
                state.loadingDetail = false;
                state.error = action.payload;
            })
            .addCase(gradeHomeworkSubmitAsync.pending, (state) => {
                state.loadingGrade = true;
                state.error = null;
            })
            .addCase(gradeHomeworkSubmitAsync.fulfilled, (state, action) => {
                const updated = action.payload.data;
                state.loadingGrade = false;
                if (state.currentDetail?.homeworkSubmit?.homeworkSubmitId === updated?.homeworkSubmitId) {
                    state.currentDetail.homeworkSubmit = { ...state.currentDetail.homeworkSubmit, ...updated };
                }
                const index = state.submits.findIndex((submit) => submit.homeworkSubmitId === updated?.homeworkSubmitId);
                if (index !== -1) state.submits[index] = { ...state.submits[index], ...updated };
            })
            .addCase(gradeHomeworkSubmitAsync.rejected, (state, action) => {
                state.loadingGrade = false;
                state.error = action.payload;
            })
            .addCase(updateCompetitionHomeworkFeedbackAsync.pending, (state) => {
                state.loadingUpdateCompetitionFeedback = true;
                state.error = null;
            })
            .addCase(updateCompetitionHomeworkFeedbackAsync.fulfilled, (state, action) => {
                const updated = action.payload.data;
                state.loadingUpdateCompetitionFeedback = false;
                if (state.currentDetail?.homeworkSubmit?.homeworkSubmitId === updated?.homeworkSubmitId) {
                    state.currentDetail.homeworkSubmit = { ...state.currentDetail.homeworkSubmit, ...updated };
                }
                const index = state.submits.findIndex((submit) => submit.homeworkSubmitId === updated?.homeworkSubmitId);
                if (index !== -1) state.submits[index] = { ...state.submits[index], ...updated };
            })
            .addCase(updateCompetitionHomeworkFeedbackAsync.rejected, (state, action) => {
                state.loadingUpdateCompetitionFeedback = false;
                state.error = action.payload;
            })
            .addCase(getStudentCompetitionAttemptsAsync.pending, (state) => {
                state.loadingCompetitionAttempts = true;
                state.competitionAttempts = [];
                state.error = null;
            })
            .addCase(getStudentCompetitionAttemptsAsync.fulfilled, (state, action) => {
                state.loadingCompetitionAttempts = false;
                state.competitionAttempts = action.payload.data?.competitionSubmits ?? [];
            })
            .addCase(getStudentCompetitionAttemptsAsync.rejected, (state, action) => {
                state.loadingCompetitionAttempts = false;
                state.error = action.payload;
            })
            .addCase(createHomeworkSubmitFromCompetitionAsync.pending, (state) => {
                state.loadingCreateFromCompetition = true;
                state.error = null;
            })
            .addCase(createHomeworkSubmitFromCompetitionAsync.fulfilled, (state, action) => {
                state.loadingCreateFromCompetition = false;
                const submit = action.payload.data?.homeworkSubmit;
                const index = state.submits.findIndex((item) => item.homeworkSubmitId === submit?.homeworkSubmitId);
                if (index !== -1) state.submits[index] = { ...state.submits[index], ...submit };
            })
            .addCase(createHomeworkSubmitFromCompetitionAsync.rejected, (state, action) => {
                state.loadingCreateFromCompetition = false;
                state.error = action.payload;
            })
            .addCase(updateHomeworkSubmitCompetitionAsync.pending, (state) => {
                state.loadingUpdateCompetitionSubmit = true;
                state.error = null;
            })
            .addCase(updateHomeworkSubmitCompetitionAsync.fulfilled, (state, action) => {
                const submit = action.payload.data?.homeworkSubmit;
                state.loadingUpdateCompetitionSubmit = false;
                if (state.currentDetail?.homeworkSubmit?.homeworkSubmitId === submit?.homeworkSubmitId) {
                    state.currentDetail.homeworkSubmit = { ...state.currentDetail.homeworkSubmit, ...submit };
                }
                const index = state.submits.findIndex((item) => item.homeworkSubmitId === submit?.homeworkSubmitId);
                if (index !== -1) state.submits[index] = { ...state.submits[index], ...submit };
            })
            .addCase(updateHomeworkSubmitCompetitionAsync.rejected, (state, action) => {
                state.loadingUpdateCompetitionSubmit = false;
                state.error = action.payload;
            })
            .addCase(ungradeHomeworkSubmitAsync.pending, (state) => {
                state.loadingUngrade = true;
                state.error = null;
            })
            .addCase(ungradeHomeworkSubmitAsync.fulfilled, (state, action) => {
                const submitId = action.meta.arg;
                const clearGrade = (submit) => {
                    if (!submit || submit.homeworkSubmitId !== submitId) return;
                    submit.points = undefined;
                    submit.gradedAt = undefined;
                    submit.graderId = undefined;
                    submit.grader = undefined;
                    submit.feedback = undefined;
                };
                state.loadingUngrade = false;
                clearGrade(state.currentDetail?.homeworkSubmit);
                state.submits.forEach(clearGrade);
            })
            .addCase(ungradeHomeworkSubmitAsync.rejected, (state, action) => {
                state.loadingUngrade = false;
                state.error = action.payload;
            })
            .addCase(updateHomeworkSubmitMediaAltAsync.pending, (state) => {
                state.loadingUpdateMediaAlt = true;
                state.error = null;
            })
            .addCase(updateHomeworkSubmitMediaAltAsync.fulfilled, (state, action) => {
                const { mediaId, alt } = action.meta.arg;
                const updateAlt = (attachments = []) => {
                    attachments.forEach((attachment) => {
                        const attachmentMediaId = attachment.mediaId ?? attachment.media?.mediaId;
                        if (attachmentMediaId !== mediaId) return;
                        if (attachment.media) attachment.media.alt = alt;
                        else attachment.alt = alt;
                    });
                };
                state.loadingUpdateMediaAlt = false;
                updateAlt(state.currentDetail?.fileSubmission?.attachments);
                updateAlt(state.currentDetail?.homeworkSubmit?.attachments);
            })
            .addCase(updateHomeworkSubmitMediaAltAsync.rejected, (state, action) => {
                state.loadingUpdateMediaAlt = false;
                state.error = action.payload;
            });
    },
});

export const { clearHomeworkSubmitDetail } = homeworkSubmitSlice.actions;
export const selectHomeworkSubmits = (state) => state.homeworkSubmit.submits;
export const selectHomeworkSubmitPagination = (state) => state.homeworkSubmit.pagination;
export const selectHomeworkSubmitLoadingGet = (state) => state.homeworkSubmit.loadingGet;
export const selectCurrentHomeworkSubmitDetail = (state) => state.homeworkSubmit.currentDetail;
export const selectHomeworkSubmitLoadingDetail = (state) => state.homeworkSubmit.loadingDetail;
export const selectHomeworkSubmitLoadingGrade = (state) => state.homeworkSubmit.loadingGrade;
export const selectHomeworkSubmitLoadingUpdateCompetitionFeedback = (state) => state.homeworkSubmit.loadingUpdateCompetitionFeedback;
export const selectHomeworkSubmitLoadingUngrade = (state) => state.homeworkSubmit.loadingUngrade;
export const selectHomeworkSubmitLoadingUpdateMediaAlt = (state) => state.homeworkSubmit.loadingUpdateMediaAlt;
export const selectHomeworkSubmitCompetitionAttempts = (state) => state.homeworkSubmit.competitionAttempts;
export const selectHomeworkSubmitLoadingCompetitionAttempts = (state) => state.homeworkSubmit.loadingCompetitionAttempts;
export const selectHomeworkSubmitLoadingCreateFromCompetition = (state) => state.homeworkSubmit.loadingCreateFromCompetition;
export const selectHomeworkSubmitLoadingUpdateCompetitionSubmit = (state) => state.homeworkSubmit.loadingUpdateCompetitionSubmit;

export default homeworkSubmitSlice.reducer;
