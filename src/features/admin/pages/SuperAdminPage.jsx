import { useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../../shared/components';
import { Input, Table } from '../../../shared/components/ui';
import { useResetPasswordByDateRange } from '../../superAdmin/hooks';

const formatJson = (value) => JSON.stringify(value, null, 2);

export const SuperAdminPage = () => {
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
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(true);

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
            setFormError('Vui lòng nhập đầy đủ fromDate và toDate.');
            return;
        }

        if (fromDate > toDate) {
            setFormError('fromDate phải nhỏ hơn hoặc bằng toDate.');
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
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${isUpdated ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
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
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Super Admin API Console</h1>
                <p className="text-sm text-foreground-light mt-1">
                    Giao diện gọi API trực tiếp theo phong cách Swagger.
                </p>
            </div>

            <section className="border border-border rounded-sm bg-white overflow-hidden">
                <button
                    type="button"
                    onClick={() => setIsResetPasswordOpen((prev) => !prev)}
                    className="w-full px-4 py-3 border-b border-border bg-green-50 flex items-center justify-between gap-4 hover:bg-green-100 transition-colors"
                >
                    <div className="flex items-center gap-3 flex-wrap text-left">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-semibold bg-green-600 text-white">
                            POST
                        </span>
                        <code className="text-sm text-green-800 font-medium">
                            /super-admin/reset-password-by-date-range
                        </code>
                        <span className="text-xs text-foreground-light">
                            Reset password theo khoảng ngày tạo tài khoản
                        </span>
                    </div>
                    {isResetPasswordOpen ? (
                        <ChevronUp size={16} className="text-green-700 shrink-0" />
                    ) : (
                        <ChevronDown size={16} className="text-green-700 shrink-0" />
                    )}
                </button>

                {isResetPasswordOpen && (
                    <div className="p-4 space-y-6">
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

                            {(formError || error) && (
                                <div className="flex items-start gap-2 text-sm rounded-sm border border-red-200 bg-red-50 text-red-700 px-3 py-2">
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    <span>{formError || error}</span>
                                </div>
                            )}

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

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-foreground-light uppercase tracking-wide">Request body</p>
                                <pre className="text-xs bg-gray-900 text-emerald-300 rounded-sm p-3 overflow-auto border border-gray-800">
                                    {formatJson(requestBody)}
                                </pre>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Response</h2>

                            {!result ? (
                                <div className="text-sm text-foreground-light border border-dashed border-border rounded-sm p-4">
                                    Chưa có dữ liệu phản hồi. Hãy nhập ngày và bấm Execute.
                                </div>
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

                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-foreground-light uppercase tracking-wide">Raw JSON</p>
                                        <pre className="text-xs bg-gray-900 text-blue-200 rounded-sm p-3 overflow-auto border border-gray-800 max-h-[320px]">
                                            {formatJson(result)}
                                        </pre>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-foreground-light uppercase tracking-wide">Results</p>
                                        <div className="border border-border rounded-sm overflow-hidden">
                                            <Table
                                                columns={resultColumns}
                                                data={responseResults}
                                                loading={false}
                                                emptyMessage="Không có bản ghi kết quả"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};
