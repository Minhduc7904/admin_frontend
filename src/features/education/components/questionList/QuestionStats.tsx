import React from 'react';
import { Card } from '@/shared/components/ui';
import { HelpCircle, Target, Zap, TrendingUp, Award } from 'lucide-react';

interface QuestionStatsProps {
    totalQuestions: number;
    thCount: number;
    nbCount: number;
    vdCount: number;
    vdcCount: number;
}

export const QuestionStats: React.FC<QuestionStatsProps> = ({
    totalQuestions,
    thCount,
    nbCount,
    vdCount,
    vdcCount,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <HelpCircle size={24} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tổng câu hỏi</p>
                        <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Target size={24} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Nhận biết</p>
                        <p className="text-2xl font-bold text-gray-900">{nbCount}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Zap size={24} className="text-cyan-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Thông hiểu</p>
                        <p className="text-2xl font-bold text-gray-900">{thCount}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <TrendingUp size={24} className="text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Vận dụng</p>
                        <p className="text-2xl font-bold text-gray-900">{vdCount}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award size={24} className="text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Vận dụng cao</p>
                        <p className="text-2xl font-bold text-gray-900">{vdcCount}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
