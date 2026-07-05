import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Table } from '../../../../shared/components/ui';
import { useSyncPermissionsFromCodes } from '../../hooks';
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

export const SyncPermissionsFromCodesApiCard = () => {
    const {
        loading,
        error,
        result,
        syncPermissionsFromCodes,
        clearState,
    } = useSyncPermissionsFromCodes();
    const [isOpen, setIsOpen] = useState(false);

    const requestBody = useMemo(() => ({}), []);
    const responseData = result?.data || result;
    const permissions = Array.isArray(responseData?.permissions) ? responseData.permissions : [];
    const duplicateCodes = Array.isArray(responseData?.duplicateCodes) ? responseData.duplicateCodes : [];

    const permissionColumns = [
        {
            key: 'code',
            label: 'Code',
            render: (row) => (
                <code className="text-xs text-foreground">
                    {row?.code || row?.permission?.code || '-'}
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
                    {row?.name || row?.permission?.name || '-'}
                </span>
            ),
        },
        {
            key: 'group',
            label: 'Group',
            render: (row) => (
                <span className="text-xs text-foreground-light">
                    {row?.group || row?.groupName || row?.permission?.group || '-'}
                </span>
            ),
        },
    ];

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            method="POST"
            path="/super-admin/permissions/sync-from-codes"
            description="Đồng bộ permission codes từ source constants vào DB"
            methodClassName="bg-sky-600"
            headerClassName="bg-sky-50 hover:bg-sky-100"
            pathClassName="text-sky-800"
        >
            <div className="space-y-4">
                <ApiErrorAlert message={error} />

                <div className="rounded-sm border border-border bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">
                        Input
                    </p>
                    <p className="mt-2 text-sm text-foreground-light">
                        API này không cần body hoặc query params. Backend đọc permission codes từ source constants và upsert vào DB.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={syncPermissionsFromCodes} loading={loading} disabled={loading}>
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
                                Permissions
                            </p>
                            <div className="overflow-hidden rounded-sm border border-border">
                                <Table
                                    columns={permissionColumns}
                                    data={permissions}
                                    loading={false}
                                    emptyMessage="Response không có danh sách permissions"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ApiEndpointCard>
    );
};
