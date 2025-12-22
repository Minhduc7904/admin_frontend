import React from 'react';
import { Card, Dropdown, SearchInput, type DropdownOption } from '@/shared/components/ui';

interface SubmissionFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    selectedScoreRange: string;
    onScoreRangeChange: (range: string) => void;
}

export const SubmissionFilters: React.FC<SubmissionFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedStatus,
    onStatusChange,
    selectedScoreRange,
    onScoreRangeChange,
}) => {
    const statusOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'completed', label: 'Đã hoàn thành' },
        { value: 'in-progress', label: 'Đang làm' },
        { value: 'not-started', label: 'Chưa làm' },
    ];

    const scoreRangeOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả điểm' },
        { value: '9-10', label: '9.0 - 10.0' },
        { value: '8-9', label: '8.0 - 8.9' },
        { value: '7-8', label: '7.0 - 7.9' },
        { value: '6-7', label: '6.0 - 6.9' },
        { value: '5-6', label: '5.0 - 5.9' },
        { value: '0-5', label: 'Dưới 5.0' },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Tìm kiếm học sinh..."
                />
                <Dropdown
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={onStatusChange}
                    placeholder="Chọn trạng thái"
                />
                <Dropdown
                    options={scoreRangeOptions}
                    value={selectedScoreRange}
                    onChange={onScoreRangeChange}
                    placeholder="Chọn khoảng điểm"
                />
            </div>
        </Card>
    );
};
