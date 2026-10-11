import { ATTENDANCE_STATUS_OPTIONS, ATTENDANCE_TYPE_OPTIONS } from "../../../core/constants/options";

/**
 * `status` (PRESENT | ABSENT | LATE) and `attendanceType` (REGULAR | MAKEUP) are independent fields.
 * Nothing here infers one from the other, from notes, or from any other field.
 */
export const DEFAULT_ATTENDANCE_TYPE = "REGULAR";

const labelOf = (options, value) => options.find((option) => option.value === value)?.label ?? null;

export const getAttendanceStatusLabel = (status) => labelOf(ATTENDANCE_STATUS_OPTIONS, status);

export const getAttendanceTypeLabel = (attendanceType) => labelOf(ATTENDANCE_TYPE_OPTIONS, attendanceType);

const isKnownType = (attendanceType) => getAttendanceTypeLabel(attendanceType) !== null;

const withoutEmpty = (payload) =>
    Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined && value !== ""));

/** Create always sends an explicit type; the default is REGULAR. */
export const buildCreateAttendancePayload = ({ sessionId, studentId, status, attendanceType, notes }) =>
    withoutEmpty({
        sessionId,
        studentId,
        status,
        attendanceType: isKnownType(attendanceType) ? attendanceType : DEFAULT_ATTENDANCE_TYPE,
        notes,
    });

/**
 * Edit sends the type held in the form (loaded from the API). When the form has no known type the field
 * is left out, so the backend keeps the stored value instead of the UI guessing one.
 */
export const buildUpdateAttendancePayload = ({ status, attendanceType, notes }) =>
    withoutEmpty({
        status,
        attendanceType: isKnownType(attendanceType) ? attendanceType : undefined,
        notes,
    });

/** Status-only change (inline dropdown): the type is deliberately not part of the payload. */
export const buildStatusOnlyPayload = (status) => ({ status });

export const buildBulkAttendancePayload = ({ sessionId, status, attendanceType, notes }) =>
    withoutEmpty({
        sessionId,
        status,
        attendanceType: isKnownType(attendanceType) ? attendanceType : DEFAULT_ATTENDANCE_TYPE,
        notes,
    });

/** List query: status and attendanceType filters are separate parameters. */
export const buildAttendanceListParams = ({ statusFilter, attendanceTypeFilter, ...rest }) =>
    withoutEmpty({
        ...rest,
        status: statusFilter || undefined,
        attendanceType: isKnownType(attendanceTypeFilter) ? attendanceTypeFilter : undefined,
    });

/** Form state for editing an existing record. */
export const attendanceToFormData = (attendance) => ({
    sessionId: attendance.sessionId,
    studentId: attendance.studentId,
    status: attendance.status,
    attendanceType: attendance.attendanceType,
    notes: attendance.notes || "",
});

export const countMakeupAttendances = (attendances) =>
    attendances.filter((attendance) => attendance.attendanceType === "MAKEUP").length;
