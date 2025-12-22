import React, { useState } from 'react';
import {
    SubmissionFilters,
    SubmissionStats,
    SubmissionTable,
    type Submission,
} from './index';

export const ExamSessionSubmissionsTab: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedScoreRange, setSelectedScoreRange] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock data
    const submissions: Submission[] = [
        {
            id: '1',
            studentName: 'Nguyễn Văn A',
            studentCode: 'HS001',
            studentClass: '12A1',
            startTime: '10/12/2024 08:05',
            submitTime: '10/12/2024 09:28',
            score: 9.5,
            totalScore: 10,
            status: 'completed',
            attemptNumber: 1,
        },
        {
            id: '2',
            studentName: 'Trần Thị B',
            studentCode: 'HS002',
            studentClass: '12A1',
            startTime: '10/12/2024 08:02',
            submitTime: '10/12/2024 09:25',
            score: 8.7,
            totalScore: 10,
            status: 'completed',
            attemptNumber: 1,
        },
        {
            id: '3',
            studentName: 'Lê Văn C',
            studentCode: 'HS003',
            studentClass: '12A1',
            startTime: '10/12/2024 08:01',
            submitTime: '10/12/2024 09:30',
            score: 7.3,
            totalScore: 10,
            status: 'completed',
            attemptNumber: 1,
        },
        {
            id: '4',
            studentName: 'Phạm Thị D',
            studentCode: 'HS004',
            studentClass: '12A1',
            startTime: '10/12/2024 08:03',
            submitTime: '10/12/2024 09:20',
            score: 9.2,
            totalScore: 10,
            status: 'completed',
            attemptNumber: 1,
        },
        {
            id: '5',
            studentName: 'Hoàng Văn E',
            studentCode: 'HS005',
            studentClass: '12A1',
            startTime: '10/12/2024 08:00',
            submitTime: '10/12/2024 09:15',
            score: 6.5,
            totalScore: 10,
            status: 'completed',
            attemptNumber: 1,
        },
        {
            id: '6',
            studentName: 'Đỗ Thị F',
            studentCode: 'HS006',
            studentClass: '12A1',
            startTime: '10/12/2024 08:10',
            score: undefined,
            totalScore: 10,
            status: 'in-progress',
            attemptNumber: 1,
        },
        {
            id: '7',
            studentName: 'Vũ Văn G',
            studentCode: 'HS007',
            studentClass: '12A1',
            score: undefined,
            totalScore: 10,
            status: 'not-started',
            attemptNumber: 1,
        },
        {
            id: '8',
            studentName: 'Bùi Thị H',
            studentCode: 'HS008',
            studentClass: '12A1',
            startTime: '10/12/2024 08:04',
            submitTime: '10/12/2024 09:29',
            score: 8.9,
            totalScore: 10,
            status: 'completed',
            attemptNumber: 1,
        },
        {
            id: '9',
            studentName: 'Ngô Văn I',
            studentCode: 'HS009',
            studentClass: '12A1',
            startTime: '10/12/2024 08:06',
            submitTime: '10/12/2024 09:27',
            score: 7.8,
            totalScore: 10,
            status: 'completed',
            attemptNumber: 1,
        },
        {
            id: '10',
            studentName: 'Dương Thị K',
            studentCode: 'HS010',
            studentClass: '12A1',
            startTime: '10/12/2024 08:08',
            submitTime: '10/12/2024 09:22',
            score: 9.0,
            totalScore: 10,
            status: 'completed',
            attemptNumber: 1,
        },
    ];

    // Calculate stats
    const completedSubmissions = submissions.filter(s => s.status === 'completed');
    const totalScore = completedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
    const averageScore = completedSubmissions.length > 0 ? totalScore / completedSubmissions.length : 0;
    const highestScore = completedSubmissions.length > 0
        ? Math.max(...completedSubmissions.map(s => s.score || 0))
        : 0;

    // Calculate pagination
    const totalPages = Math.ceil(submissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSubmissions = submissions.slice(startIndex, endIndex);

    // Handlers
    const handleView = (id: string) => {
        console.log('View submission:', id);
    };

    const handleGrade = (id: string) => {
        console.log('Grade submission:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete submission:', id);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-6">
            <SubmissionFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedScoreRange={selectedScoreRange}
                onScoreRangeChange={setSelectedScoreRange}
            />

            <SubmissionStats
                totalSubmissions={submissions.length}
                completedSubmissions={completedSubmissions.length}
                averageScore={averageScore}
                highestScore={highestScore}
            />

            <SubmissionTable
                submissions={paginatedSubmissions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onView={handleView}
                onGrade={handleGrade}
                onDelete={handleDelete}
            />
        </div>
    );
};
