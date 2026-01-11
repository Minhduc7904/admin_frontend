import { SearchInput, Dropdown } from '../../../shared/components/ui';

export const CourseFilters = ({
    search,
    onSearchChange,
    grade,
    onGradeChange,
    visibility,
    onVisibilityChange,
    academicYear,
    onAcademicYearChange
}) => {
    const gradeOptions = [
        { value: '', label: 'Tất cả khối' },
        { value: '1', label: 'Khối 1' },
        { value: '2', label: 'Khối 2' },
        { value: '3', label: 'Khối 3' },
        { value: '4', label: 'Khối 4' },
        { value: '5', label: 'Khối 5' },
        { value: '6', label: 'Khối 6' },
        { value: '7', label: 'Khối 7' },
        { value: '8', label: 'Khối 8' },
        { value: '9', label: 'Khối 9' },
        { value: '10', label: 'Khối 10' },
        { value: '11', label: 'Khối 11' },
        { value: '12', label: 'Khối 12' },
    ];

    const visibilityOptions = [
        { value: '', label: 'Tất cả trạng thái' },
        { value: 'DRAFT', label: 'Bản nháp' },
        { value: 'PUBLISHED', label: 'Đã xuất bản' },
        { value: 'PRIVATE', label: 'Riêng tư' },
    ];

    // Generate academic year options (current year ± 2 years)
    const currentYear = new Date().getFullYear();
    const academicYearOptions = [
        { value: '', label: 'Tất cả năm học' },
        ...Array.from({ length: 5 }, (_, i) => {
            const startYear = currentYear - 2 + i;
            const endYear = startYear + 1;
            const value = `${startYear}-${endYear}`;
            return { value, label: `Năm học ${value}` };
        })
    ];

    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm khóa học (tiêu đề, mô tả)..."
                    />
                </div>
                <div className="w-48">
                    <Dropdown
                        value={grade}
                        onChange={onGradeChange}
                        options={gradeOptions}
                        placeholder="Chọn khối"
                    />
                </div>
                <div className="w-48">
                    <Dropdown
                        value={visibility}
                        onChange={onVisibilityChange}
                        options={visibilityOptions}
                        placeholder="Chọn trạng thái"
                    />
                </div>
                <div className="w-48">
                    <Dropdown
                        value={academicYear}
                        onChange={onAcademicYearChange}
                        options={academicYearOptions}
                        placeholder="Năm học"
                    />
                </div>
            </div>
        </div>
    );
}
