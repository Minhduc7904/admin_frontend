import { formatTimeRange } from "../../../shared/utils/dateTime";

/**
 * Pure helpers for the makeup link between attendance records.
 * A made-up absence is an ABSENT record whose `makeupByAttendanceId` points at the PRESENT record
 * that made it up. Nothing here guesses the link from notes, type or dates.
 */

export const isMadeUpAbsence = (attendance) =>
    attendance?.status === "ABSENT" &&
    (attendance.isMadeUp === true ||
        (attendance.makeupByAttendanceId !== null && attendance.makeupByAttendanceId !== undefined));

/** "Điểm danh" is offered for every record that is not PRESENT yet (ABSENT and LATE). */
export const canCheckIn = (attendance) => !!attendance && attendance.status !== "PRESENT";

export const canCancelCheckIn = (attendance) => attendance?.status === "PRESENT";

/** Checking in an absence that was already made up needs an explicit confirmation. */
export const needsMakeupConfirm = (attendance) => canCheckIn(attendance) && isMadeUpAbsence(attendance);

/** Keeps fields only the list endpoint returns (otherAttendancesInWeek, tuition, student.hasParentZaloId...). */
export const mergeAttendanceRow = (oldRow, newRow) => {
    const merged = { ...(oldRow || {}), ...(newRow || {}) };
    for (const key of ["student", "classSession"]) {
        if (oldRow?.[key] && newRow?.[key]) merged[key] = { ...oldRow[key], ...newRow[key] };
    }
    return merged;
};

/** Detail panel: the fetched record wins, the row snapshot fills what the detail endpoint does not return. */
export const pickDetailAttendance = (selected, fetched) => {
    if (!selected) return fetched || null;
    if (fetched && fetched.attendanceId === selected.attendanceId) {
        return mergeAttendanceRow(selected, fetched);
    }
    return selected;
};

/** "YYYY-MM-DD" (or ISO date) -> "dd/MM/yyyy" without timezone shifts. */
export const formatMakeupLinkDate = (sessionDate) => {
    if (!sessionDate) return "";
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(sessionDate));
    return match ? `${match[3]}/${match[2]}/${match[1]}` : "";
};

/** "Lớp A - Buổi 3 • 12/10/2026 • 18:00 - 19:30" */
export const formatMakeupLinkLabel = (summary) => {
    if (!summary) return "";
    const title = [summary.className, summary.sessionName || (summary.sessionId ? `Buổi #${summary.sessionId}` : "")]
        .filter(Boolean)
        .join(" - ");
    const date = formatMakeupLinkDate(summary.sessionDate);
    const time = formatTimeRange(summary.startTime, summary.endTime);
    return [title, date, time].filter(Boolean).join(" • ");
};

export const getLinkedAbsenceCount = (response) => {
    const count = Number(response?.data?.data?.linkedAbsenceCount ?? response?.data?.linkedAbsenceCount ?? 0);
    return Number.isFinite(count) && count > 0 ? count : 0;
};

export const buildCheckInSuccessMessage = (linkedCount) =>
    linkedCount > 0 ? `Đã nối ${linkedCount} buổi vắng được học bù` : "";

export const buildCancelCheckInSuccessMessage = (releasedCount) =>
    releasedCount > 0 ? `Đã gỡ ${releasedCount} buổi vắng khỏi buổi học bù` : "";

/**
 * Quick attendance: check the student in to every selected session without stopping at the first failure.
 * Sessions run one after another because each check-in can link absences that the next one must see.
 * `checkIn(payload)` must reject on failure (e.g. a thunk dispatch followed by `.unwrap()`).
 * Returns the failed sessions so the caller can keep the panel open instead of swallowing errors.
 */
export const runQuickCheckIns = async ({ sessions, studentId, checkIn }) => {
    const failed = [];
    for (const session of sessions) {
        try {
            await checkIn({ sessionId: session.sessionId, studentId });
        } catch {
            failed.push(session);
        }
    }
    return { total: sessions.length, failed, succeeded: sessions.length - failed.length };
};
