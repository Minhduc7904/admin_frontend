import { SearchInput, Dropdown, CurrencyInput } from '../../../shared/components/ui'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { STATUS_OPTIONS } from '../constants/tuition-payment.constant'
import { GRADE_OPTIONS } from '../../../core/constants/grade-constants'

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

    grade,
    onGradeChange,

    month,
    onMonthChange,

    year,
    onYearChange,

    minAmount,
    onMinAmountChange,

    maxAmount,
    onMaxAmountChange,

    showStats,
    onToggleStats,
}) => {
    return (
        <div className="mb-4 bg-white border border-border rounded-sm p-4 space-y-4">
            {/* ===== Row 1: Search + Status + Grade + Month + Year ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-4">
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
                        value={grade}
                        onChange={onGradeChange}
                        options={GRADE_OPTIONS}
                        placeholder="Khối"
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

            {/* ===== Row 2: Amount range ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-3">
                    <CurrencyInput
                        label="Số tiền từ"
                        name="minAmount"
                        value={minAmount}
                        onChange={(e) => onMinAmountChange(e.target.value)}
                        placeholder="0"
                    />
                </div>

                <div className="lg:col-span-3">
                    <CurrencyInput
                        label="Số tiền đến"
                        name="maxAmount"
                        value={maxAmount}
                        onChange={(e) => onMaxAmountChange(e.target.value)}
                        placeholder="0"
                    />
                </div>
            </div>

            {/* ===== Row 3: Toggle Stats ===== */}
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
