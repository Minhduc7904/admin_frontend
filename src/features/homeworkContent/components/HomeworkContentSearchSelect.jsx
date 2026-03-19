import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import {
    getHomeworkContentsByCourseAsync,
    selectByCourseHomeworkContents,
    selectHomeworkContentLoadingGetByCourse,
} from '../store/homeworkContentSlice';

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
    homeworkContents = [], // Danh sách homework từ parent (optional)
    courseId = null,
    loading = false,
}) => {
    const dispatch = useDispatch();
    const byCourseHomeworkContents = useSelector(selectByCourseHomeworkContents);
    const loadingGetByCourse = useSelector(selectHomeworkContentLoadingGetByCourse);

    const availableHomeworkContents = homeworkContents.length > 0
        ? homeworkContents
        : byCourseHomeworkContents;

    useEffect(() => {
        if (!courseId || homeworkContents.length > 0) return;

        dispatch(getHomeworkContentsByCourseAsync(courseId));
    }, [courseId, dispatch, homeworkContents.length]);

    const isLoading = loading || (Boolean(courseId) && loadingGetByCourse);

    // Search function - filter local array
    const handleSearch = async (keyword) => {
        if (!keyword || keyword.trim() === '') {
            return availableHomeworkContents;
        }
        
        const lowerKeyword = keyword.toLowerCase();
        return availableHomeworkContents.filter((hw) => 
            hw.content?.toLowerCase().includes(lowerKeyword) ||
            hw.learningItem?.title?.toLowerCase().includes(lowerKeyword)
        );
    };

    // Fetch default items - trả về toàn bộ list
    const fetchDefaultItems = async () => {
        return availableHomeworkContents;
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
            placeholder={isLoading ? 'Đang tải...' : placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultItems}
            onSelect={onSelect}
            getOptionLabel={(homework) => homework?.content || 'N/A'}
            getOptionValue={(homework) => homework?.homeworkContentId}
            renderOption={renderHomeworkOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled || isLoading}
            className={className}
        />
    );
};
