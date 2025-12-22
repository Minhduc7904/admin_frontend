import React from 'react';
import { Card, Pagination } from '@/shared/components/ui';
import { ExamSessionTableRow, type ExamSession } from './ExamSessionTableRow';

interface ExamSessionTableProps {
    sessions: ExamSession[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const ExamSessionTable: React.FC<ExamSessionTableProps> = ({
    sessions,
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
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Tên cuộc thi
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Thời gian
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Thời lượng
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Số người tham gia
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Trạng thái
                            </th>
                            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase w-16">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (
                            <ExamSessionTableRow
                                key={session.id}
                                session={session}
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
                totalItems={sessions.length}
                itemsPerPage={sessions.length}
                onPageChange={(page) => onPageChange?.(page)}
            />
        </Card>
    );
};
