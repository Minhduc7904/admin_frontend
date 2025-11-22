import React from 'react';
import { Card, Pagination } from '@/shared/components/ui';
import { StudentTableRow } from './StudentTableRow';

interface Student {
    id: string;
    name: string;
    studentCode: string;
    email: string;
    grade: string;
    class: string;
    status: 'active' | 'inactive' | 'suspended';
    enrolledDate: string;
}

interface StudentTableProps {
    students: Student[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onEdit?: (id: string) => void;
    onToggleLock?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
    students,
    currentPage = 1,
    totalPages = 3,
    onPageChange,
    onEdit,
    onToggleLock,
    onDelete,
}) => {
    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Họ tên
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Mã HS
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Email
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Khối
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Lớp
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Trạng thái
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Ngày nhập học
                            </th>
                            <th className="text-right py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <StudentTableRow
                                key={student.id}
                                student={student}
                                onEdit={onEdit}
                                onToggleLock={onToggleLock}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={students.length}
                itemsPerPage={students.length}
                onPageChange={(page) => onPageChange?.(page)}
            />
        </Card>
    );
};
