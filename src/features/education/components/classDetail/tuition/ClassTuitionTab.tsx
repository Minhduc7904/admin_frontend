import React, { useState } from 'react';
import { TuitionStats, TuitionTable, type TuitionRecord } from '@/features/student/components';
import { Card, Dropdown, SearchInput, type DropdownOption } from '@/shared/components/ui';

interface ClassTuitionTabProps {
    classId: string;
}

interface TuitionFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedMonth: string;
    onMonthChange: (month: string) => void;
    selectedPaymentStatus: string;
    onPaymentStatusChange: (status: string) => void;
}

const TuitionFilters: React.FC<TuitionFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedMonth,
    onMonthChange,
    selectedPaymentStatus,
    onPaymentStatusChange,
}) => {
    const monthOptions: DropdownOption[] = [
        { value: '2024-12', label: 'Tháng 12/2024' },
        { value: '2024-11', label: 'Tháng 11/2024' },
        { value: '2024-10', label: 'Tháng 10/2024' },
        { value: '2024-09', label: 'Tháng 9/2024' },
        { value: '2024-08', label: 'Tháng 8/2024' },
    ];

    const paymentStatusOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'paid', label: 'Đã đóng' },
        { value: 'unpaid', label: 'Chưa đóng' },
        { value: 'overdue', label: 'Quá hạn' },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Tìm kiếm học sinh..."
                />
                <Dropdown
                    options={monthOptions}
                    value={selectedMonth}
                    onChange={onMonthChange}
                    placeholder="Chọn tháng"
                />
                <Dropdown
                    options={paymentStatusOptions}
                    value={selectedPaymentStatus}
                    onChange={onPaymentStatusChange}
                    placeholder="Chọn trạng thái"
                />
            </div>
        </Card>
    );
};

export const ClassTuitionTab: React.FC<ClassTuitionTabProps> = ({ classId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('2024-12');
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
            class: '12A1',
            amount: 2500000,
            dueDate: '05/12/2024',
            status: 'unpaid',
        },
        {
            id: '3',
            studentName: 'Lê Văn Cường',
            studentCode: 'HS003',
            grade: 'Khối 12',
            class: '12A1',
            amount: 2500000,
            dueDate: '05/12/2024',
            paidDate: '04/12/2024',
            status: 'paid',
        },
        {
            id: '4',
            studentName: 'Phạm Thị Dung',
            studentCode: 'HS004',
            grade: 'Khối 12',
            class: '12A1',
            amount: 2500000,
            dueDate: '05/12/2024',
            status: 'overdue',
        },
        {
            id: '5',
            studentName: 'Hoàng Văn Em',
            studentCode: 'HS005',
            grade: 'Khối 12',
            class: '12A1',
            amount: 2500000,
            dueDate: '05/12/2024',
            paidDate: '02/12/2024',
            status: 'paid',
        },
        {
            id: '6',
            studentName: 'Đỗ Thị Phương',
            studentCode: 'HS006',
            grade: 'Khối 12',
            class: '12A1',
            amount: 2500000,
            dueDate: '05/12/2024',
            status: 'unpaid',
        },
        {
            id: '7',
            studentName: 'Vũ Văn Giang',
            studentCode: 'HS007',
            grade: 'Khối 12',
            class: '12A1',
            amount: 2500000,
            dueDate: '05/12/2024',
            paidDate: '01/12/2024',
            status: 'paid',
        },
        {
            id: '8',
            studentName: 'Mai Thị Hoa',
            studentCode: 'HS008',
            grade: 'Khối 12',
            class: '12A1',
            amount: 2500000,
            dueDate: '05/12/2024',
            status: 'overdue',
        },
        {
            id: '9',
            studentName: 'Ngô Văn Ích',
            studentCode: 'HS009',
            grade: 'Khối 12',
            class: '12A1',
            amount: 2500000,
            dueDate: '05/12/2024',
            paidDate: '05/12/2024',
            status: 'paid',
        },
        {
            id: '10',
            studentName: 'Bùi Thị Khánh',
            studentCode: 'HS010',
            grade: 'Khối 12',
            class: '12A1',
            amount: 2500000,
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
        <div className="space-y-4">
            <TuitionFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
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
        </div>
    );
};
