import { SearchInput, Dropdown } from '../../../shared/components/ui'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { TuitionPaymentStatus, STATUS_OPTIONS } from '../constants/tuition-payment.constant'

const STATUS_OPTIONS_WITH_DEFAULT = [
    { value: '', label: 'Tất cả trạng thái' },
    ...STATUS_OPTIONS,
]

const MONTH_OPTIONS = [
    { value: '', label: 'Tất cả tháng' },
    ...Array.from({ length: 12 }).map((_, i) => ({
        value: i + 1,
        label: `Tháng ${i + 1}`,
    })),
]

const YEAR_OPTIONS = [
    { value: '', label: 'Tất cả năm' },
    ...Array.from({ length: 6 }).map((_, i) => {
        const year = new Date().getFullYear() - i
        return { value: year, label: `Năm ${year}` }
    }),
]

export const TuitionPaymentFilters = ({
    search,
    onSearchChange,

    status,
    onStatusChange,

    month,
    onMonthChange,

    year,
    onYearChange,

    showStats,
    onToggleStats,
}) => {
    return (
        <div className="mb-4 bg-white border border-border rounded-sm p-4 space-y-4">
            {/* ===== Row 1: Search + Filters ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tên học sinh, ghi chú..."
                    />
                </div>

                <div className="lg:col-span-2">
                    <Dropdown
                        value={status}
                        onChange={onStatusChange}
                        options={STATUS_OPTIONS_WITH_DEFAULT}
                        placeholder="Trạng thái"
                    />
                </div>

                <div className="lg:col-span-2">
                    <Dropdown
                        value={month}
                        onChange={onMonthChange}
                        options={MONTH_OPTIONS}
                        placeholder="Tháng"
                    />
                </div>

                <div className="lg:col-span-2">
                    <Dropdown
                        value={year}
                        onChange={onYearChange}
                        options={YEAR_OPTIONS}
                        placeholder="Năm"
                    />
                </div>
            </div>

            {/* ===== Row 2: Toggle Stats ===== */}
            <div className="flex items-center justify-center pt-2 border-t border-border">
                <button
                    type="button"
                    onClick={onToggleStats}
                    className="
                        w-full
                        flex items-center justify-center gap-2
                        text-sm font-medium
                        px-3 py-2 rounded
                        border transition-all
                        hover:bg-gray-50
                    "
                >
                    <span>
                        {showStats ? 'Ẩn thống kê' : 'Xem thống kê'}
                    </span>

                    {showStats ? (
                        <ChevronUp size={16} />
                    ) : (
                        <ChevronDown size={16} />
                    )}
                </button>
            </div>
        </div>
    )
}
