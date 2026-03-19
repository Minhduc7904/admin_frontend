import { useState } from 'react'
import { SearchInput, Dropdown, Input } from '../../../shared/components/ui'
import { GRADE_OPTIONS } from '../../../core/constants/grade-constants'
import { IS_ACTIVE_OPTIONS } from '../../../core/constants/is-active.constants'
import { TIME_RANGE_OPTIONS } from '../../../core/constants/options'
import { getDateRange } from '../../../shared/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CourseClassSearchMultiSelect } from '../../courseClass/components/CourseClassSearchMultiSelect'

const TIME_RANGE_OPTIONS_WITH_DEFAULT = [
    { value: '', label: 'Tùy chọn' },
    ...TIME_RANGE_OPTIONS,
]

const PARENT_ZALO_OPTIONS = [
    { value: '', label: 'Tất cả PH Zalo' },
    { value: 'true', label: 'Đã đăng ký PH Zalo' },
    { value: 'false', label: 'Chưa đăng ký PH Zalo' },
]

export const StudentFilters = ({
    search,
    onSearchChange,
    grade,
    onGradeChange,
    isActive,
    onIsActiveChange,
    hasParentZaloId,
    onHasParentZaloIdChange,
    fromDate,
    onFromDateChange,
    toDate,
    onToDateChange,
    /* classes filter */
    selectedClasses,
    onClassesChange,
    /* ===== NEW ===== */
    showStats,
    onToggleStats,
}) => {
    const [timeRange, setTimeRange] = useState('')

    const handleTimeRangeChange = (value) => {
        setTimeRange(value)

        if (value) {
            const { fromDate: from, toDate: to } = getDateRange(value)
            onFromDateChange(from)
            onToDateChange(to)
        } else {
            onFromDateChange('')
            onToDateChange('')
        }
    }

    return (
        <div className="mb-4 bg-white border border-border rounded-sm p-4 space-y-4">
            {/* ===== Row 1: Search + main filters ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tên, username, email..."
                    />
                </div>

                <div className="lg:col-span-2">
                    <Dropdown
                        value={grade}
                        onChange={onGradeChange}
                        options={GRADE_OPTIONS}
                        placeholder="Khối học"
                    />
                </div>

                <div className="lg:col-span-2">
                    <Dropdown
                        value={isActive}
                        onChange={onIsActiveChange}
                        options={IS_ACTIVE_OPTIONS}
                        placeholder="Trạng thái"
                    />
                </div>

                <div className="lg:col-span-3">
                    <Dropdown
                        value={hasParentZaloId}
                        onChange={onHasParentZaloIdChange}
                        options={PARENT_ZALO_OPTIONS}
                        placeholder="Zalo phụ huynh"
                    />
                </div>
            </div>

            {/* ===== Row 2: Date filters ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Dropdown
                    label="Khoảng thời gian"
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                    options={TIME_RANGE_OPTIONS_WITH_DEFAULT}
                />

                <Input
                    type="date"
                    label="Từ ngày tham gia"
                    value={fromDate}
                    onChange={(e) => {
                        onFromDateChange(e.target.value)
                        setTimeRange('')
                    }}
                />

                <Input
                    type="date"
                    label="Đến ngày tham gia"
                    value={toDate}
                    onChange={(e) => {
                        onToDateChange(e.target.value)
                        setTimeRange('')
                    }}
                />
            </div>

            {/* ===== Row 3: Class filter ===== */}
            <div>
                <CourseClassSearchMultiSelect
                    label="Lớp học đã tham gia"
                    placeholder="Tìm kiếm lớp học..."
                    value={selectedClasses}
                    onChange={onClassesChange}
                />
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
                        <ChevronUp
                            size={16}
                            className="transition-transform duration-200"
                        />
                    ) : (
                        <ChevronDown
                            size={16}
                            className="transition-transform duration-200"
                        />
                    )}
                </button>
            </div>

        </div>
    )
}
