import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExamDetailHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-4 mb-6">
            <button
                onClick={() => navigate('/education/exams')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Chi tiết đề thi</h1>
                <p className="text-sm text-gray-600 mt-1">Xem và chỉnh sửa thông tin đề thi</p>
            </div>
        </div>
    );
};
