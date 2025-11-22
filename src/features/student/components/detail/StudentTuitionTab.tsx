import React from 'react';
import { Card } from '@/shared/components/ui';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TuitionRecord {
    id: string;
    month: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: 'paid' | 'pending' | 'overdue';
    note?: string;
}

interface StudentTuitionTabProps {
    tuitionRecords: TuitionRecord[];
}

const getTuitionStatusColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'bg-green-100 text-green-700';
        case 'pending':
            return 'bg-blue-100 text-blue-700';
        case 'overdue':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getTuitionStatusText = (status: string) => {
    switch (status) {
        case 'paid':
            return 'Đã đóng';
        case 'pending':
            return 'Chưa đóng';
        case 'overdue':
            return 'Quá hạn';
        default:
            return status;
    }
};

const getTuitionIcon = (status: string) => {
    switch (status) {
        case 'paid':
            return <CheckCircle size={18} className="text-green-600" />;
        case 'pending':
            return <Clock size={18} className="text-blue-600" />;
        case 'overdue':
            return <AlertCircle size={18} className="text-red-600" />;
        default:
            return null;
    }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

export const StudentTuitionTab: React.FC<StudentTuitionTabProps> = ({ tuitionRecords }) => {
    const totalPaid = tuitionRecords
        .filter(r => r.status === 'paid')
        .reduce((sum, r) => sum + r.amount, 0);
    
    const totalPending = tuitionRecords
        .filter(r => r.status === 'pending' || r.status === 'overdue')
        .reduce((sum, r) => sum + r.amount, 0);

    const paidCount = tuitionRecords.filter(r => r.status === 'paid').length;
    const overdueCount = tuitionRecords.filter(r => r.status === 'overdue').length;

    return (
        <div className="space-y-4">
            {/* Statistics */}
            <div className="grid grid-cols-4 gap-3">
                <Card>
                    <p className="text-xs text-gray-600">Đã đóng</p>
                    <p className="text-lg font-bold text-green-600 mt-1">{formatCurrency(totalPaid)}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Còn nợ</p>
                    <p className="text-lg font-bold text-red-600 mt-1">{formatCurrency(totalPending)}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Số tháng đã đóng</p>
                    <p className="text-xl font-bold text-green-600 mt-1">{paidCount}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Quá hạn</p>
                    <p className="text-xl font-bold text-red-600 mt-1">{overdueCount}</p>
                </Card>
            </div>

            {/* Tuition Records */}
            <Card>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Lịch sử học phí</h4>
                <div className="space-y-2">
                    {tuitionRecords.map((record) => (
                        <div
                            key={record.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                {getTuitionIcon(record.status)}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-medium text-gray-900">{record.month}</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getTuitionStatusColor(record.status)}`}>
                                            {getTuitionStatusText(record.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1">
                                        <p className="text-xs text-gray-600">Hạn đóng: {record.dueDate}</p>
                                        {record.paidDate && (
                                            <p className="text-xs text-green-600">Đã đóng: {record.paidDate}</p>
                                        )}
                                    </div>
                                    {record.note && (
                                        <p className="text-xs text-gray-600 mt-1">{record.note}</p>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{formatCurrency(record.amount)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
