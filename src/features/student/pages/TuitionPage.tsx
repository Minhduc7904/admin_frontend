import React, { useState } from 'react';
import {
    TuitionPageHeader,
    TuitionFilters,
    TuitionStats,
    TuitionTable,
    type TuitionRecord,
} from '@/features/student/components';

export const TuitionPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('2024-12');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock data - using useState to make it mutable
    const [tuitionRecords, setTuitionRecords] = useState<TuitionRecord[]>([
        {
            id: '1',
            studentName: 'Nguyễn Văn An',
            studentCode: 'HS001',
            grade: 'Khối 12',
            class: '12A1',
            amount: 2500000,
            dueDate: '05/12/2024',
            paidDate: '03/12/2024',
            status: 'paid',
        },
        {
            id: '2',
            studentName: 'Trần Thị Bình',
            studentCode: 'HS002',
            grade: 'Khối 12',
            class: '12A2',
            amount: 2500000,
            dueDate: '05/12/2024',
            status: 'unpaid',
        },
        {
            id: '3',
            studentName: 'Lê Văn Cường',
            studentCode: 'HS003',
            grade: 'Khối 11',
            class: '11B1',
            amount: 2300000,
            dueDate: '05/12/2024',
            paidDate: '04/12/2024',
            status: 'paid',
        },
        {
            id: '4',
            studentName: 'Phạm Thị Dung',
            studentCode: 'HS004',
            grade: 'Khối 11',
            class: '11B2',
            amount: 2300000,
            dueDate: '05/12/2024',
            status: 'overdue',
        },
        {
            id: '5',
            studentName: 'Hoàng Văn Em',
            studentCode: 'HS005',
            grade: 'Khối 10',
            class: '10C1',
            amount: 2200000,
            dueDate: '05/12/2024',
            paidDate: '02/12/2024',
            status: 'paid',
        },
        {
            id: '6',
            studentName: 'Đỗ Thị Phương',
            studentCode: 'HS006',
            grade: 'Khối 10',
            class: '10C2',
            amount: 2200000,
            dueDate: '05/12/2024',
            status: 'unpaid',
        },
        {
            id: '7',
            studentName: 'Vũ Văn Giang',
            studentCode: 'HS007',
            grade: 'Khối 9',
            class: '9A1',
            amount: 2000000,
            dueDate: '05/12/2024',
            paidDate: '01/12/2024',
            status: 'paid',
        },
        {
            id: '8',
            studentName: 'Mai Thị Hoa',
            studentCode: 'HS008',
            grade: 'Khối 8',
            class: '8B1',
            amount: 1800000,
            dueDate: '05/12/2024',
            status: 'overdue',
        },
        {
            id: '9',
            studentName: 'Ngô Văn Ích',
            studentCode: 'HS009',
            grade: 'Khối 7',
            class: '7A2',
            amount: 1700000,
            dueDate: '05/12/2024',
            paidDate: '05/12/2024',
            status: 'paid',
        },
        {
            id: '10',
            studentName: 'Bùi Thị Khánh',
            studentCode: 'HS010',
            grade: 'Khối 6',
            class: '6B1',
            amount: 1600000,
            dueDate: '05/12/2024',
            status: 'unpaid',
        },
    ]);

    // Calculate statistics
    const totalAmount = tuitionRecords.reduce((sum, record) => sum + record.amount, 0);
    const paidAmount = tuitionRecords
        .filter((record) => record.status === 'paid')
        .reduce((sum, record) => sum + record.amount, 0);
    const unpaidAmount = tuitionRecords
        .filter((record) => record.status === 'unpaid')
        .reduce((sum, record) => sum + record.amount, 0);
    const overdueCount = tuitionRecords.filter((record) => record.status === 'overdue').length;

    // Pagination
    const totalPages = Math.ceil(tuitionRecords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRecords = tuitionRecords.slice(startIndex, endIndex);

    // Handlers
    const handleExport = () => {
        console.log('Export tuition report');
    };

    const handleSendReminder = () => {
        console.log('Send payment reminder');
    };

    const handleTogglePayment = (id: string, currentStatus: boolean) => {
        setTuitionRecords((prevRecords) =>
            prevRecords.map((record) => {
                if (record.id === id) {
                    const newStatus = currentStatus ? 'unpaid' : 'paid';
                    const today = new Date().toLocaleDateString('vi-VN');
                    return {
                        ...record,
                        status: newStatus as 'paid' | 'unpaid' | 'overdue',
                        paidDate: newStatus === 'paid' ? today : undefined,
                    };
                }
                return record;
            })
        );
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <TuitionPageHeader onExport={handleExport} onSendReminder={handleSendReminder} />

            <TuitionFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                selectedClass={selectedClass}
                onClassChange={setSelectedClass}
                selectedPaymentStatus={selectedPaymentStatus}
                onPaymentStatusChange={setSelectedPaymentStatus}
            />

            <TuitionStats
                totalAmount={totalAmount}
                paidAmount={paidAmount}
                unpaidAmount={unpaidAmount}
                overdueCount={overdueCount}
            />

            <TuitionTable 
                records={paginatedRecords} 
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onTogglePayment={handleTogglePayment} 
            />
        </>
    );
};
