import React from 'react';
import { Card, Dropdown, SearchInput, DateInput, type DropdownOption } from '@/shared/components/ui';

interface CheatLogFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    startDate: string;
    onStartDateChange: (date: string) => void;
    endDate: string;
    onEndDateChange: (date: string) => void;
    severityFilter: string;
    onSeverityFilterChange: (severity: string) => void;
    onApply: () => void;
    onReset: () => void;
}

export const CheatLogFilters: React.FC<CheatLogFiltersProps> = ({
    searchQuery,
    onSearchChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    severityFilter,
    onSeverityFilterChange,
    onApply,
    onReset,
}) => {
    const severityOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả mức độ' },
        { value: 'critical', label: 'Nghiêm trọng' },
        { value: 'warning', label: 'Cảnh báo' },
        { value: 'info', label: 'Thông tin' },
    ];

    return (
        <Card>
            <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <SearchInput
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm học sinh..."
                    />
                    <DateInput
                        value={startDate}
                        onChange={onStartDateChange}
                        placeholder="Từ ngày"
                    />
                    <DateInput
                        value={endDate}
                        onChange={onEndDateChange}
                        placeholder="Đến ngày"
                    />
                    <Dropdown
                        options={severityOptions}
                        value={severityFilter}
                        onChange={onSeverityFilterChange}
                        placeholder="Chọn mức độ"
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Đặt lại
                    </button>
                    <button
                        onClick={onApply}
                        className="px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </Card>
    );
};
