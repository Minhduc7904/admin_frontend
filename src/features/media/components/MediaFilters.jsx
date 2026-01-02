import { Search, Filter } from 'lucide-react';
import { Input, Select } from '../../../shared/components/ui';

const TYPE_OPTIONS = [
    { value: '', label: 'Tất cả loại' },
    { value: 'IMAGE', label: 'Hình ảnh' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'AUDIO', label: 'Âm thanh' },
    { value: 'DOCUMENT', label: 'Tài liệu' },
    { value: 'OTHER', label: 'Khác' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'READY', label: 'Sẵn sàng' },
    { value: 'UPLOADING', label: 'Đang tải' },
    { value: 'FAILED', label: 'Thất bại' },
    { value: 'DELETED', label: 'Đã xóa' },
];

const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Ngày tải lên' },
    { value: 'fileSize', label: 'Kích thước' },
    { value: 'filename', label: 'Tên file' },
];

const SORT_ORDER_OPTIONS = [
    { value: 'desc', label: 'Giảm dần' },
    { value: 'asc', label: 'Tăng dần' },
];

export const MediaFilters = ({
    search,
    onSearchChange,
    type,
    onTypeChange,
    status,
    onStatusChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
}) => {
    return (
        <div className="bg-white border border-border rounded-sm p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Filter size={18} className="text-foreground-light" />
                <h3 className="font-medium text-foreground">Bộ lọc</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <div className="relative">
                        <Input
                            placeholder="Tìm kiếm theo tên file..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <Search
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-light"
                        />
                    </div>
                </div>

                {/* Type */}
                <Select
                    value={type}
                    onChange={(e) => onTypeChange(e.target.value)}
                    options={TYPE_OPTIONS}
                />

                {/* Status */}
                <Select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    options={STATUS_OPTIONS}
                />

                {/* Sort By */}
                <div className="grid grid-cols-2 gap-2">
                    <Select
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                        options={SORT_OPTIONS}
                    />
                    <Select
                        value={sortOrder}
                        onChange={(e) => onSortOrderChange(e.target.value)}
                        options={SORT_ORDER_OPTIONS}
                    />
                </div>
            </div>
        </div>
    );
};
