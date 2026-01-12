import { SearchInput, Dropdown } from '../../../shared/components/ui';
import { ClassSessionSearchSelect } from '../../classSesssion/components/ClassSessionSearchSelect';

/* ===================== STATUS OPTIONS ===================== */
const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PRESENT', label: 'Có mặt' },
    { value: 'ABSENT', label: 'Vắng' },
    { value: 'LATE', label: 'Muộn' },
    { value: 'MAKEUP', label: 'Học bù' },
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
                    />
                </div>

                {/* Status filter */}
                <div className="w-48">
                    <Dropdown
                        value={status}
                        onChange={onStatusChange}
                        options={STATUS_OPTIONS}
                        placeholder="Chọn trạng thái"
                    />
                </div>
            </div>
        </div>
    );
};
