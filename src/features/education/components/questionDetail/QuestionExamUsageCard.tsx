import React from 'react';
import { Card } from '@/shared/components/ui';
import { FileText, Calendar, Users } from 'lucide-react';

export interface ExamUsage {
    id: string;
    examCode: string;
    examTitle: string;
    grade: number;
    usedDate: string;
    studentCount: number;
}

interface QuestionExamUsageCardProps {
    exams: ExamUsage[];
}

export const QuestionExamUsageCard: React.FC<QuestionExamUsageCardProps> = ({ exams }) => {
    if (exams.length === 0) {
        return (
            <Card>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Đề thi sử dụng câu hỏi này</h2>
                <div className="text-center py-8">
                    <FileText size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500">Câu hỏi chưa được sử dụng trong đề thi nào</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Đề thi sử dụng câu hỏi này ({exams.length})
            </h2>
            <div className="space-y-2">
                {exams.map((exam) => (
                    <div
                        key={exam.id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-gray-900">{exam.examCode}</span>
                                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                                        Khối {exam.grade}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{exam.examTitle}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {exam.usedDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={12} />
                                        {exam.studentCount} học sinh
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
