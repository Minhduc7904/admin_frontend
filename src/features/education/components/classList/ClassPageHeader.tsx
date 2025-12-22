import React from 'react';
import { Plus } from 'lucide-react';

interface ClassPageHeaderProps {
    onAddClick?: () => void;
}

export const ClassPageHeader: React.FC<ClassPageHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Danh sách Lớp học</h1>
                <p className="text-xs text-gray-600 mt-1">Quản lý thông tin lớp học</p>
            </div>
            <button
                onClick={onAddClick}
                className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm"
            >
                <Plus size={16} />
                Thêm Lớp học
            </button>
        </div>
    );
};
