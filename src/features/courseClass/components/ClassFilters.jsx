import { SearchInput, Dropdown } from '../../../shared/components/ui';

export const ClassFilters = ({
    search,
    onSearchChange,
    courseId,
    onCourseChange,
    instructorId,
    onInstructorChange,
    isActive,
    onIsActiveChange
}) => {
    const statusOptions = [
        { value: '', label: 'Tất cả trạng thái' },
        { value: 'true', label: 'Đang hoạt động' },
        { value: 'false', label: 'Chưa bắt đầu/Đã kết thúc' },
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
                <div className="w-48">
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
