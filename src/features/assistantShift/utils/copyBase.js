/**
 * Helper thuần cho luồng "Copy ca cơ sở", tách khỏi React/Redux để dễ kiểm thử.
 */

/**
 * Số ca cơ sở đã chọn có và chưa gắn lớp. Chỉ ca có lớp mới sinh được buổi học khi bật "tạo buổi học".
 */
export const countSelectedShiftsByClass = (baseShifts, selectedIds) => {
    const selected = baseShifts.filter((shift) => selectedIds.has(shift.assistantShiftId));
    const withClass = selected.filter((shift) => shift.classId != null).length;

    return { withClass, withoutClass: selected.length - withClass };
};

/**
 * Body POST /assistant-shifts/base/copy. Cờ `createClassSessions` chỉ được gửi khi bật.
 */
export const buildCopyBasePayload = ({
    ids,
    paste,
    copyAssignments,
    copyAssignmentAttendanceStatus,
    createClassSessions = false,
}) => ({
    ids,
    startPasteAt: paste.startAt,
    endPasteAt: paste.endAt,
    copyAssignments,
    copyAssignmentAttendanceStatus,
    ...(createClassSessions ? { createClassSessions: true } : {}),
});

const SKIP_LABELS = [
    ['skippedExistingSessionCount', 'buổi đã có'],
    ['skippedNoClassCount', 'ca chưa gắn lớp'],
    ['skippedEndedCourseCount', 'lớp đã kết thúc'],
];

/**
 * Thông báo kết quả sao chép từ `data` của response, ví dụ
 * "Đã tạo 3 ca, 2 buổi học. Bỏ qua: 1 ca chưa gắn lớp."
 */
export const formatCopyBaseResultMessage = (result) => {
    const copiedShiftCount = result?.copiedShiftCount ?? 0;

    if (typeof result?.createdSessionCount !== 'number') {
        return `Đã tạo ${copiedShiftCount} ca trợ giảng.`;
    }

    const skipped = SKIP_LABELS.filter(([key]) => result[key] > 0).map(([key, label]) => `${result[key]} ${label}`);
    const created = `Đã tạo ${copiedShiftCount} ca, ${result.createdSessionCount} buổi học.`;

    return skipped.length > 0 ? `${created} Bỏ qua: ${skipped.join(', ')}.` : created;
};
