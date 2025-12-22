import React from 'react';
import { Card } from '@/shared/components/ui';
import { Edit2, FileText, BookOpen, GraduationCap, Target, CheckCircle } from 'lucide-react';

interface ExamInfo {
    id: string;
    title: string;
    examCode: string;
    chapter: string;
    grade: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
    status: 'published' | 'draft' | 'archived';
    createdDate: string;
    description?: string;
}

interface ExamInfoTabProps {
    examInfo: ExamInfo;
    onEdit: () => void;
}

const getDifficultyColor = (difficulty: ExamInfo['difficulty']) => {
    switch (difficulty) {
        case 'easy':
            return 'bg-blue-100 text-blue-700';
        case 'medium':
            return 'bg-yellow-100 text-yellow-700';
        case 'hard':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getDifficultyText = (difficulty: ExamInfo['difficulty']) => {
    switch (difficulty) {
        case 'easy':
            return 'Dễ';
        case 'medium':
            return 'Trung bình';
        case 'hard':
            return 'Khó';
        default:
            return difficulty;
    }
};

const getStatusColor = (status: ExamInfo['status']) => {
    switch (status) {
        case 'published':
            return 'bg-green-100 text-green-700';
        case 'draft':
            return 'bg-orange-100 text-orange-700';
        case 'archived':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: ExamInfo['status']) => {
    switch (status) {
        case 'published':
            return 'Đã xuất bản';
        case 'draft':
            return 'Bản nháp';
        case 'archived':
            return 'Đã lưu trữ';
        default:
            return status;
    }
};

export const ExamInfoTab: React.FC<ExamInfoTabProps> = ({ examInfo, onEdit }) => {
    return (
        <div className="space-y-6">
            {/* Header with Edit Button */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Thông tin đề thi</h2>
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Edit2 size={16} />
                    Chỉnh sửa
                </button>
            </div>

            {/* Basic Information */}
            <Card>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                        <FileText size={20} className="text-gray-600" />
                        <h3 className="text-base font-semibold text-gray-900">Thông tin cơ bản</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-600 uppercase">Tên đề thi</label>
                            <p className="text-sm text-gray-900 mt-1">{examInfo.title}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 uppercase">Mã đề</label>
                            <p className="text-sm text-gray-900 mt-1">{examInfo.examCode}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 uppercase">Chương</label>
                            <p className="text-sm text-gray-900 mt-1">{examInfo.chapter}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 uppercase">Khối</label>
                            <p className="text-sm text-gray-900 mt-1">{examInfo.grade}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 uppercase">Mức độ</label>
                            <div className="mt-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(examInfo.difficulty)}`}>
                                    {getDifficultyText(examInfo.difficulty)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 uppercase">Trạng thái</label>
                            <div className="mt-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(examInfo.status)}`}>
                                    {getStatusText(examInfo.status)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 uppercase">Số câu hỏi</label>
                            <p className="text-sm text-gray-900 mt-1">{examInfo.questionCount} câu</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600 uppercase">Ngày tạo</label>
                            <p className="text-sm text-gray-900 mt-1">{examInfo.createdDate}</p>
                        </div>
                    </div>

                    {examInfo.description && (
                        <div className="pt-3 border-t border-gray-200">
                            <label className="text-xs font-medium text-gray-600 uppercase">Mô tả</label>
                            <p className="text-sm text-gray-900 mt-1">{examInfo.description}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Tổng số câu hỏi</p>
                            <p className="text-2xl font-bold text-gray-900">{examInfo.questionCount}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <GraduationCap size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Lượt thi</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Target size={24} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Điểm trung bình</p>
                            <p className="text-2xl font-bold text-gray-900">--</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
