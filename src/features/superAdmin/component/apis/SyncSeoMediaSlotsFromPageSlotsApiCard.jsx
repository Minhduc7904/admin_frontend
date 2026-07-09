import { useMemo, useState } from 'react';
import { ImageUp, RotateCcw } from 'lucide-react';
import { Button, Table } from '../../../../shared/components/ui';
import { useSyncSeoMediaSlotsFromPageSlots } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

const summaryItems = [
    { key: 'totalFromSource', label: 'Từ source' },
    { key: 'totalUnique', label: 'Unique' },
    { key: 'createdCount', label: 'Tạo mới' },
    { key: 'updatedCount', label: 'Cập nhật' },
    { key: 'unchangedCount', label: 'Không đổi' },
];

export const SyncSeoMediaSlotsFromPageSlotsApiCard = () => {
    const {
        loading,
        error,
        result,
        syncSeoMediaSlotsFromPageSlots,
        clearState,
    } = useSyncSeoMediaSlotsFromPageSlots();
    const [isOpen, setIsOpen] = useState(false);

    const requestBody = useMemo(() => ({}), []);
    const responseData = result?.data || result;
    const slots = Array.isArray(responseData?.slots) ? responseData.slots : [];
    const duplicateCodes = Array.isArray(responseData?.duplicateCodes)
        ? responseData.duplicateCodes
        : [];

    const slotColumns = [
        {
            key: 'code',
            label: 'Code',
            render: (row) => (
                <code className="text-xs text-foreground">
                    {row?.code || row?.slot?.code || '-'}
                </code>
            ),
        },
        {
            key: 'action',
            label: 'Action',
            render: (row) => (
                <span className="text-xs text-foreground-light">
                    {row?.action || row?.status || row?.result || '-'}
                </span>
            ),
        },
        {
            key: 'name',
            label: 'Name',
            render: (row) => (
                <span className="text-sm text-foreground-light">
                    {row?.name || row?.slot?.name || '-'}
                </span>
            ),
        },
        {
            key: 'pageKey',
            label: 'Page',
            render: (row) => (
                <span className="text-xs text-foreground-light">
                    {row?.pageKey || row?.slot?.pageKey || row?.metadata?.pageKey || '-'}
                </span>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (row) => (
                <span className="text-xs text-foreground-light">
                    {row?.type || row?.slot?.type || '-'}
                </span>
            ),
        },
    ];

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            method="POST"
            path="/super-admin/seo-media/slots/sync-from-page-slots"
            description="Đồng bộ SEO media slots từ PAGE_SEO_MEDIA_SLOTS vào DB"
            methodClassName="bg-indigo-600"
            headerClassName="bg-indigo-50 hover:bg-indigo-100"
            pathClassName="text-indigo-800"
        >
            <div className="space-y-4">
                <ApiErrorAlert message={error} />

                <div className="rounded-sm border border-border bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">
                        Input
                    </p>
                    <p className="mt-2 text-sm text-foreground-light">
                        API này không cần body hoặc query params. Backend đọc PAGE_SEO_MEDIA_SLOTS từ source constants,
                        flatten theo pageKey.slotKey và upsert slot theo code.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={syncSeoMediaSlotsFromPageSlots} loading={loading} disabled={loading}>
                        <ImageUp size={14} />
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
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Response</h2>

                {!result ? (
                    <ApiResponsePlaceholder message="Chưa có dữ liệu phản hồi. Hãy bấm Execute." />
                ) : (
                    <>
                        <ApiJsonPreview
                            title="Raw JSON"
                            value={result}
                            className="max-h-[320px] overflow-auto rounded-sm border border-gray-800 bg-gray-900 p-3 text-xs text-blue-200"
                        />

                        <div className="grid gap-3 md:grid-cols-5">
                            {summaryItems.map((item) => (
                                <div key={item.key} className="rounded-sm border border-border bg-gray-50 p-3">
                                    <p className="text-xs text-foreground-light">{item.label}</p>
                                    <p className="mt-1 text-lg font-semibold text-foreground">
                                        {responseData?.[item.key] ?? 0}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {responseData?.source && (
                            <div className="rounded-sm border border-border bg-gray-50 p-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">
                                    Source
                                </p>
                                <code className="mt-2 block break-all text-xs text-foreground">
                                    {responseData.source}
                                </code>
                            </div>
                        )}

                        {duplicateCodes.length > 0 && (
                            <div className="rounded-sm border border-yellow-200 bg-yellow-50 p-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                                    Duplicate codes
                                </p>
                                <ApiJsonPreview
                                    title="duplicateCodes"
                                    value={duplicateCodes}
                                    className="mt-2 max-h-[180px] overflow-auto rounded-sm border border-yellow-200 bg-white p-3 text-xs text-yellow-900"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">
                                Slots
                            </p>
                            <div className="overflow-hidden rounded-sm border border-border">
                                <Table
                                    columns={slotColumns}
                                    data={slots}
                                    loading={false}
                                    emptyMessage="Response không có danh sách slots"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ApiEndpointCard>
    );
};
