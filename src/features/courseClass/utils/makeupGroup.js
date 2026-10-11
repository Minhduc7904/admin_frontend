/**
 * Helper thuần cho cấu hình lớp học bù, tách khỏi Redux/React để dễ kiểm thử.
 */

/**
 * Chuẩn hóa chuỗi để tìm kiếm không phân biệt hoa thường và dấu tiếng Việt.
 */
export const normalizeSearchText = (value) =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();

/**
 * Lọc candidate theo tên lớp; từ khóa rỗng trả toàn bộ danh sách.
 */
export const filterMakeupCandidates = (candidates, keyword) => {
    const normalizedKeyword = normalizeSearchText(keyword);

    if (!normalizedKeyword) {
        return candidates;
    }

    return candidates.filter((candidate) =>
        normalizeSearchText(candidate.className).includes(normalizedKeyword)
    );
};

/**
 * So sánh hai danh sách ID như hai tập hợp, bỏ qua thứ tự.
 */
export const isSameIdSet = (left, right) => {
    if (left.length !== right.length) {
        return false;
    }

    const rightSet = new Set(right);
    return left.every((id) => rightSet.has(id));
};

/**
 * ID các lớp đang được chọn theo response của server.
 */
export const getSelectedClassIds = (candidates) =>
    candidates.filter((candidate) => candidate.selected).map((candidate) => candidate.classId);

/**
 * Chuỗi ngày `YYYY-MM-DD` từ server sang `dd/MM/yyyy`, không qua Date để không lệch múi giờ.
 */
export const formatMakeupDate = (value) => {
    if (typeof value !== 'string') {
        return null;
    }

    const [year, month, day] = value.split('-');
    return year && month && day ? `${day}/${month}/${year}` : null;
};

/**
 * Khoảng ngày hiển thị của lớp: "01/09/2026 - 31/05/2027", chỉ một đầu thì ghi "Từ ..." / "Đến ...".
 */
export const formatMakeupDateRange = (startDate, endDate) => {
    const start = formatMakeupDate(startDate);
    const end = formatMakeupDate(endDate);

    if (start && end) return `${start} - ${end}`;
    if (start) return `Từ ${start}`;
    if (end) return `Đến ${end}`;
    return null;
};
