import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Trophy, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import {
    getAllCompetitionSubmitsAsync,
    selectCompetitionSubmits,
    selectCompetitionSubmitPagination,
    selectCompetitionSubmitLoadingGet,
} from '../../competitionSubmit/store/competitionSubmitSlice';
import { Dropdown, Table } from '../../../shared/components/ui';
import { Pagination } from '../../../shared/components/ui/Pagination';

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

    const [status,      setStatus]      = useState('');
    const [isGraded,    setIsGraded]    = useState('');
    const [startedFrom, setStartedFrom] = useState('');
    const [startedTo,   setStartedTo]   = useState('');
    const [page,  setPage]  = useState(1);
    const [limit, setLimit] = useState(10);

    const load = useCallback(() => {
        if (!competition?.competitionId) return;
        dispatch(getAllCompetitionSubmitsAsync({
            competitionId: competition.competitionId,
            status:      status      || undefined,
            isGraded:    isGraded    !== '' ? isGraded : undefined,
            startedFrom: startedFrom || undefined,
            startedTo:   startedTo   || undefined,
            page,
            limit,
            sortBy:    'startedAt',
            sortOrder: 'desc',
        }));
    }, [dispatch, competition?.competitionId, status, isGraded, startedFrom, startedTo, page, limit]);

    useEffect(() => { load(); }, [load]);

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
            render: (s) => <ScoreCell score={s.totalPoints} totalScore={s.maxPoints} />,
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (s) => <StatusBadge status={s.status} />,
        },
        {
            key: 'graded',
            label: 'Chấm',
            render: (s) => s.isGraded
                ? <CheckCircle2 size={14} className="text-green-500" />
                : <XCircle size={14} className="text-gray-300" />,
        },
        {
            key: 'startedAt',
            label: 'Bắt đầu',
            render: (s) => <span className="text-[10px] text-foreground-lighter">{formatDateTime(s.startedAt)}</span>,
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
                    disabled={loading}
                    title="Tải lại"
                    className="p-1.5 rounded hover:bg-gray-100 text-foreground-light transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Filters */}
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
        </div>
    );
};

