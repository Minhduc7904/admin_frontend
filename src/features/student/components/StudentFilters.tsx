import React from 'react';
import { Search } from 'lucide-react';

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
    return (
        <div className="flex gap-3">
            {/* Search */}
            <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, mã học sinh..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none text-sm"
                />
            </div>

            {/* Grade Filter */}
            <select
                value={selectedGrade}
                onChange={(e) => onGradeChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none text-sm"
            >
                <option value="all">Tất cả khối</option>
                <option value="10">Khối 10</option>
                <option value="11">Khối 11</option>
                <option value="12">Khối 12</option>
            </select>

            {/* Status Filter */}
            <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none text-sm"
            >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang học</option>
                <option value="inactive">Nghỉ học</option>
                <option value="suspended">Đình chỉ</option>
            </select>
        </div>
    );
};
