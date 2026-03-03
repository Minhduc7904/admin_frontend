import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Calendar, Trophy, FileText, Clock, RefreshCw,
    Edit2, CheckCircle, XCircle, Eye,
    AlertCircle, Users, BookOpen, Edit
} from 'lucide-react';
import {
    getCompetitionByIdAsync,
    selectCurrentCompetition,
    selectCompetitionLoadingGetById
} from '../store/competitionSlice';
import { Button, RightPanel } from '../../../shared/components/ui';
import { InlineLoading, MarkdownRenderer } from '../../../shared/components';
import { EditHomeworkContent } from '../../homeworkContent/components';

/* ── helpers ─────────────────────────────────────────────────────── */

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const VisibilityBadge = ({ visibility }) => {
    const map = {
        DRAFT:     { label: 'Bản nháp',     cls: 'bg-gray-100 text-gray-700' },
        PUBLISHED: { label: 'Đã xuất bản',  cls: 'bg-green-100 text-green-700' },
        PRIVATE:   { label: 'Riêng tư',     cls: 'bg-yellow-100 text-yellow-700' },
    };
    const { label, cls } = map[visibility] || map.DRAFT;
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
};

const StatusBadge = ({ competition }) => {
    const now = new Date();
    const start = new Date(competition.startDate);
    const end = new Date(competition.endDate);
    if (now < start)
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Sắp diễn ra</span>;
    if (now <= end)
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Đang diễn ra</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Đã kết thúc</span>;
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center">
            <Icon size={14} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground-lighter uppercase tracking-wide font-medium mb-0.5">{label}</p>
            <div className="text-sm text-foreground">{value}</div>
        </div>
    </div>
);

const SettingRow = ({ label, enabled, tooltip }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
        <div className="flex flex-col">
            <span className="text-sm text-foreground">{label}</span>
            {tooltip && <span className="text-xs text-foreground-lighter mt-0.5">{tooltip}</span>}
        </div>
        {enabled
            ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            : <XCircle size={16} className="text-gray-300 flex-shrink-0" />
        }
    </div>
);

/* ── component ───────────────────────────────────────────────────── */

export const CompetitionDetail = ({ competitionId, onEdit, onExamClick }) => {
    const dispatch = useDispatch();
    const competition = useSelector(selectCurrentCompetition);
    const loading = useSelector(selectCompetitionLoadingGetById);
    const [editingHomework, setEditingHomework] = useState(null);

    useEffect(() => {
        if (competitionId) {
            dispatch(getCompetitionByIdAsync(competitionId));
        }
    }, [dispatch, competitionId]);

    if (loading || !competition || competition.competitionId !== competitionId) {
        return (
            <div className="flex items-center justify-center h-40">
                <InlineLoading message="Đang tải thông tin cuộc thi..." />
            </div>
        );
    }

    return (
        <>
        <div className="flex flex-col h-full overflow-y-auto">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-semibold text-foreground leading-snug">
                            {competition.title}
                        </h2>
                        {competition.subtitle && (
                            <p className="text-sm text-foreground-light mt-0.5 truncate">
                                {competition.subtitle}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <VisibilityBadge visibility={competition.visibility} />
                            {competition.startDate && competition.endDate && (
                                <StatusBadge competition={competition} />
                            )}
                        </div>
                    </div>
                    {onEdit && (
                        <Button variant="outline" size="sm" onClick={onEdit} className="flex-shrink-0">
                            <Edit2 size={14} />
                            Chỉnh sửa
                        </Button>
                    )}
                </div>
            </div>

            <div className="px-6 py-5 space-y-6">
                {/* ── Thông tin cơ bản ───────────────────────────────── */}
                <section>
                    <h3 className="text-xs font-semibold text-foreground-lighter uppercase tracking-widest mb-3">
                        Thông tin cuộc thi
                    </h3>
                    <div className="space-y-4">
                        <InfoRow
                            icon={Trophy}
                            label="Số lượt thi"
                            value={
                                <div className="flex items-center gap-1.5">
                                    <Users size={13} className="text-foreground-lighter" />
                                    <span>{competition.totalSubmissions ?? 0} lượt</span>
                                </div>
                            }
                        />
                        <InfoRow
                            icon={Eye}
                            label="Trạng thái hiển thị"
                            value={<VisibilityBadge visibility={competition.visibility} />}
                        />
                        {competition.createdByAdmin && (
                            <InfoRow
                                icon={AlertCircle}
                                label="Tạo bởi"
                                value={competition.createdByAdmin.fullName}
                            />
                        )}
                    </div>
                </section>

                {/* ── Đề thi ─────────────────────────────────────────── */}
                <section>
                    <h3 className="text-xs font-semibold text-foreground-lighter uppercase tracking-widest mb-3">
                        Đề thi liên kết
                    </h3>
                    {competition.exam ? (
                        <div
                            className={`p-4 bg-gray-50 rounded-lg border border-border space-y-2 ${
                                onExamClick ? 'cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors' : ''
                            }`}
                            onClick={onExamClick ? () => onExamClick(competition.exam) : undefined}
                        >
                            <div className="flex items-start gap-2">
                                <FileText size={15} className="text-foreground-lighter mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-medium text-foreground leading-snug">
                                    {competition.exam.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap pl-5">
                                {competition.exam.grade && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        Lớp {competition.exam.grade}
                                    </span>
                                )}
                                {competition.exam.visibility && (
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        competition.exam.visibility === 'PUBLISHED'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {competition.exam.visibility === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-foreground-lighter italic p-4 bg-gray-50 rounded-lg border border-border">
                            <FileText size={14} />
                            Chưa có đề thi liên kết
                        </div>
                    )}
                </section>

                {/* ── Thời gian ──────────────────────────────────────── */}
                <section>
                    <h3 className="text-xs font-semibold text-foreground-lighter uppercase tracking-widest mb-3">
                        Thời gian
                    </h3>
                    <div className="space-y-4">
                        <InfoRow
                            icon={Calendar}
                            label="Thời gian bắt đầu"
                            value={formatDate(competition.startDate)}
                        />
                        <InfoRow
                            icon={Calendar}
                            label="Thời gian kết thúc"
                            value={formatDate(competition.endDate)}
                        />
                        <InfoRow
                            icon={Clock}
                            label="Thời gian làm bài"
                            value={competition.durationMinutes
                                ? `${competition.durationMinutes} phút`
                                : <span className="text-foreground-lighter italic">Không giới hạn</span>
                            }
                        />
                        <InfoRow
                            icon={RefreshCw}
                            label="Số lần làm tối đa"
                            value={competition.maxAttempts
                                ? `${competition.maxAttempts} lần`
                                : <span className="text-foreground-lighter italic">Không giới hạn</span>
                            }
                        />
                    </div>
                </section>

                {/* ── Chính sách / Nội quy ───────────────────────────── */}
                {(competition.processedPolicies || competition.policies) && (
                    <section>
                        <h3 className="text-xs font-semibold text-foreground-lighter uppercase tracking-widest mb-3">
                            Nội quy / Chính sách
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-lg border border-border text-sm prose prose-sm max-w-none">
                            <MarkdownRenderer content={competition.processedPolicies || competition.policies} />
                        </div>
                    </section>
                )}

                {/* ── Bài tập về nhà ─────────────────────────────────── */}
                {competition.homeworkContents?.length > 0 && (
                    <section>
                        <h3 className="text-xs font-semibold text-foreground-lighter uppercase tracking-widest mb-3">
                            Bài tập về nhà ({competition.homeworkContents.length})
                        </h3>
                        <div className="space-y-2">
                            {competition.homeworkContents.map((hw) => (
                                <div
                                    key={hw.homeworkContentId}
                                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-border"
                                >
                                    <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center">
                                        <BookOpen size={13} className="text-gray-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {hw.learningItem?.title || `#${hw.homeworkContentId}`}
                                        </p>
                                        {hw.content && (
                                            <p className="text-xs text-foreground-light mt-0.5 truncate">
                                                {hw.content}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                                            {hw.dueDate && (
                                                <span className="flex items-center gap-1 text-xs text-foreground-lighter">
                                                    <Calendar size={11} />
                                                    Hạn nộp: {formatDate(hw.dueDate)}
                                                </span>
                                            )}
                                            {hw.learningItem?.admin?.fullName && (
                                                <span className="text-xs text-foreground-lighter">
                                                    {hw.learningItem.admin.fullName}
                                                </span>
                                            )}
                                            {hw.allowLateSubmit && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                    Nộp muộn
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setEditingHomework(hw)}
                                        className="flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Cài đặt hiển thị ───────────────────────────────── */}
                <section>
                    <h3 className="text-xs font-semibold text-foreground-lighter uppercase tracking-widest mb-3">
                        Cài đặt
                    </h3>
                    <div className="bg-gray-50 rounded-lg border border-border px-4 py-1">
                        <SettingRow
                            label="Hiển thị chi tiết kết quả"
                            enabled={competition.showResultDetail}
                            tooltip="Cho phép học sinh xem đúng/sai từng câu sau khi làm xong."
                        />
                        <SettingRow
                            label="Hiển thị bảng xếp hạng"
                            enabled={competition.allowLeaderboard}
                            tooltip="Công khai bảng xếp hạng điểm của các học sinh tham gia."
                        />
                        <SettingRow
                            label="Cho phép xem điểm"
                            enabled={competition.allowViewScore}
                            tooltip="Học sinh có thể xem điểm tổng sau khi hoàn thành."
                        />
                        <SettingRow
                            label="Cho phép xem đáp án"
                            enabled={competition.allowViewAnswer}
                            tooltip="Học sinh được xem đáp án đúng sau khi nộp bài."
                        />
                        <SettingRow
                            label="Bật chống gian lận"
                            enabled={competition.enableAntiCheating}
                            tooltip="Kích hoạt các biện pháp hạn chế gian lận như chuyển tab, copy."
                        />
                        <SettingRow
                            label="Cho phép xem video giải chi tiết"
                            enabled={competition.allowViewSolutionYoutubeUrl}
                            tooltip="Học sinh có thể xem video hướng dẫn giải sau khi hoàn thành."
                        />
                        <SettingRow
                            label="Cho phép xem nội dung đề"
                            enabled={competition.allowViewExamContent}
                            tooltip="Học sinh có thể xem lại đề thi sau khi nộp bài."
                        />
                    </div>
                </section>
            </div>
        </div>

        {/* ── Edit Homework Content Panel ──────────────────────── */}
        <RightPanel
            isOpen={!!editingHomework}
            onClose={() => setEditingHomework(null)}
            title={`Chỉnh sửa bài tập #${editingHomework?.homeworkContentId ?? ''}`}
        >
            {editingHomework && (
                <EditHomeworkContent
                    homeworkContent={editingHomework}
                    onClose={() => setEditingHomework(null)}
                    onSuccess={() => {
                        setEditingHomework(null);
                        dispatch(getCompetitionByIdAsync(competitionId));
                    }}
                />
            )}
        </RightPanel>
        </>
    );
};
