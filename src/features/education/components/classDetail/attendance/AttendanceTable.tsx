import React from 'react';
import { Card, Pagination } from '@/shared/components/ui';
import { AttendanceTableRow, type AttendanceRecord } from './AttendanceTableRow';

export type { AttendanceRecord };

interface AttendanceTableProps {
    records: AttendanceRecord[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
    records,
    currentPage = 1,
    totalPages = 3,
    onPageChange,
    onView,
    onEdit,
    onDelete,
}) => {
    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                ID phiếu
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Học sinh
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Trạng thái
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Điểm BTVN
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Học phí
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Ngày
                            </th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-700 uppercase w-16">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <AttendanceTableRow
                                key={record.id}
                                record={record}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={records.length}
                itemsPerPage={records.length}
                onPageChange={(page) => onPageChange?.(page)}
            />
        </Card>
    );
};
