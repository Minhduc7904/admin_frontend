import { useDispatch } from 'react-redux';
import { SearchableMultiSelect } from '../../../shared/components/ui';
import { searchCoursesAsync } from '../store/courseSlice';

/**
 * CourseSearchMultiSelect
 * Wrapper component for searching & selecting MULTIPLE courses
 */
export const CourseSearchMultiSelect = ({
    label = 'Khóa học',
    placeholder = 'Tìm kiếm khóa học...',
    value = [],                 // array<Course>
    onChange,                   // (courses[]) => void
    error,
    required = false,
    disabled = false,
    className = '',
    filterTeacherId = null,
}) => {
    const dispatch = useDispatch();

    /* ===================== SEARCH ===================== */
    const handleSearch = async (keyword) => {
        try {
            const result = await dispatch(
                searchCoursesAsync({
                    search: keyword,
                    teacherId: filterTeacherId || undefined,
                })
            ).unwrap();

            return result.data || [];
        } catch (error) {
            console.error('Error searching courses:', error);
            return [];
        }
    };

    /* ===================== DEFAULT ===================== */
    const fetchDefaultCourses = async () => {
        try {
            const result = await dispatch(
                searchCoursesAsync({
                    teacherId: filterTeacherId || undefined,
                })
            ).unwrap();

            return result.data || [];
        } catch (error) {
            console.error('Error fetching default courses:', error);
            return [];
        }
    };

    /* ===================== RENDER OPTION ===================== */
    const renderCourseOption = (course) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium">
                    {course.title || 'N/A'}
                </span>
                <div className="flex items-center gap-2 text-xs text-foreground-light">
                    {course.subjectName && <span>{course.subjectName}</span>}
                    {course.grade && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                            Khối {course.grade}
                        </span>
                    )}
                    {course.academicYear && <span>{course.academicYear}</span>}
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
            fetchDefaultItems={fetchDefaultCourses}
            getOptionLabel={(course) => course?.title || 'N/A'}
            getOptionValue={(course) => course?.courseId}
            renderOption={renderCourseOption}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
        />
    );
};
