import React from 'react';
import { Plus } from 'lucide-react';

interface ExamPageHeaderProps {
    onAddClick: () => void;
}

export const ExamPageHeader: React.FC<ExamPageHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý đề thi</h1>
                <p className="text-sm text-gray-600 mt-1">Quản lý và tổ chức các đề thi</p>
            </div>
            <button
                onClick={onAddClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
                <Plus size={20} />
                Thêm đề thi
            </button>
        </div>
    );
};
