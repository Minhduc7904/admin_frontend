import React from 'react';
import { Plus } from 'lucide-react';

interface ExamSessionPageHeaderProps {
    onAddClick: () => void;
}

export const ExamSessionPageHeader: React.FC<ExamSessionPageHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý cuộc thi</h1>
                <p className="text-sm text-gray-600 mt-1">Quản lý và tổ chức các cuộc thi/làm bài</p>
            </div>
            <button
                onClick={onAddClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
                <Plus size={20} />
                Thêm cuộc thi
            </button>
        </div>
    );
};
