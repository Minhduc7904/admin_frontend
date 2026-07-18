import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    Button,
    Dropdown,
    Input,
    Pagination,
    StatsCard,
    StatsGrid,
    Table,
} from '../../../shared/components/ui';
import { useSearch } from '../../../shared/hooks';
import { formatDateTime } from '../../../shared/utils';
import { CompetitionSubmitDetail } from '../../competitionSubmit/components/CompetitionSubmitDetail';
import {
    getStudentCompetitionSubmitsAsync,
    selectCompetitionSubmitLoadingGetByStudent,
    selectStudentCompetitionSubmitPagination,
    selectStudentCompetitionSubmits,
} from '../../competitionSubmit/store/competitionSubmitSlice';

const GRADED_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái chấm' },
    { value: 'true', label: 'Đã chấm' },
    { value: 'false', label: 'Chưa chấm' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'IN_PROGRESS', label: 'Đang làm' },
    { value: 'SUBMITTED', label: 'Đã nộp' },
    { value: 'GRADED', label: 'Đã chấm' },
    { value: 'ABANDONED', label: 'Bỏ giữa chừng' },
];

const SORT_OPTIONS = [
    { value: 'startedAt:desc', label: 'Bắt đầu mới nhất' },
    { value: 'submittedAt:desc', label: 'Nộp mới nhất' },
    { value: 'gradedAt:desc', label: 'Chấm mới nhất' },
    { value: 'totalPoints:desc', label: 'Điểm cao nhất' },
    { value: 'totalPoints:asc', label: 'Điểm thấp nhất' },
    { value: 'attemptNumber:desc', label: 'Lần làm mới nhất' },
];

const STATUS_BADGES = {
    IN_PROGRESS: 'bg-blue-50 text-blue-700',
    SUBMITTED: 'bg-emerald-50 text-emerald-700',
    GRADED: 'bg-violet-50 text-violet-700',
    ABANDONED: 'bg-gray-100 text-gray-600',
};

const STATUS_LABELS = {
    IN_PROGRESS: 'Đang làm',
    SUBMITTED: 'Đã nộp',
    GRADED: 'Đã chấm',
    ABANDONED: 'Bỏ giữa chừng',
};

const toNumberOrUndefined = (value) => {
    if (value === '' || value == null) return undefined;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? undefined : numberValue;
};

const toBooleanOrUndefined = (value) => {
    if (value === '') return undefined;
    return value === 'true';
};

const formatDuration = (seconds) => {
    if (seconds == null) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes <= 0) return `${remainingSeconds}s`;
    return `${minutes}p ${remainingSeconds}s`;
};

const StatusBadge = ({ status }) => (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGES[status] ?? 'bg-gray-100 text-gray-600'}`}>
        {STATUS_LABELS[status] ?? status ?? '-'}
    </span>
);

const scoreText = (submit) => {
    if (submit.totalPoints == null && submit.maxPoints == null) return '-';
    if (submit.maxPoints == null) return submit.totalPoints;
    return `${submit.totalPoints ?? 0}/${submit.maxPoints}`;
};

export const StudentCompetitionSubmits = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const studentId = Number(id);

    const submits = useSelector(selectStudentCompetitionSubmits);
    const pagination = useSelector(selectStudentCompetitionSubmitPagination);
    const loading = useSelector(selectCompetitionSubmitLoadingGetByStudent);

    const { search, debouncedSearch, handleSearchChange } = useSearch('', 500);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [filters, setFilters] = useState({
        status: '',
        isGraded: '',
        sort: 'startedAt:desc',
        startedFrom: '',
        startedTo: '',
        submittedFrom: '',
        submittedTo: '',
        competitionId: '',
        graderId: '',
    });
    const [selectedSubmitId, setSelectedSubmitId] = useState(null);

    const loadSubmits = useCallback(() => {
        if (!studentId || Number.isNaN(studentId)) return;
        const [sortBy, sortOrder] = filters.sort.split(':');
        dispatch(getStudentCompetitionSubmitsAsync({
            studentId,
            params: {
                page,
                limit,
                search: debouncedSearch || undefined,
                status: filters.status || undefined,
                isGraded: toBooleanOrUndefined(filters.isGraded),
                startedFrom: filters.startedFrom || undefined,
                startedTo: filters.startedTo || undefined,
                submittedFrom: filters.submittedFrom || undefined,
                submittedTo: filters.submittedTo || undefined,
                competitionId: toNumberOrUndefined(filters.competitionId),
                graderId: toNumberOrUndefined(filters.graderId),
                sortBy,
                sortOrder,
            },
        }));
    }, [debouncedSearch, dispatch, filters, limit, page, studentId]);

    useEffect(() => {
        loadSubmits();
    }, [loadSubmits]);

    const updateFilter = (changes) => {
        setFilters((current) => ({ ...current, ...changes }));
        setPage(1);
    };

    const columns = useMemo(() => [
        {
            key: 'competition',
            label: 'Competition',
            render: (submit) => (
                <div className="min-w-[220px]">
                    <p className="font-medium text-foreground">{submit.competition?.title || `Competition #${submit.competitionId ?? '-'}`}</p>
                    <p className="mt-1 text-xs text-foreground-light">Lần {submit.attemptNumber ?? 1}</p>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (submit) => <StatusBadge status={submit.status} />,
        },
        {
            key: 'score',
            label: 'Điểm',
            align: 'right',
            render: (submit) => <span className="text-sm font-semibold text-foreground">{scoreText(submit)}</span>,
        },
        {
            key: 'startedAt',
            label: 'Bắt đầu',
            render: (submit) => <span className="text-sm text-foreground">{formatDateTime(submit.startedAt)}</span>,
        },
        {
            key: 'submittedAt',
            label: 'Nộp lúc',
            render: (submit) => <span className="text-sm text-foreground-light">{formatDateTime(submit.submittedAt)}</span>,
        },
        {
            key: 'timeSpentSeconds',
            label: 'Thời gian',
            render: (submit) => <span className="text-sm text-foreground-light">{formatDuration(submit.timeSpentSeconds)}</span>,
        },
        {
            key: 'grader',
            label: 'Người chấm',
            render: (submit) => <span className="text-sm text-foreground-light">{submit.grader?.fullName || '-'}</span>,
        },
        {
            key: 'action',
            label: '',
            align: 'right',
            render: (submit) => (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                        event.stopPropagation();
                        setSelectedSubmitId(submit.competitionSubmitId ?? submit.submitId);
                    }}
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ], []);

    return (
        <>
            <div className="mb-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Lượt thi</h1>
                    <p className="text-sm text-foreground-light">Danh sách lượt thi Competition của học sinh</p>
                </div>

                <StatsGrid cols={3} className="mb-4">
                    <StatsCard label="Tổng lượt thi" value={pagination.total} loading={loading} />
                    <StatsCard label="Đã chấm" value={submits.filter((submit) => submit.status === 'GRADED' || submit.gradedAt).length} variant="success" />
                    <StatsCard label="Đã nộp" value={submits.filter((submit) => submit.status === 'SUBMITTED').length} variant="info" />
                </StatsGrid>

                <div className="grid grid-cols-1 gap-3 rounded-sm border border-border bg-white p-4 lg:grid-cols-4">
                    <Input
                        label="Tìm kiếm"
                        value={search}
                        onChange={(event) => { handleSearchChange(event.target.value); setPage(1); }}
                        placeholder="Tên competition, nhận xét..."
                    />
                    <Dropdown label="Trạng thái" value={filters.status} onChange={(status) => updateFilter({ status })} options={STATUS_OPTIONS} />
                    <Dropdown label="Trạng thái chấm" value={filters.isGraded} onChange={(isGraded) => updateFilter({ isGraded })} options={GRADED_OPTIONS} />
                    <Dropdown label="Sắp xếp" value={filters.sort} onChange={(sort) => updateFilter({ sort })} options={SORT_OPTIONS} />
                    <Input label="Mã Competition" type="number" value={filters.competitionId} onChange={(event) => updateFilter({ competitionId: event.target.value })} />
                    <Input label="Mã người chấm" type="number" value={filters.graderId} onChange={(event) => updateFilter({ graderId: event.target.value })} />
                    <Input label="Bắt đầu từ ngày" type="date" value={filters.startedFrom} onChange={(event) => updateFilter({ startedFrom: event.target.value })} />
                    <Input label="Bắt đầu đến ngày" type="date" value={filters.startedTo} onChange={(event) => updateFilter({ startedTo: event.target.value })} />
                    <Input label="Nộp từ ngày" type="date" value={filters.submittedFrom} onChange={(event) => updateFilter({ submittedFrom: event.target.value })} />
                    <Input label="Nộp đến ngày" type="date" value={filters.submittedTo} onChange={(event) => updateFilter({ submittedTo: event.target.value })} />
                </div>
            </div>

            <div className="rounded-sm border border-border bg-white">
                <Table
                    columns={columns}
                    data={submits}
                    loading={loading}
                    emptyMessage="Không có lượt thi"
                    emptyIcon="trophy"
                    onRowClick={(submit) => setSelectedSubmitId(submit.competitionSubmitId ?? submit.submitId)}
                />
                <div className="border-t border-border p-4">
                    <Pagination
                        currentPage={page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.total}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                        itemsPerPage={limit}
                        onPageChange={setPage}
                        onItemsPerPageChange={(value) => { setLimit(value); setPage(1); }}
                    />
                </div>
            </div>

            <CompetitionSubmitDetail
                submitId={selectedSubmitId}
                isOpen={!!selectedSubmitId}
                onClose={() => setSelectedSubmitId(null)}
                allowQuestionEdit={false}
            />
        </>
    );
};
