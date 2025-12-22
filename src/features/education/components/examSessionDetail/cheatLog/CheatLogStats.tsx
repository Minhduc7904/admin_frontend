import React from 'react';
import { Card } from '@/shared/components/ui';
import { Shield, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface CheatLogStatsProps {
    totalLogs: number;
    criticalCount: number;
    warningCount: number;
    infoCount: number;
}

export const CheatLogStats: React.FC<CheatLogStatsProps> = ({
    totalLogs,
    criticalCount,
    warningCount,
    infoCount,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield size={24} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tổng cảnh báo</p>
                        <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertCircle size={24} className="text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Nghiêm trọng</p>
                        <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle size={24} className="text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Cảnh báo</p>
                        <p className="text-2xl font-bold text-gray-900">{warningCount}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Info size={24} className="text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Thông tin</p>
                        <p className="text-2xl font-bold text-gray-900">{infoCount}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
