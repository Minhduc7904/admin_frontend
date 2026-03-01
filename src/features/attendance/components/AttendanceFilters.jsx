import { SearchInput, Dropdown, Checkbox } from '../../../shared/components/ui';
import { ClassSessionSearchSelect } from '../../classSesssion/components/ClassSessionSearchSelect';
import { HomeworkContentSearchSelect } from '../../homeworkContent/components/HomeworkContentSearchSelect';
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

/* ===================== TUITION STATUS OPTIONS ===================== */
const TUITION_STATUS_OPTIONS = [
    { value: '', label: 'Tất cả học phí' },
    { value: 'PAID', label: 'Đã đóng' },
    { value: 'UNPAID', label: 'Chưa đóng' },
    { value: 'NO_TUITION', label: 'Chưa có học phí' },
];

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
    tuitionStatus,
    onTuitionStatusChange,
    /* homework */
    hasClass = false,
    showHomework = false,
    onShowHomeworkChange,
    homeworkContents = [],
    selectedHomework,
    onHomeworkChange,
    loadingHomework = false,
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
                    <div className="w-48">
                        <Dropdown
                            value={tuitionStatus}
                            onChange={onTuitionStatusChange}
                            options={TUITION_STATUS_OPTIONS}
                            placeholder="Lọc trạng thái học phí"
                        />
                    </div>
                </>
            )}
        </div>

        {/* ===== ROW 3: homework toggle ===== */}
        <div className="flex items-center gap-4">
            <Checkbox
                id="show-homework"
                label="Hiển thị bài tập về nhà"
                checked={showHomework}
                onChange={onShowHomeworkChange}
                disabled={!hasClass}
            />

            {showHomework && (
                <div className="w-96">
                    <HomeworkContentSearchSelect
                        placeholder="Tìm kiếm bài tập..."
                        onSelect={onHomeworkChange}
                        value={selectedHomework}
                        homeworkContents={homeworkContents}
                        loading={loadingHomework}
                        disabled={loadingHomework}
                        label=""
                    />
                </div>
            )}
        </div>
    </div>
    );
};
