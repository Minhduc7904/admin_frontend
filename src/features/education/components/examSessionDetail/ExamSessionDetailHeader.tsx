import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface ExamSessionDetailHeaderProps {
    sessionTitle: string;
}

export const ExamSessionDetailHeader: React.FC<ExamSessionDetailHeaderProps> = ({ sessionTitle }) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <button
                onClick={() => navigate('/education/exam-sessions')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
                <ChevronLeft size={16} />
                Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{sessionTitle}</h1>
        </div>
    );
};
