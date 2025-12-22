import React from 'react';
import { Card } from '@/shared/components/ui';
import { FileText, CheckCircle, BarChart2, TrendingUp } from 'lucide-react';

interface SubmissionStatsProps {
    totalSubmissions: number;
    completedSubmissions: number;
    averageScore: number;
    highestScore: number;
}

export const SubmissionStats: React.FC<SubmissionStatsProps> = ({
    totalSubmissions,
    completedSubmissions,
    averageScore,
    highestScore,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText size={24} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tổng bài làm</p>
                        <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Đã hoàn thành</p>
                        <p className="text-2xl font-bold text-gray-900">{completedSubmissions}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <BarChart2 size={24} className="text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Điểm trung bình</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {averageScore > 0 ? averageScore.toFixed(1) : '--'}
                        </p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp size={24} className="text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Điểm cao nhất</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {highestScore > 0 ? highestScore.toFixed(1) : '--'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
