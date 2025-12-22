import React from 'react';
import { Card, Pagination } from '@/shared/components/ui';
import { SubmissionTableRow, type Submission } from './SubmissionTableRow';

interface SubmissionTableProps {
    submissions: Submission[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onView?: (id: string) => void;
    onGrade?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const SubmissionTable: React.FC<SubmissionTableProps> = ({
    submissions,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    onView,
    onGrade,
    onDelete,
}) => {
    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Học sinh
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Lần làm
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Bắt đầu
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Nộp bài
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Điểm số
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
                        {submissions.map((submission) => (
                            <SubmissionTableRow
                                key={submission.id}
                                submission={submission}
                                onView={onView}
                                onGrade={onGrade}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={submissions.length}
                    itemsPerPage={submissions.length}
                    onPageChange={(page) => onPageChange?.(page)}
                />
            )}
        </Card>
    );
};
