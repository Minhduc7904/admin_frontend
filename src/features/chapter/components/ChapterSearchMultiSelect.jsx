import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchableMultiSelect } from '../../../shared/components/ui';
import {
    searchChaptersAsync,
    selectSearchChapters,
    selectSearchPagination,
    selectSearchTerm,
    selectSearchSubjectId,
    selectChapterLoadingSearch,
    setSearchTerm,
    setSearchSubjectId,
    clearSearchChapters,
} from '../store/chapterSlice';

/**
 * ChapterSearchMultiSelect
 * Wrapper component for searching & selecting MULTIPLE chapters
 */
export const ChapterSearchMultiSelect = ({
    label = 'Chương',
    placeholder = 'Tìm kiếm chương...',
    value = [],                 // array<Chapter>
    onChange,                   // (chapters[]) => void
    error,
    required = false,
    disabled = false,
    className = '',
    filterSubjectId = null,
}) => {
    const dispatch = useDispatch();
    
    // Redux state
    const searchChapters = useSelector(selectSearchChapters);
    const searchPagination = useSelector(selectSearchPagination);
    const searchTerm = useSelector(selectSearchTerm);
    const searchSubjectId = useSelector(selectSearchSubjectId);
    const loading = useSelector(selectChapterLoadingSearch);

    // Clear search when subject changes
    useEffect(() => {
        if (filterSubjectId !== searchSubjectId) {
            dispatch(clearSearchChapters());
            dispatch(setSearchSubjectId(filterSubjectId));
        }
    }, [filterSubjectId, searchSubjectId, dispatch]);

    /* ===================== SEARCH ===================== */
    const handleSearch = async (keyword, page = 1) => {
        try {
            // Check if we already have data for this search
            const isSameSearch = keyword === searchTerm && filterSubjectId === searchSubjectId;
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

            const result = await dispatch(
                searchChaptersAsync({
                    search: keyword,
                    subjectId: filterSubjectId || undefined,
                    page,
                    limit: 20,
                })
            ).unwrap();
            
            return result;
        } catch (error) {
            console.error('Error searching chapters:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    /* ===================== DEFAULT ===================== */
    const fetchDefaultChapters = async (page = 1) => {
        try {
            // Check if we already have data (no search term)
            const isSameSearch = !searchTerm && filterSubjectId === searchSubjectId;
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

            const result = await dispatch(
                searchChaptersAsync({
                    subjectId: filterSubjectId || undefined,
                    page,
                    limit: 20,
                })
            ).unwrap();

            return result;
        } catch (error) {
            console.error('Error fetching default chapters:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    /* ===================== RENDER OPTION ===================== */
    const renderChapterOption = (chapter) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium">
                    {chapter.name || 'N/A'}
                </span>
                <div className="flex items-center gap-2 text-xs text-foreground-light">
                    {chapter.subjectName && <span>{chapter.subjectName}</span>}
                    {chapter.slug && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {chapter.slug}
                        </span>
                    )}
                    {chapter.level !== undefined && chapter.level !== null && (
                        <span className="text-gray-500">
                            Cấp {chapter.level}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    /* ===================== RENDER ===================== */
    return (
        <SearchableMultiSelect
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultChapters}
            getOptionLabel={(chapter) => chapter?.name || 'N/A'}
            getOptionValue={(chapter) => chapter?.chapterId}
            renderOption={renderChapterOption}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
            enableInfiniteScroll={true}
            debounceMs={1000}
        />
    );
};
