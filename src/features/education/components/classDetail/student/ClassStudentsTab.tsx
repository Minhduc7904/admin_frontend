import React, { useState } from 'react';
import { Card, SearchInput, Dropdown, Pagination, type DropdownOption } from '@/shared/components/ui';
import { Users, UserPlus, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Student {
    id: string;
    name: string;
    studentCode: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'suspended';
    enrolledDate: string;
}

interface ClassStudentsTabProps {
    classId: string;
}

const getStatusColor = (status: Student['status']) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700';
        case 'inactive':
            return 'bg-gray-100 text-gray-700';
        case 'suspended':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: Student['status']) => {
    switch (status) {
        case 'active':
            return 'Đang học';
        case 'inactive':
            return 'Nghỉ học';
        case 'suspended':
            return 'Đình chỉ';
        default:
            return status;
    }
};

const StudentTableRow: React.FC<{
    student: Student;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}> = ({ student, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">
                            {student.name.charAt(0)}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                        {student.name}
                    </span>
                </div>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{student.studentCode}</span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{student.email}</span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{student.phone}</span>
            </td>
            <td className="py-2 px-3">
                <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(
                        student.status
                    )}`}
                >
                    {getStatusText(student.status)}
                </span>
            </td>
            <td className="py-2 px-3">
                <span className="text-xs text-gray-600">{student.enrolledDate}</span>
            </td>
            <td className="py-2 px-3 w-16">
                <div className="flex items-center justify-center" ref={dropdownRef}>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        >
                            <MoreVertical size={14} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => {
                                        navigate(`/student/detail/${student.id}`);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Eye size={12} />
                                    Xem chi tiết
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit?.(student.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit2 size={12} />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete?.(student.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 size={12} />
                                    Xóa khỏi lớp
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export const ClassStudentsTab: React.FC<ClassStudentsTabProps> = ({ classId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Mock data - students in this class
    const students: Student[] = [
        {
            id: '1',
            name: 'Nguyễn Văn An',
            studentCode: 'HS001',
            email: 'nguyenvanan@school.edu.vn',
            phone: '0987654321',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
        {
            id: '2',
            name: 'Trần Thị Bình',
            studentCode: 'HS002',
            email: 'tranthibinh@school.edu.vn',
            phone: '0987654322',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
        {
            id: '3',
            name: 'Lê Văn Cường',
            studentCode: 'HS003',
            email: 'levancuong@school.edu.vn',
            phone: '0987654323',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
        {
            id: '4',
            name: 'Phạm Thị Dung',
            studentCode: 'HS004',
            email: 'phamthidung@school.edu.vn',
            phone: '0987654324',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
        {
            id: '5',
            name: 'Hoàng Văn Em',
            studentCode: 'HS005',
            email: 'hoangvanem@school.edu.vn',
            phone: '0987654325',
            status: 'inactive',
            enrolledDate: '01/09/2024',
        },
        {
            id: '6',
            name: 'Đỗ Thị Phương',
            studentCode: 'HS006',
            email: 'dothiphuong@school.edu.vn',
            phone: '0987654326',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
        {
            id: '7',
            name: 'Vũ Văn Giang',
            studentCode: 'HS007',
            email: 'vuvangiang@school.edu.vn',
            phone: '0987654327',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
        {
            id: '8',
            name: 'Mai Thị Hoa',
            studentCode: 'HS008',
            email: 'maithihoa@school.edu.vn',
            phone: '0987654328',
            status: 'active',
            enrolledDate: '01/09/2024',
        },
    ];

    // Status options
    const statusOptions: DropdownOption[] = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Đang học' },
        { value: 'inactive', label: 'Nghỉ học' },
        { value: 'suspended', label: 'Đình chỉ' },
    ];

    // Handlers
    const handleAddStudent = () => {
        console.log('Add student to class');
    };

    const handleEdit = (id: string) => {
        console.log('Edit student:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Remove student from class:', id);
    };

    return (
        <div className="space-y-4">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Danh sách học sinh</h3>
                <button
                    onClick={handleAddStudent}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <UserPlus size={16} />
                    Thêm học sinh
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Tìm kiếm theo tên, mã học sinh..."
                    className="flex-1"
                />

                <Dropdown
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Chọn trạng thái"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Tổng số</p>
                            <p className="text-xl font-bold text-gray-900">{students.length}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Đang học</p>
                            <p className="text-xl font-bold text-gray-900">
                                {students.filter((s) => s.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Nghỉ học</p>
                            <p className="text-xl font-bold text-gray-900">
                                {students.filter((s) => s.status === 'inactive').length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Đình chỉ</p>
                            <p className="text-xl font-bold text-gray-900">
                                {students.filter((s) => s.status === 'suspended').length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Table */}
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
                                    Số điện thoại
                                </th>
                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                    Trạng thái
                                </th>
                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 uppercase">
                                    Ngày nhập học
                                </th>
                                <th className="text-center py-2 px-3 text-xs font-semibold text-gray-700 uppercase w-16">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <StudentTableRow
                                    key={student.id}
                                    student={student}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={1}
                    totalPages={1}
                    totalItems={students.length}
                    itemsPerPage={students.length}
                    onPageChange={(page) => console.log('Page:', page)}
                />
            </Card>
        </div>
    );
};
