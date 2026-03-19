import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Input, Table } from '../../../../shared/components/ui';
import { useResetPasswordByDateRange } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

export const ResetPasswordByDateRangeApiCard = () => {
    const {
        loading,
        error,
        result,
        resetByDateRange,
        clearState,
    } = useResetPasswordByDateRange();

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [formError, setFormError] = useState('');
    const [isOpen, setIsOpen] = useState(true);

    const requestBody = useMemo(
        () => ({
            fromDate: fromDate || '2026-01-01',
            toDate: toDate || '2026-03-31',
        }),
        [fromDate, toDate]
    );

    const responseResults = result?.data?.results || [];

    const handleExecute = async () => {
        if (!fromDate || !toDate) {
            setFormError('Vui long nhap day du fromDate va toDate.');
            return;
        }

        if (fromDate > toDate) {
            setFormError('fromDate phai nho hon hoac bang toDate.');
            return;
        }

        setFormError('');
        await resetByDateRange({ fromDate, toDate });
    };

    const resultColumns = [
        {
            key: 'studentId',
            label: 'Student ID',
            render: (row) => <span className="text-sm text-foreground">{row.studentId}</span>,
        },
        {
            key: 'userId',
            label: 'User ID',
            render: (row) => <span className="text-sm text-foreground">{row.userId}</span>,
        },
        {
            key: 'studentPhone',
            label: 'Student Phone',
            render: (row) => <span className="text-sm text-foreground-light">{row.studentPhone || '-'}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => {
                const isUpdated = row.status === 'updated' || row.status === 'success';
                return (
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            isUpdated ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}
                    >
                        {row.status || '-'}
                    </span>
                );
            },
        },
        {
            key: 'reason',
            label: 'Reason',
            render: (row) => (
                <span className="text-xs text-foreground-light max-w-[240px] truncate block" title={row.reason || ''}>
                    {row.reason || '-'}
                </span>
            ),
        },
    ];

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            method="POST"
            path="/super-admin/reset-password-by-date-range"
            description="Reset password theo khoang ngay tao tai khoan"
            methodClassName="bg-green-600"
            headerClassName="bg-green-50 hover:bg-green-100"
            pathClassName="text-green-800"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="date"
                        label="fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        required
                    />
                    <Input
                        type="date"
                        label="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        required
                    />
                </div>

                <ApiErrorAlert message={formError || error} />

                <div className="flex items-center gap-2">
                    <Button onClick={handleExecute} loading={loading} disabled={loading}>
                        Execute
                    </Button>
                    <Button
                        variant="outline"
                        onClick={clearState}
                        disabled={loading}
                    >
                        <RotateCcw size={14} />
                        Clear Response
                    </Button>
                </div>

                <ApiJsonPreview title="Request body" value={requestBody} />
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Response</h2>

                {!result ? (
                    <ApiResponsePlaceholder message="Chua co du lieu phan hoi. Hay nhap ngay va bam Execute." />
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">Total</p>
                                <p className="text-lg font-semibold text-foreground">{result.data?.totalStudents ?? 0}</p>
                            </div>
                            <div className="rounded-sm border border-green-200 bg-green-50 p-3">
                                <p className="text-xs text-green-700">Updated</p>
                                <p className="text-lg font-semibold text-green-700">{result.data?.updatedCount ?? 0}</p>
                            </div>
                            <div className="rounded-sm border border-amber-200 bg-amber-50 p-3">
                                <p className="text-xs text-amber-700">Skipped</p>
                                <p className="text-lg font-semibold text-amber-700">{result.data?.skippedCount ?? 0}</p>
                            </div>
                            <div className="rounded-sm border border-border p-3 col-span-2">
                                <p className="text-xs text-foreground-light">Range</p>
                                <p className="text-sm font-medium text-foreground">
                                    {result.data?.fromDate || '-'} to {result.data?.toDate || '-'}
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
                                    data={responseResults}
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
