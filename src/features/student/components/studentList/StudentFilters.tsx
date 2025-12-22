import React from 'react';
import { Dropdown, SearchInput, type DropdownOption } from '@/shared/components/ui';

interface StudentFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedGrade: string;
    onGradeChange: (grade: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedGrade,
    onGradeChange,
    selectedStatus,
    onStatusChange,
}) => {
    // Grade options
    const gradeOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả khối' },
        { value: '10', label: 'Khối 10' },
        { value: '11', label: 'Khối 11' },
        { value: '12', label: 'Khối 12' },
    ];

    // Status options
    const statusOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Đang học' },
        { value: 'inactive', label: 'Nghỉ học' },
        { value: 'suspended', label: 'Đình chỉ' },
    ];

    return (
        <div className="flex gap-3">
            {/* Search */}
            <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Tìm kiếm theo tên, email, mã học sinh..."
                className="flex-1"
            />

            {/* Grade Filter */}
            <Dropdown
                options={gradeOptions}
                value={selectedGrade}
                onChange={onGradeChange}
            />

            {/* Status Filter */}
            <Dropdown
                options={statusOptions}
                value={selectedStatus}
                onChange={onStatusChange}
            />
        </div>
    );
};
