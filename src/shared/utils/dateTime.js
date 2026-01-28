/**
 * Format a date to Vietnamese date string
 * @param {string | Date} date - Date to format
 * @returns {string} Formatted date string (dd/MM/yyyy)
 */
export const formatDate = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Format a time to Vietnamese time string
 * @param {string | Date} time - Time to format
 * @returns {string} Formatted time string (HH:mm)
 */
export const formatTime = (time) => {
    if (!time) return '';

    const d = new Date(time);
    if (isNaN(d.getTime())) return '';

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
};

/**
 * Format a date and time to Vietnamese datetime string
 * @param {string | Date} dateTime - DateTime to format
 * @returns {string} Formatted datetime string (dd/MM/yyyy HH:mm)
 */
export const formatDateTime = (dateTime) => {
    if (!dateTime) return '';

    const d = new Date(dateTime);
    if (isNaN(d.getTime())) return '';

    return `${formatDate(d)} ${formatTime(d)}`;
};

/**
 * Format a date and time to full Vietnamese datetime string with seconds
 * @param {string | Date} dateTime - DateTime to format
 * @returns {string} Formatted datetime string (dd/MM/yyyy HH:mm:ss)
 */
export const formatDateTimeFull = (dateTime) => {
    if (!dateTime) return '';

    const d = new Date(dateTime);
    if (isNaN(d.getTime())) return '';

    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${formatDate(d)} ${formatTime(d)}:${seconds}`;
};

/**
 * Format time range
 * @param {string | Date} startTime - Start time
 * @param {string | Date} endTime - End time
 * @returns {string} Formatted time range (HH:mm - HH:mm)
 */
export const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return '';

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * Format date range
 * @param {string | Date} startDate - Start date
 * @param {string | Date} endDate - End date
 * @returns {string} Formatted date range (dd/MM/yyyy - dd/MM/yyyy)
 */
export const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '';

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param {string | Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const now = new Date();
    const diffMs = now - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) {
        return diffSec <= 5 ? 'Vừa xong' : `${diffSec} giây trước`;
    } else if (diffMin < 60) {
        return `${diffMin} phút trước`;
    } else if (diffHour < 24) {
        return `${diffHour} giờ trước`;
    } else if (diffDay < 30) {
        return `${diffDay} ngày trước`;
    } else if (diffMonth < 12) {
        return `${diffMonth} tháng trước`;
    } else {
        return `${diffYear} năm trước`;
    }
};

/**
 * Check if date is today
 * @param {string | Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
    if (!date) return false;

    const d = new Date(date);
    if (isNaN(d.getTime())) return false;

    const today = new Date();
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
};

/**
 * Check if date is in the past
 * @param {string | Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPast = (date) => {
    if (!date) return false;

    const d = new Date(date);
    if (isNaN(d.getTime())) return false;

    return d < new Date();
};

/**
 * Check if date is in the future
 * @param {string | Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFuture = (date) => {
    if (!date) return false;

    const d = new Date(date);
    if (isNaN(d.getTime())) return false;

    return d > new Date();
};

/**
 * Get day name in Vietnamese
 * @param {string | Date} date - Date to get day name
 * @returns {string} Day name (Thứ 2, Thứ 3, ..., Chủ nhật)
 */
export const getDayName = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return dayNames[d.getDay()];
};

/**
 * Get month name in Vietnamese
 * @param {string | Date} date - Date to get month name
 * @returns {string} Month name (Tháng 1, Tháng 2, ...)
 */
export const getMonthName = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    return `Tháng ${d.getMonth() + 1}`;
};

/**
 * Format date to ISO string (YYYY-MM-DD) for input[type="date"]
 * @param {string | Date} date - Date to format
 * @returns {string} ISO date string
 */
export const toISODate = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Format time to ISO string (HH:mm) for input[type="time"]
 * @param {string | Date} time - Time to format
 * @returns {string} ISO time string
 */
export const toISOTime = (time) => {
    if (!time) return '';

    const d = new Date(time);
    if (isNaN(d.getTime())) return '';

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
};

/**
 * Calculate duration between two dates
 * @param {string | Date} startDate - Start date
 * @param {string | Date} endDate - End date
 * @returns {object} Duration object with days, hours, minutes
 */
export const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return { days: 0, hours: 0, minutes: 0 };

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { days: 0, hours: 0, minutes: 0 };
    }

    const diffMs = end - start;
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    return {
        days: diffDay,
        hours: diffHour % 24,
        minutes: diffMin % 60,
        totalMinutes: diffMin,
        totalHours: diffHour,
    };
};

/**
 * Format duration to human readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatDuration = (minutes) => {
    if (!minutes || minutes <= 0) return '0 phút';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
        return `${mins} phút`;
    } else if (mins === 0) {
        return `${hours} giờ`;
    } else {
        return `${hours} giờ ${mins} phút`;
    }
};

// Helper functions to calculate date ranges
export const getDateRange = (rangeType) => {
    const today = new Date();
    let fromDate, toDate;

    switch (rangeType) {
        case 'today': {
            fromDate = new Date(today);
            fromDate.setHours(0, 0, 0, 0);

            toDate = new Date(today);
            toDate.setHours(23, 59, 59, 999);
            break;
        }

        case 'yesterday': {
            fromDate = new Date(today);
            fromDate.setDate(today.getDate() - 1);
            fromDate.setHours(0, 0, 0, 0);

            toDate = new Date(fromDate);
            toDate.setHours(23, 59, 59, 999);
            break;
        }

        case 'dayBeforeYesterday': {
            fromDate = new Date(today);
            fromDate.setDate(today.getDate() - 2);
            fromDate.setHours(0, 0, 0, 0);

            toDate = new Date(fromDate);
            toDate.setHours(23, 59, 59, 999);
            break;
        }

        case 'thisWeek': {
            // Tuần này: thứ 2 → CN
            const dayOfWeek = today.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

            fromDate = new Date(today);
            fromDate.setDate(today.getDate() + diff);
            fromDate.setHours(0, 0, 0, 0);

            toDate = new Date(fromDate);
            toDate.setDate(fromDate.getDate() + 6);
            toDate.setHours(23, 59, 59, 999);
            break;
        }

        case 'lastWeek': {
            const dayOfWeek = today.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

            fromDate = new Date(today);
            fromDate.setDate(today.getDate() + diff - 7);
            fromDate.setHours(0, 0, 0, 0);

            toDate = new Date(fromDate);
            toDate.setDate(fromDate.getDate() + 6);
            toDate.setHours(23, 59, 59, 999);
            break;
        }

        case 'thisMonth': {
            fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
            fromDate.setHours(0, 0, 0, 0);

            toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            toDate.setHours(23, 59, 59, 999);
            break;
        }

        case 'lastMonth': {
            fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            fromDate.setHours(0, 0, 0, 0);

            toDate = new Date(today.getFullYear(), today.getMonth(), 0);
            toDate.setHours(23, 59, 59, 999);
            break;
        }

        default:
            return { fromDate: '', toDate: '' };
    }

    return {
        fromDate: toISODate(fromDate),
        toDate: toISODate(toDate),
    };
};