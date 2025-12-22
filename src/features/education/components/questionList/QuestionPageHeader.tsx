import React from 'react';
import { Plus } from 'lucide-react';

interface QuestionPageHeaderProps {
    onAddClick: () => void;
}

export const QuestionPageHeader: React.FC<QuestionPageHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Ngân hàng câu hỏi</h1>
                <p className="text-sm text-gray-600 mt-1">Quản lý câu hỏi và mệnh đề</p>
            </div>
            <button
                onClick={onAddClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
                <Plus size={20} />
                Thêm câu hỏi
            </button>
        </div>
    );
};
