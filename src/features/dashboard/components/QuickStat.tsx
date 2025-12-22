import React from 'react';
import { Card } from '@/shared/components/ui';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface QuickStatProps {
    title: string;
    value: string | number;
    percent: string;
    isIncrease?: boolean;
    icon: LucideIcon;
    iconBg?: string;
    iconColor?: string;
}

export const QuickStat: React.FC<QuickStatProps> = ({
    title,
    value,
    percent,
    isIncrease = true,
    icon: Icon,
    iconBg = 'bg-blue-100',
    iconColor = 'text-blue-600',
}) => {
    return (
        <Card className='h-full'>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    <div className="flex items-center gap-1 mt-1">
                        {isIncrease ? (
                            <TrendingUp size={12} className="text-green-600" />
                        ) : (
                            <TrendingDown size={12} className="text-red-600" />
                        )}
                        <span
                            className={`text-xs font-medium ${
                                isIncrease ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {percent}
                        </span>
                    </div>
                </div>
                <div className={`p-3 rounded-lg ${iconBg}`}>
                    <Icon size={20} className={iconColor} />
                </div>
            </div>
        </Card>
    );
};
