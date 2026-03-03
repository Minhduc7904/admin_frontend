import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Trophy, RefreshCw, CheckCircle2, XCircle, BarChart2, RotateCcw } from 'lucide-react';
import {
    getAllCompetitionSubmitsAsync,
    regradeCompetitionSubmitAsync,
    selectCompetitionSubmits,
    selectCompetitionSubmitPagination,
    selectCompetitionSubmitLoadingGet,
    selectCompetitionSubmitLoadingRegrade,
} from '../../competitionSubmit/store/competitionSubmitSlice';
import {
    getCompetitionQuestionStatsAsync,
    selectCompetitionQuestionStats,
    selectCompetitionLoadingQuestionStats,
} from '../store/competitionSlice';
import { Dropdown, Table } from '../../../shared/components/ui';
import { Pagination } from '../../../shared/components/ui/Pagination';
import { CompetitionSubmitDetail } from '../../competitionSubmit/components/CompetitionSubmitDetail';
import { StackedBarChart, PercentPieChart } from '../../../shared/components/stat';

/* ── Constants ──────────────────────────────────────────────────── */

const STATUS_CONFIG = {
    IN_PROGRESS: { label: 'Đang làm',       cls: 'bg-blue-100 text-blue-700' },
    SUBMITTED:   { label: 'Đã nộp',         cls: 'bg-green-100 text-green-700' },
    GRADED:      { label: 'Đã chấm',        cls: 'bg-purple-100 text-purple-700' },
    ABANDONED:   { label: 'Bỏ giữa chừng', cls: 'bg-gray-100 text-gray-600' },
};

const STATUS_OPTIONS = [
    { value: '',            label: 'Tất cả trạng thái' },
    { value: 'IN_PROGRESS', label: 'Đang làm' },
    { value: 'SUBMITTED',   label: 'Đã nộp' },
    { value: 'GRADED',      label: 'Đã chấm' },
    { value: 'ABANDONED',   label: 'Bỏ giữa chừng' },
];

const IS_GRADED_OPTIONS = [
    { value: '',      label: 'Tất cả' },
    { value: 'true',  label: 'Đã chấm' },
    { value: 'false', label: 'Chưa chấm' },
];

/* ── Helpers ────────────────────────────────────────────────────── */

const formatDateTime = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
};

const ScoreCell = ({ score, totalScore }) => {
    if (score == null) return <span className="text-xs text-foreground-lighter italic">–</span>;
    const pct = totalScore ? Math.round((score / totalScore) * 100) : null;
    const color =
        pct == null    ? 'bg-gray-100 text-gray-700' :
        pct >= 80      ? 'bg-green-100 text-green-700' :
        pct >= 50      ? 'bg-yellow-100 text-yellow-700' :
                         'bg-red-100 text-red-700';
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${color}`}>
            {score}{totalScore ? `/${totalScore}` : ''}
        </span>
    );
};

/* ── Component ──────────────────────────────────────────────────── */

export const CompetitionLeaderboard = ({ competition }) => {
    const dispatch   = useDispatch();
    const submits    = useSelector(selectCompetitionSubmits);
    const pagination = useSelector(selectCompetitionSubmitPagination);
    const loading    = useSelector(selectCompetitionSubmitLoadingGet);
    const questionStats  = useSelector(selectCompetitionQuestionStats);
    const loadingStats   = useSelector(selectCompetitionLoadingQuestionStats);
    const loadingRegrade = useSelector(selectCompetitionSubmitLoadingRegrade);
    const [regradingId,  setRegradingId]  = useState(null);

    const [activeTab,   setActiveTab]   = useState('submits'); // 'submits' | 'stats'
    const [status,      setStatus]      = useState('');
    const [isGraded,    setIsGraded]    = useState('');
    const [startedFrom, setStartedFrom] = useState('');
    const [startedTo,   setStartedTo]   = useState('');
    const [page,  setPage]  = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedSubmitId, setSelectedSubmitId] = useState(null);
    const [sort, setSort] = useState({ field: 'startedAt', direction: 'desc' });
    // Track whether stats have been fetched at least once to avoid re-fetching on tab switch
    const [statsFetched, setStatsFetched] = useState(false);

    const handleSortChange = (field, direction) => {
        setSort({ field, direction });
        setPage(1);
    };

    const loadSubmits = useCallback(() => {
        if (!competition?.competitionId) return;
        dispatch(getAllCompetitionSubmitsAsync({
            competitionId: competition.competitionId,
            status:      status      || undefined,
            isGraded:    isGraded    !== '' ? isGraded : undefined,
            startedFrom: startedFrom || undefined,
            startedTo:   startedTo   || undefined,
            page,
            limit,
            sortBy:    sort.field,
            sortOrder: sort.direction,
        }));
    }, [dispatch, competition?.competitionId, status, isGraded, startedFrom, startedTo, page, limit, sort]);

    const loadStats = useCallback(() => {
        if (!competition?.competitionId) return;
        dispatch(getCompetitionQuestionStatsAsync(competition.competitionId));
        setStatsFetched(true);
    }, [dispatch, competition?.competitionId]);

    // Keep backward compat alias used by refresh button
    const load = activeTab === 'stats' ? loadStats : loadSubmits;

    useEffect(() => { loadSubmits(); }, [loadSubmits]);

    // Only fetch stats when switching to stats tab for the first time
    useEffect(() => {
        if (activeTab === 'stats' && !statsFetched) {
            loadStats();
        }
    }, [activeTab, statsFetched, loadStats]);

    const applyFilter = (setter) => (val) => { setter(val); setPage(1); };

    /* ── Columns ──────────────────────────────────────────────── */
    const columns = [
        {
            key: 'submitId',
            label: 'ID',
            render: (s) => <span className="text-xs text-foreground-lighter">#{s.submitId}</span>,
        },
        {
            key: 'student',
            label: 'Học sinh',
            render: (s) => (
                <div className="flex items-center gap-1.5 min-w-0">
                    <User size={12} className="text-foreground-lighter flex-shrink-0" />
                    <div className="min-w-0">
                        <div className="text-xs font-medium text-foreground truncate max-w-[140px]">
                            {s.student?.fullName ?? `#${s.studentId}`}
                        </div>
                        {s.student?.email && (
                            <div className="text-[10px] text-foreground-lighter truncate max-w-[140px]">
                                {s.student.email}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'attempt',
            label: 'Lần',
            render: (s) => (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                    {s.attemptNumber ?? 1}
                </span>
            ),
        },
        {
            key: 'score',
            label: 'Điểm',
            sortDirection: sort.field === 'totalPoints' ? sort.direction : null,
            onSort: (direction) => handleSortChange('totalPoints', direction),
            render: (s) => <ScoreCell score={s.totalPoints} totalScore={s.maxPoints} />,
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (s) => <StatusBadge status={s.status} />,
        },
        {
            key: 'startedAt',
            label: 'Bắt đầu',
            sortDirection: sort.field === 'startedAt' ? sort.direction : null,
            onSort: (direction) => handleSortChange('startedAt', direction),
            render: (s) => <span className="text-[10px] text-foreground-lighter">{formatDateTime(s.startedAt)}</span>,
        },
        {
            key: 'submittedAt',
            label: 'Nộp bài',
            sortDirection: sort.field === 'submittedAt' ? sort.direction : null,
            onSort: (direction) => handleSortChange('submittedAt', direction),
            render: (s) => <span className="text-[10px] text-foreground-lighter">{formatDateTime(s.submittedAt)}</span>,
        },
        {
            key: 'timeSpent',
            label: 'Thời gian làm',
            render: (s) => (
                s.timeSpentDisplay
                    ? <span className="text-[10px] text-foreground-lighter whitespace-nowrap">{s.timeSpentDisplay}</span>
                    : <span className="text-xs text-foreground-lighter italic">–</span>
            ),
        },
        {
            key: 'actions',
            label: '',
            render: (s) => {
                const id = s.competitionSubmitId ?? s.submitId;
                const isRegrading = regradingId === id && loadingRegrade;
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <button
                            title="Chấm lại"
                            disabled={isRegrading}
                            onClick={async () => {
                                setRegradingId(id);
                                await dispatch(regradeCompetitionSubmitAsync(id));
                                setRegradingId(null);
                                loadSubmits();
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed truncate transition-colors"
                        >
                            <RotateCcw size={11} className={isRegrading ? 'animate-spin' : ''} />
                            Chấm lại
                        </button>
                    </div>
                );
            },
        },
    ];

    /* ── Render ───────────────────────────────────────────────── */
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-white flex items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <Trophy size={15} className="text-yellow-500 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                            {competition?.title ?? 'Cuộc thi'}
                        </p>
                        <p className="text-xs text-foreground-lighter">
                            {loading ? '...' : `${pagination?.total ?? 0} lượt nộp bài`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={load}
                    disabled={activeTab === 'stats' ? loadingStats : loading}
                    title="Tải lại"
                    className="p-1.5 rounded hover:bg-gray-100 text-foreground-light transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={14} className={(activeTab === 'stats' ? loadingStats : loading) ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border bg-white flex-shrink-0">
                <button
                    onClick={() => setActiveTab('submits')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                        activeTab === 'submits'
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-foreground-light hover:text-foreground'
                    }`}
                >
                    <Trophy size={13} />
                    Lượt nộp bài
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                        activeTab === 'stats'
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-foreground-light hover:text-foreground'
                    }`}
                >
                    <BarChart2 size={13} />
                    Thống kê câu hỏi
                </button>
            </div>

            {/* ═══ TAB: STATS ══════════════════════════════════════ */}
            {activeTab === 'stats' && (() => {
                const questions       = questionStats?.questions ?? [];
                const totalGraded     = questionStats?.totalGradedSubmissions ?? 0;
                const totalCorrect    = questions.reduce((s, q) => s + (q.correctCount ?? 0), 0);
                const totalWrong      = questions.reduce((s, q) => s + (q.wrongCount   ?? 0), 0);

                /* ── Difficulty aggregation ── */
                const DIFF_LABELS = { NB: 'Nhận biết', TH: 'Thông hiểu', VD: 'Vận dụng', VDC: 'Vận dụng cao' };
                const DIFF_ORDER  = ['NB', 'TH', 'VD', 'VDC'];
                const DIFF_COLORS = { NB: '#3b82f6', TH: '#f59e0b', VD: '#f97316', VDC: '#ef4444' };
                const byDifficulty = {};
                questions.forEach(q => {
                    const d = q.difficulty ?? 'UNKNOWN';
                    if (!byDifficulty[d]) byDifficulty[d] = { count: 0, correct: 0, wrong: 0 };
                    byDifficulty[d].count++;
                    byDifficulty[d].correct += q.correctCount ?? 0;
                    byDifficulty[d].wrong   += q.wrongCount   ?? 0;
                });
                const diffKeys      = DIFF_ORDER.filter(k => byDifficulty[k]);
                const diffBarData   = diffKeys.map(k => ({
                    label: DIFF_LABELS[k] ?? k,
                    values: { correct: byDifficulty[k].correct, wrong: byDifficulty[k].wrong },
                }));
                const diffPieData   = diffKeys.map(k => ({
                    label: DIFF_LABELS[k] ?? k,
                    value: byDifficulty[k].count,
                    color: DIFF_COLORS[k] ?? '#94a3b8',
                }));

                /* ── Type aggregation ── */
                const TYPE_LABELS = { SINGLE_CHOICE: 'Trắc nghiệm', TRUE_FALSE: 'Đúng / Sai', SHORT_ANSWER: 'Tự luận ngắn' };
                const TYPE_COLORS = { SINGLE_CHOICE: '#6366f1', TRUE_FALSE: '#10b981', SHORT_ANSWER: '#f59e0b' };
                const byType = {};
                questions.forEach(q => {
                    const t = q.type ?? 'UNKNOWN';
                    if (!byType[t]) byType[t] = { count: 0, correct: 0, wrong: 0 };
                    byType[t].count++;
                    byType[t].correct += q.correctCount ?? 0;
                    byType[t].wrong   += q.wrongCount   ?? 0;
                });
                const typeKeys    = Object.keys(byType);
                const typeBarData = typeKeys.map(k => ({
                    label: TYPE_LABELS[k] ?? k,
                    values: { correct: byType[k].correct, wrong: byType[k].wrong },
                }));
                const typePieData = typeKeys.map(k => ({
                    label: TYPE_LABELS[k] ?? k,
                    value: byType[k].count,
                    color: TYPE_COLORS[k] ?? '#94a3b8',
                }));

                /* ── Per-question bar ── */
                const barData = questions.map((q, i) => ({
                    label: `C${q.order ?? i + 1}`,
                    values: { correct: q.correctCount ?? 0, wrong: q.wrongCount ?? 0 },
                }));
                const barSeries = [
                    { key: 'correct', label: 'Đúng',       color: '#22c55e' },
                    { key: 'wrong',   label: 'Sai/Bỏ qua', color: '#ef4444' },
                ];

                const RateCell = ({ rate }) => (
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rate >= 70 ? 'bg-green-100 text-green-700' :
                        rate >= 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}`}>
                        {rate}%
                    </span>
                );

                const StatsTable = ({ rows }) => (
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gray-100 border-b border-border">
                                <th className="px-3 py-2 text-left font-semibold text-foreground-lighter">Nhóm</th>
                                <th className="px-3 py-2 text-right font-semibold text-foreground-lighter">Số câu</th>
                                <th className="px-3 py-2 text-right font-semibold text-green-700">Đúng</th>
                                <th className="px-3 py-2 text-right font-semibold text-red-700">Sai/Bỏ</th>
                                <th className="px-3 py-2 text-right font-semibold text-foreground-lighter">Tỉ lệ đúng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => {
                                const total = r.correct + r.wrong;
                                const rate  = total > 0 ? Math.round((r.correct / total) * 100) : 0;
                                return (
                                    <tr key={i} className="border-b border-border last:border-0 hover:bg-white transition-colors">
                                        <td className="px-3 py-2 font-medium text-foreground">{r.label}</td>
                                        <td className="px-3 py-2 text-right text-foreground">{r.count}</td>
                                        <td className="px-3 py-2 text-right text-green-700 font-semibold">{r.correct}</td>
                                        <td className="px-3 py-2 text-right text-red-600 font-semibold">{r.wrong}</td>
                                        <td className="px-3 py-2 text-right"><RateCell rate={rate} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                );

                return (
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                        {loadingStats && (
                            <div className="flex items-center justify-center py-12 text-sm text-foreground-lighter">
                                <RefreshCw size={16} className="animate-spin mr-2" />Đang tải thống kê...
                            </div>
                        )}

                        {!loadingStats && (
                        <>
                        {/* ── Summary cards ── */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-50 rounded-lg border border-border p-3 text-center">
                                <p className="text-[10px] text-foreground-lighter uppercase tracking-wide">Bài đã chấm</p>
                                <p className="text-xl font-bold text-foreground mt-0.5">{totalGraded}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg border border-green-200 p-3 text-center">
                                <p className="text-[10px] text-green-700 uppercase tracking-wide">Đúng (tổng)</p>
                                <p className="text-xl font-bold text-green-700 mt-0.5">{totalCorrect}</p>
                            </div>
                            <div className="bg-red-50 rounded-lg border border-red-200 p-3 text-center">
                                <p className="text-[10px] text-red-700 uppercase tracking-wide">Sai / Bỏ qua</p>
                                <p className="text-xl font-bold text-red-700 mt-0.5">{totalWrong}</p>
                            </div>
                        </div>

                        {/* ── Section: By Difficulty ── */}
                        {diffKeys.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border pb-1">
                                Thống kê theo độ khó
                            </p>
                            {/* Pie: count per difficulty */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-lg border border-border p-3">
                                    <p className="text-[10px] text-foreground-lighter uppercase tracking-wide mb-2">Số câu theo độ khó</p>
                                    <PercentPieChart
                                        data={diffPieData}
                                        loading={false}
                                        width={150}
                                        height={150}
                                        outerRadius={55}
                                    />
                                </div>
                                <div className="bg-gray-50 rounded-lg border border-border p-3">
                                    <p className="text-[10px] text-foreground-lighter uppercase tracking-wide mb-2">Chi tiết</p>
                                    <div className="space-y-1.5">
                                        {diffKeys.map(k => (
                                            <div key={k} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: DIFF_COLORS[k] ?? '#94a3b8' }} />
                                                    <span className="text-foreground-light">{DIFF_LABELS[k] ?? k}</span>
                                                </div>
                                                <span className="font-semibold text-foreground">{byDifficulty[k].count} câu</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Stacked bar: correct/wrong per difficulty */}
                            <div className="bg-gray-50 rounded-lg border border-border p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] text-foreground-lighter uppercase tracking-wide">Đúng / Sai theo độ khó</p>
                                    <div className="flex items-center gap-3 text-[10px] text-foreground-light">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Đúng</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Sai</span>
                                    </div>
                                </div>
                                <StackedBarChart data={diffBarData} seriesConfig={barSeries} height={160} loading={false} />
                            </div>
                            {/* Table */}
                            <div className="bg-gray-50 rounded-lg border border-border overflow-hidden">
                                <StatsTable rows={diffKeys.map(k => ({
                                    label: DIFF_LABELS[k] ?? k,
                                    count: byDifficulty[k].count,
                                    correct: byDifficulty[k].correct,
                                    wrong: byDifficulty[k].wrong,
                                }))} />
                            </div>
                        </div>
                        )}

                        {/* ── Section: By Type ── */}
                        {typeKeys.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border pb-1">
                                Thống kê theo loại câu hỏi
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-lg border border-border p-3">
                                    <p className="text-[10px] text-foreground-lighter uppercase tracking-wide mb-2">Số câu theo loại</p>
                                    <PercentPieChart
                                        data={typePieData}
                                        loading={false}
                                        width={150}
                                        height={150}
                                        outerRadius={55}
                                    />
                                </div>
                                <div className="bg-gray-50 rounded-lg border border-border p-3">
                                    <p className="text-[10px] text-foreground-lighter uppercase tracking-wide mb-2">Chi tiết</p>
                                    <div className="space-y-1.5">
                                        {typeKeys.map(k => (
                                            <div key={k} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: TYPE_COLORS[k] ?? '#94a3b8' }} />
                                                    <span className="text-foreground-light">{TYPE_LABELS[k] ?? k}</span>
                                                </div>
                                                <span className="font-semibold text-foreground">{byType[k].count} câu</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Stacked bar: correct/wrong per type */}
                            <div className="bg-gray-50 rounded-lg border border-border p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] text-foreground-lighter uppercase tracking-wide">Đúng / Sai theo loại câu</p>
                                    <div className="flex items-center gap-3 text-[10px] text-foreground-light">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Đúng</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Sai</span>
                                    </div>
                                </div>
                                <StackedBarChart data={typeBarData} seriesConfig={barSeries} height={160} loading={false} />
                            </div>
                            {/* Table */}
                            <div className="bg-gray-50 rounded-lg border border-border overflow-hidden">
                                <StatsTable rows={typeKeys.map(k => ({
                                    label: TYPE_LABELS[k] ?? k,
                                    count: byType[k].count,
                                    correct: byType[k].correct,
                                    wrong: byType[k].wrong,
                                }))} />
                            </div>
                        </div>
                        )}

                        {/* ── Section: Per question ── */}
                        {questions.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border pb-1">
                                Thống kê từng câu hỏi
                            </p>
                            <div className="bg-gray-50 rounded-lg border border-border p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] text-foreground-lighter uppercase tracking-wide">Đúng / Sai theo câu</p>
                                    <div className="flex items-center gap-3 text-[10px] text-foreground-light">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Đúng</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Sai</span>
                                    </div>
                                </div>
                                <StackedBarChart data={barData} seriesConfig={barSeries} height={220} loading={false} />
                            </div>
                            <div className="bg-gray-50 rounded-lg border border-border overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-border">
                                            <th className="px-3 py-2 text-left font-semibold text-foreground-lighter">Câu</th>
                                            <th className="px-3 py-2 text-left font-semibold text-foreground-lighter">Loại</th>
                                            <th className="px-3 py-2 text-left font-semibold text-foreground-lighter">Độ khó</th>
                                            <th className="px-3 py-2 text-right font-semibold text-green-700">Đúng</th>
                                            <th className="px-3 py-2 text-right font-semibold text-red-700">Sai/Bỏ</th>
                                            <th className="px-3 py-2 text-right font-semibold text-foreground-lighter">Tỉ lệ đúng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map((q, i) => (
                                            <tr key={q.questionId ?? i} className="border-b border-border last:border-0 hover:bg-white transition-colors">
                                                <td className="px-3 py-2 font-medium text-foreground">Câu {q.order ?? i + 1}</td>
                                                <td className="px-3 py-2 text-foreground-light">{TYPE_LABELS[q.type] ?? q.type}</td>
                                                <td className="px-3 py-2">
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                                                        style={{ backgroundColor: (DIFF_COLORS[q.difficulty] ?? '#94a3b8') + '20', color: DIFF_COLORS[q.difficulty] ?? '#64748b' }}>
                                                        {DIFF_LABELS[q.difficulty] ?? q.difficulty}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-right text-green-700 font-semibold">{q.correctCount ?? 0}</td>
                                                <td className="px-3 py-2 text-right text-red-600 font-semibold">{q.wrongCount ?? 0}</td>
                                                <td className="px-3 py-2 text-right"><RateCell rate={q.correctRate ?? 0} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        )}

                        {questions.length === 0 && !loadingStats && (
                            <div className="flex flex-col items-center justify-center py-12 text-foreground-lighter gap-2">
                                <BarChart2 size={32} className="opacity-30" />
                                <p className="text-sm">Chưa có dữ liệu thống kê</p>
                            </div>
                        )}
                        </>
                        )}
                    </div>
                );
            })()}

            {/* ═══ TAB: SUBMITS ════════════════════════════════════ */}
            {activeTab === 'submits' && (<>
            <div className="px-4 py-3 border-b border-border bg-gray-50 flex-shrink-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <Dropdown
                        value={status}
                        onChange={applyFilter(setStatus)}
                        options={STATUS_OPTIONS}
                        placeholder="Trạng thái"
                        size="sm"
                    />
                    <Dropdown
                        value={isGraded}
                        onChange={applyFilter(setIsGraded)}
                        options={IS_GRADED_OPTIONS}
                        placeholder="Chấm điểm"
                        size="sm"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] text-foreground-lighter uppercase tracking-wide">Từ ngày</label>
                        <input
                            type="date"
                            value={startedFrom}
                            onChange={(e) => { setStartedFrom(e.target.value); setPage(1); }}
                            className="w-full text-xs border border-border rounded px-2 py-1.5 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] text-foreground-lighter uppercase tracking-wide">Đến ngày</label>
                        <input
                            type="date"
                            value={startedTo}
                            onChange={(e) => { setStartedTo(e.target.value); setPage(1); }}
                            className="w-full text-xs border border-border rounded px-2 py-1.5 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <Table
                    columns={columns}
                    data={submits}
                    loading={loading}
                    dense
                    emptyMessage="Không có lượt nộp bài nào"
                    onRowClick={(s) => setSelectedSubmitId(s.submitId ?? s.competitionSubmitId)}
                />
            </div>

            {/* Pagination */}
            {(pagination?.totalPages ?? 0) > 0 && (
                <div className="px-4 py-3 border-t border-border bg-white flex-shrink-0">
                    <Pagination
                        currentPage={page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.total}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                        itemsPerPage={limit}
                        onPageChange={setPage}
                        onItemsPerPageChange={(v) => { setLimit(v); setPage(1); }}
                    />
                </div>
            )}
            </>)}

            {/* Submit Detail – stacked on top of this panel */}
            <CompetitionSubmitDetail
                submitId={selectedSubmitId}
                isOpen={!!selectedSubmitId}
                onClose={() => setSelectedSubmitId(null)}
            />
        </div>
    );
};

