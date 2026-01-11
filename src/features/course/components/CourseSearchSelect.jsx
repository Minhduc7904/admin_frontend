import { useDispatch } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import { searchCoursesAsync } from '../store/courseSlice';

/**
 * CourseSearchSelect - Wrapper component for searching and selecting courses
 * Sử dụng SearchableSelect với Redux thunk
 */
export const CourseSearchSelect = ({
    label = "Khóa học",
    placeholder = "Tìm kiếm khóa học...",
    onSelect,
    value,
    error,
    required = false,
    disabled = false,
    className = '',
    filterTeacherId = null, // Filter by teacherId
}) => {
    const dispatch = useDispatch();

    // Search function using Redux thunk
    const handleSearch = async (keyword) => {
        try {
            const result = await dispatch(searchCoursesAsync({
                search: keyword,
                limit: 10,
                teacherId: filterTeacherId || undefined
            })).unwrap();
            return result.data;
        } catch (error) {
            console.error('Error searching courses:', error);
            return [];
        }
    };

    // Fetch default items (latest 50 courses)
    const fetchDefaultCourses = async () => {
        try {
            const result = await dispatch(searchCoursesAsync({
                page: 1,
                limit: 50,
                sortBy: 'createdAt',
                sortOrder: 'desc',
                teacherId: filterTeacherId || undefined
            })).unwrap();
            return result.data;
        } catch (error) {
            console.error('Error fetching default courses:', error);
            return [];
        }
    };

    // Custom render option để hiển thị thông tin chi tiết hơn
    const renderCourseOption = (course) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium">{course.title || 'N/A'}</span>
                <div className="flex items-center gap-2 text-xs text-foreground-light">
                    {course.subjectName && (
                        <span>{course.subjectName}</span>
                    )}
                    {course.grade && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                            Khối {course.grade}
                        </span>
                    )}
                    {course.academicYear && (
                        <span>{course.academicYear}</span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <SearchableSelect
            label={label}
            placeholder={placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultCourses}
            onSelect={onSelect}
            getOptionLabel={(course) => course?.title || 'N/A'}
            getOptionValue={(course) => course?.courseId}
            renderOption={renderCourseOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
        />
    );
};
