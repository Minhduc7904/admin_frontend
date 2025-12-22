import React, { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceTable, type AttendanceRecord } from './AttendanceTable';
import { AttendanceDetailPanel } from './AttendanceDetailPanel';

interface ClassAttendanceTabProps {
    classId: string;
}

export const ClassAttendanceTab: React.FC<ClassAttendanceTabProps> = ({ classId }) => {
    const [selectedLesson, setSelectedLesson] = useState<string>('all');
    const [selectedHomework, setSelectedHomework] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedTuition, setSelectedTuition] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
    const itemsPerPage = 10;

    // Mock data - attendance records
    const attendanceRecords: (AttendanceRecord & { teacherComment?: string })[] = [
        {
            id: 'ATT001',
            studentName: 'Nguyễn Văn An',
            studentCode: 'HS001',
            studentClass: '12A1',
            studentPhone: '0987654321',
            status: 'present',
            homeworkScore: 9.5,
            isPaidTuition: true,
            date: '02/12/2024',
            teacherComment: 'Em An học rất chăm chỉ, tích cực tham gia lớp học và hoàn thành bài tập đầy đủ. Cần tiếp tục phát huy.',
        },
        {
            id: 'ATT002',
            studentName: 'Trần Thị Bình',
            studentCode: 'HS002',
            studentClass: '12A1',
            studentPhone: '0987654322',
            status: 'present',
            homeworkScore: 8.0,
            isPaidTuition: true,
            date: '02/12/2024',
            teacherComment: 'Em Bình có nỗ lực trong học tập, làm bài tập đúng hạn.',
        },
        {
            id: 'ATT003',
            studentName: 'Lê Văn Cường',
            studentCode: 'HS003',
            studentClass: '12A1',
            studentPhone: '0987654323',
            status: 'late',
            homeworkScore: 7.5,
            isPaidTuition: false,
            date: '02/12/2024',
            teacherComment: 'Em Cường cần chú ý đến giờ hơn. Tuy nhiên, tinh thần học tập còn tốt.',
        },
        {
            id: 'ATT004',
            studentName: 'Phạm Thị Dung',
            studentCode: 'HS004',
            studentClass: '12A1',
            studentPhone: '0987654324',
            status: 'absent',
            homeworkScore: null,
            isPaidTuition: true,
            date: '02/12/2024',
        },
        {
            id: 'ATT005',
            studentName: 'Hoàng Văn Em',
            studentCode: 'HS005',
            studentClass: '12A1',
            studentPhone: '0987654325',
            status: 'present',
            homeworkScore: 9.0,
            isPaidTuition: true,
            date: '02/12/2024',
        },
        {
            id: 'ATT006',
            studentName: 'Đỗ Thị Phương',
            studentCode: 'HS006',
            studentClass: '12A1',
            studentPhone: '0987654326',
            status: 'excused',
            homeworkScore: null,
            isPaidTuition: false,
            date: '02/12/2024',
        },
        {
            id: 'ATT007',
            studentName: 'Vũ Văn Giang',
            studentCode: 'HS007',
            studentClass: '12A1',
            studentPhone: '0987654327',
            status: 'present',
            homeworkScore: 8.5,
            isPaidTuition: true,
            date: '02/12/2024',
        },
        {
            id: 'ATT008',
            studentName: 'Mai Thị Hoa',
            studentCode: 'HS008',
            studentClass: '12A1',
            studentPhone: '0987654328',
            status: 'present',
            homeworkScore: null,
            isPaidTuition: true,
            date: '02/12/2024',
        },
    ];

    // Handlers
    const handleCreateAll = () => {
        console.log('Create attendance for all students');
    };

    const handleCreateOne = () => {
        console.log('Create attendance for one student');
    };

    const handleView = (id: string) => {
        setSelectedRecordId(id);
    };

    const handleEdit = (id: string) => {
        console.log('Edit attendance:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete attendance:', id);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Calculate pagination
    const totalPages = Math.ceil(attendanceRecords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRecords = attendanceRecords.slice(startIndex, endIndex);

    // Calculate stats
    const presentCount = attendanceRecords.filter((r) => r.status === 'present').length;
    const absentCount = attendanceRecords.filter((r) => r.status === 'absent').length;
    const lateCount = attendanceRecords.filter((r) => r.status === 'late').length;
    const excusedCount = attendanceRecords.filter((r) => r.status === 'excused').length;

    return (
        <div className="space-y-4">
            {/* Header with Create Buttons */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Điểm danh</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleCreateOne}
                        className="flex items-center gap-2 px-3 py-2 bg-white text-gray-900 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <UserPlus size={16} />
                        Tạo 1 học sinh
                    </button>
                    <button
                        onClick={handleCreateAll}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Plus size={16} />
                        Tạo tất cả
                    </button>
                </div>
            </div>

            {/* Filters */}
            <AttendanceFilters
                selectedLesson={selectedLesson}
                onLessonChange={setSelectedLesson}
                selectedHomework={selectedHomework}
                onHomeworkChange={setSelectedHomework}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedTuition={selectedTuition}
                onTuitionChange={setSelectedTuition}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-green-700 mb-1">Có mặt</div>
                    <div className="text-2xl font-bold text-green-900">{presentCount}</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xs text-red-700 mb-1">Vắng</div>
                    <div className="text-2xl font-bold text-red-900">{absentCount}</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-xs text-orange-700 mb-1">Muộn</div>
                    <div className="text-2xl font-bold text-orange-900">{lateCount}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-700 mb-1">Có phép</div>
                    <div className="text-2xl font-bold text-blue-900">{excusedCount}</div>
                </div>
            </div>

            {/* Table */}
            <AttendanceTable
                records={paginatedRecords}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Detail Panel */}
            {selectedRecordId && (
                <AttendanceDetailPanel
                    record={attendanceRecords.find((r) => r.id === selectedRecordId)!}
                    onClose={() => setSelectedRecordId(null)}
                />
            )}
        </div>
    );
};
