// src/features/competition/components/CompetitionSearchSelect.jsx
import { useDispatch, useSelector } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import {
    searchCompetitionsAsync,
    selectSearchCompetitions,
    selectCompetitionSearchPagination,
    selectCompetitionSearchTerm,
    selectCompetitionLoadingSearch,
    setSearchTerm,
    clearSearchCompetitions,
} from '../store/competitionSlice';

/**
 * CompetitionSearchSelect - Wrapper component for searching and selecting competitions
 * Sử dụng SearchableSelect với Redux thunk
 */
export const CompetitionSearchSelect = ({
    label = "Cuộc thi",
    placeholder = "Tìm kiếm cuộc thi...",
    onSelect,
    value,
    error,
    required = false,
    disabled = false,
    className = '',
}) => {
    const dispatch = useDispatch();

    // Redux state
    const searchCompetitions = useSelector(selectSearchCompetitions);
    const searchPagination = useSelector(selectCompetitionSearchPagination);
    const searchTerm = useSelector(selectCompetitionSearchTerm);
    const loading = useSelector(selectCompetitionLoadingSearch);

    // Search function using Redux thunk with caching
    const handleSearch = async (keyword, page = 1) => {
        try {
            const isSameSearch = keyword === searchTerm;
            const hasCache = isSameSearch && searchCompetitions.length > 0 && page <= searchPagination.page;

            if (hasCache) {
                return {
                    data: searchCompetitions,
                    meta: searchPagination,
                };
            }

            if (keyword !== searchTerm) {
                dispatch(setSearchTerm(keyword));
            }

            const result = await dispatch(searchCompetitionsAsync({
                search: keyword,
                page,
                limit: 50,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            })).unwrap();

            return result;
        } catch (error) {
            console.error('Error searching competitions:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    // Fetch default items with caching
    const fetchDefaultCompetitions = async (page = 1) => {
        try {
            const isSameSearch = !searchTerm;
            const hasCache = isSameSearch && searchCompetitions.length > 0 && page <= searchPagination.page;

            if (hasCache) {
                return {
                    data: searchCompetitions,
                    meta: searchPagination,
                };
            }

            if (searchTerm) {
                dispatch(setSearchTerm(''));
            }

            const result = await dispatch(searchCompetitionsAsync({
                page,
                limit: 50,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            })).unwrap();

            return result;
        } catch (error) {
            console.error('Error fetching default competitions:', error);
            return { data: [], meta: { hasNext: false } };
        }
    };

    const renderCompetitionOption = (competition) => (
        <div className="flex items-center justify-between gap-2">
            <span className="font-medium truncate">{competition.title}</span>
            <span className="text-xs text-foreground-light bg-gray-100 px-2 py-0.5 rounded shrink-0">
                #{competition.competitionId}
            </span>
        </div>
    );

    return (
        <SearchableSelect
            label={label}
            placeholder={placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultCompetitions}
            onSelect={onSelect}
            getOptionLabel={(competition) => competition?.title || 'N/A'}
            getOptionValue={(competition) => competition?.competitionId}
            renderOption={renderCompetitionOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
            enableInfiniteScroll={true}
            debounceMs={500}
        />
    );
};
