import React from 'react';
import { Card } from '@/shared/components/ui';
import { Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ExamSessionStatsProps {
    totalSessions: number;
    upcomingSessions: number;
    ongoingSessions: number;
    completedSessions: number;
}

export const ExamSessionStats: React.FC<ExamSessionStatsProps> = ({
    totalSessions,
    upcomingSessions,
    ongoingSessions,
    completedSessions,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Trophy size={24} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tổng cuộc thi</p>
                        <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock size={24} className="text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Sắp diễn ra</p>
                        <p className="text-2xl font-bold text-gray-900">{upcomingSessions}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Đang diễn ra</p>
                        <p className="text-2xl font-bold text-gray-900">{ongoingSessions}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <XCircle size={24} className="text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Đã kết thúc</p>
                        <p className="text-2xl font-bold text-gray-900">{completedSessions}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
