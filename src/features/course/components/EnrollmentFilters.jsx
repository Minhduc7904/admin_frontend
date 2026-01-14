import { SearchInput, Dropdown } from '../../../shared/components/ui';
import { ENROLMENT_STATUS_OPTIONS } from '../../../core/constants';
/* ===================== STATUS OPTIONS ===================== */
const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    ...ENROLMENT_STATUS_OPTIONS,
];

export const EnrollmentFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
}) => {
    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm học viên (tên, email, ID)..."
                    />
                </div>

                {/* Status filter */}
                <div className="w-64">
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
