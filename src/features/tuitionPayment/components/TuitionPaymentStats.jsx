import { useSelector } from 'react-redux'
import { RefreshCw } from 'lucide-react'

import {
    selectTuitionPaymentLoadingStatsMoney,
    selectTuitionPaymentLoadingStatsStatus,
    selectTuitionPaymentLoadingStatsMonthly,
    selectTuitionPaymentStatsByMoney,
    selectTuitionPaymentStatsByStatus,
    selectTuitionPaymentStatsByMonthly,
} from '../store/tuitionPaymentSlice'
import { PercentPieChart, StackedBarChart } from '../../../shared/components/stat'
import { formatMoney } from '../../../shared/utils'

const countSeriesConfig = [
    { key: 'paidCount', label: 'Đã đóng', color: '#4CAF50' },
    { key: 'unpaidCount', label: 'Chưa đóng', color: '#F44336' },
]

const amountSeriesConfig = [
    { key: 'paidAmount', label: 'Đã đóng', color: '#4CAF50' },
    { key: 'unpaidAmount', label: 'Chưa đóng', color: '#F44336' },
]

export const TuitionPaymentStats = ({ loadStats }) => {
    /* ===================== REDUX ===================== */
    const loadingStatsMoney = useSelector(selectTuitionPaymentLoadingStatsMoney)
    const loadingStatsStatus = useSelector(selectTuitionPaymentLoadingStatsStatus)
    const loadingStatsMonthly = useSelector(selectTuitionPaymentLoadingStatsMonthly)
    
    const statsMoney = useSelector(selectTuitionPaymentStatsByMoney)
    const statsStatus = useSelector(selectTuitionPaymentStatsByStatus)
    const statsMonthly = useSelector(selectTuitionPaymentStatsByMonthly)

    const isLoading = loadingStatsMoney || loadingStatsStatus || loadingStatsMonthly

    /* ===================== PIE DATA - SỐ LƯỢNG ===================== */
    const countPieChartData = [
        { label: 'Đã đóng', value: statsStatus?.paid || 0, color: '#4CAF50' },
        { label: 'Chưa đóng', value: statsStatus?.unpaid || 0, color: '#F44336' },
    ]

    /* ===================== PIE DATA - SỐ TIỀN ===================== */
    const moneyPieChartData = [
        { label: 'Đã thu', value: statsMoney?.collected || 0, color: '#4CAF50' },
        { label: 'Chưa thu', value: statsMoney?.uncollected || 0, color: '#F44336' },
    ]

    /* ===================== BAR DATA - THEO THÁNG ===================== */
    const monthlyBarChartData = (statsMonthly?.months || []).map((m) => ({
        label: `T${m.month}`,
        values: {
            paidAmount: m.paidAmount,
            unpaidAmount: m.unpaidAmount,
        },
    }))

    /* ===================== RENDER ===================== */
    return (
        <div className="mb-4">
            <div className="bg-white border border-border rounded-sm p-4">
                {/* ===== Header ===== */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-medium text-foreground">
                            Thống kê học phí {statsMonthly?.year && `- Năm ${statsMonthly.year}`}
                        </h3>
                        {statsMonthly?.totalAmount > 0 && (
                            <p className="text-xs text-foreground-light mt-1">
                                Tổng: {formatMoney(statsMonthly.totalAmount)} 
                                {' '}({statsMonthly.totalCount} học phí)
                            </p>
                        )}
                    </div>
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
                <div className="flex flex-col gap-6">
                    {/* ===== ROW 1: Two Pie charts ===== */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie chart 1 - Số lượng */}
                        <div className="flex flex-col items-center">
                            <h4 className="text-sm font-medium text-center text-foreground mb-2">
                                Số lượng học phí
                            </h4>
                            <PercentPieChart
                                data={countPieChartData}
                                loading={loadingStatsStatus}
                            />
                        </div>

                        {/* Pie chart 2 - Số tiền */}
                        <div className="flex flex-col items-center">
                            <h4 className="text-sm font-medium text-center text-foreground mb-2">
                                Số tiền học phí
                            </h4>
                            <PercentPieChart
                                data={moneyPieChartData}
                                loading={loadingStatsMoney}
                                formatValue={formatMoney}
                            />
                        </div>
                    </div>

                    {/* ===== ROW 2: Bar chart ===== */}
                    <div className="w-full">
                        <h4 className="text-sm font-medium text-center text-foreground mb-2">
                            Số tiền học phí theo tháng
                        </h4>
                        <StackedBarChart
                            data={monthlyBarChartData}
                            seriesConfig={amountSeriesConfig}
                            loading={loadingStatsMonthly}
                            formatValue={formatMoney}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
