import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    ExamDetailHeader,
    ExamDetailTabs,
    ExamInfoTab,
    ExamQuestionsTab,
    ExamPreviewTab,
} from '@/features/education/components/examDetail';

type TabType = 'info' | 'questions' | 'preview';

interface ExamInfo {
    id: string;
    title: string;
    examCode: string;
    chapter: string;
    grade: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
    status: 'published' | 'draft' | 'archived';
    createdDate: string;
    description?: string;
}

export const ExamDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<TabType>('info');

    // Mock data
    const examInfo: ExamInfo = {
        id: id || '1',
        title: 'Kiểm tra giữa kỳ 1 - Hàm số và Đồ thị',
        examCode: 'DE001',
        chapter: 'Chương 1: Hàm số và Đồ thị',
        grade: 'Khối 12',
        difficulty: 'medium',
        questionCount: 30,
        status: 'published',
        createdDate: '01/12/2024',
        description: 'Đề thi kiểm tra giữa kỳ 1 dành cho học sinh khối 12, tập trung vào các kiến thức về hàm số, tính chất của hàm số, và các dạng đồ thị cơ bản.',
    };

    // Handlers
    const handleEdit = () => {
        console.log('Edit exam info');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <ExamInfoTab examInfo={examInfo} onEdit={handleEdit} />;
            case 'questions':
                return <ExamQuestionsTab examId={id || '1'} />;
            case 'preview':
                return <ExamPreviewTab examId={id || '1'} />;
            default:
                return null;
        }
    };

    return (
        <>
            <ExamDetailHeader />
            <ExamDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {renderTabContent()}
        </>
    );
};
