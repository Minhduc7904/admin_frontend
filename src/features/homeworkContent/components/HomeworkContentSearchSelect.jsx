import { SearchableSelect } from '../../../shared/components/ui';

/**
 * HomeworkContentSearchSelect - Component for searching and selecting homework from a local list
 * Không cần gọi API, chỉ filter trong danh sách có sẵn
 */
export const HomeworkContentSearchSelect = ({
    label = "Bài tập về nhà",
    placeholder = "Tìm kiếm bài tập...",
    onSelect,
    value,
    error,
    required = false,
    disabled = false,
    className = '',
    homeworkContents = [], // Danh sách homework từ parent
    loading = false,
}) => {
    // Search function - filter local array
    const handleSearch = async (keyword) => {
        if (!keyword || keyword.trim() === '') {
            return homeworkContents;
        }
        
        const lowerKeyword = keyword.toLowerCase();
        return homeworkContents.filter((hw) => 
            hw.content?.toLowerCase().includes(lowerKeyword) ||
            hw.learningItem?.title?.toLowerCase().includes(lowerKeyword)
        );
    };

    // Fetch default items - trả về toàn bộ list
    const fetchDefaultItems = async () => {
        return homeworkContents;
    };

    // Custom render option để hiển thị thông tin chi tiết hơn
    const renderHomeworkOption = (homework) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium">{homework.content || 'N/A'}</span>
                {homework.learningItem?.title && (
                    <span className="text-xs text-foreground-light">
                        {homework.learningItem.title}
                    </span>
                )}
            </div>
        );
    };

    return (
        <SearchableSelect
            label={label}
            placeholder={loading ? 'Đang tải...' : placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultItems}
            onSelect={onSelect}
            getOptionLabel={(homework) => homework?.content || 'N/A'}
            getOptionValue={(homework) => homework?.homeworkContentId}
            renderOption={renderHomeworkOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled || loading}
            className={className}
        />
    );
};
