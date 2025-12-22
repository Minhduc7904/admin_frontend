import React, { useState } from 'react';
import { StudentManagementLayout } from '@/shared/layouts/StudentManagementLayout';
import {
    StudentPageHeader,
    StudentFilters,
    StudentStats,
    StudentTable,
} from '@/features/student/components/studentList';

interface Student {
    id: string;
    name: string;
    studentCode: string;
    email: string;
    grade: string;
    class: string;
    status: 'active' | 'inactive' | 'suspended';
    enrolledDate: string;
}

export const StudentListPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Mock data
    const students: Student[] = [
        {
            id: '1',
            name: 'Nguyễn Văn An',
            studentCode: 'HS001',
            email: 'nguyenvanan@school.edu.vn',
            grade: 'Khối 12',
            class: '12A1',
            status: 'active',
            enrolledDate: '01/09/2022',
        },
        {
            id: '2',
            name: 'Trần Thị Bình',
            studentCode: 'HS002',
            email: 'tranthibinh@school.edu.vn',
            grade: 'Khối 12',
            class: '12A2',
            status: 'active',
            enrolledDate: '01/09/2022',
        },
        {
            id: '3',
            name: 'Lê Văn Cường',
            studentCode: 'HS003',
            email: 'levancuong@school.edu.vn',
            grade: 'Khối 11',
            class: '11B1',
            status: 'active',
            enrolledDate: '01/09/2023',
        },
        {
            id: '4',
            name: 'Phạm Thị Dung',
            studentCode: 'HS004',
            email: 'phamthidung@school.edu.vn',
            grade: 'Khối 11',
            class: '11B2',
            status: 'inactive',
            enrolledDate: '01/09/2023',
        },
        {
            id: '5',
            name: 'Hoàng Văn Em',
            studentCode: 'HS005',
            email: 'hoangvanem@school.edu.vn',
            grade: 'Khối 10',
            class: '10C1',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
        {
            id: '6',
            name: 'Đỗ Thị Phương',
            studentCode: 'HS006',
            email: 'dothiphuong@school.edu.vn',
            grade: 'Khối 10',
            class: '10C2',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
        {
            id: '7',
            name: 'Vũ Văn Giang',
            studentCode: 'HS007',
            email: 'vuvangiang@school.edu.vn',
            grade: 'Khối 12',
            class: '12A3',
            status: 'active',
            enrolledDate: '01/09/2022',
        },
        {
            id: '8',
            name: 'Mai Thị Hoa',
            studentCode: 'HS008',
            email: 'maithihoa@school.edu.vn',
            grade: 'Khối 11',
            class: '11B3',
            status: 'suspended',
            enrolledDate: '01/09/2023',
        },
        {
            id: '9',
            name: 'Ngô Văn Ích',
            studentCode: 'HS009',
            email: 'ngovanich@school.edu.vn',
            grade: 'Khối 10',
            class: '10C3',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
        {
            id: '10',
            name: 'Bùi Thị Khánh',
            studentCode: 'HS010',
            email: 'buithikhanh@school.edu.vn',
            grade: 'Khối 12',
            class: '12A1',
            status: 'active',
            enrolledDate: '01/09/2022',
        },
    ];

    // Handlers
    const handleAddStudent = () => {
        console.log('Add student clicked');
    };

    const handleEdit = (id: string) => {
        console.log('Edit student:', id);
    };

    const handleToggleLock = (id: string) => {
        console.log('Toggle lock student:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete student:', id);
    };

    return (
        <>
            <StudentPageHeader onAddClick={handleAddStudent} />

            <StudentFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
            />

            <StudentStats
                totalStudents={students.length}
                activeStudents={students.filter((s) => s.status === 'active').length}
                inactiveStudents={students.filter((s) => s.status === 'inactive').length}
                suspendedStudents={students.filter((s) => s.status === 'suspended').length}
            />

            <StudentTable
                students={students}
                onEdit={handleEdit}
                onToggleLock={handleToggleLock}
                onDelete={handleDelete}
            />
        </>
    );
};
