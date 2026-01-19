import { Search, Filter } from 'lucide-react'
import { Input, Select } from '../../../shared/components/ui'
import {
    MEDIA_TYPE_OPTIONS,
    MEDIA_STATUS_OPTIONS,
    MEDIA_SORT_OPTIONS,
    SORT_ORDER_OPTIONS,
} from '../../../core/constants/options'

const TYPE_OPTIONS = [
    { value: '', label: 'Tất cả loại' },
    ...MEDIA_TYPE_OPTIONS,
]

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    ...MEDIA_STATUS_OPTIONS,
]

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
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Filter size={18} className="text-foreground-light" />
                <h3 className="font-medium text-foreground">Bộ lọc</h3>
            </div>

            {/* Filters */}
            <div className="space-y-4">

                {/* Row 1: Search + Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search (2 cols) */}
                    <div className="md:col-span-2 relative">
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

                    {/* Type */}
                    <Select
                        value={type}
                        onChange={(e) => onTypeChange(e.target.value)}
                        options={TYPE_OPTIONS}
                    />
                </div>

                {/* Row 2: Status + Sort + Order */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status */}
                    <Select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        options={STATUS_OPTIONS}
                    />

                    {/* Sort By */}
                    <Select
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                        options={MEDIA_SORT_OPTIONS}
                    />

                    {/* Sort Order */}
                    <Select
                        value={sortOrder}
                        onChange={(e) => onSortOrderChange(e.target.value)}
                        options={SORT_ORDER_OPTIONS}
                    />
                </div>
            </div>
        </div>
    )
}
