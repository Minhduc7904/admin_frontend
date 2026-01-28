import React, { useMemo } from 'react'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'

export function PercentPieChart({
    data = [],
    width = 200,
    height = 200,
    outerRadius = 80,
    fontSize = 14,
    loading = false,
}) {
    const total = useMemo(
        () => data.reduce((sum, item) => sum + item.value, 0),
        [data],
    )

    const getArcLabel = (params) => {
        if (!total || loading) return ''
        const percent = params.value / total
        return `${Math.round(percent * 100)}%`
    }

    /* ===================== LOADING UI ===================== */
    if (loading) {
        return (
            <div className="flex items-center gap-6">
                {/* Fake chart skeleton */}
                <div
                    className="relative rounded-full animate-pulse"
                    style={{
                        width,
                        height,
                        background:
                            'conic-gradient(#e5e7eb 0deg, #f3f4f6 120deg, #e5e7eb 240deg)',
                    }}
                />

                {/* Legend skeleton */}
                <div className="flex flex-col gap-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
                            <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    /* ===================== NORMAL RENDER ===================== */
    return (
        <div className="flex items-center gap-6">
            {/* ===================== CHART ===================== */}
            <PieChart
                series={[
                    {
                        data,
                        outerRadius,
                        arcLabel: getArcLabel,
                    },
                ]}
                width={width}
                height={height}
                margin={{ right: 5 }}
                slotProps={{ legend: { hidden: true } }}
                hideLegend
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fill: '#fff',
                        fontSize,
                        fontWeight: 600,
                        pointerEvents: 'none',
                    },
                }}
            />

            {/* ===================== CUSTOM LEGEND ===================== */}
            <div className="flex flex-col gap-2 text-sm">
                {data.map((item, idx) => {
                    const percent = total
                        ? Math.round((item.value / total) * 100)
                        : 0

                    return (
                        <div
                            key={idx}
                            className="flex items-center justify-between gap-3"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-foreground">{item.label}</span>
                            </div>

                            <div className="text-foreground-light">
                                <b>{item.value}</b> ({percent}%)
                            </div>
                        </div>
                    )
                })}

                {/* Total */}
                <div className="pt-2 mt-2 border-t border-border text-xs text-foreground-light">
                    Tổng: <b>{total}</b>
                </div>
            </div>
        </div>
    )
}
