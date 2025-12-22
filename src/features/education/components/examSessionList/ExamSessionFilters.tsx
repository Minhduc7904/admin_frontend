import React from 'react';
import { Card, Dropdown, SearchInput, type DropdownOption } from '@/shared/components/ui';

interface ExamSessionFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    selectedExam: string;
    onExamChange: (exam: string) => void;
}

export const ExamSessionFilters: React.FC<ExamSessionFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedStatus,
    onStatusChange,
    selectedExam,
    onExamChange,
}) => {
    const statusOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'upcoming', label: 'Sắp diễn ra' },
        { value: 'ongoing', label: 'Đang diễn ra' },
        { value: 'completed', label: 'Đã kết thúc' },
        { value: 'cancelled', label: 'Đã hủy' },
    ];

    const examOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả đề thi' },
        { value: 'DE001', label: 'DE001 - Hàm số và Đồ thị' },
        { value: 'DE002', label: 'DE002 - Đạo hàm' },
        { value: 'DE003', label: 'DE003 - Giới hạn' },
        { value: 'DE004', label: 'DE004 - Tích phân' },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Tìm kiếm cuộc thi..."
                />
                <Dropdown
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={onStatusChange}
                    placeholder="Chọn trạng thái"
                />
                <Dropdown
                    options={examOptions}
                    value={selectedExam}
                    onChange={onExamChange}
                    placeholder="Chọn đề thi"
                />
            </div>
        </Card>
    );
};
