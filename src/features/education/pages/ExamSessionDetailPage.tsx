import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    ExamSessionDetailHeader,
    ExamSessionDetailTabs,
    ExamSessionInfoTab,
    ExamSessionSubmissionsTab,
} from '@/features/education/components/examSessionDetail';
import { ExamSessionCheatLogTab } from '@/features/education/components/examSessionDetail/cheatLog/ExamSessionCheatLogTab';
import { ExamSessionPreviewTab } from '@/features/education/components/examSessionDetail/preview';

type TabType = 'info' | 'submissions' | 'preview' | 'cheat-log';

export const ExamSessionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<TabType>('info');

    // Mock data
    const [sessionInfo, setSessionInfo] = useState({
        id: id || '1',
        title: 'Kiểm tra giữa kỳ 1 - Lớp 12A1',
        subtitle: 'Đợt thi học kỳ I năm học 2024-2025',
        examCode: 'DE001',
        examTitle: 'Hàm số và Đồ thị',
        startDate: '10/12/2024 08:00',
        endDate: '10/12/2024 09:30',
        durationMinutes: 90,
        maxAttempts: 1,
        showResultDetail: true,
        allowViewScore: true,
        allowViewAnswer: false,
        allowLeaderboard: false,
        enableAntiCheating: true,
        participantCount: 38,
        submissionCount: 35,
    });

    const handleEdit = () => {
        console.log('Edit session:', id);
    };

    const handleToggleChange = (field: string, value: boolean) => {
        setSessionInfo(prev => ({
            ...prev,
            [field]: value,
        }));
        console.log(`Toggle ${field}:`, value);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <ExamSessionInfoTab sessionInfo={sessionInfo} onEdit={handleEdit} onToggleChange={handleToggleChange} />;
            case 'submissions':
                return <ExamSessionSubmissionsTab />;
            case 'preview':
                return (
                    <ExamSessionPreviewTab
                        sessionId={id || '1'}
                        sessionInfo={sessionInfo}
                    />
                );
            case 'cheat-log':
                return <ExamSessionCheatLogTab />;
            default:
                return null;
        }
    };

    return (
        <>
            <ExamSessionDetailHeader sessionTitle={sessionInfo.title} />
            <ExamSessionDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {renderTabContent()}
        </>
    );
};
