import { useDispatch } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import {
    searchStudentsAsync,
} from '../store/studentSlice';

/**
 * StudentSearchSelect
 * Component tìm kiếm & chọn học viên
 * Dùng cho Course Enrollment (Create)
 */
export const StudentSearchSelect = ({
    label = 'Học viên',
    placeholder = 'Tìm kiếm học viên...',
    onSelect,
    value,
    error,
    required = false,
    disabled = false,
    className = '',
}) => {
    const dispatch = useDispatch();

    /* ===================== SEARCH ===================== */
    const handleSearch = async (keyword) => {
        try {
            const result = await dispatch(
                searchStudentsAsync({
                    search: keyword,
                    limit: 10,
                })
            ).unwrap();

            return result.data;
        } catch (error) {
            console.error('Error searching students:', error);
            return [];
        }
    };

    /* ===================== DEFAULT LIST ===================== */
    const fetchDefaultStudents = async () => {
        try {
            const result = await dispatch(
                searchStudentsAsync({
                    page: 1,
                    limit: 10,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                })
            ).unwrap();

            return result.data;
        } catch (error) {
            console.error('Error fetching default students:', error);
            return [];
        }
    };

    /* ===================== RENDER OPTION ===================== */
    const renderStudentOption = (student) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium">
                    {student.fullName || student.name || 'N/A'}
                </span>
                <span className="text-xs text-foreground-light">
                    {student.username} / {student.studentPhone || 'N/A'} / {student.parentPhone || 'N/A'} / {'Lớp ' + (student.grade || 'N/A')} / {student.school || 'N/A'}
                </span>
            </div>
        );
    };

    return (
        <SearchableSelect
            label={label}
            placeholder={placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultStudents}
            onSelect={onSelect}
            getOptionLabel={(student) =>
                student?.fullName || student?.name || 'N/A'
            }
            getOptionValue={(student) => student?.studentId}
            renderOption={renderStudentOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
        />
    );
};
