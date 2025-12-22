import React from 'react';
import { Dropdown, SearchInput, type DropdownOption } from '@/shared/components/ui';

interface ClassFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedGrade: string;
    onGradeChange: (grade: string) => void;
    selectedSubject: string;
    onSubjectChange: (subject: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
}

export const ClassFilters: React.FC<ClassFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedGrade,
    onGradeChange,
    selectedSubject,
    onSubjectChange,
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

    // Subject options
    const subjectOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả môn học' },
        { value: 'Toán', label: 'Toán' },
        { value: 'Văn', label: 'Văn' },
        { value: 'Anh', label: 'Tiếng Anh' },
        { value: 'Lý', label: 'Vật Lý' },
        { value: 'Hóa', label: 'Hóa Học' },
        { value: 'Sinh', label: 'Sinh Học' },
        { value: 'Sử', label: 'Lịch Sử' },
        { value: 'Địa', label: 'Địa Lý' },
    ];

    // Status options
    const statusOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Đang hoạt động' },
        { value: 'completed', label: 'Đã hoàn thành' },
        { value: 'archived', label: 'Lưu trữ' },
    ];

    return (
        <div className="flex gap-3">
            {/* Search */}
            <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Tìm kiếm theo tên lớp, giáo viên chủ nhiệm..."
                className="flex-1"
            />

            {/* Grade Filter */}
            <Dropdown
                options={gradeOptions}
                value={selectedGrade}
                onChange={onGradeChange}
                placeholder="Chọn khối"
            />

            {/* Subject Filter */}
            <Dropdown
                options={subjectOptions}
                value={selectedSubject}
                onChange={onSubjectChange}
                placeholder="Chọn môn học"
            />

            {/* Status Filter */}
            <Dropdown
                options={statusOptions}
                value={selectedStatus}
                onChange={onStatusChange}
                placeholder="Chọn trạng thái"
            />
        </div>
    );
};
