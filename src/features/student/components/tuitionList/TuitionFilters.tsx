import React from 'react';
import { Dropdown, SearchInput, type DropdownOption } from '@/shared/components/ui';

interface TuitionFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedMonth: string;
    onMonthChange: (month: string) => void;
    selectedGrade: string;
    onGradeChange: (grade: string) => void;
    selectedClass: string;
    onClassChange: (className: string) => void;
    selectedPaymentStatus: string;
    onPaymentStatusChange: (status: string) => void;
}

export const TuitionFilters: React.FC<TuitionFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedMonth,
    onMonthChange,
    selectedGrade,
    onGradeChange,
    selectedClass,
    onClassChange,
    selectedPaymentStatus,
    onPaymentStatusChange,
}) => {
    // Generate months for current year
    const months: DropdownOption[] = [
        { value: '2024-09', label: 'Tháng 9/2024' },
        { value: '2024-10', label: 'Tháng 10/2024' },
        { value: '2024-11', label: 'Tháng 11/2024' },
        { value: '2024-12', label: 'Tháng 12/2024' },
        { value: '2025-01', label: 'Tháng 1/2025' },
        { value: '2025-02', label: 'Tháng 2/2025' },
    ];

    // Grade options
    const gradeOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả khối' },
        ...Array.from({ length: 7 }, (_, i) => ({
            value: (i + 6).toString(),
            label: `Khối ${i + 6}`,
        })),
    ];

    // Classes for each grade
    const getClassesForGrade = (grade: string): DropdownOption[] => {
        if (grade === 'all') return [{ value: 'all', label: 'Tất cả lớp' }];
        const gradeNum = parseInt(grade);
        return [
            { value: 'all', label: 'Tất cả lớp' },
            ...['A1', 'A2', 'A3', 'B1', 'B2'].map((suffix) => ({
                value: `${gradeNum}${suffix}`,
                label: `Lớp ${gradeNum}${suffix}`,
            })),
        ];
    };

    const classOptions = getClassesForGrade(selectedGrade);

    // Payment status options
    const paymentStatusOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'paid', label: 'Đã đóng' },
        { value: 'unpaid', label: 'Chưa đóng' },
        { value: 'overdue', label: 'Quá hạn' },
    ];

    return (
        <div className="space-y-3">
            {/* First row: Search and Month */}
            <div className="flex gap-3">
                {/* Search */}
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Tìm kiếm theo tên, email, mã học sinh..."
                    className="flex-1"
                />

                {/* Month Filter */}
                <Dropdown
                    options={months}
                    value={selectedMonth}
                    onChange={onMonthChange}
                    minWidth="150px"
                />
            </div>

            {/* Second row: Grade, Class, Payment Status */}
            <div className="flex gap-3">
                {/* Grade Filter */}
                <Dropdown
                    options={gradeOptions}
                    value={selectedGrade}
                    onChange={(value) => {
                        onGradeChange(value);
                        onClassChange('all');
                    }}
                />

                {/* Class Filter */}
                <Dropdown
                    options={classOptions}
                    value={selectedClass}
                    onChange={onClassChange}
                    disabled={selectedGrade === 'all'}
                />

                {/* Payment Status Filter */}
                <Dropdown
                    options={paymentStatusOptions}
                    value={selectedPaymentStatus}
                    onChange={onPaymentStatusChange}
                />
            </div>
        </div>
    );
};
