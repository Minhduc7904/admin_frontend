import { Search } from 'lucide-react';
import { Input, Select } from '../../../shared/components/ui';
import { TAG_STATUS_OPTIONS, TAG_TYPE_FILTER_OPTIONS } from '../constants/tag.constants';

export const TagFilters = ({
    search,
    type,
    isActive,
    onSearchChange,
    onTypeChange,
    onStatusChange,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
                <Input
                    type="text"
                    placeholder="Tìm kiếm tag theo tên hoặc slug..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    icon={<Search size={16} />}
                />
            </div>

            <Select
                name="type"
                value={type}
                onChange={(e) => onTypeChange(e.target.value)}
                options={TAG_TYPE_FILTER_OPTIONS}
                placeholder="Tất cả loại tag"
            />

            <Select
                name="isActive"
                value={isActive}
                onChange={(e) => onStatusChange(e.target.value)}
                options={TAG_STATUS_OPTIONS}
                placeholder="Tất cả trạng thái"
            />
        </div>
    );
};
