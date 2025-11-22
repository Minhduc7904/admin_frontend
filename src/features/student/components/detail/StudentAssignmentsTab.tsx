import React from 'react';
import { Card } from '@/shared/components/ui';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    submittedDate?: string;
    score?: number;
    maxScore: number;
    status: 'completed' | 'late' | 'pending' | 'missing';
}

interface StudentAssignmentsTabProps {
    assignments: Assignment[];
}

const getAssignmentStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-700';
        case 'late':
            return 'bg-orange-100 text-orange-700';
        case 'pending':
            return 'bg-blue-100 text-blue-700';
        case 'missing':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getAssignmentStatusText = (status: string) => {
    switch (status) {
        case 'completed':
            return 'Đã hoàn thành';
        case 'late':
            return 'Nộp muộn';
        case 'pending':
            return 'Đang chờ';
        case 'missing':
            return 'Chưa nộp';
        default:
            return status;
    }
};

const getAssignmentIcon = (status: string) => {
    switch (status) {
        case 'completed':
            return <CheckCircle size={18} className="text-green-600" />;
        case 'late':
            return <Clock size={18} className="text-orange-600" />;
        case 'pending':
            return <Clock size={18} className="text-blue-600" />;
        case 'missing':
            return <XCircle size={18} className="text-red-600" />;
        default:
            return null;
    }
};

export const StudentAssignmentsTab: React.FC<StudentAssignmentsTabProps> = ({ assignments }) => {
    const completedCount = assignments.filter(a => a.status === 'completed' || a.status === 'late').length;
    const averageScore = assignments
        .filter(a => a.score !== undefined)
        .reduce((sum, a) => sum + (a.score || 0), 0) / assignments.filter(a => a.score !== undefined).length || 0;

    return (
        <div className="space-y-4">
            {/* Statistics */}
            <div className="grid grid-cols-4 gap-3">
                <Card>
                    <p className="text-xs text-gray-600">Tổng bài tập</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{assignments.length}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Đã nộp</p>
                    <p className="text-xl font-bold text-green-600 mt-1">{completedCount}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Chưa nộp</p>
                    <p className="text-xl font-bold text-red-600 mt-1">{assignments.length - completedCount}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Điểm TB</p>
                    <p className="text-xl font-bold text-blue-600 mt-1">{averageScore.toFixed(1)}</p>
                </Card>
            </div>

            {/* Assignments List */}
            <Card>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Lịch sử làm bài</h4>
                <div className="space-y-3">
                    {assignments.map((assignment) => (
                        <div
                            key={assignment.id}
                            className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-start gap-3 flex-1">
                                <div className="mt-0.5">
                                    {getAssignmentIcon(assignment.status)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                                            <p className="text-xs text-gray-600 mt-1">Môn: {assignment.subject}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getAssignmentStatusColor(assignment.status)}`}>
                                                    {getAssignmentStatusText(assignment.status)}
                                                </span>
                                                {assignment.score !== undefined && (
                                                    <span className="text-xs font-semibold text-gray-900">
                                                        Điểm: {assignment.score}/{assignment.maxScore}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-xs text-gray-500">
                                <p>Hạn: {assignment.dueDate}</p>
                                {assignment.submittedDate && (
                                    <p className="mt-1">Nộp: {assignment.submittedDate}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
