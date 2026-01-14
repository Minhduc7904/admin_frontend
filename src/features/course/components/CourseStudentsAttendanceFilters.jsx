import { useState } from 'react';
import { Input, Dropdown } from '../../../shared/components/ui';
import { getDateRange } from '../../../shared/utils';
import { ATTENDANCE_STATUS_OPTIONS, TIME_RANGE_OPTIONS } from '../../../core/constants/options';

/* ===================== STATUS OPTIONS ===================== */
const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    ...ATTENDANCE_STATUS_OPTIONS,
];

const TIME_RANGE_OPTIONS_WITH_DEFAULT = [
    { value: '', label: 'Tùy chọn' },
    ...TIME_RANGE_OPTIONS,
];

export const CourseStudentsAttendanceFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    fromDate,
    onFromDateChange,
    toDate,
    onToDateChange,
}) => {
    const [timeRange, setTimeRange] = useState('');

    const handleTimeRangeChange = (value) => {
        setTimeRange(value);

        if (value) {
            const { fromDate: from, toDate: to } = getDateRange(value);
            onFromDateChange(from);
            onToDateChange(to);
        } else {
            // Reset dates when selecting "Tùy chọn"
            onFromDateChange('');
            onToDateChange('');
        }
    };

    return (
        <div className="bg-white border border-border rounded-sm p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                    <Input
                        type="text"
                        label="Tìm kiếm"
                        placeholder="Tên học sinh, email, SĐT..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <Dropdown
                        label="Trạng thái"
                        options={STATUS_OPTIONS}
                        value={status}
                        onChange={onStatusChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Time Range Preset */}
                <div>
                    <Dropdown
                        label="Khoảng thời gian"
                        options={TIME_RANGE_OPTIONS_WITH_DEFAULT}
                        value={timeRange}
                        onChange={handleTimeRangeChange}
                    />
                </div>

                {/* From Date */}
                <div>
                    <Input
                        type="date"
                        label="Từ ngày"
                        value={fromDate}
                        onChange={(e) => {
                            onFromDateChange(e.target.value);
                            setTimeRange(''); // Reset preset when manual date is selected
                        }}
                    />
                </div>

                {/* To Date */}
                <div>
                    <Input
                        type="date"
                        label="Đến ngày"
                        value={toDate}
                        onChange={(e) => {
                            onToDateChange(e.target.value);
                            setTimeRange(''); // Reset preset when manual date is selected
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
