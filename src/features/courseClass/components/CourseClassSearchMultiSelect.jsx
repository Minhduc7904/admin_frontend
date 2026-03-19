import { useDispatch } from 'react-redux';
import { SearchableMultiSelect } from '../../../shared/components/ui';
import { searchCourseClassesAsync } from '../store/courseClassSlice';

/**
 * CourseClassSearchMultiSelect
 * Wrapper component for searching & selecting MULTIPLE course classes
 */
export const CourseClassSearchMultiSelect = ({
    label = 'Lớp học',
    placeholder = 'Tìm kiếm lớp học...',
    value = [],                     // array<CourseClass>
    onChange,                       // (classes[]) => void
    error,
    required = false,
    disabled = false,
    className = '',
    courseIds = [],                 // 🔥 filter theo courseIds
}) => {
    const dispatch = useDispatch();

    /* ===================== SEARCH ===================== */
    const handleSearch = async (keyword) => {
        try {
            const result = await dispatch(
                searchCourseClassesAsync({
                    search: keyword,
                    courseIds: courseIds.length ? courseIds : undefined,
                })
            ).unwrap();

            return result.data || [];
        } catch (error) {
            console.error('Error searching course classes:', error);
            return [];
        }
    };

    /* ===================== DEFAULT ===================== */
    const fetchDefaultClasses = async () => {
        try {
            const result = await dispatch(
                searchCourseClassesAsync({
                    courseIds: courseIds.length ? courseIds : undefined,
                })
            ).unwrap();

            return result.data || [];
        } catch (error) {
            console.error('Error fetching default course classes:', error);
            return [];
        }
    };

    /* ===================== RENDER OPTION ===================== */
    const renderClassOption = (courseClass) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium">
                    {courseClass.className || 'N/A'}
                </span>

                <div className="flex items-center gap-2 text-xs text-foreground-light ">
                    {courseClass.course?.title && (
                        <span>{courseClass.course.title}</span>
                    )}

                    {courseClass.room && (
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                            / Phòng {courseClass.room}
                        </span>
                    )}

                    {courseClass.startDate && (
                        <span>
                            / {new Date(courseClass.startDate).toLocaleDateString('vi-VN')}
                        </span>
                    )}
                    <span className="text-xs text-foreground-light">
                        / Lịch học: {courseClass.weeklySchedule || 'Chưa có lịch học'}
                    </span>
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
            fetchDefaultItems={fetchDefaultClasses}
            getOptionLabel={(cls) => cls?.className || 'N/A'}
            getOptionValue={(cls) => cls?.classId}
            renderOption={renderClassOption}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
        />
    );
};
