import React from 'react';
import { Card } from '@/shared/components/ui';
import { X, User, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';

export interface StudentSubmission {
    id: string;
    studentName: string;
    studentCode: string;
    submittedDate: string;
    fileName: string;
    fileUrl: string;
    status: 'submitted' | 'late' | 'graded';
    score?: number;
    maxScore?: number;
    feedback?: string;
}

interface StudentSubmissionsListProps {
    itemTitle: string;
    submissions: StudentSubmission[];
    onClose: () => void;
}

const getStatusColor = (status: StudentSubmission['status']) => {
    switch (status) {
        case 'submitted':
            return 'bg-blue-100 text-blue-700';
        case 'late':
            return 'bg-orange-100 text-orange-700';
        case 'graded':
            return 'bg-green-100 text-green-700';
    }
};

const getStatusText = (status: StudentSubmission['status']) => {
    switch (status) {
        case 'submitted':
            return 'Đã nộp';
        case 'late':
            return 'Nộp muộn';
        case 'graded':
            return 'Đã chấm';
    }
};

export const StudentSubmissionsList: React.FC<StudentSubmissionsListProps> = ({
    itemTitle,
    submissions,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Danh sách bài nộp</h3>
                        <p className="text-xs text-gray-600 mt-0.5">{itemTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-3">
                        {submissions.map((submission) => (
                            <Card key={submission.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2 flex-1">
                                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xs font-semibold">
                                                {submission.studentName.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {submission.studentName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    ({submission.studentCode})
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {submission.submittedDate}
                                                </div>
                                                <span className={`px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(submission.status)}`}>
                                                    {getStatusText(submission.status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <FileText size={12} className="text-gray-400" />
                                                <a
                                                    href={submission.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:underline"
                                                >
                                                    {submission.fileName}
                                                </a>
                                            </div>
                                            {submission.status === 'graded' && (
                                                <div className="mt-2 p-2 bg-gray-50 rounded">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CheckCircle size={12} className="text-green-600" />
                                                        <span className="text-xs font-medium text-gray-900">
                                                            Điểm: {submission.score}/{submission.maxScore}
                                                        </span>
                                                    </div>
                                                    {submission.feedback && (
                                                        <p className="text-[10px] text-gray-600">
                                                            {submission.feedback}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {submission.status !== 'graded' && (
                                        <button className="px-2 py-1 text-[10px] text-white bg-gray-900 hover:bg-gray-800 rounded transition-colors">
                                            Chấm điểm
                                        </button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">
                            Tổng: {submissions.length} bài nộp
                        </span>
                        <button
                            onClick={onClose}
                            className="px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
