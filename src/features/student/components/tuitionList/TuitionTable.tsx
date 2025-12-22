import React from 'react';
import { Check, X } from 'lucide-react';
import { Checkbox, Pagination } from '@/shared/components/ui';

export interface TuitionRecord {
    id: string;
    studentName: string;
    studentCode: string;
    grade: string;
    class: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: 'paid' | 'unpaid' | 'overdue';
}

interface TuitionTableProps {
    records: TuitionRecord[];
    currentPage?: number;
    totalPages?: number;
    itemsPerPage?: number;
    onPageChange?: (page: number) => void;
    onTogglePayment: (id: string, currentStatus: boolean) => void;
}

export const TuitionTable: React.FC<TuitionTableProps> = ({ 
    records, 
    currentPage = 1,
    totalPages = 1,
    itemsPerPage = 10,
    onPageChange,
    onTogglePayment 
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const getStatusBadge = (status: 'paid' | 'unpaid' | 'overdue') => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                        <Check size={12} />
                        Đã đóng
                    </span>
                );
            case 'unpaid':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Chưa đóng
                    </span>
                );
            case 'overdue':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                        <X size={12} />
                        Quá hạn
                    </span>
                );
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className='bg-white border'>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-16">STT</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Mã HS</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Học sinh</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Khối</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Lớp</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Học phí</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Hạn đóng</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Ngày đóng</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Đã đóng</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {records.map((record, index) => (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-xs text-gray-600">
                                    {startIndex + index + 1}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600">{record.studentCode}</td>
                                <td className="px-4 py-3 text-xs font-medium text-gray-900">{record.studentName}</td>
                                <td className="px-4 py-3 text-xs text-gray-600">{record.grade}</td>
                                <td className="px-4 py-3 text-xs text-gray-600">{record.class}</td>
                                <td className="px-4 py-3 text-xs font-semibold text-gray-900">
                                    {formatCurrency(record.amount)}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600">{record.dueDate}</td>
                                <td className="px-4 py-3 text-xs text-gray-600">
                                    {record.paidDate || '-'}
                                </td>
                                <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                                <td className="px-4 py-3">
                                    <Checkbox
                                        checked={record.status === 'paid'}
                                        onChange={() => onTogglePayment(record.id, record.status === 'paid')}
                                        variant="success"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {records.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                    <p className="text-sm">Không có dữ liệu học phí</p>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={records.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => onPageChange?.(page)}
            />
        </div>
    );
};
