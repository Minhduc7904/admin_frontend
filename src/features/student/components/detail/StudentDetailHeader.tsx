import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const StudentDetailHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
                <ArrowLeft size={16} />
                Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết Học sinh</h1>
        </div>
    );
};
