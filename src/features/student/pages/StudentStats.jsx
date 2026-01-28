import { useSelector } from 'react-redux'
import { RefreshCw } from 'lucide-react'

import {
    selectStudentLoadingStats,
    selectStudentStats,
    selectStudentLoadingStatsByGrade,
    selectStudentStatsByGrade,
} from '../store/studentSlice'
import { PercentPieChart, StackedBarChart } from '../../../shared/components/stat'

const seriesConfig = [
    { key: 'active', label: 'Hoạt động', color: '#4CAF50' },
    { key: 'inactive', label: 'Không hoạt động', color: '#F44336' },
]

export const StudentStats = ({ loadStats }) => {
    /* ===================== REDUX ===================== */
    const loadingStats = useSelector(selectStudentLoadingStats)
    const stats = useSelector(selectStudentStats)

    const loadingStatsByGrade = useSelector(selectStudentLoadingStatsByGrade)
    const statsByGrade = useSelector(selectStudentStatsByGrade)

    const isLoading = loadingStats || loadingStatsByGrade

    /* ===================== PIE DATA ===================== */
    const pieChartData = [
        { label: 'Hoạt động', value: stats?.active || 0, color: '#4CAF50' },
        { label: 'Không hoạt động', value: stats?.inactive || 0, color: '#F44336' },
    ]

    /* ===================== BAR DATA ===================== */
    const barChartData = (statsByGrade?.items || []).map((g) => ({
        label: `Khối ${g.grade}`,
        values: {
            active: g.active,
            inactive: g.inactive,
        },
    }))

    /* ===================== RENDER ===================== */
    return (
        <div className="mb-4">
            <div className="bg-white border border-border rounded-sm p-4">
                {/* ===== Header ===== */}
                <div className="flex items-center justify-end mb-4">
                    <button
                        type="button"
                        onClick={loadStats}
                        disabled={isLoading}
                        className="
                            flex items-center gap-2
                            text-sm px-3 py-1.5 rounded border
                            transition
                            hover:bg-gray-50
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        <RefreshCw
                            size={14}
                            className={isLoading ? 'animate-spin' : ''}
                        />
                        Làm mới
                    </button>
                </div>

                {/* ===== Content ===== */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                    {/* ===== Pie chart ===== */}
                    <div className="flex justify-center lg:justify-start lg:shrink-0">
                        <div>
                            <h4 className="text-sm font-medium text-center text-foreground mb-2">
                                Trạng thái
                            </h4>

                            <PercentPieChart
                                data={pieChartData}
                                loading={loadingStats}
                            />
                        </div>
                    </div>

                    {/* ===== Bar chart ===== */}
                    <div className="w-full">
                        <h4 className="text-sm font-medium text-center text-foreground mb-2">
                            Theo khối
                        </h4>

                        <StackedBarChart
                            data={barChartData}
                            seriesConfig={seriesConfig}
                            loading={loadingStatsByGrade}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
