import { SearchInput, Dropdown } from '../../../shared/components/ui';

export const CompetitionFilters = ({
    search,
    onSearchChange,
    visibility,
    onVisibilityChange,
    examId,
    onExamIdChange
}) => {
    const visibilityOptions = [
        { value: '', label: 'Tất cả trạng thái' },
        { value: 'DRAFT', label: 'Bản nháp' },
        { value: 'PUBLISHED', label: 'Đã xuất bản' },
        { value: 'PRIVATE', label: 'Riêng tư' },
    ];

    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm cuộc thi (tiêu đề, mô tả)..."
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
