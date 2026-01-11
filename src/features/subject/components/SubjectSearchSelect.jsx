import { useDispatch } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import { searchSubjectsAsync } from '../store/subjectSlice';

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

    // Search function using Redux thunk
    const handleSearch = async (keyword) => {
        try {
            const result = await dispatch(searchSubjectsAsync({
                search: keyword,
                limit: 10,
                sortBy: 'name',
                sortOrder: 'asc'
            })).unwrap();
            return result;
        } catch (error) {
            console.error('Error searching subjects:', error);
            return { data: [] };
        }
    };

    // Fetch default items (all subjects sorted by name)
    const fetchDefaultSubjects = async () => {
        try {
            const result = await dispatch(searchSubjectsAsync({
                page: 1,
                limit: 50, // Load more subjects as they are usually limited
                sortBy: 'name',
                sortOrder: 'asc'
            })).unwrap();
            return result;
        } catch (error) {
            console.error('Error fetching default subjects:', error);
            return { data: [] };
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
        />
    );
};
