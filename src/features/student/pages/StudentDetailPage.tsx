import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StudentManagementLayout } from '@/shared/layouts/StudentManagementLayout';
import {
    StudentDetailHeader,
    StudentDetailTabs,
    StudentInfoTab,
    StudentAttendanceTab,
    StudentAssignmentsTab,
    StudentTuitionTab,
    StudentClassesTab,
} from '@/features/student/components/detail';

type TabType = 'info' | 'attendance' | 'assignments' | 'tuition' | 'classes';

interface Student {
    id: string;
    name: string;
    studentCode: string;
    email: string;
    phone: string;
    address: string;
    grade: string;
    class: string;
    status: 'active' | 'inactive' | 'suspended';
    enrolledDate: string;
    birthDate: string;
    gender: string;
    parentName: string;
    parentPhone: string;
}

interface AttendanceRecord {
    id: string;
    date: string;
    subject: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    note?: string;
}

interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    submittedDate?: string;
    score?: number;
    maxScore: number;
    status: 'completed' | 'late' | 'pending' | 'missing';
}

interface TuitionRecord {
    id: string;
    month: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: 'paid' | 'pending' | 'overdue';
    note?: string;
}

interface ClassInfo {
    id: string;
    name: string;
    subject: string;
    teacher: string;
    schedule: string;
    room: string;
    semester: string;
    studentCount: number;
    status: 'active' | 'completed' | 'upcoming';
}

export const StudentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<TabType>('info');

    // Mock data
    const student: Student = {
        id: id || '1',
        name: 'Nguyễn Văn An',
        studentCode: 'HS001',
        email: 'nguyenvanan@school.edu.vn',
        phone: '0987654321',
        address: 'Số 10, Đường Láng Hạ, Đống Đa, Hà Nội',
        grade: 'Khối 12',
        class: '12A1',
        status: 'active',
        enrolledDate: '01/09/2022',
        birthDate: '15/05/2007',
        gender: 'Nam',
        parentName: 'Nguyễn Văn Bình',
        parentPhone: '0912345678',
    };

    const attendanceRecords: AttendanceRecord[] = [
        {
            id: '1',
            date: '20/11/2024',
            subject: 'Toán học',
            status: 'present',
        },
        {
            id: '2',
            date: '20/11/2024',
            subject: 'Văn học',
            status: 'present',
        },
        {
            id: '3',
            date: '19/11/2024',
            subject: 'Tiếng Anh',
            status: 'late',
            note: 'Đến muộn 10 phút',
        },
        {
            id: '4',
            date: '19/11/2024',
            subject: 'Vật lý',
            status: 'present',
        },
        {
            id: '5',
            date: '18/11/2024',
            subject: 'Hóa học',
            status: 'absent',
            note: 'Ốm',
        },
        {
            id: '6',
            date: '18/11/2024',
            subject: 'Sinh học',
            status: 'excused',
            note: 'Có giấy phép',
        },
        {
            id: '7',
            date: '15/11/2024',
            subject: 'Lịch sử',
            status: 'present',
        },
        {
            id: '8',
            date: '15/11/2024',
            subject: 'Địa lý',
            status: 'present',
        },
    ];

    const assignments: Assignment[] = [
        {
            id: '1',
            title: 'Bài tập chương 3: Đạo hàm',
            subject: 'Toán học',
            dueDate: '25/11/2024',
            submittedDate: '24/11/2024',
            score: 9.5,
            maxScore: 10,
            status: 'completed',
        },
        {
            id: '2',
            title: 'Phân tích tác phẩm "Chiếc Thuyền Ngoài Xa"',
            subject: 'Văn học',
            dueDate: '22/11/2024',
            submittedDate: '23/11/2024',
            score: 8.0,
            maxScore: 10,
            status: 'late',
        },
        {
            id: '3',
            title: 'Essay: My Future Career',
            subject: 'Tiếng Anh',
            dueDate: '26/11/2024',
            status: 'pending',
            maxScore: 10,
        },
        {
            id: '4',
            title: 'Bài tập động lực học',
            subject: 'Vật lý',
            dueDate: '20/11/2024',
            submittedDate: '20/11/2024',
            score: 9.0,
            maxScore: 10,
            status: 'completed',
        },
        {
            id: '5',
            title: 'Thí nghiệm phản ứng hóa học',
            subject: 'Hóa học',
            dueDate: '18/11/2024',
            status: 'missing',
            maxScore: 10,
        },
        {
            id: '6',
            title: 'Báo cáo thực hành',
            subject: 'Sinh học',
            dueDate: '27/11/2024',
            status: 'pending',
            maxScore: 10,
        },
    ];

    const tuitionRecords: TuitionRecord[] = [
        {
            id: '1',
            month: 'Tháng 11/2024',
            amount: 5000000,
            dueDate: '05/11/2024',
            paidDate: '03/11/2024',
            status: 'paid',
        },
        {
            id: '2',
            month: 'Tháng 10/2024',
            amount: 5000000,
            dueDate: '05/10/2024',
            paidDate: '04/10/2024',
            status: 'paid',
        },
        {
            id: '3',
            month: 'Tháng 9/2024',
            amount: 5000000,
            dueDate: '05/09/2024',
            paidDate: '10/09/2024',
            status: 'paid',
            note: 'Đóng muộn 5 ngày',
        },
        {
            id: '4',
            month: 'Tháng 8/2024',
            amount: 5000000,
            dueDate: '05/08/2024',
            paidDate: '02/08/2024',
            status: 'paid',
        },
        {
            id: '5',
            month: 'Tháng 7/2024',
            amount: 5000000,
            dueDate: '05/07/2024',
            status: 'overdue',
            note: 'Chưa đóng, đã quá hạn',
        },
        {
            id: '6',
            month: 'Tháng 6/2024',
            amount: 5000000,
            dueDate: '05/06/2024',
            paidDate: '05/06/2024',
            status: 'paid',
        },
    ];

    const classes: ClassInfo[] = [
        {
            id: '1',
            name: 'Toán nâng cao 12',
            subject: 'Toán học',
            teacher: 'Nguyễn Thị Mai',
            schedule: 'Thứ 2, 4, 6 - 7h00-8h30',
            room: 'A201',
            semester: 'HK1 2024-2025',
            studentCount: 35,
            status: 'active',
        },
        {
            id: '2',
            name: 'Văn học Việt Nam hiện đại',
            subject: 'Văn học',
            teacher: 'Trần Văn Long',
            schedule: 'Thứ 3, 5 - 9h00-11h00',
            room: 'B105',
            semester: 'HK1 2024-2025',
            studentCount: 32,
            status: 'active',
        },
        {
            id: '3',
            name: 'English Advanced',
            subject: 'Tiếng Anh',
            teacher: 'Sarah Johnson',
            schedule: 'Thứ 2, 4 - 13h30-15h00',
            room: 'C301',
            semester: 'HK1 2024-2025',
            studentCount: 28,
            status: 'active',
        },
        {
            id: '4',
            name: 'Vật lý đại cương',
            subject: 'Vật lý',
            teacher: 'Lê Quang Minh',
            schedule: 'Thứ 3, 6 - 7h00-9h00',
            room: 'Lab Vật lý',
            semester: 'HK1 2024-2025',
            studentCount: 30,
            status: 'active',
        },
        {
            id: '5',
            name: 'Hóa học hữu cơ',
            subject: 'Hóa học',
            teacher: 'Phạm Thị Hoa',
            schedule: 'Thứ 5, 7 - 9h00-11h00',
            room: 'Lab Hóa',
            semester: 'HK1 2024-2025',
            studentCount: 25,
            status: 'active',
        },
        {
            id: '6',
            name: 'Toán cơ bản 11',
            subject: 'Toán học',
            teacher: 'Nguyễn Văn Tuấn',
            schedule: 'Thứ 2-6 - 7h00-8h30',
            room: 'A105',
            semester: 'HK2 2023-2024',
            studentCount: 38,
            status: 'completed',
        },
        {
            id: '7',
            name: 'Sinh học phân tử',
            subject: 'Sinh học',
            teacher: 'Đỗ Thị Lan',
            schedule: 'Thứ 3, 5 - 13h30-15h30',
            room: 'Lab Sinh',
            semester: 'HK2 2024-2025',
            studentCount: 30,
            status: 'upcoming',
        },
    ];

    // Handlers
    const handleEdit = () => {
        console.log('Edit student info');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <StudentInfoTab student={student} onEdit={handleEdit} />;
            case 'attendance':
                return <StudentAttendanceTab attendanceRecords={attendanceRecords} />;
            case 'assignments':
                return <StudentAssignmentsTab assignments={assignments} />;
            case 'tuition':
                return <StudentTuitionTab tuitionRecords={tuitionRecords} />;
            case 'classes':
                return <StudentClassesTab classes={classes} />;
            default:
                return null;
        }
    };

    return (
        <>
            <StudentDetailHeader />
            <StudentDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {renderTabContent()}
        </>
    );
};
