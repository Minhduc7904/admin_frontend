import { useDispatch, useSelector } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import {
    searchSubjectsAsync,
    selectSearchSubjects,
    selectSearchPagination,
    selectSearchTerm,
    selectSubjectLoadingSearch,
    setSearchTerm,
    clearSearchSubjects,
} from '../store/subjectSlice';

/**
 * SubjectSearchSelect - Wrapper component for searching and selecting subjects
 * Sử dụng SearchableSelect với Redux thunk
 */
export const SubjectSearchSelect = ({
    label = "Môn học",
    placeholder = "Tìm kiếm môn học...",
    onSelect,
    value,
    error,
    required = false,
    disabled = false,
    className = ''
}) => {
    const dispatch = useDispatch();
    
    // Redux state
    const searchSubjects = useSelector(selectSearchSubjects);
    const searchPagination = useSelector(selectSearchPagination);
    const searchTerm = useSelector(selectSearchTerm);
    const loading = useSelector(selectSubjectLoadingSearch);

    // Search function using Redux thunk with caching
    const handleSearch = async (keyword, page = 1) => {
        try {
            // Check if we already have data for this search
            const isSameSearch = keyword === searchTerm;
            const hasCache = isSameSearch && searchSubjects.length > 0 && page <= searchPagination.page;
            
            if (hasCache) {
                // Return cached data
                return {
                    data: searchSubjects,
                    meta: searchPagination,
                };
            }

            // Update search term in Redux
            if (keyword !== searchTerm) {
                dispatch(setSearchTerm(keyword));
            }

            const result = await dispatch(searchSubjectsAsync({
                search: keyword,
                page,
                limit: 50,
                sortBy: 'name',
                sortOrder: 'asc'
            })).unwrap();
            
            return result;
        } catch (error) {
            console.error('Error searching subjects:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    // Fetch default items with caching
    const fetchDefaultSubjects = async (page = 1) => {
        try {
            // Check if we already have data (no search term)
            const isSameSearch = !searchTerm;
            const hasCache = isSameSearch && searchSubjects.length > 0 && page <= searchPagination.page;
            
            if (hasCache) {
                // Return cached data
                return {
                    data: searchSubjects,
                    meta: searchPagination,
                };
            }

            // Clear search term
            if (searchTerm) {
                dispatch(setSearchTerm(''));
            }

            const result = await dispatch(searchSubjectsAsync({
                page,
                limit: 50,
                sortBy: 'name',
                sortOrder: 'asc'
            })).unwrap();
            
            return result;
        } catch (error) {
            console.error('Error fetching default subjects:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    // Custom render option để hiển thị thông tin chi tiết hơn
    const renderSubjectOption = (subject) => {
        return (
            <div className="flex items-center justify-between">
                <span className="font-medium">{subject.name}</span>
                {subject.code && (
                    <span className="text-xs text-foreground-light bg-gray-100 px-2 py-1 rounded">
                        {subject.code}
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
            fetchDefaultItems={fetchDefaultSubjects}
            onSelect={onSelect}
            getOptionLabel={(subject) => subject?.name || 'N/A'}
            getOptionValue={(subject) => subject?.subjectId}
            renderOption={renderSubjectOption}
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
