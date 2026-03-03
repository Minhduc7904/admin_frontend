import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import {
    X, User, Trophy, CheckCircle2, XCircle, MinusCircle,
    Clock, Hash, BarChart2, FileQuestion, Pencil,
} from 'lucide-react';
import {
    getCompetitionSubmitDetailAsync,
    selectCurrentCompetitionSubmitDetail,
    selectCompetitionSubmitLoadingGetDetail,
    clearCurrentSubmitDetail,
} from '../store/competitionSubmitSlice';
import { InlineLoading, MarkdownRenderer } from '../../../shared/components';
import { EditQuestion } from '../../question/components';

/* ── helpers ─────────────────────────────────────────────────────── */

const fmt = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const STATEMENT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const STATUS_MAP = {
    IN_PROGRESS: { label: 'Đang làm',       cls: 'bg-blue-100 text-blue-700' },
    SUBMITTED:   { label: 'Đã nộp',         cls: 'bg-green-100 text-green-700' },
    GRADED:      { label: 'Đã chấm',        cls: 'bg-purple-100 text-purple-700' },
    ABANDONED:   { label: 'Bỏ giữa chừng', cls: 'bg-gray-100 text-gray-600' },
};

/* ── sub-components ──────────────────────────────────────────────── */

const StatBadge = ({ icon: Icon, label, value, color = 'bg-gray-100 text-gray-700' }) => (
    <div className={`flex flex-col items-center justify-center rounded-lg px-3 py-2 ${color}`}>
        <div className="flex items-center gap-1 mb-0.5">
            <Icon size={12} />
            <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
        </div>
        <span className="text-lg font-bold leading-none">{value}</span>
    </div>
);

const AnswerItem = ({ answer, index, onEdit }) => {
    const q = answer.question;
    if (!q) return null;

    // Parse the JSON `answer` field used by TRUE_FALSE / SHORT_ANSWER questions.
    // e.g. answer.answer = '{"4612":false,"4613":true}'
    let parsedAnswer = null;
    if (answer.answer != null && answer.answer !== '') {
        try { parsedAnswer = JSON.parse(answer.answer); } catch { parsedAnswer = answer.answer; }
    }

    const isTrueFalse   = q.type === 'TRUE_FALSE';
    const isShortAnswer = q.type === 'SHORT_ANSWER';

    // Unanswered = no selection AND no text/json answer submitted.
    const isUnanswered =
        answer.selectedStatementIds == null &&
        (answer.answer == null || answer.answer === '');

    const selectedIds  = new Set(answer.selectedStatementIds ?? []);
    const sortedStatements = q.statements
        ? [...q.statements].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : [];

    const cardCls = isUnanswered
        ? 'border-gray-200 bg-gray-50/40'
        : answer.isCorrect
            ? 'border-green-200 bg-green-50/40'
            : 'border-red-200 bg-red-50/30';

    return (
        <div className={`rounded-lg border ${cardCls}`}>
            {/* Question header */}
            <div className="flex items-start gap-2 px-4 pt-3 pb-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                </span>
                <div className="flex-1 min-w-0 text-sm text-foreground prose prose-sm max-w-none">
                    <MarkdownRenderer content={q.processedContent || q.content || '(Không có nội dung)'} />
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 ml-2">
                    {isUnanswered ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            <MinusCircle size={11} /> Chưa trả lời
                        </span>
                    ) : answer.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={11} /> Đúng
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                            <XCircle size={11} /> Sai
                        </span>
                    )}
                    {answer.points != null && (
                        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                            {answer.points} đ
                        </span>
                    )}
                    {onEdit && q.questionId && (
                        <button
                            title="Chỉnh sửa câu hỏi"
                            onClick={() => onEdit(q.questionId)}
                            className="p-1 rounded hover:bg-gray-200 text-foreground-lighter hover:text-foreground transition-colors"
                        >
                            <Pencil size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Short answer – show the text answer */}
            {isShortAnswer && parsedAnswer != null && (
                <div className="mx-4 mb-3 ml-12 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-[10px] font-semibold text-foreground-lighter uppercase tracking-wide mb-1">Câu trả lời</p>
                    <p className="text-sm text-foreground font-medium">{String(parsedAnswer)}</p>
                </div>
            )}

            {/* TRUE_FALSE statements – show student's true/false choice per statement */}
            {isTrueFalse && sortedStatements.length > 0 && (
                <div className="px-4 pb-3 space-y-1.5 ml-8">
                    {sortedStatements.map((st, i) => {
                        const studentAnswer = parsedAnswer != null && typeof parsedAnswer === 'object'
                            ? parsedAnswer[String(st.statementId)]
                            : undefined;
                        const hasAnswer = studentAnswer !== undefined && studentAnswer !== null;
                        // Correct if student's answer matches st.isCorrect
                        const isStatementCorrect = hasAnswer
                            ? (studentAnswer === st.isCorrect)
                            : null;

                        let rowCls = 'border border-gray-200 bg-white';
                        if (!hasAnswer) rowCls = 'border border-gray-200 bg-gray-50';
                        else if (isStatementCorrect)  rowCls = 'border border-green-300 bg-green-50';
                        else rowCls = 'border border-red-300 bg-red-50';

                        return (
                            <div key={st.statementId} className={`flex items-start gap-2.5 rounded-md px-3 py-2 ${rowCls}`}>
                                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                                    !hasAnswer ? 'bg-gray-200 text-gray-600' :
                                    isStatementCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                    {STATEMENT_LABELS[i] ?? i + 1}
                                </span>
                                <div className="flex-1 text-sm text-foreground prose prose-sm max-w-none">
                                    <MarkdownRenderer content={st.processedContent || st.content} />
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-1.5">
                                    {hasAnswer ? (
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                            studentAnswer ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {studentAnswer ? 'Đúng' : 'Sai'}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-gray-400 italic">–</span>
                                    )}
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                        st.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                    }`}>
                                        ĐA: {st.isCorrect ? 'Đúng' : 'Sai'}
                                    </span>
                                    {hasAnswer && (isStatementCorrect
                                        ? <CheckCircle2 size={13} className="text-green-500" />
                                        : <XCircle size={13} className="text-red-400" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* SINGLE_CHOICE statements – highlight selected option */}
            {!isTrueFalse && !isShortAnswer && sortedStatements.length > 0 && (
                <div className="px-4 pb-3 space-y-1.5 ml-8">
                    {sortedStatements.map((st, i) => {
                        const isSelected = selectedIds.has(st.statementId);
                        const isCorrect  = st.isCorrect;

                        let rowCls = 'border border-gray-200 bg-white';
                        if (isSelected && isCorrect)  rowCls = 'border border-green-300 bg-green-50';
                        else if (isSelected && !isCorrect) rowCls = 'border border-red-300 bg-red-50';
                        else if (!isSelected && isCorrect) rowCls = 'border border-green-200 bg-green-50/50';

                        return (
                            <div key={st.statementId} className={`flex items-start gap-2.5 rounded-md px-3 py-2 ${rowCls}`}>
                                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                                    isSelected ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {STATEMENT_LABELS[i] ?? i + 1}
                                </span>
                                <div className="flex-1 text-sm text-foreground prose prose-sm max-w-none">
                                    <MarkdownRenderer content={st.processedContent || st.content} />
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-1">
                                    {isSelected && (
                                        <span className="text-[10px] text-gray-500 italic">Đã chọn</span>
                                    )}
                                    {isCorrect && (
                                        <CheckCircle2 size={13} className="text-green-500" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Solution */}
            {(q.processedSolution || q.solution) && (
                <div className="mx-4 mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wide mb-1">Lời giải</p>
                    <div className="text-sm text-blue-900 prose prose-sm max-w-none">
                        <MarkdownRenderer content={q.processedSolution || q.solution} />
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── main component ──────────────────────────────────────────────── */

export const CompetitionSubmitDetail = ({ submitId, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const detail  = useSelector(selectCurrentCompetitionSubmitDetail);
    const loading = useSelector(selectCompetitionSubmitLoadingGetDetail);
    const [editQuestionId, setEditQuestionId] = useState(null);

    useEffect(() => {
        if (isOpen && submitId) {
            dispatch(getCompetitionSubmitDetailAsync(submitId));
        }
        return () => {
            if (!isOpen) dispatch(clearCurrentSubmitDetail());
        };
    }, [dispatch, submitId, isOpen]);

    if (!isOpen) return null;

    const statusCfg = STATUS_MAP[detail?.status] ?? { label: detail?.status ?? '', cls: 'bg-gray-100 text-gray-700' };
    const answers   = detail?.answers ?? [];

    return createPortal(
        <>
            {/* Overlay – z above the leaderboard panel (z-50) */}
            <div
                className="fixed inset-0 bg-black bg-opacity-40 z-[60]"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-[680px] bg-white shadow-2xl z-[70] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <FileQuestion size={18} className="text-foreground-lighter flex-shrink-0" />
                        <h2 className="text-base font-semibold text-foreground truncate">
                            Chi tiết bài làm
                            {detail?.student?.fullName ? ` – ${detail.student.fullName}` : ''}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-sm transition-colors flex-shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {loading || !detail || detail.competitionSubmitId !== submitId ? (
                    <div className="flex items-center justify-center flex-1">
                        <InlineLoading message="Đang tải thông tin bài làm..." />
                    </div>
                ) : (() => {
                    // Recompute stats client-side so unanswered answers are never
                    // counted as wrong (API may return isCorrect: false for them).
                    const isAnswerEmpty = (a) => a.selectedStatementIds == null && (a.answer == null || a.answer === '');
                    const computedCorrect    = answers.filter(a => !isAnswerEmpty(a) && a.isCorrect === true).length;
                    const computedUnanswered = answers.filter(isAnswerEmpty).length;
                    const computedWrong      = answers.filter(a => !isAnswerEmpty(a) && a.isCorrect !== true).length;
                    return (
                    <div className="flex-1 overflow-y-auto">
                        {/* ── Meta info ─────────────────────────────── */}
                        <div className="px-6 py-4 border-b border-border space-y-3">
                            {/* Student */}
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-foreground-lighter flex-shrink-0" />
                                <div>
                                    <span className="text-sm font-semibold text-foreground">
                                        {detail.student?.fullName ?? `#${detail.studentId}`}
                                    </span>
                                    {detail.student?.email && (
                                        <span className="ml-2 text-xs text-foreground-lighter">{detail.student.email}</span>
                                    )}
                                </div>
                            </div>

                            {/* Status + Attempt */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.cls}`}>
                                    {statusCfg.label}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    <Hash size={10} /> Lần {detail.attemptNumber ?? 1}
                                </span>
                            </div>

                            {/* Times */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-foreground-light">
                                <div className="flex items-center gap-1">
                                    <Clock size={11} />
                                    <span>Bắt đầu: {fmt(detail.startedAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={11} />
                                    <span>Nộp bài: {fmt(detail.submittedAt)}</span>
                                </div>
                            </div>

                            {/* Score stats */}
                            <div className="grid grid-cols-4 gap-2 pt-1">
                                <StatBadge
                                    icon={BarChart2}
                                    label="Tổng điểm"
                                    value={`${detail.totalPoints ?? 0}/${detail.maxPoints ?? 0}`}
                                    color="bg-purple-100 text-purple-700"
                                />
                                <StatBadge
                                    icon={CheckCircle2}
                                    label="Đúng"
                                    value={computedCorrect}
                                    color="bg-green-100 text-green-700"
                                />
                                <StatBadge
                                    icon={XCircle}
                                    label="Sai"
                                    value={computedWrong}
                                    color="bg-red-100 text-red-700"
                                />
                                <StatBadge
                                    icon={MinusCircle}
                                    label="Chưa TL"
                                    value={computedUnanswered}
                                    color="bg-gray-100 text-gray-600"
                                />
                            </div>
                        </div>

                        {/* ── Answer list ───────────────────────────── */}
                        <div className="px-6 py-4 space-y-3">
                            <h3 className="text-xs font-semibold text-foreground-lighter uppercase tracking-widest mb-1">
                                Danh sách câu trả lời ({answers.length})
                            </h3>
                            {answers.length === 0 ? (
                                <div className="flex items-center gap-2 text-sm text-foreground-lighter italic py-6 justify-center">
                                    <Trophy size={14} /> Không có câu trả lời nào
                                </div>
                            ) : (
                                answers.map((ans, i) => (
                                    <AnswerItem key={ans.answerId ?? i} answer={ans} index={i} onEdit={setEditQuestionId} />
                                ))
                            )}
                        </div>
                    </div>
                    );
                })()}
            </div>

            {/* Edit Question – stacked above this panel */}
            {editQuestionId && createPortal(
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-[80]"
                        onClick={() => setEditQuestionId(null)}
                    />
                    <div className="fixed right-0 top-0 bottom-0 w-[800px] bg-white shadow-2xl z-[90] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Pencil size={16} className="text-foreground-lighter" />
                                <h2 className="text-base font-semibold text-foreground">Chỉnh sửa câu hỏi</h2>
                            </div>
                            <button
                                onClick={() => setEditQuestionId(null)}
                                className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <EditQuestion
                                questionId={editQuestionId}
                                onClose={() => setEditQuestionId(null)}
                                loadQuestions={() => {
                                    if (submitId) dispatch(getCompetitionSubmitDetailAsync(submitId));
                                }}
                            />
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>,
        document.body
    );
};
