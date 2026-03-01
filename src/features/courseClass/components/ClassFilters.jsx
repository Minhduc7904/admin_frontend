import { SearchInput, Dropdown } from '../../../shared/components/ui';
import { GRADE_OPTIONS } from '../../../core/constants/grade-constants';

export const ClassFilters = ({
    search,
    onSearchChange,
    courseId,
    onCourseChange,
    instructorId,
    onInstructorChange,
    isActive,
    onIsActiveChange,
    grade,
    onGradeChange,
}) => {
    const statusOptions = [
        { value: '', label: 'Tất cả trạng thái' },
        { value: 'true', label: 'Đang hoạt động' },
        { value: 'false', label: 'Chưa bắt đầu/Đã kết thúc' },
    ];

    const gradeOptions = [
        { value: '', label: 'Tất cả khối' },
        ...GRADE_OPTIONS.filter(o => o.value !== ''),
    ];

    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm lớp học (tên lớp, phòng học)..."
                    />
                </div>
                <div className="w-40">
                    <Dropdown
                        value={grade}
                        onChange={onGradeChange}
                        options={gradeOptions}
                        placeholder="Chọn khối"
                    />
                </div>
                <div className="w-52">
                    <Dropdown
                        value={isActive}
                        onChange={onIsActiveChange}
                        options={statusOptions}
                        placeholder="Chọn trạng thái"
                    />
                </div>
            </div>
        </div>
    );
}
