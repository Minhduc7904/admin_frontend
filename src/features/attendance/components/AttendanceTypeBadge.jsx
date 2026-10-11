import { getAttendanceTypeLabel } from '../utils/attendanceFields';

const TYPE_BADGE = {
    REGULAR: 'bg-gray-100 text-gray-600',
    MAKEUP: 'bg-blue-100 text-blue-700',
};

/**
 * Shows the attendance type next to (never instead of) the attendance status.
 * Unknown or missing types render nothing: the type is never inferred.
 */
export const AttendanceTypeBadge = ({ attendanceType }) => {
    const label = getAttendanceTypeLabel(attendanceType);
    if (!label) return null;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[attendanceType]}`}>
            {label}
        </span>
    );
};
