import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Input, Table } from '../../../../shared/components/ui';
import { usePromoteStudentGradeByGraduationYear } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

export const PromoteStudentGradeByGraduationYearApiCard = () => {
    const {
        loading,
        error,
        result,
        promoteStudentGradeByGraduationYear,
        clearState,
    } = usePromoteStudentGradeByGraduationYear();

    const [highSchoolGraduationYear, setHighSchoolGraduationYear] = useState('');
    const [formError, setFormError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const requestBody = useMemo(
        () => ({
            highSchoolGraduationYear: highSchoolGraduationYear
                ? Number(highSchoolGraduationYear)
                : 2026,
        }),
        [highSchoolGraduationYear]
    );

    const responseData = result?.data || result;
    const responseResults = Array.isArray(responseData?.results)
        ? responseData.results
        : Array.isArray(responseData?.students)
            ? responseData.students
            : [];

    const handleExecute = async () => {
        const year = Number(highSchoolGraduationYear);

        if (!highSchoolGraduationYear) {
            setFormError('Vui long nhap highSchoolGraduationYear.');
            return;
        }

        if (!Number.isInteger(year) || year < 1900 || year > 2200) {
            setFormError('highSchoolGraduationYear phai la so nguyen tu 1900 den 2200.');
            return;
        }

        setFormError('');
        await promoteStudentGradeByGraduationYear({ highSchoolGraduationYear: year });
    };

    const resultColumns = [
        {
            key: 'studentId',
            label: 'Student ID',
            render: (row) => <span className="text-sm text-foreground">{row?.studentId || row?.id || '-'}</span>,
        },
        {
            key: 'fullName',
            label: 'Name',
            render: (row) => <span className="text-sm text-foreground-light">{row?.fullName || row?.name || '-'}</span>,
        },
        {
            key: 'grade',
            label: 'Grade',
            render: (row) => (
                <span className="text-sm text-foreground">
                    {row?.oldGrade ?? row?.grade ?? '-'}{row?.newGrade ? ` -> ${row.newGrade}` : ''}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => <span className="text-xs text-foreground-light">{row?.status || row?.result || '-'}</span>,
        },
    ];

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            method="POST"
            path="/super-admin/students/promote-grade/by-graduation-year"
            description="Tang khoi hoc sinh theo nam tot nghiep cap 3"
            methodClassName="bg-blue-600"
            headerClassName="bg-blue-50 hover:bg-blue-100"
            pathClassName="text-blue-800"
        >
            <div className="space-y-4">
                <Input
                    type="number"
                    label="highSchoolGraduationYear"
                    value={highSchoolGraduationYear}
                    onChange={(e) => setHighSchoolGraduationYear(e.target.value)}
                    min={1900}
                    max={2200}
                    required
                    helperText="Chi tang khoi cho hoc sinh co nam tot nghiep nay va dang duoi lop 12."
                />

                <ApiErrorAlert message={formError || error} />

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
                    <ApiResponsePlaceholder message="Chua co du lieu phan hoi. Hay nhap nam tot nghiep va bam Execute." />
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">Matched</p>
                                <p className="text-lg font-semibold text-foreground">
                                    {responseData?.matchedCount ?? responseData?.totalStudents ?? responseData?.total ?? 0}
                                </p>
                            </div>
                            <div className="rounded-sm border border-green-200 bg-green-50 p-3">
                                <p className="text-xs text-green-700">Updated</p>
                                <p className="text-lg font-semibold text-green-700">
                                    {responseData?.updatedCount ?? responseData?.promotedCount ?? 0}
                                </p>
                            </div>
                            <div className="rounded-sm border border-amber-200 bg-amber-50 p-3">
                                <p className="text-xs text-amber-700">Skipped</p>
                                <p className="text-lg font-semibold text-amber-700">
                                    {responseData?.skippedCount ?? 0}
                                </p>
                            </div>
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">Graduation year</p>
                                <p className="text-lg font-semibold text-foreground">
                                    {responseData?.highSchoolGraduationYear ?? highSchoolGraduationYear}
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
                                    emptyMessage="Response khong co danh sach results"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ApiEndpointCard>
    );
};
