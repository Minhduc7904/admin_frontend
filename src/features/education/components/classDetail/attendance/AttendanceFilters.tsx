import React from 'react';
import { Card, Dropdown, type DropdownOption } from '@/shared/components/ui';

interface AttendanceFiltersProps {
    selectedLesson: string;
    onLessonChange: (lesson: string) => void;
    selectedHomework: string;
    onHomeworkChange: (homework: string) => void;
    selectedMonth: string;
    onMonthChange: (month: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    selectedTuition: string;
    onTuitionChange: (tuition: string) => void;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
    selectedLesson,
    onLessonChange,
    selectedHomework,
    onHomeworkChange,
    selectedMonth,
    onMonthChange,
    selectedStatus,
    onStatusChange,
    selectedTuition,
    onTuitionChange,
}) => {
    // Lesson options - mock data
    const lessonOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả buổi học' },
        { value: 'lesson-1', label: 'Buổi 1: Giới thiệu về Đạo hàm' },
        { value: 'lesson-2', label: 'Buổi 2: Các quy tắc tính đạo hàm' },
        { value: 'lesson-3', label: 'Buổi 3: Ứng dụng đạo hàm khảo sát hàm số' },
    ];

    // Homework options - mock data
    const homeworkOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả bài tập' },
        { value: 'hw-1', label: 'Bài tập định nghĩa đạo hàm' },
        { value: 'hw-2', label: 'Bài tập quy tắc đạo hàm' },
        { value: 'hw-3', label: 'Bài tập khảo sát hàm số' },
    ];

    // Month options
    const monthOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả tháng' },
        { value: '2024-12', label: 'Tháng 12/2024' },
        { value: '2024-11', label: 'Tháng 11/2024' },
        { value: '2024-10', label: 'Tháng 10/2024' },
        { value: '2024-09', label: 'Tháng 9/2024' },
    ];

    // Status options
    const statusOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'present', label: 'Có mặt' },
        { value: 'absent', label: 'Vắng' },
        { value: 'late', label: 'Muộn' },
        { value: 'excused', label: 'Có phép' },
    ];

    // Tuition payment options
    const tuitionOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả' },
        { value: 'paid', label: 'Đã đóng' },
        { value: 'unpaid', label: 'Chưa đóng' },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {/* Lesson Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Buổi học
                    </label>
                    <Dropdown
                        options={lessonOptions}
                        value={selectedLesson}
                        onChange={onLessonChange}
                        placeholder="Chọn buổi học"
                    />
                </div>

                {/* Homework Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Bài tập về nhà
                    </label>
                    <Dropdown
                        options={homeworkOptions}
                        value={selectedHomework}
                        onChange={onHomeworkChange}
                        placeholder="Chọn bài tập"
                    />
                </div>

                {/* Month Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tháng
                    </label>
                    <Dropdown
                        options={monthOptions}
                        value={selectedMonth}
                        onChange={onMonthChange}
                        placeholder="Chọn tháng"
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Trạng thái
                    </label>
                    <Dropdown
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={onStatusChange}
                        placeholder="Chọn trạng thái"
                    />
                </div>

                {/* Tuition Payment Filter */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Học phí
                    </label>
                    <Dropdown
                        options={tuitionOptions}
                        value={selectedTuition}
                        onChange={onTuitionChange}
                        placeholder="Chọn học phí"
                    />
                </div>
            </div>
        </Card>
    );
};
