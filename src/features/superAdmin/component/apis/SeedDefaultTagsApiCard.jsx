import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Table } from '../../../../shared/components/ui';
import { useSeedDefaultTags } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

const seedOrder = [
    { type: 'CHAPTER', source: 'CHAPTERS' },
    { type: 'SUBJECT', source: 'SUBJECTS' },
    { type: 'DOCUMENT_TYPE', source: 'DOCUMENT_TYPE_TAGS' },
];

export const SeedDefaultTagsApiCard = () => {
    const { loading, error, result, seedDefaultTags, clearState } = useSeedDefaultTags();
    const [isOpen, setIsOpen] = useState(false);
    const requestBody = useMemo(() => ({}), []);

    const responseData = result?.data || result;
    const responseResults = Array.isArray(responseData?.results)
        ? responseData.results
        : Array.isArray(responseData)
            ? responseData
            : [];

    const resultColumns = [
        {
            key: 'type',
            label: 'Type',
            render: (row) => <span className="text-sm text-foreground">{row?.type || row?.tagType || '-'}</span>,
        },
        {
            key: 'name',
            label: 'Name',
            render: (row) => <span className="text-sm text-foreground-light">{row?.name || row?.tag?.name || '-'}</span>,
        },
        {
            key: 'slug',
            label: 'Slug',
            render: (row) => <span className="text-xs text-foreground-light">{row?.slug || row?.tag?.slug || '-'}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className="text-xs text-foreground-light">
                    {row?.status || row?.result || row?.action || '-'}
                </span>
            ),
        },
    ];

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            method="POST"
            path="/super-admin/tags/seed-defaults"
            description="Seed các tag mặc định bằng upsert"
            methodClassName="bg-indigo-600"
            headerClassName="bg-indigo-50 hover:bg-indigo-100"
            pathClassName="text-indigo-800"
        >
            <div className="space-y-4">
                <ApiErrorAlert message={error} />

                <div className="rounded-sm border border-border bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">Thứ tự seed</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                        {seedOrder.map((item, index) => (
                            <div key={item.type} className="rounded-sm border border-border bg-white p-3">
                                <p className="text-xs text-foreground-light">Bước {index + 1}</p>
                                <p className="mt-1 text-sm font-semibold text-foreground">{item.type}</p>
                                <p className="text-xs text-foreground-light">Nguồn: {item.source}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={() => seedDefaultTags({})} loading={loading} disabled={loading}>
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

                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-light">Results</p>
                            <div className="overflow-hidden rounded-sm border border-border">
                                <Table
                                    columns={resultColumns}
                                    data={responseResults}
                                    loading={false}
                                    emptyMessage="Response không có danh sách results"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ApiEndpointCard>
    );
};
