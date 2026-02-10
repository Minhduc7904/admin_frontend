import { useDispatch, useSelector } from 'react-redux';
import { SearchableMultiSelect } from '../../../shared/components/ui';
import {
    searchChaptersAsync,
    selectSearchChapters,
    selectSearchPagination,
    selectSearchTerm,
    selectChapterLoadingSearch,
    setSearchTerm,
    clearSearchChapters,
} from '../store/chapterSlice';

/**
 * ChapterMultiSearchSelect - Component for searching and selecting multiple chapters
 * Sử dụng SearchableMultiSelect với Redux thunk
 */
export const ChapterMultiSearchSelect = ({
    label = "Chương",
    placeholder = "Tìm kiếm và chọn các chương...",
    onChange,
    value = [],
    error,
    required = false,
    disabled = false,
    className = '',
    helperText,
    subjectId = null, // Optional filter by subject
}) => {
    const dispatch = useDispatch();
    
    // Redux state
    const searchChapters = useSelector(selectSearchChapters);
    const searchPagination = useSelector(selectSearchPagination);
    const searchTerm = useSelector(selectSearchTerm);
    const loading = useSelector(selectChapterLoadingSearch);

    // Search function using Redux thunk with caching
    const handleSearch = async (keyword, page = 1) => {
        try {
            // Check if we already have data for this search
            const isSameSearch = keyword === searchTerm;
            const hasCache = isSameSearch && searchChapters.length > 0 && page <= searchPagination.page;
            
            if (hasCache) {
                // Return cached data
                return {
                    data: searchChapters,
                    meta: searchPagination,
                };
            }

            // Update search term in Redux
            if (keyword !== searchTerm) {
                dispatch(setSearchTerm(keyword));
            }

            const params = {
                search: keyword,
                page,
                limit: 50,
                sortBy: 'name',
                sortOrder: 'asc'
            };

            // Add subject filter if provided
            if (subjectId) {
                params.subjectId = subjectId;
            }

            const result = await dispatch(searchChaptersAsync(params)).unwrap();
            
            return result;
        } catch (error) {
            console.error('Error searching chapters:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    // Fetch default items with caching
    const fetchDefaultChapters = async (page = 1) => {
        try {
            // Check if we already have data (no search term)
            const isSameSearch = !searchTerm;
            const hasCache = isSameSearch && searchChapters.length > 0 && page <= searchPagination.page;
            
            if (hasCache) {
                // Return cached data
                return {
                    data: searchChapters,
                    meta: searchPagination,
                };
            }

            // Clear search term
            if (searchTerm) {
                dispatch(setSearchTerm(''));
            }

            const params = {
                page,
                limit: 50,
                sortBy: 'name',
                sortOrder: 'asc'
            };

            // Add subject filter if provided
            if (subjectId) {
                params.subjectId = subjectId;
            }

            const result = await dispatch(searchChaptersAsync(params)).unwrap();
            
            return result;
        } catch (error) {
            console.error('Error fetching default chapters:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    // Custom render option để hiển thị thông tin chi tiết hơn
    const renderChapterOption = (chapter) => {
        return (
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <span className="font-medium block">{chapter.name}</span>
                    {chapter.subject?.name && (
                        <span className="text-xs text-foreground-light">
                            {chapter.subject.name}
                        </span>
                    )}
                </div>
                {chapter.level !== undefined && (
                    <span className="text-xs text-foreground-light bg-gray-100 px-2 py-1 rounded shrink-0">
                        Cấp {chapter.level}
                    </span>
                )}
            </div>
        );
    };

    return (
        <SearchableMultiSelect
            label={label}
            placeholder={placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultChapters}
            onChange={onChange}
            getOptionLabel={(chapter) => chapter?.name || 'N/A'}
            getOptionValue={(chapter) => chapter?.chapterId}
            renderOption={renderChapterOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
            helperText={helperText}
            enableInfiniteScroll={true}
            debounceMs={1000}
        />
    );
};
