import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Table } from '../../../../shared/components/ui';
import { useCleanupUnusedMediaOlderThan30Days } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

export const CleanupUnusedMediaOlderThan30DaysApiCard = () => {
    const {
        loading,
        error,
        result,
        cleanupUnusedMediaOlderThan30Days,
        clearState,
    } = useCleanupUnusedMediaOlderThan30Days();

    const [isOpen, setIsOpen] = useState(false);

    const requestBody = useMemo(() => ({}), []);

    const handleExecute = async () => {
        await cleanupUnusedMediaOlderThan30Days({});
    };

    const responseData = result?.data || result;
    const responseResults = responseData?.results || [];

    const resultColumns = [
        {
            key: 'mediaId',
            label: 'Media ID',
            render: (row) => (
                <span className="text-sm text-foreground">
                    {row?.mediaId ?? row?.id ?? row?.media?.mediaId ?? '-'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => {
                const status = row?.status ?? row?.result ?? row?.outcome ?? '-';
                const isSuccess = String(status).toLowerCase().includes('delete') || String(status).toLowerCase().includes('success');
                const isFailed = String(status).toLowerCase().includes('fail') || String(status).toLowerCase().includes('error');

                const className = isFailed
                    ? 'bg-red-100 text-red-700'
                    : isSuccess
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700';

                return (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
                        {status}
                    </span>
                );
            },
        },
        {
            key: 'message',
            label: 'Message',
            render: (row) => {
                const message = row?.message ?? row?.reason ?? row?.error ?? row?.errorMessage ?? '-';
                return (
                    <span className="text-xs text-foreground-light max-w-[360px] truncate block" title={message || ''}>
                        {message || '-'}
                    </span>
                );
            },
        },
    ];

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            method="POST"
            path="/super-admin/cleanup-unused-media-older-than-30-days"
            description="Tim va xoa media khong co usage va da tao qua 30 ngay"
            methodClassName="bg-rose-600"
            headerClassName="bg-rose-50 hover:bg-rose-100"
            pathClassName="text-rose-800"
        >
            <div className="space-y-4">
                <ApiErrorAlert message={error} />

                <div className="flex items-center gap-2">
                    <Button onClick={handleExecute} loading={loading} disabled={loading}>
                        Execute
                    </Button>
                    <Button variant="outline" onClick={clearState} disabled={loading}>
                        <RotateCcw size={14} />
                        Clear Response
                    </Button>
                </div>

                <ApiJsonPreview title="Request body" value={requestBody} />
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Response</h2>

                {!result ? (
                    <ApiResponsePlaceholder message="Chua co du lieu phan hoi. Hay bam Execute." />
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">olderThanDays</p>
                                <p className="text-lg font-semibold text-foreground">{responseData?.olderThanDays ?? 30}</p>
                            </div>
                            <div className="rounded-sm border border-border p-3 col-span-1 md:col-span-2">
                                <p className="text-xs text-foreground-light">cutoffDate</p>
                                <p className="text-sm font-medium text-foreground">{responseData?.cutoffDate || '-'}</p>
                            </div>
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">Candidates</p>
                                <p className="text-lg font-semibold text-foreground">{responseData?.totalCandidates ?? 0}</p>
                            </div>
                            <div className="rounded-sm border border-green-200 bg-green-50 p-3">
                                <p className="text-xs text-green-700">Deleted</p>
                                <p className="text-lg font-semibold text-green-700">{responseData?.deletedCount ?? 0}</p>
                            </div>
                            <div className="rounded-sm border border-amber-200 bg-amber-50 p-3">
                                <p className="text-xs text-amber-700">Skipped</p>
                                <p className="text-lg font-semibold text-amber-700">{responseData?.skippedCount ?? 0}</p>
                            </div>
                            <div className="rounded-sm border border-red-200 bg-red-50 p-3">
                                <p className="text-xs text-red-700">Failed</p>
                                <p className="text-lg font-semibold text-red-700">{responseData?.failedCount ?? 0}</p>
                            </div>
                        </div>

                        <ApiJsonPreview
                            title="Raw JSON"
                            value={result}
                            className="text-xs bg-gray-900 text-blue-200 rounded-sm p-3 overflow-auto border border-gray-800 max-h-[320px]"
                        />

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-foreground-light uppercase tracking-wide">Results</p>
                            <div className="border border-border rounded-sm overflow-hidden">
                                <Table
                                    columns={resultColumns}
                                    data={Array.isArray(responseResults) ? responseResults : []}
                                    loading={false}
                                    emptyMessage="Khong co ban ghi ket qua"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ApiEndpointCard>
    );
};
