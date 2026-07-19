import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    Button,
    Dropdown,
    Input,
    Pagination,
    RightPanel,
    StatsCard,
    StatsGrid,
    Table,
} from '../../../shared/components/ui';
import { useSearch } from '../../../shared/hooks';
import { formatDateTime } from '../../../shared/utils';
import { HomeworkSubmissionPanel } from '../../homeworkSubmit/components/HomeworkSubmissionPanel';
import {
    getStudentHomeworkSubmitsAsync,
    selectHomeworkSubmitLoadingGetByStudent,
    selectStudentHomeworkSubmitPagination,
    selectStudentHomeworkSubmits,
} from '../../homeworkSubmit/store/homeworkSubmitSlice';

const GRADED_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'true', label: 'Đã chấm' },
    { value: 'false', label: 'Chưa chấm' },
];

const SORT_OPTIONS = [
    { value: 'submitAt:desc', label: 'Nộp mới nhất' },
    { value: 'submitAt:asc', label: 'Nộp cũ nhất' },
    { value: 'gradedAt:desc', label: 'Chấm mới nhất' },
    { value: 'points:desc', label: 'Điểm cao nhất' },
    { value: 'points:asc', label: 'Điểm thấp nhất' },
];

const toNumberOrUndefined = (value) => {
    if (value === '' || value == null) return undefined;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? undefined : numberValue;
};

const toBooleanOrUndefined = (value) => {
    if (value === '') return undefined;
    return value === 'true';
};

const getHomeworkTitle = (submit) => (
    submit.homeworkContent?.learningItem?.title
    || submit.homeworkContent?.title
    || submit.learningItem?.title
    || `Bài tập #${submit.homeworkContentId ?? submit.homeworkContent?.homeworkContentId ?? '-'}`
);

const ScoreBadge = ({ submit }) => (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${submit.points == null ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-700'}`}>
        {submit.points == null ? 'Chưa chấm' : `${submit.points} điểm`}
    </span>
);

export const StudentHomeworkSubmits = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const studentId = Number(id);

    const submits = useSelector(selectStudentHomeworkSubmits);
    const pagination = useSelector(selectStudentHomeworkSubmitPagination);
    const loading = useSelector(selectHomeworkSubmitLoadingGetByStudent);

    const { search, debouncedSearch, handleSearchChange } = useSearch('', 500);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [filters, setFilters] = useState({
        isGraded: '',
        sort: 'submitAt:desc',
        submittedFrom: '',
        submittedTo: '',
        homeworkContentId: '',
        competitionId: '',
        graderId: '',
    });
    const [selectedSubmit, setSelectedSubmit] = useState(null);

    const loadSubmits = useCallback(() => {
        if (!studentId || Number.isNaN(studentId)) return;
        const [sortBy, sortOrder] = filters.sort.split(':');
        dispatch(getStudentHomeworkSubmitsAsync({
            studentId,
            params: {
                page,
                limit,
                search: debouncedSearch || undefined,
                isGraded: toBooleanOrUndefined(filters.isGraded),
                submittedFrom: filters.submittedFrom || undefined,
                submittedTo: filters.submittedTo || undefined,
                homeworkContentId: toNumberOrUndefined(filters.homeworkContentId),
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

    const selectedHomework = useMemo(() => {
        if (!selectedSubmit) return null;
        const homeworkContent = selectedSubmit.homeworkContent ?? {};
        return {
            ...homeworkContent,
            homeworkContentId: homeworkContent.homeworkContentId ?? selectedSubmit.homeworkContentId,
            type: homeworkContent.type ?? selectedSubmit.type,
            content: homeworkContent.content ?? homeworkContent.learningItem?.title ?? getHomeworkTitle(selectedSubmit),
        };
    }, [selectedSubmit]);

    const columns = useMemo(() => [
        {
            key: 'title',
            label: 'Bài tập',
            render: (submit) => (
                <div className="min-w-[220px]">
                    <p className="font-medium text-foreground">{getHomeworkTitle(submit)}</p>
                    {submit.competition?.title && (
                        <p className="mt-1 text-xs text-foreground-light">Competition: {submit.competition.title}</p>
                    )}
                </div>
            ),
        },
        {
            key: 'submitAt',
            label: 'Nộp lúc',
            render: (submit) => <span className="text-sm text-foreground">{formatDateTime(submit.submitAt)}</span>,
        },
        {
            key: 'gradedAt',
            label: 'Chấm lúc',
            render: (submit) => <span className="text-sm text-foreground-light">{formatDateTime(submit.gradedAt)}</span>,
        },
        {
            key: 'points',
            label: 'Điểm',
            align: 'right',
            render: (submit) => <ScoreBadge submit={submit} />,
        },
        {
            key: 'action',
            label: '',
            align: 'right',
            render: (submit) => (
                <Button size="sm" variant="outline" onClick={(event) => { event.stopPropagation(); setSelectedSubmit(submit); }}>
                    Xem chi tiết
                </Button>
            ),
        },
    ], []);

    return (
        <>
            <div className="mb-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold">Bài tập về nhà</h1>
                        <p className="text-sm text-foreground-light">Danh sách bài tập về nhà học sinh đã nộp</p>
                    </div>
                </div>

                <StatsGrid cols={3} className="mb-4">
                    <StatsCard label="Tổng bài nộp" value={pagination.total} loading={loading} />
                    <StatsCard label="Đã chấm" value={submits.filter((submit) => submit.points != null).length} variant="success" />
                    <StatsCard label="Chưa chấm" value={submits.filter((submit) => submit.points == null).length} variant="warning" />
                </StatsGrid>

                <div className="grid grid-cols-1 gap-3 rounded-sm border border-border bg-white p-4 lg:grid-cols-4">
                    <Input
                        label="Tìm kiếm"
                        value={search}
                        onChange={(event) => { handleSearchChange(event.target.value); setPage(1); }}
                        placeholder="Tên bài tập, nội dung, nhận xét..."
                    />
                    <Dropdown label="Trạng thái" value={filters.isGraded} onChange={(isGraded) => updateFilter({ isGraded })} options={GRADED_OPTIONS} />
                    <Dropdown label="Sắp xếp" value={filters.sort} onChange={(sort) => updateFilter({ sort })} options={SORT_OPTIONS} />
                    <Input label="Mã bài tập" type="number" value={filters.homeworkContentId} onChange={(event) => updateFilter({ homeworkContentId: event.target.value })} />
                    <Input label="Mã Competition" type="number" value={filters.competitionId} onChange={(event) => updateFilter({ competitionId: event.target.value })} />
                    <Input label="Mã người chấm" type="number" value={filters.graderId} onChange={(event) => updateFilter({ graderId: event.target.value })} />
                    <Input label="Nộp từ ngày" type="date" value={filters.submittedFrom} onChange={(event) => updateFilter({ submittedFrom: event.target.value })} />
                    <Input label="Nộp đến ngày" type="date" value={filters.submittedTo} onChange={(event) => updateFilter({ submittedTo: event.target.value })} />
                </div>
            </div>

            <div className="rounded-sm border border-border bg-white">
                <Table
                    columns={columns}
                    data={submits}
                    loading={loading}
                    emptyMessage="Không có bài tập về nhà"
                    emptyIcon="file"
                    onRowClick={setSelectedSubmit}
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

            <RightPanel
                isOpen={!!selectedSubmit}
                title="Chi tiết bài tập về nhà"
                onClose={() => setSelectedSubmit(null)}
                width="w-[760px]"
            >
                {selectedHomework && (
                    <HomeworkSubmissionPanel
                        homework={selectedHomework}
                        studentId={studentId}
                        initialSubmitId={selectedSubmit?.homeworkSubmitId}
                        isOpen={!!selectedSubmit}
                    />
                )}
            </RightPanel>
        </>
    );
};
