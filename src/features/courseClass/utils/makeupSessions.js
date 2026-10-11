/**
 * Helper thuần cho bảng "Buổi học bù trong tuần", tách khỏi React/Redux để dễ kiểm thử.
 * Tuần luôn tính từ Thứ Hai đến Chủ Nhật và được trao đổi với server dạng `YYYY-MM-DD`.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const pad = (value) => String(value).padStart(2, '0');

const parseDateOnly = (value) => {
    const match = DATE_ONLY.exec(String(value ?? ''));

    if (!match) {
        return null;
    }

    return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
};

const formatUtcDate = (date) => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

/**
 * Chuỗi `YYYY-MM-DD` của Thứ Hai trong tuần chứa `value` (mặc định hôm nay), theo giờ trình duyệt.
 */
export const getWeekStart = (value = new Date()) => {
    const date = new Date(value);
    const daysSinceMonday = (date.getDay() + 6) % 7;

    return formatUtcDate(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - daysSinceMonday)));
};

/**
 * Dời một Thứ Hai đi `offset` tuần (âm là lùi). Tính trên ngày UTC nên không lệch do múi giờ hay giờ mùa hè.
 */
export const shiftWeek = (weekStart, offset) => {
    const date = parseDateOnly(weekStart);

    if (!date) {
        return weekStart;
    }

    return formatUtcDate(new Date(date.getTime() + offset * 7 * DAY_MS));
};

/**
 * Nhãn khoảng tuần: "12/10 – 18/10/2026".
 */
export const formatWeekRange = (weekStart) => {
    const start = parseDateOnly(weekStart);

    if (!start) {
        return '';
    }

    const end = new Date(start.getTime() + 6 * DAY_MS);

    return `${pad(start.getUTCDate())}/${pad(start.getUTCMonth() + 1)} – ${pad(end.getUTCDate())}/${pad(end.getUTCMonth() + 1)}/${end.getUTCFullYear()}`;
};

/**
 * Nhãn ngày của buổi học (chuỗi `YYYY-MM-DD` từ server): "T3 13/10". Không qua `Date` địa phương nên không lệch ngày.
 */
export const formatSessionDay = (sessionDate) => {
    const date = parseDateOnly(sessionDate);

    if (!date) {
        return '';
    }

    return `${WEEKDAY_LABELS[date.getUTCDay()]} ${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}`;
};

/**
 * Dữ liệu hợp lệ của response `GET /course-classes/:id/makeup-sessions`: danh sách buổi luôn là mảng.
 */
export const normalizeMakeupSessions = (data) => ({
    groupId: data?.groupId ?? null,
    weekStart: data?.weekStart ?? null,
    weekEnd: data?.weekEnd ?? null,
    sessions: (Array.isArray(data?.sessions) ? data.sessions : []).map((session) => ({
        ...session,
        makeupCandidates: Array.isArray(session.makeupCandidates) ? session.makeupCandidates : [],
    })),
});
