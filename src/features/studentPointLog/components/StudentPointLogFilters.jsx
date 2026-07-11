import { useState } from "react";
import { Dropdown, Input } from "../../../shared/components/ui";
import { getDateRange } from "../../../shared/utils";
import { TIME_RANGE_OPTIONS } from "../../../core/constants/options";

const TYPE_OPTIONS = [
    { value: "", label: "Tất cả loại điểm" },
    { value: "BONUS", label: "Cộng điểm" },
    { value: "PENALTY", label: "Trừ điểm" },
];

const SORT_OPTIONS = [
    { value: "createdAt", label: "Thời gian tạo" },
    { value: "pointLogId", label: "ID log" },
    { value: "points", label: "Số điểm" },
    { value: "type", label: "Loại điểm" },
    { value: "source", label: "Nguồn" },
];

const SORT_ORDER_OPTIONS = [
    { value: "desc", label: "Giảm dần" },
    { value: "asc", label: "Tăng dần" },
];

const TIME_RANGE_OPTIONS_WITH_DEFAULT = [
    { value: "", label: "Tùy chọn" },
    ...TIME_RANGE_OPTIONS,
];

export const StudentPointLogFilters = ({
    filters,
    search,
    onSearchChange,
    onFilterChange,
}) => {
    const [timeRange, setTimeRange] = useState("");

    const handleTimeRangeChange = (value) => {
        setTimeRange(value);

        if (!value) {
            onFilterChange({ fromDate: "", toDate: "" });
            return;
        }

        const { fromDate, toDate } = getDateRange(value);
        onFilterChange({ fromDate, toDate });
    };

    const handleDateChange = (field, value) => {
        setTimeRange("");
        onFilterChange({ [field]: value });
    };

    return (
        <div className="bg-white border border-border rounded-sm p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                    label="Tìm kiếm"
                    placeholder="Nguồn, tham chiếu, ghi chú..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />

                <Dropdown
                    label="Loại điểm"
                    options={TYPE_OPTIONS}
                    value={filters.type}
                    onChange={(value) => onFilterChange({ type: value })}
                />

                <Input
                    label="Nguồn"
                    placeholder="ADMIN_ADJUST, ATTENDANCE..."
                    value={filters.source}
                    onChange={(e) => onFilterChange({ source: e.target.value })}
                />

                <Input
                    label="Loại tham chiếu"
                    placeholder="MANUAL, ATTENDANCE..."
                    value={filters.referenceType}
                    onChange={(e) => onFilterChange({ referenceType: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Input
                    label="ID tham chiếu"
                    type="number"
                    min="1"
                    placeholder="VD: 123"
                    value={filters.referenceId}
                    onChange={(e) => onFilterChange({ referenceId: e.target.value })}
                />

                <Dropdown
                    label="Khoảng thời gian"
                    options={TIME_RANGE_OPTIONS_WITH_DEFAULT}
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                />

                <Input
                    type="date"
                    label="Từ ngày"
                    value={filters.fromDate}
                    onChange={(e) => handleDateChange("fromDate", e.target.value)}
                />

                <Input
                    type="date"
                    label="Đến ngày"
                    value={filters.toDate}
                    onChange={(e) => handleDateChange("toDate", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">
                    <Dropdown
                        label="Sắp xếp"
                        options={SORT_OPTIONS}
                        value={filters.sortBy}
                        onChange={(value) => onFilterChange({ sortBy: value })}
                    />
                    <Dropdown
                        label="Thứ tự"
                        options={SORT_ORDER_OPTIONS}
                        value={filters.sortOrder}
                        onChange={(value) => onFilterChange({ sortOrder: value })}
                    />
                </div>
            </div>
        </div>
    );
};
