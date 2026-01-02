import { useState } from 'react';
import { SearchInput, Dropdown } from '../../../shared/components/ui';
import { DateTimePicker } from '../../../shared/components/ui/DateTimePicker';
import { Calendar, X } from 'lucide-react';

export const AuditLogFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    resourceType,
    onResourceTypeChange,
    fromDate,
    onFromDateChange,
    toDate,
    onToDateChange,
}) => {
    const [showDateFilter, setShowDateFilter] = useState(false);
    const statusOptions = [
        { value: '', label: 'Tất cả trạng thái' },
        { value: 'SUCCESS', label: 'Thành công' },
        { value: 'FAIL', label: 'Thất bại' },
        { value: 'ROLLBACK', label: 'Đã rollback' },
    ];

    const resourceTypeOptions = [
        { value: '', label: 'Tất cả resource' },
        { value: 'role', label: 'Role' },
        { value: 'permission', label: 'Permission' },
        { value: 'admin', label: 'Admin' },
        { value: 'student', label: 'Student' },
        { value: 'user', label: 'User' },
    ];

    return (
        <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm theo action, resource..."
                    />
                </div>

                {/* Status Filter */}
                <Dropdown
                    value={status}
                    onChange={onStatusChange}
                    options={statusOptions}
                    placeholder="Chọn trạng thái"
                />

                {/* Resource Type Filter */}
                <Dropdown
                    value={resourceType}
                    onChange={onResourceTypeChange}
                    options={resourceTypeOptions}
                    placeholder="Chọn resource"
                />

                {/* Date Range */}
                <div className="lg:col-span-1">
                    <button 
                        onClick={() => setShowDateFilter(!showDateFilter)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors flex items-center justify-center gap-2 ${
                            showDateFilter || fromDate || toDate
                                ? 'border-info bg-info-bg text-info-text'
                                : 'border-border text-foreground hover:bg-gray-50'
                        }`}
                    >
                        <Calendar size={16} />
                        Lọc theo ngày
                    </button>
                </div>
            </div>

            {/* Date Range Pickers */}
            {showDateFilter && (
                <div className="mt-4 pt-4 border-t border-b pb-4 border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DateTimePicker
                            label="Từ ngày"
                            value={fromDate}
                            onChange={onFromDateChange}
                            placeholder="Chọn ngày giờ bắt đầu"
                        />
                        <DateTimePicker
                            label="Đến ngày"
                            value={toDate}
                            onChange={onToDateChange}
                            placeholder="Chọn ngày giờ kết thúc"
                        />
                    </div>
                    {(fromDate || toDate) && (
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={() => {
                                    onFromDateChange('');
                                    onToDateChange('');
                                }}
                                className="text-sm text-error hover:text-error-dark flex items-center gap-1 transition-colors"
                            >
                                <X size={16} />
                                Xóa bộ lọc ngày
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
