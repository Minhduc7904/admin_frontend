import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Table } from '../../../../shared/components/ui';
import { useRegenerateQuestionSlugs } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

export const RegenerateQuestionSlugsApiCard = () => {
    const {
        loading,
        error,
        result,
        regenerateQuestionSlugs,
        clearState,
    } = useRegenerateQuestionSlugs();

    const [isOpen, setIsOpen] = useState(false);

    const requestBody = useMemo(() => ({}), []);

    const handleExecute = async () => {
        await regenerateQuestionSlugs({});
    };

    const responseData = result?.data || result;
    const responseResults = responseData?.results || [];

    const resultColumns = [
        {
            key: 'questionId',
            label: 'Question ID',
            render: (row) => (
                <span className="text-sm text-foreground">
                    {row?.questionId ?? row?.id ?? row?.question?.id ?? '-'}
                </span>
            ),
        },
        {
            key: 'title',
            label: 'Title',
            render: (row) => (
                <span
                    className="text-sm text-foreground-light max-w-[220px] truncate block"
                    title={row?.title || row?.name || row?.questionTitle || row?.question?.title || ''}
                >
                    {row?.title || row?.name || row?.questionTitle || row?.question?.title || '-'}
                </span>
            ),
        },
        {
            key: 'slug',
            label: 'Slug',
            render: (row) => (
                <span className="text-xs text-foreground-light">
                    {row?.slug || row?.generatedSlug || row?.question?.slug || '-'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => {
                const status = row?.status ?? row?.result ?? row?.outcome ?? '-';
                const normalized = String(status).toLowerCase();
                let className = 'bg-amber-100 text-amber-700';

                if (normalized.includes('success') || normalized.includes('update')) {
                    className = 'bg-green-100 text-green-700';
                }

                if (normalized.includes('fail') || normalized.includes('error')) {
                    className = 'bg-red-100 text-red-700';
                }

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
                    <span className="text-xs text-foreground-light max-w-[260px] truncate block" title={message || ''}>
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
            path="/super-admin/questions/regenerate-slugs"
            description="Regenerate slug cho question co slug dang question-123"
            methodClassName="bg-teal-600"
            headerClassName="bg-teal-50 hover:bg-teal-100"
            pathClassName="text-teal-800"
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">Total</p>
                                <p className="text-lg font-semibold text-foreground">{responseData?.totalCandidates ?? 0}</p>
                            </div>
                            <div className="rounded-sm border border-green-200 bg-green-50 p-3">
                                <p className="text-xs text-green-700">Updated</p>
                                <p className="text-lg font-semibold text-green-700">{responseData?.updatedCount ?? 0}</p>
                            </div>
                            <div className="rounded-sm border border-amber-200 bg-amber-50 p-3">
                                <p className="text-xs text-amber-700">Skipped</p>
                                <p className="text-lg font-semibold text-amber-700">{responseData?.skippedCount ?? 0}</p>
                            </div>
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">Results</p>
                                <p className="text-lg font-semibold text-foreground">
                                    {Array.isArray(responseResults) ? responseResults.length : 0}
                                </p>
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
