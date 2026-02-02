import { useDispatch } from 'react-redux';
import { SearchableMultiSelect } from '../../../shared/components/ui';
import { searchChaptersAsync } from '../store/chapterSlice';

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

    /* ===================== SEARCH ===================== */
    const handleSearch = async (keyword) => {
        try {
            const result = await dispatch(
                searchChaptersAsync({
                    search: keyword,
                    subjectId: filterSubjectId || undefined,
                })
            ).unwrap();

            return result.data || [];
        } catch (error) {
            console.error('Error searching chapters:', error);
            return [];
        }
    };

    /* ===================== DEFAULT ===================== */
    const fetchDefaultChapters = async () => {
        try {
            const result = await dispatch(
                searchChaptersAsync({
                    subjectId: filterSubjectId || undefined,
                })
            ).unwrap();

            return result.data || [];
        } catch (error) {
            console.error('Error fetching default chapters:', error);
            return [];
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
        />
    );
};
