import { SearchInput, Dropdown } from '../../../shared/components/ui';

export const ExamFilters = ({
    search,
    onSearchChange,
    grade,
    onGradeChange,
    visibility,
    onVisibilityChange,
    subjectId,
    onSubjectIdChange
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
    ];

    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm đề thi (tiêu đề, mô tả)..."
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
            </div>
        </div>
    );
}
