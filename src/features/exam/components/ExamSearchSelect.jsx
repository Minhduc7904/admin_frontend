import { useDispatch, useSelector } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import {
    searchExamsAsync,
    selectSearchExams,
    selectSearchPagination,
    selectSearchTerm,
    selectExamLoadingSearch,
    setSearchTerm,
    clearSearchExams,
} from '../store/examSlice';

/**
 * ExamSearchSelect - Wrapper component for searching and selecting exams
 * Sử dụng SearchableSelect với Redux thunk
 */
export const ExamSearchSelect = ({
    label = "Đề thi",
    placeholder = "Tìm kiếm đề thi...",
    onSelect,
    value,
    error,
    required = false,
    disabled = false,
    className = '',
    // Additional filters
    subjectId,
    grade,
    visibility,
}) => {
    const dispatch = useDispatch();

    // Redux state
    const searchExams = useSelector(selectSearchExams);
    const searchPagination = useSelector(selectSearchPagination);
    const searchTerm = useSelector(selectSearchTerm);
    const loading = useSelector(selectExamLoadingSearch);

    // Search function using Redux thunk with caching
    const handleSearch = async (keyword, page = 1) => {
        try {
            // Check if we already have data for this search
            const isSameSearch = keyword === searchTerm;
            const hasCache = isSameSearch && searchExams.length > 0 && page <= searchPagination.page;

            if (hasCache) {
                // Return cached data
                return {
                    data: searchExams,
                    meta: searchPagination,
                };
            }

            // Update search term in Redux
            if (keyword !== searchTerm) {
                dispatch(setSearchTerm(keyword));
            }

            const result = await dispatch(searchExamsAsync({
                search: keyword,
                page,
                limit: 50,
                subjectId: subjectId || undefined,
                grade: grade || undefined,
                visibility: visibility || undefined,
                sortBy: 'title',
                sortOrder: 'asc'
            })).unwrap();

            return result;
        } catch (error) {
            console.error('Error searching exams:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    // Fetch default items with caching
    const fetchDefaultExams = async (page = 1) => {
        try {
            // Check if we already have data (no search term)
            const isSameSearch = !searchTerm;
            const hasCache = isSameSearch && searchExams.length > 0 && page <= searchPagination.page;

            if (hasCache) {
                // Return cached data
                return {
                    data: searchExams,
                    meta: searchPagination,
                };
            }

            // Clear search term
            if (searchTerm) {
                dispatch(setSearchTerm(''));
            }

            const result = await dispatch(searchExamsAsync({
                page,
                limit: 50,
                subjectId: subjectId || undefined,
                grade: grade || undefined,
                visibility: visibility || undefined,
                sortBy: 'title',
                sortOrder: 'asc'
            })).unwrap();

            return result;
        } catch (error) {
            console.error('Error fetching default exams:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    // Custom render option để hiển thị thông tin chi tiết hơn
    const renderExamOption = (exam) => {
        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <span className="font-medium">{exam.title}</span>
                    {exam.grade && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Khối {exam.grade}
                        </span>
                    )}
                </div>
                {exam.description && (
                    <span className="text-xs text-foreground-lighter line-clamp-1">
                        {exam.description}
                    </span>
                )}
                {exam.subjectName && (
                    <span className="text-xs text-foreground-light">
                        {exam.subjectName}
                    </span>
                )}
            </div>
        );
    };

    return (
        <SearchableSelect
            label={label}
            placeholder={placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultExams}
            onSelect={onSelect}
            getOptionLabel={(exam) => exam?.title || 'N/A'}
            getOptionValue={(exam) => exam?.examId}
            renderOption={renderExamOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
            enableInfiniteScroll={true}
            debounceMs={1000}
        />
    );
};
