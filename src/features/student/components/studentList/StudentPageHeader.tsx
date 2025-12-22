import React from 'react';
import { Plus } from 'lucide-react';

interface StudentPageHeaderProps {
    onAddClick?: () => void;
}

export const StudentPageHeader: React.FC<StudentPageHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Danh sách Học sinh</h1>
                <p className="text-xs text-gray-600 mt-1">Quản lý thông tin học sinh</p>
            </div>
            <button
                onClick={onAddClick}
                className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm"
            >
                <Plus size={16} />
                Thêm Học sinh
            </button>
        </div>
    );
};
