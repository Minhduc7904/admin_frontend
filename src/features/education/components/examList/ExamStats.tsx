import React from 'react';
import { Card } from '@/shared/components/ui';
import { FileText, CheckCircle, Clock, Archive } from 'lucide-react';

interface ExamStatsProps {
    totalExams: number;
    publishedExams: number;
    draftExams: number;
    archivedExams: number;
}

export const ExamStats: React.FC<ExamStatsProps> = ({
    totalExams,
    publishedExams,
    draftExams,
    archivedExams,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText size={24} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tổng số đề thi</p>
                        <p className="text-2xl font-bold text-gray-900">{totalExams}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Đã xuất bản</p>
                        <p className="text-2xl font-bold text-gray-900">{publishedExams}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock size={24} className="text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Bản nháp</p>
                        <p className="text-2xl font-bold text-gray-900">{draftExams}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Archive size={24} className="text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Đã lưu trữ</p>
                        <p className="text-2xl font-bold text-gray-900">{archivedExams}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
