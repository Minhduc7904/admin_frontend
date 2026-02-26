import { SearchInput, Dropdown, Checkbox } from '../../../shared/components/ui';
import { ClassSessionSearchSelect } from '../../classSesssion/components/ClassSessionSearchSelect';
import { ATTENDANCE_STATUS_OPTIONS } from '../../../core/constants/options';

/* ===================== STATUS OPTIONS ===================== */
const STATUS_OPTIONS_WITH_ALL = [
    { value: '', label: 'Tất cả trạng thái' },
    ...ATTENDANCE_STATUS_OPTIONS,
];

/* ===================== MONTH / YEAR OPTIONS ===================== */
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
}));

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - 2 + i,
    label: `${currentYear - 2 + i}`,
}));

export const AttendanceFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    selectedSession,
    onSessionChange,
    classId,
    /* tuition */
    showTuition = false,
    onShowTuitionChange,
    tuitionMonth,
    tuitionYear,
    onTuitionMonthChange,
    onTuitionYearChange,
}) => {
    return (
        <div className="mb-4 space-y-3">
            {/* ===== ROW 1: search / session / status ===== */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm theo tên học sinh, ghi chú..."
                    />
                </div>

                {/* Session filter */}
                <div className="w-64">
                    <ClassSessionSearchSelect
                        placeholder="Chọn buổi học..."
                        onSelect={onSessionChange}
                        value={selectedSession}
                        classId={classId}
                        label=''
                    />
                </div>

                {/* Status filter */}
                <div className="w-48">
                    <Dropdown
                        value={status}
                        onChange={onStatusChange}
                        options={STATUS_OPTIONS_WITH_ALL}
                        placeholder="Chọn trạng thái"
                    />
                </div>
            </div>

            {/* ===== ROW 2: tuition toggle ===== */}
            <div className="flex items-center gap-4">
                <Checkbox
                    id="show-tuition"
                    label="Hiển thị học phí"
                    checked={showTuition}
                    onChange={onShowTuitionChange}
                />

                {showTuition && (
                    <>
                        <div className="w-40">
                            <Dropdown
                                value={tuitionMonth}
                                onChange={onTuitionMonthChange}
                                options={MONTH_OPTIONS}
                            />
                        </div>
                        <div className="w-36">
                            <Dropdown
                                value={tuitionYear}
                                onChange={onTuitionYearChange}
                                options={YEAR_OPTIONS}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
