import React, { useState } from "react";

export interface LineData {
  label: string;
  color: string;
  data: number[];
}

interface LineChartProps {
  labels: string[];
  lines: LineData[];
  height?: number;
  showGrid?: boolean;
}

interface TooltipData {
  lineLabel: string;
  value: number;
  xLabel: string;
  x: number;
  y: number;
  color: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  labels,
  lines,
  height = 200,
  showGrid = true,
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const padding = 40;
  const width = 500;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate max value for scaling
  const allValues = lines.flatMap((line) => line.data);
  const maxValue = Math.max(...allValues, 1);
  const minValue = Math.min(...allValues, 0);
  const valueRange = maxValue - minValue || 1;

  // Calculate points for each line
  const getLinePoints = (data: number[]): string => {
    return data
      .map((value, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1 || 1);
        const y =
          padding +
          chartHeight -
          ((value - minValue) / valueRange) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Grid lines
  const gridLines = 5;
  const gridStep = chartHeight / gridLines;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height: `${height}px` }}
      >
        {/* Grid */}
        {showGrid && (
          <g className="text-gray-200">
            {Array.from({ length: gridLines + 1 }).map((_, i) => {
              const y = padding + i * gridStep;
              const value = maxValue - (i * valueRange) / gridLines;
              return (
                <g key={i}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#9ca3af"
                  >
                    {Math.round(value)}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Lines */}
        {lines.map((line, lineIndex) => (
          <g key={lineIndex}>
            {/* Line path */}
            <polyline
              points={getLinePoints(line.data)}
              fill="none"
              stroke={line.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Data points */}
            {line.data.map((value, index) => {
              const x =
                padding + (index * chartWidth) / (line.data.length - 1 || 1);
              const y =
                padding +
                chartHeight -
                ((value - minValue) / valueRange) * chartHeight;
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="white"
                    stroke={line.color}
                    strokeWidth="2"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() =>
                      setTooltip({
                        lineLabel: line.label,
                        value: value,
                        xLabel: labels[index],
                        x: x,
                        y: y,
                        color: line.color,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />
                </g>
              );
            })}
          </g>
        ))}

        {/* X-axis labels */}
        {labels.map((label, index) => {
          const x = padding + (index * chartWidth) / (labels.length - 1 || 1);
          return (
            <text
              key={index}
              x={x}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Custom Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y - 50,
          }}
        >
          <div className="bg-black/70 backdrop-blur-sm shadow-xl rounded-lg border border-white/10 px-3 py-2 min-w-[120px]">
            {/* X label */}
            <div className="text-xs font-semibold text-white mb-1">
              {tooltip.xLabel}
            </div>

            {/* Line info */}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tooltip.color }}
              />

              <span className="text-xs text-gray-300">
                {tooltip.lineLabel}:
              </span>

              <span className="text-xs font-bold text-white">
                {tooltip.value}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {lines.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <span className="text-xs text-gray-700">{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
