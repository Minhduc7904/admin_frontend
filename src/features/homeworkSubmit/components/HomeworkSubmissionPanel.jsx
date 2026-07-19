import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileText,
    Loader2,
    MessageSquare,
    Paperclip,
    PenLine,
    Plus,
    RotateCcw,
    Trophy,
    Upload,
    User,
} from 'lucide-react';
import { Button, ConfirmModal, Dropdown, Input, Pagination, Textarea } from '../../../shared/components';
import { formatDateTime } from '../../../shared/utils';
import {
    clearHomeworkSubmitDetail,
    getAdminHomeworkSubmitDetailAsync,
    getAllHomeworkSubmitsAsync,
    gradeHomeworkSubmitAsync,
    ungradeHomeworkSubmitAsync,
    updateHomeworkSubmitMediaAltAsync,
    selectCurrentHomeworkSubmitDetail,
    selectHomeworkSubmitLoadingDetail,
    selectHomeworkSubmitLoadingGet,
    selectHomeworkSubmitLoadingGrade,
    selectHomeworkSubmitLoadingUpdateCompetitionFeedback,
    selectHomeworkSubmitLoadingUngrade,
    selectHomeworkSubmitLoadingUpdateMediaAlt,
    selectHomeworkSubmitPagination,
    selectHomeworkSubmits,
    updateCompetitionHomeworkFeedbackAsync,
} from '../store/homeworkSubmitSlice';
import {
    HomeworkSubmissionMediaPreviewModal,
} from './HomeworkSubmissionMediaPreviewModal';
import {
    isHomeworkSubmissionImage,
    isHomeworkSubmissionPdf,
} from '../utils/homeworkSubmissionMedia';
import { CompetitionSubmitDetail } from '../../competitionSubmit/components/CompetitionSubmitDetail';
import { CompetitionHomeworkSubmitModal } from './CompetitionHomeworkSubmitModal';

const ScoreBadge = ({ points }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${points == null ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-700'}`}>
        {points == null ? 'Chưa chấm' : `${points} điểm`}
    </span>
);

const studentName = (submit) => submit?.student?.fullName || submit?.student?.user?.fullName || `Học sinh #${submit?.studentId}`;

const GRADED_FILTER_OPTIONS = [
    { value: '', label: 'Tất cả bài nộp' },
    { value: 'false', label: 'Chưa chấm điểm' },
    { value: 'true', label: 'Đã chấm điểm' },
];

const SUBMISSION_SORT_OPTIONS = [
    { value: 'submitAt:desc', label: 'Nộp mới nhất' },
    { value: 'submitAt:asc', label: 'Nộp cũ nhất' },
    { value: 'points:desc', label: 'Điểm cao đến thấp' },
    { value: 'points:asc', label: 'Điểm thấp đến cao' },
];

export const HomeworkSubmissionPanel = ({ homework, isOpen, studentId, initialSubmitId = null }) => {
    const dispatch = useDispatch();
    const submits = useSelector(selectHomeworkSubmits);
    const pagination = useSelector(selectHomeworkSubmitPagination);
    const loadingList = useSelector(selectHomeworkSubmitLoadingGet);
    const detail = useSelector(selectCurrentHomeworkSubmitDetail);
    const loadingDetail = useSelector(selectHomeworkSubmitLoadingDetail);
    const loadingGrade = useSelector(selectHomeworkSubmitLoadingGrade);
    const loadingUpdateCompetitionFeedback = useSelector(selectHomeworkSubmitLoadingUpdateCompetitionFeedback);
    const loadingUngrade = useSelector(selectHomeworkSubmitLoadingUngrade);
    const loadingUpdateMediaAlt = useSelector(selectHomeworkSubmitLoadingUpdateMediaAlt);
    const [selectedId, setSelectedId] = useState(null);
    const [grade, setGrade] = useState({ points: '', feedback: '' });
    const [errors, setErrors] = useState({});
    const [previewMediaId, setPreviewMediaId] = useState(null);
    const [ungradeSubmitId, setUngradeSubmitId] = useState(null);
    const [competitionSubmitDetailId, setCompetitionSubmitDetailId] = useState(null);
    const [competitionSubmitModalTarget, setCompetitionSubmitModalTarget] = useState(null);
    const [competitionFeedback, setCompetitionFeedback] = useState('');
    const [submissionFilters, setSubmissionFilters] = useState({
        isGraded: '',
        sort: 'submitAt:desc',
    });

    const loadSubmits = useCallback((page = 1, limit = pagination.limit || 20, filters = submissionFilters) => {
        if (!homework?.homeworkContentId) return;
        const [sortBy, sortOrder] = filters.sort.split(':');
        dispatch(getAllHomeworkSubmitsAsync({
            homeworkContentId: homework.homeworkContentId,
            studentId: studentId || undefined,
            page,
            limit,
            isGraded: filters.isGraded === '' ? undefined : filters.isGraded === 'true',
            sortBy,
            sortOrder,
        }));
    }, [dispatch, homework?.homeworkContentId, pagination.limit, studentId, submissionFilters]);

    useEffect(() => {
        if (!isOpen) return undefined;
        setSelectedId(initialSubmitId);
        setGrade({ points: '', feedback: '' });
        setErrors({});
        setPreviewMediaId(null);
        setUngradeSubmitId(null);
        setCompetitionSubmitDetailId(null);
        setCompetitionSubmitModalTarget(null);
        setCompetitionFeedback('');
        loadSubmits(1);
        return () => dispatch(clearHomeworkSubmitDetail());
    }, [dispatch, initialSubmitId, isOpen, homework?.homeworkContentId, loadSubmits]);

    useEffect(() => {
        if (selectedId) dispatch(getAdminHomeworkSubmitDetailAsync(selectedId));
    }, [dispatch, selectedId]);

    useEffect(() => {
        const submit = detail?.homeworkSubmit;
        if (!submit) return;
        setGrade({
            points: submit.points ?? '',
            feedback: submit.feedback ?? '',
        });
        setErrors({});
        if (detail?.type === 'COMPETITION') setCompetitionFeedback(submit.feedback ?? '');
    }, [detail]);

    const handleGrade = async (event) => {
        event.preventDefault();
        const points = Number(grade.points);
        if (grade.points === '' || Number.isNaN(points) || points < 0) {
            setErrors({ points: 'Điểm phải là số lớn hơn hoặc bằng 0.' });
            return;
        }

        try {
            await dispatch(gradeHomeworkSubmitAsync({
                id: detail.homeworkSubmit.homeworkSubmitId,
                data: { points, feedback: grade.feedback.trim() || undefined },
            })).unwrap();
            loadSubmits(pagination.page, pagination.limit);
        } catch (error) {
            console.error('Error grading homework submit:', error);
        }
    };

    const handleSaveMediaAlt = async (mediaId, alt) => {
        if (!submit?.homeworkSubmitId || !mediaId) return;
        try {
            await dispatch(updateHomeworkSubmitMediaAltAsync({
                homeworkSubmitId: submit.homeworkSubmitId,
                mediaId,
                alt,
            })).unwrap();
        } catch (error) {
            console.error('Error updating homework submission media feedback:', error);
        }
    };

    const handleUngrade = async () => {
        if (!ungradeSubmitId) return;
        try {
            await dispatch(ungradeHomeworkSubmitAsync(ungradeSubmitId)).unwrap();
            if (submit?.homeworkSubmitId === ungradeSubmitId) setGrade({ points: '', feedback: '' });
            setUngradeSubmitId(null);
            loadSubmits(pagination.page, pagination.limit);
        } catch (error) {
            console.error('Error ungrading homework submit:', error);
        }
    };

    const handleUpdateCompetitionFeedback = async (event) => {
        event.preventDefault();
        const feedback = competitionFeedback.trim();
        if (!feedback) {
            setErrors((current) => ({ ...current, competitionFeedback: 'Nhận xét không được để trống.' }));
            return;
        }
        try {
            await dispatch(updateCompetitionHomeworkFeedbackAsync({
                id: submit.homeworkSubmitId,
                feedback,
            })).unwrap();
            setErrors((current) => ({ ...current, competitionFeedback: undefined }));
            loadSubmits(pagination.page, pagination.limit);
        } catch (error) {
            console.error('Error updating competition homework feedback:', error);
        }
    };

    const handleCompetitionSubmitModalSuccess = () => {
        loadSubmits(pagination.page, pagination.limit);
        if (selectedId) dispatch(getAdminHomeworkSubmitDetailAsync(selectedId));
    };

    if (!isOpen) return null;

    const submit = detail?.homeworkSubmit;
    const isFileUpload = (detail?.type || homework?.type) === 'FILE_UPLOAD';
    const competitionSubmit = detail?.competitionSubmission;
    const attachments = detail?.fileSubmission?.attachments ?? submit?.attachments ?? [];
    const ungradeConfirmModal = <ConfirmModal
        isOpen={ungradeSubmitId != null}
        onClose={() => setUngradeSubmitId(null)}
        onConfirm={handleUngrade}
        title="Gỡ chấm điểm?"
        message="Điểm, nhận xét và thông tin người chấm sẽ bị xóa. Sau đó học sinh có thể nộp lại bài này."
        confirmText="Gỡ chấm điểm"
        cancelText="Hủy"
        variant="warning"
        isLoading={loadingUngrade}
    />;

    const handleFilterChange = (changes) => {
        const nextFilters = { ...submissionFilters, ...changes };
        setSubmissionFilters(nextFilters);
    };

    if (selectedId) {
        return (
            <>
            <div className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-3 border-b border-border bg-gray-50 px-6 py-3">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedId(null); dispatch(clearHomeworkSubmitDetail()); }}>
                        <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Danh sách bài nộp
                    </Button>
                    {submit && <ScoreBadge points={submit.points} />}
                </div>

                {loadingDetail || !detail ? (
                    <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải bài nộp...
                    </div>
                ) : (
                    <div className="flex-1 space-y-5 overflow-y-auto p-6">
                        <section className="rounded-xl border border-border bg-white p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <User className="h-4 w-4 text-info" />
                                <h3 className="font-semibold text-foreground">{studentName(submit)}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                                <span>Mã học sinh: {submit.student?.studentCode || '-'}</span>
                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatDateTime(submit.submitAt)}</span>
                                {submit.gradedAt && <span>Chấm lúc: {formatDateTime(submit.gradedAt)}</span>}
                                {submit.grader?.fullName && <span>Người chấm: {submit.grader.fullName}</span>}
                            </div>
                        </section>

                        {isFileUpload ? (
                            <>
                                <section className="rounded-xl border border-border bg-white p-4">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Upload className="h-4 w-4 text-violet-600" /> Nội dung học sinh nộp
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{submit.content || 'Học sinh không gửi nội dung kèm theo.'}</p>
                                    <div className="mt-4 space-y-3">
                                        {attachments.length ? attachments.map((attachment, index) => {
                                            const media = attachment.media ?? attachment;
                                            const mediaId = attachment.mediaId ?? media.mediaId;
                                            const name = media.originalName || media.fileName || `Tệp đính kèm ${index + 1}`;

                                            if (isHomeworkSubmissionImage(attachment)) {
                                                return <button key={attachment.usageId ?? mediaId ?? index} type="button" onClick={() => setPreviewMediaId(mediaId)} className="group block w-full overflow-hidden rounded-xl border border-border bg-gray-50 text-left hover:border-info/50">
                                                    {media.viewUrl ? <img src={media.viewUrl} alt={media.alt || name} className="h-48 w-full object-contain bg-gray-100 transition-transform group-hover:scale-[1.01]" /> : <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">Không có ảnh xem trước</div>}
                                                    <div className="flex items-center gap-2 px-3 py-2"><Paperclip className="h-4 w-4 text-info" /><span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{name}</span><span className="text-xs text-info">Xem ảnh</span></div>
                                                    {media.alt && <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">Nhận xét: {media.alt}</p>}
                                                </button>;
                                            }

                                            if (isHomeworkSubmissionPdf(attachment) && media.viewUrl) {
                                                return <div key={attachment.usageId ?? mediaId ?? index} className="overflow-hidden rounded-xl border border-border bg-white">
                                                    <div className="flex items-center gap-2 border-b border-border px-3 py-2"><FileText className="h-4 w-4 text-red-600" /><span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{name}</span><button type="button" onClick={() => setPreviewMediaId(mediaId)} className="text-xs font-medium text-info hover:underline">Xem slide</button><a href={media.viewUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-info hover:underline">Mở riêng</a></div>
                                                    <iframe src={media.viewUrl} title={name} className="h-80 w-full bg-gray-100" />
                                                </div>;
                                            }

                                            return <div key={attachment.usageId ?? mediaId ?? index} className="flex items-center gap-2 rounded-lg border border-info/30 bg-info/5 px-3 py-2 text-sm font-medium text-info">
                                                <Paperclip className="h-4 w-4 shrink-0" />
                                                <a href={media.viewUrl} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate hover:underline">{name}</a>
                                                <button type="button" onClick={() => setPreviewMediaId(mediaId)} className="shrink-0 text-xs font-semibold hover:underline">Nhận xét</button>
                                            </div>;
                                        }) : <p className="text-sm italic text-muted-foreground">Không có tệp đính kèm.</p>}
                                    </div>
                                </section>

                                <form onSubmit={handleGrade} className="rounded-xl border border-violet-200 bg-violet-50/40 p-4">
                                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-violet-900">
                                        <PenLine className="h-4 w-4" /> Chấm bài
                                    </div>
                                    <div className="space-y-4">
                                        <Input
                                            label="Điểm"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={grade.points}
                                            error={errors.points}
                                            onChange={(event) => setGrade((value) => ({ ...value, points: event.target.value }))}
                                            helperText="Nhập điểm từ 0 trở lên. Có thể chấm lại để cập nhật điểm và nhận xét."
                                        />
                                        <Textarea
                                            label="Nhận xét"
                                            rows={4}
                                            value={grade.feedback}
                                            onChange={(event) => setGrade((value) => ({ ...value, feedback: event.target.value }))}
                                            placeholder="Nhận xét để học sinh xem lại..."
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            <Button type="submit" loading={loadingGrade} disabled={loadingGrade || loadingUngrade}>
                                                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Lưu điểm và nhận xét
                                            </Button>
                                            {submit.points != null && <Button type="button" variant="outline" onClick={() => setUngradeSubmitId(submit.homeworkSubmitId)} disabled={loadingGrade || loadingUngrade} className="border-warning/40 text-warning-dark hover:bg-warning-bg">
                                                <RotateCcw className="mr-1.5 h-4 w-4" /> Gỡ chấm điểm
                                            </Button>}
                                        </div>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                            <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-900">
                                    <Trophy className="h-4 w-4" /> Kết quả Competition
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-lg bg-white p-3"><p className="text-xs text-muted-foreground">Điểm</p><p className="mt-1 font-bold text-foreground">{competitionSubmit?.totalPoints ?? submit.points ?? '-'}{competitionSubmit?.maxPoints != null ? `/${competitionSubmit.maxPoints}` : ''}</p></div>
                                    <div className="rounded-lg bg-white p-3"><p className="text-xs text-muted-foreground">Trạng thái</p><p className="mt-1 font-semibold text-foreground">{competitionSubmit?.status || (submit.points == null ? 'Chưa chấm' : 'Đã chấm')}</p></div>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-sm text-amber-900/80">Bài tập Competition nhận điểm từ lượt làm bài; không thể chấm hoặc gỡ chấm tại đây.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {competitionSubmit?.competitionSubmitId && <Button type="button" size="sm" variant="outline" onClick={() => setCompetitionSubmitDetailId(competitionSubmit.competitionSubmitId)}>
                                            Xem chi tiết bài làm
                                        </Button>}
                                        <Button type="button" size="sm" variant="outline" onClick={() => setCompetitionSubmitModalTarget(submit)}>
                                            Đổi lượt thi
                                        </Button>
                                    </div>
                                </div>
                            </section>
                            <form onSubmit={handleUpdateCompetitionFeedback} className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-900"><MessageSquare className="h-4 w-4" /> Nhận xét cho học sinh</div>
                                <Textarea
                                    label="Nhận xét"
                                    required
                                    rows={4}
                                    value={competitionFeedback}
                                    error={errors.competitionFeedback}
                                    onChange={(event) => {
                                        setCompetitionFeedback(event.target.value);
                                        setErrors((current) => ({ ...current, competitionFeedback: undefined }));
                                    }}
                                    placeholder="Nhập nhận xét để học sinh xem lại..."
                                />
                                <div className="mt-3 flex justify-end"><Button type="submit" loading={loadingUpdateCompetitionFeedback} disabled={loadingUpdateCompetitionFeedback}>Lưu nhận xét</Button></div>
                            </form>
                            </>
                        )}
                    </div>
                )}
            </div>
            {previewMediaId != null && <HomeworkSubmissionMediaPreviewModal
                key={previewMediaId}
                attachments={attachments}
                initialMediaId={previewMediaId}
                isOpen={previewMediaId != null}
                onClose={() => setPreviewMediaId(null)}
                onSaveAlt={handleSaveMediaAlt}
                saving={loadingUpdateMediaAlt}
            />}
            {ungradeConfirmModal}
            <CompetitionSubmitDetail
                submitId={competitionSubmitDetailId}
                isOpen={competitionSubmitDetailId != null}
                onClose={() => setCompetitionSubmitDetailId(null)}
                allowQuestionEdit={false}
            />
            {competitionSubmitModalTarget != null && <CompetitionHomeworkSubmitModal
                isOpen={competitionSubmitModalTarget != null}
                onClose={() => setCompetitionSubmitModalTarget(null)}
                homework={homework}
                existingSubmit={competitionSubmitModalTarget}
                onSuccess={handleCompetitionSubmitModalSuccess}
            />}
            </>
        );
    }

    return (
        <>
        <div className="flex h-full flex-col">
            <div className="border-b border-border bg-gray-50 px-6 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {homework?.type === 'FILE_UPLOAD' ? <Upload className="h-4 w-4 text-violet-600" /> : <Trophy className="h-4 w-4 text-amber-600" />}
                        <span className="text-sm font-medium text-foreground">{homework?.type === 'FILE_UPLOAD' ? 'Bài nộp file' : 'Bài nộp Competition'}</span>
                    </div>
                    {homework?.type === 'COMPETITION' && <Button type="button" size="sm" onClick={() => setCompetitionSubmitModalTarget({})}><Plus className="mr-1 h-4 w-4" /> Tạo từ lượt thi</Button>}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{homework?.content}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 border-b border-border bg-white px-4 py-3 sm:grid-cols-2">
                <Dropdown label="Trạng thái điểm" value={submissionFilters.isGraded} onChange={(isGraded) => handleFilterChange({ isGraded })} options={GRADED_FILTER_OPTIONS} />
                <Dropdown label="Sắp xếp" value={submissionFilters.sort} onChange={(sort) => handleFilterChange({ sort })} options={SUBMISSION_SORT_OPTIONS} />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {loadingList ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : submits.length === 0 ? (
                    <div className="py-12 text-center"><FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" /><p className="text-sm text-muted-foreground">Chưa có học sinh nộp bài.</p></div>
                ) : (
                    <div className="space-y-2">
                        {submits.map((item) => (
                            <div key={item.homeworkSubmitId} className="flex items-center gap-2 rounded-xl border border-border bg-white p-1.5 transition-colors hover:border-info/40 hover:bg-info/5">
                            <button type="button" onClick={() => setSelectedId(item.homeworkSubmitId)} className="min-w-0 flex-1 rounded-lg p-2.5 text-left">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">{studentName(item)}</p><p className="mt-1 text-xs text-muted-foreground">Nộp lúc {formatDateTime(item.submitAt)}</p></div>
                                    <ScoreBadge points={item.points} />
                                </div>
                                {item.feedback && <p className="mt-3 line-clamp-1 text-xs text-muted-foreground">Nhận xét: {item.feedback}</p>}
                            </button>
                            {homework?.type === 'FILE_UPLOAD' && item.points != null && <button type="button" onClick={() => setUngradeSubmitId(item.homeworkSubmitId)} disabled={loadingUngrade} title="Gỡ chấm điểm nhanh" className="rounded-lg p-2 text-warning-dark transition-colors hover:bg-warning-bg disabled:cursor-not-allowed disabled:opacity-50"><RotateCcw className="h-4 w-4" /></button>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {pagination.totalPages > 1 && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(page) => loadSubmits(page, pagination.limit)} itemsPerPage={pagination.limit} onItemsPerPageChange={(limit) => loadSubmits(1, Number(limit))} totalItems={pagination.total} disabled={loadingList} />}
        </div>
        {ungradeConfirmModal}
        {competitionSubmitModalTarget != null && <CompetitionHomeworkSubmitModal
            isOpen={competitionSubmitModalTarget != null}
            onClose={() => setCompetitionSubmitModalTarget(null)}
            homework={homework}
            existingSubmit={competitionSubmitModalTarget?.homeworkSubmitId ? competitionSubmitModalTarget : null}
            onSuccess={handleCompetitionSubmitModalSuccess}
        />}
        </>
    );
};
