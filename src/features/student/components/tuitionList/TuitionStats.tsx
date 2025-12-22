import React from 'react';

interface TuitionStatsProps {
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    overdueCount: number;
}

export const TuitionStats: React.FC<TuitionStatsProps> = ({
    totalAmount,
    paidAmount,
    unpaidAmount,
    overdueCount,
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const paidPercentage = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

    return (
        <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Tổng học phí</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Đã thu</p>
                <p className="text-lg font-bold text-green-600 mt-1">{formatCurrency(paidAmount)}</p>
                <p className="text-xs text-green-600 mt-0.5">{paidPercentage}%</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Chưa thu</p>
                <p className="text-lg font-bold text-orange-600 mt-1">{formatCurrency(unpaidAmount)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Quá hạn</p>
                <p className="text-lg font-bold text-red-600 mt-1">{overdueCount} học sinh</p>
            </div>
        </div>
    );
};
