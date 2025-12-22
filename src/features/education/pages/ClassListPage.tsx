import React, { useState } from 'react';
import {
    ClassPageHeader,
    ClassFilters,
    ClassStats,
    ClassTable,
    type Class,
} from '@/features/education/components/classList';

export const ClassListPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Mock data
    const classes: Class[] = [
        {
            id: '1',
            name: '12A1',
            classCode: 'LH001',
            grade: 'Khối 12',
            subject: 'Toán',
            teacher: 'Nguyễn Thị Lan',
            studentCount: 38,
            status: 'active',
            academicYear: '2024-2025',
        },
        {
            id: '2',
            name: '12A2',
            classCode: 'LH002',
            grade: 'Khối 12',
            subject: 'Văn',
            teacher: 'Trần Văn Hùng',
            studentCount: 40,
            status: 'active',
            academicYear: '2024-2025',
        },
        {
            id: '3',
            name: '11B1',
            classCode: 'LH003',
            grade: 'Khối 11',
            subject: 'Lý',
            teacher: 'Lê Thị Mai',
            studentCount: 35,
            status: 'active',
            academicYear: '2024-2025',
        },
        {
            id: '4',
            name: '11B2',
            classCode: 'LH004',
            grade: 'Khối 11',
            subject: 'Hóa',
            teacher: 'Phạm Văn Đức',
            studentCount: 37,
            status: 'active',
            academicYear: '2024-2025',
        },
        {
            id: '5',
            name: '10C1',
            classCode: 'LH005',
            grade: 'Khối 10',
            subject: 'Sinh',
            teacher: 'Hoàng Thị Thu',
            studentCount: 39,
            status: 'active',
            academicYear: '2024-2025',
        },
        {
            id: '6',
            name: '10C2',
            classCode: 'LH006',
            grade: 'Khối 10',
            subject: 'Anh',
            teacher: 'Đỗ Văn Nam',
            studentCount: 36,
            status: 'active',
            academicYear: '2024-2025',
        },
        {
            id: '7',
            name: '12A3',
            classCode: 'LH007',
            grade: 'Khối 12',
            subject: 'Toán',
            teacher: 'Vũ Thị Hoa',
            studentCount: 38,
            status: 'active',
            academicYear: '2024-2025',
        },
        {
            id: '8',
            name: '11A1',
            classCode: 'LH008',
            grade: 'Khối 11',
            subject: 'Địa',
            teacher: 'Bùi Văn Thành',
            studentCount: 0,
            status: 'archived',
            academicYear: '2023-2024',
        },
        {
            id: '9',
            name: '10A1',
            classCode: 'LH009',
            grade: 'Khối 10',
            subject: 'Sử',
            teacher: 'Mai Thị Lan',
            studentCount: 40,
            status: 'completed',
            academicYear: '2023-2024',
        },
        {
            id: '10',
            name: '12B1',
            classCode: 'LH010',
            grade: 'Khối 12',
            subject: 'Văn',
            teacher: 'Ngô Văn Sơn',
            studentCount: 39,
            status: 'active',
            academicYear: '2024-2025',
        },
    ];

    // Handlers
    const handleAddClass = () => {
        console.log('Add class clicked');
    };

    const handleEdit = (id: string) => {
        console.log('Edit class:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete class:', id);
    };

    return (
        <>
            <ClassPageHeader onAddClick={handleAddClass} />

            <ClassFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
            />

            <ClassStats
                totalClasses={classes.length}
                activeClasses={classes.filter((c) => c.status === 'active').length}
                completedClasses={classes.filter((c) => c.status === 'completed').length}
                archivedClasses={classes.filter((c) => c.status === 'archived').length}
            />

            <ClassTable
                classes={classes}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    );
};
