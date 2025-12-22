import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ExamSessionPageHeader,
    ExamSessionFilters,
    ExamSessionStats,
    ExamSessionTable,
    type ExamSession,
} from '@/features/education/components/examSessionList';

export const ExamSessionListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedExam, setSelectedExam] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock data
    const sessions: ExamSession[] = [
        {
            id: '1',
            title: 'Kiểm tra giữa kỳ 1 - Lớp 12A1',
            examCode: 'DE001',
            examTitle: 'Hàm số và Đồ thị',
            startDate: '10/12/2024 08:00',
            endDate: '10/12/2024 09:30',
            duration: 90,
            participantCount: 38,
            status: 'completed',
        },
        {
            id: '2',
            title: 'Thi thử THPT Quốc gia 2024',
            examCode: 'DE002',
            examTitle: 'Đạo hàm',
            startDate: '15/12/2024 14:00',
            endDate: '15/12/2024 16:00',
            duration: 120,
            participantCount: 125,
            status: 'ongoing',
        },
        {
            id: '3',
            title: 'Kiểm tra 15 phút - Chương 3',
            examCode: 'DE003',
            examTitle: 'Giới hạn',
            startDate: '20/12/2024 07:30',
            endDate: '20/12/2024 07:45',
            duration: 15,
            participantCount: 42,
            status: 'upcoming',
        },
        {
            id: '4',
            title: 'Thi cuối kỳ - Khối 12',
            examCode: 'DE004',
            examTitle: 'Tích phân',
            startDate: '25/12/2024 08:00',
            endDate: '25/12/2024 09:30',
            duration: 90,
            participantCount: 0,
            status: 'upcoming',
        },
        {
            id: '5',
            title: 'Đề ôn tập - Hình học không gian',
            examCode: 'DE005',
            examTitle: 'Hình học không gian',
            startDate: '18/12/2024 14:00',
            endDate: '18/12/2024 15:00',
            duration: 60,
            participantCount: 78,
            status: 'completed',
        },
        {
            id: '6',
            title: 'Kiểm tra HSG - Toán nâng cao',
            examCode: 'DE007',
            examTitle: 'Toán nâng cao',
            startDate: '30/12/2024 08:00',
            endDate: '30/12/2024 11:00',
            duration: 180,
            participantCount: 0,
            status: 'upcoming',
        },
        {
            id: '7',
            title: 'Thi Olympic Toán 2024',
            examCode: 'DE002',
            examTitle: 'Đạo hàm',
            startDate: '05/11/2024 09:00',
            endDate: '05/11/2024 11:00',
            duration: 120,
            participantCount: 96,
            status: 'completed',
        },
        {
            id: '8',
            title: 'Kiểm tra thường xuyên - Lớp 11B',
            examCode: 'DE006',
            examTitle: 'Lượng giác',
            startDate: '12/11/2024 15:00',
            endDate: '12/11/2024 15:30',
            duration: 30,
            participantCount: 35,
            status: 'completed',
        },
    ];

    // Calculate pagination
    const totalPages = Math.ceil(sessions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSessions = sessions.slice(startIndex, endIndex);

    // Handlers
    const handleAddSession = () => {
        console.log('Add session clicked');
    };

    const handleView = (id: string) => {
        navigate(`/education/exam-sessions/${id}`);
    };

    const handleEdit = (id: string) => {
        console.log('Edit session:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete session:', id);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <ExamSessionPageHeader onAddClick={handleAddSession} />

            <ExamSessionFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedExam={selectedExam}
                onExamChange={setSelectedExam}
            />

            <ExamSessionStats
                totalSessions={sessions.length}
                upcomingSessions={sessions.filter((s) => s.status === 'upcoming').length}
                ongoingSessions={sessions.filter((s) => s.status === 'ongoing').length}
                completedSessions={sessions.filter((s) => s.status === 'completed').length}
            />

            <ExamSessionTable
                sessions={paginatedSessions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    );
};
