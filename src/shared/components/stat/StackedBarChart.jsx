import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'

export function StackedBarChart({
    data = [],
    seriesConfig = [],
    height = 260,
    loading = false,
}) {
    /* ===================== LOADING ===================== */
    if (loading) {
        return (
            <div className="w-full h-[260px] rounded bg-gray-100 animate-pulse" />
        )
    }

    if (!data.length || !seriesConfig.length) {
        return (
            <div className="w-full h-[260px] flex items-center justify-center text-sm text-gray-400">
                Không có dữ liệu
            </div>
        )
    }

    const xLabels = data.map((d) => d.label)

    const series = seriesConfig.map((s) => ({
        id: s.key,
        label: s.label,
        stack: 'total',
        color: s.color,
        data: data.map((d) => d.values?.[s.key] ?? 0),
    }))

    return (
        <div className="flex gap-6">
            {/* ===================== CHART ===================== */}
            <div className="flex-1">
                <BarChart
                    height={height}
                    series={series}
                    xAxis={[
                        {
                            data: xLabels,
                            scaleType: 'band',
                        },
                    ]}
                    yAxis={[{ width: 40 }]}
                    slotProps={{
                        legend: { hidden: true },
                    }}
                />
            </div>
        </div>
    )
}
