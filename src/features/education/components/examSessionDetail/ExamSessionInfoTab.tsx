import React, { useState } from 'react';
import { Card, Toggle } from '@/shared/components/ui';
import { Edit2, Calendar, Clock, Users, FileText } from 'lucide-react';

interface ExamSessionInfo {
    id: string;
    title: string;
    subtitle?: string;
    examCode: string;
    examTitle: string;
    startDate: string;
    endDate: string;
    durationMinutes?: number; // thời lượng làm bài
    maxAttempts?: number; // số lần được làm, null = không giới hạn
    showResultDetail: boolean; // xem chi tiết bài làm
    allowLeaderboard: boolean; // hiển thị bảng xếp hạng
    allowViewScore: boolean; // xem điểm
    allowViewAnswer: boolean; // xem đáp án
    enableAntiCheating: boolean; // phát hiện gian lận
    participantCount: number;
    submissionCount: number;
}

interface ExamSessionInfoTabProps {
    sessionInfo: ExamSessionInfo;
    onEdit?: () => void;
    onToggleChange?: (field: string, value: boolean) => void;
}

export const ExamSessionInfoTab: React.FC<ExamSessionInfoTabProps> = ({ sessionInfo, onEdit, onToggleChange }) => {
    return (
        <div className="space-y-6">
            {/* Basic Information Card */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <Edit2 size={14} />
                        Chỉnh sửa
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Tên cuộc thi</label>
                        <p className="text-sm text-gray-900">{sessionInfo.title}</p>
                    </div>
                    {sessionInfo.subtitle && (
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Tiêu đề phụ</label>
                            <p className="text-sm text-gray-900">{sessionInfo.subtitle}</p>
                        </div>
                    )}
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Đề thi liên kết</label>
                        <p className="text-sm text-gray-900">
                            {sessionInfo.examCode} - {sessionInfo.examTitle}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Bắt đầu</label>
                        <p className="text-sm text-gray-900">{sessionInfo.startDate}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Kết thúc</label>
                        <p className="text-sm text-gray-900">{sessionInfo.endDate}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Thời lượng làm bài</label>
                        <p className="text-sm text-gray-900">{sessionInfo.durationMinutes ? `${sessionInfo.durationMinutes} phút` : 'Không giới hạn'}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Số lần làm bài</label>
                        <p className="text-sm text-gray-900">{sessionInfo.maxAttempts ?? 'Không giới hạn'}</p>
                    </div>
                </div>
            </Card>

            {/* Permissions Card */}
            <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quyền và cài đặt</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Cho phép xem chi tiết kết quả</p>
                            <p className="text-xs text-gray-500">Học sinh có thể xem lại chi tiết bài làm sau khi nộp</p>
                        </div>
                        <Toggle
                            checked={sessionInfo.showResultDetail}
                            onChange={(value) => onToggleChange?.('showResultDetail', value)}
                        />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Cho phép xem điểm</p>
                            <p className="text-xs text-gray-500">Hiển thị điểm số cho học sinh</p>
                        </div>
                        <Toggle
                            checked={sessionInfo.allowViewScore}
                            onChange={(value) => onToggleChange?.('allowViewScore', value)}
                        />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Cho phép xem đáp án</p>
                            <p className="text-xs text-gray-500">Học sinh có thể xem đáp án đúng sau khi làm bài</p>
                        </div>
                        <Toggle
                            checked={sessionInfo.allowViewAnswer}
                            onChange={(value) => onToggleChange?.('allowViewAnswer', value)}
                        />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Hiển thị bảng xếp hạng</p>
                            <p className="text-xs text-gray-500">Cho phép học sinh xem bảng xếp hạng</p>
                        </div>
                        <Toggle
                            checked={sessionInfo.allowLeaderboard}
                            onChange={(value) => onToggleChange?.('allowLeaderboard', value)}
                        />
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Phát hiện gian lận</p>
                            <p className="text-xs text-gray-500">
                                Tự động theo dõi và cảnh báo hành vi gian lận
                            </p>
                        </div>
                        <Toggle
                            checked={sessionInfo.enableAntiCheating}
                            onChange={(value) => onToggleChange?.('enableAntiCheating', value)}
                        />
                    </div>
                </div>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Số người tham gia</p>
                            <p className="text-2xl font-bold text-gray-900">{sessionInfo.participantCount}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Bài làm đã nộp</p>
                            <p className="text-2xl font-bold text-gray-900">{sessionInfo.submissionCount}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock size={24} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Tỷ lệ hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {sessionInfo.participantCount > 0
                                    ? Math.round((sessionInfo.submissionCount / sessionInfo.participantCount) * 100)
                                    : 0}
                                %
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
