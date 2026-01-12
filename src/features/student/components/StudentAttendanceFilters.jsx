import { useState } from 'react';
import { Input, Dropdown } from '../../../shared/components/ui';
import { toISODate, getDateRange } from '../../../shared/utils';
import { ClassSearchSelect } from '../../courseClass/components';
import { ClassSessionSearchSelect } from '../../classSesssion/components';

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PRESENT', label: 'Có mặt' },
    { value: 'ABSENT', label: 'Vắng' },
    { value: 'LATE', label: 'Muộn' },
    { value: 'MAKEUP', label: 'Học bù' },
];

const TIME_RANGE_OPTIONS = [
    { value: '', label: 'Tùy chọn' },
    { value: 'thisWeek', label: 'Tuần này' },
    { value: 'lastWeek', label: 'Tuần trước' },
    { value: 'thisMonth', label: 'Tháng này' },
    { value: 'lastMonth', label: 'Tháng trước' },
];

export const StudentAttendanceFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    fromDate,
    onFromDateChange,
    toDate,
    onToDateChange,
    selectedClass,
    onClassChange,
    selectedSession,
    onSessionChange,
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                    <Input
                        type="text"
                        label="Tìm kiếm"
                        placeholder="Tên buổi học, lớp, ghi chú..."
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

                {/* Class Filter */}
                <div>
                    <ClassSearchSelect
                        label="Lọc theo lớp"
                        placeholder="Chọn lớp học..."
                        onSelect={onClassChange}
                        value={selectedClass}
                    />
                </div>

                {/* Session Filter */}
                <div>
                    <ClassSessionSearchSelect
                        label="Lọc theo buổi học"
                        placeholder="Chọn buổi học..."
                        onSelect={onSessionChange}
                        value={selectedSession}
                        classId={selectedClass?.classId}
                        disabled={!selectedClass}
                    />
                </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Time Range Preset */}
                <div>
                    <Dropdown
                        label="Khoảng thời gian"
                        options={TIME_RANGE_OPTIONS}
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
