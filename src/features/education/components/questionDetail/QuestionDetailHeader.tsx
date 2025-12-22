import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface QuestionDetailHeaderProps {
    questionId: string;
}

export const QuestionDetailHeader: React.FC<QuestionDetailHeaderProps> = ({ questionId }) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <button
                onClick={() => navigate('/education/questions')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
                <ChevronLeft size={16} />
                Quay lại danh sách
            </button>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết câu hỏi</h1>
                    <p className="text-sm text-gray-600 mt-1">ID: {questionId}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                    Chỉnh sửa
                </button>
            </div>
        </div>
    );
};
