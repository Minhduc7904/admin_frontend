import React from 'react';
import { Card } from '@/shared/components/ui';
import type { LucideIcon } from 'lucide-react';
import { LineChart, type LineData } from './LineChart';

interface ChartCardProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    labels: string[];
    lines: LineData[];
    height?: number;
}

export const ChartCard: React.FC<ChartCardProps> = ({
    title,
    subtitle,
    icon: Icon,
    iconBg,
    iconColor,
    labels,
    lines,
    height = 200,
}) => {
    return (
        <Card className='w-full'>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>
                </div>
                <div className={`p-2 rounded-lg ${iconBg}`}>
                    <Icon size={16} className={iconColor} />
                </div>
            </div>
            <LineChart labels={labels} lines={lines} height={height} />
        </Card>
    );
};
