import React from 'react';
import { Card, Pagination } from '@/shared/components/ui';
import { ClassTableRow, type Class } from './ClassTableRow';

interface ClassTableProps {
    classes: Class[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const ClassTable: React.FC<ClassTableProps> = ({
    classes,
    currentPage = 1,
    totalPages = 3,
    onPageChange,
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
                                Tên lớp
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Mã lớp
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Khối
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Môn học
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                GV
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Sĩ số
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Trạng thái
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Năm học
                            </th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-700 uppercase w-16">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((classItem) => (
                            <ClassTableRow
                                key={classItem.id}
                                classItem={classItem}
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
                totalItems={classes.length}
                itemsPerPage={classes.length}
                onPageChange={(page) => onPageChange?.(page)}
            />
        </Card>
    );
};
