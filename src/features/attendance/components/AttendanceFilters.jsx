import { SearchInput, Dropdown } from '../../../shared/components/ui';
import { ClassSessionSearchSelect } from '../../classSesssion/components/ClassSessionSearchSelect';
import { ATTENDANCE_STATUS_OPTIONS  } from '../../../core/constants/options';
/* ===================== STATUS OPTIONS ===================== */
const STATUS_OPTIONS_WITH_ALL = [
    { value: '', label: 'Tất cả trạng thái' },
    ...ATTENDANCE_STATUS_OPTIONS,
];

export const AttendanceFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    selectedSession,
    onSessionChange,
    classId,
}) => {
    return (
        <div className="mb-4">
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
        </div>
    );
};
