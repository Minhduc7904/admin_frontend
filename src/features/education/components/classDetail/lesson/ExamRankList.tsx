import React from 'react';
import { Card } from '@/shared/components/ui';
import { X, Trophy, Clock, CheckCircle } from 'lucide-react';

export interface ExamRank {
    rank: number;
    studentName: string;
    studentCode: string;
    score: number;
    maxScore: number;
    completedTime: string;
    completedDate: string;
    status: 'completed' | 'in-progress';
}

interface ExamRankListProps {
    examTitle: string;
    ranks: ExamRank[];
    onClose: () => void;
}

const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
};

const getRankIcon = (rank: number) => {
    if (rank <= 3) {
        return <Trophy size={16} className={getRankColor(rank)} />;
    }
    return null;
};

export const ExamRankList: React.FC<ExamRankListProps> = ({
    examTitle,
    ranks,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Bảng xếp hạng</h3>
                        <p className="text-xs text-gray-600 mt-0.5">{examTitle}</p>
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
                    <div className="space-y-2">
                        {ranks.map((rankItem) => (
                            <Card key={rankItem.studentCode}>
                                <div className="flex items-center gap-3">
                                    {/* Rank */}
                                    <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                                        {getRankIcon(rankItem.rank)}
                                        <span className={`text-lg font-bold ${getRankColor(rankItem.rank)}`}>
                                            {rankItem.rank}
                                        </span>
                                    </div>

                                    {/* Student Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-gray-900">
                                                {rankItem.studentName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({rankItem.studentCode})
                                            </span>
                                            {rankItem.status === 'completed' ? (
                                                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-medium">
                                                    <CheckCircle size={10} />
                                                    Hoàn thành
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-medium">
                                                    <Clock size={10} />
                                                    Đang làm
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                            <span>Điểm: {rankItem.score}/{rankItem.maxScore}</span>
                                            <span>Thời gian: {rankItem.completedTime}</span>
                                            <span>{rankItem.completedDate}</span>
                                        </div>
                                    </div>

                                    {/* Score Display */}
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {((rankItem.score / rankItem.maxScore) * 100).toFixed(1)}
                                        </div>
                                        <div className="text-[10px] text-gray-500">điểm</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">
                            Tổng: {ranks.length} học sinh đã làm bài
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
