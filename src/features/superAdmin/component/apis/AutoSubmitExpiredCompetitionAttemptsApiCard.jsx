import { useMemo, useState } from 'react';
import { Clock3, RotateCcw } from 'lucide-react';
import { Button, Table } from '../../../../shared/components/ui';
import { useAutoSubmitExpiredCompetitionAttempts } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

const REASON_LABELS = {
    ATTEMPT_TIME_EXPIRED: 'Hết thời gian làm bài',
    COMPETITION_ENDED: 'Cuộc thi đã kết thúc',
};

const resultColumns = [
    { key: 'competitionSubmitId', label: 'Mã lượt thi', render: (row) => <span className="text-sm text-foreground">#{row?.competitionSubmitId ?? '-'}</span> },
    { key: 'studentId', label: 'Học sinh', render: (row) => <span className="text-sm text-foreground-light">#{row?.studentId ?? '-'}</span> },
    { key: 'reason', label: 'Lý do', render: (row) => <span className="text-xs text-foreground-light">{REASON_LABELS[row?.reason] || row?.reason || '-'}</span> },
    { key: 'reasonMessage', label: 'Chi tiết', render: (row) => <span className="text-xs text-foreground-light">{row?.reasonMessage || '-'}</span> },
];

export const AutoSubmitExpiredCompetitionAttemptsApiCard = () => {
    const { loading, error, result, autoSubmitExpiredCompetitionAttempts, clearState } = useAutoSubmitExpiredCompetitionAttempts();
    const [isOpen, setIsOpen] = useState(false);
    const requestBody = useMemo(() => ({}), []);
    const responseData = result?.data || result;
    const resultGroups = [
        { key: 'submitted', label: 'Đã tự nộp', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
        { key: 'skipped', label: 'Bỏ qua', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
        { key: 'failed', label: 'Thất bại', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
    ];

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            method="POST"
            path="/super-admin/competitions/auto-submit-expired-attempts"
            description="Tự động nộp các lượt thi đang làm đã hết thời gian"
            methodClassName="bg-violet-600"
            headerClassName="bg-violet-50 hover:bg-violet-100"
            pathClassName="text-violet-800"
        >
            <div className="space-y-4">
                <ApiErrorAlert message={error} />
                <div className="rounded-sm border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900">
                    Hệ thống sẽ chỉ tự nộp lượt đang <code>IN_PROGRESS</code> khi đã hết <code>durationMinutes</code> hoặc cuộc thi đã qua <code>endDate</code>. Không có body hoặc query params.
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={autoSubmitExpiredCompetitionAttempts} loading={loading} disabled={loading}>
                        <Clock3 size={14} /> Kiểm tra và tự nộp
                    </Button>
                    <Button variant="outline" onClick={clearState} disabled={loading}>
                        <RotateCcw size={14} /> Clear Response
                    </Button>
                </div>
                <ApiJsonPreview title="Request body" value={requestBody} />
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Response</h2>
                {!result ? <ApiResponsePlaceholder message="Chưa có dữ liệu phản hồi. Hãy bấm Kiểm tra và tự nộp." /> : <>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {[
                            { label: 'Đang làm', value: responseData?.inProgressCount ?? 0 },
                            { label: 'Đủ điều kiện', value: responseData?.eligibleCount ?? 0 },
                            { label: 'Đã tự nộp', value: responseData?.submittedCount ?? 0 },
                            { label: 'Thất bại', value: responseData?.failedCount ?? 0 },
                        ].map((item) => <div key={item.label} className="rounded-sm border border-border bg-gray-50 p-3"><p className="text-xs text-foreground-light">{item.label}</p><p className="mt-1 text-lg font-semibold text-foreground">{item.value}</p></div>)}
                    </div>
                    {responseData?.checkedAt && <p className="text-xs text-foreground-light">Thời điểm kiểm tra: {new Date(responseData.checkedAt).toLocaleString('vi-VN')}</p>}
                    <ApiJsonPreview title="Raw JSON" value={result} className="max-h-[320px] overflow-auto rounded-sm border border-gray-800 bg-gray-900 p-3 text-xs text-blue-200" />
                    {resultGroups.map((group) => {
                        const rows = Array.isArray(responseData?.[group.key]) ? responseData[group.key] : [];
                        return <div key={group.key} className="space-y-2"><p className={`text-xs font-semibold uppercase tracking-wide ${group.color}`}>{group.label} ({rows.length})</p><div className={`overflow-hidden rounded-sm border ${group.bg}`}><Table columns={resultColumns} data={rows} loading={false} emptyMessage={`Không có lượt thi ${group.label.toLowerCase()}`} /></div></div>;
                    })}
                </>}
            </div>
        </ApiEndpointCard>
    );
};
