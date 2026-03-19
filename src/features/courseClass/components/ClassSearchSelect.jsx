import { useDispatch } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import { getAllCourseClassesAsync } from '../store/courseClassSlice';

/**
 * ClassSearchSelect - Wrapper component for searching and selecting classes
 * Sử dụng SearchableSelect với Redux thunk
 */
export const ClassSearchSelect = ({
    label = "Lớp học",
    placeholder = "Tìm kiếm lớp học...",
    onSelect,
    value,
    error,
    required = false,
    disabled = false,
    className = '',
    filterCourseId = null, // Filter by courseId
    filterInstructorId = null, // Filter by instructorId
}) => {
    const dispatch = useDispatch();

    // Search function using Redux thunk
    const handleSearch = async (keyword) => {
        try {
            const result = await dispatch(getAllCourseClassesAsync({
                search: keyword,
                limit: 10,
                courseId: filterCourseId || undefined,
                instructorId: filterInstructorId || undefined,
            })).unwrap();
            return result.data;
        } catch (error) {
            console.error('Error searching classes:', error);
            return [];
        }
    };

    // Fetch default items (latest 50 classes)
    const fetchDefaultClasses = async () => {
        try {
            const result = await dispatch(getAllCourseClassesAsync({
                page: 1,
                limit: 50,
                sortBy: 'createdAt',
                sortOrder: 'desc',
                courseId: filterCourseId || undefined,
                instructorId: filterInstructorId || undefined,
            })).unwrap();
            return result.data;
        } catch (error) {
            console.error('Error fetching default classes:', error);
            return [];
        }
    };

    // Custom render option để hiển thị thông tin chi tiết hơn
    const renderClassOption = (courseClass) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium">{courseClass.className || 'N/A'}</span>
                <div className="flex items-center gap-2 text-xs text-foreground-light">
                    {courseClass.course?.title && (
                        <span>{courseClass.course.title}</span>
                    )}
                    {courseClass.room && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {courseClass.room}
                        </span>
                    )}
                    {courseClass.instructor?.fullName && (
                        <span>GV: {courseClass.instructor.fullName}</span>
                    )}
                </div>
                <span className="text-xs text-foreground-light mt-1">
                    Lịch học: {courseClass.weeklySchedule || 'Chưa có lịch học'}
                </span>
            </div>
        );
    };

    return (
        <SearchableSelect
            label={label}
            placeholder={placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultClasses}
            onSelect={onSelect}
            getOptionLabel={(courseClass) => courseClass?.className || 'N/A'}
            getOptionValue={(courseClass) => courseClass?.classId}
            renderOption={renderClassOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
        />
    );
};
