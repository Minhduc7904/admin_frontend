import React from 'react';
import { Card, Pagination } from '@/shared/components/ui';
import { QuestionTableRow, type Question } from './QuestionTableRow';

interface QuestionTableProps {
    questions: Question[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
    questions,
    currentPage = 1,
    totalPages = 1,
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
                                Nội dung câu hỏi
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Chương
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">
                                Ngày tạo
                            </th>
                            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase w-16">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question) => (
                            <QuestionTableRow
                                key={question.id}
                                question={question}
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
                    totalItems={questions.length}
                    itemsPerPage={questions.length}
                    onPageChange={(page) => onPageChange?.(page)}
                />
        </Card>
    );
};
