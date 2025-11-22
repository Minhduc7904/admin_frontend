import React from 'react';
import { Card } from '@/shared/components/ui';
import { Mail, Phone, MapPin, Calendar, GraduationCap, User as UserIcon, Edit2 } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    studentCode: string;
    email: string;
    phone: string;
    address: string;
    grade: string;
    class: string;
    status: 'active' | 'inactive' | 'suspended';
    enrolledDate: string;
    birthDate: string;
    gender: string;
    parentName: string;
    parentPhone: string;
}

interface StudentInfoTabProps {
    student: Student;
    onEdit?: () => void;
}

const getStatusColor = (status: string) => {
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

const getStatusText = (status: string) => {
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

export const StudentInfoTab: React.FC<StudentInfoTabProps> = ({ student, onEdit }) => {
    return (
        <div className="space-y-4">
            <Card>
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-2xl font-bold">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.studentCode}</p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(student.status)}`}>
                                {getStatusText(student.status)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Edit2 size={14} />
                        Chỉnh sửa
                    </button>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin cá nhân</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900">{student.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Số điện thoại</p>
                                <p className="text-sm font-medium text-gray-900">{student.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Ngày sinh</p>
                                <p className="text-sm font-medium text-gray-900">{student.birthDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <UserIcon size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Giới tính</p>
                                <p className="text-sm font-medium text-gray-900">{student.gender}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                            <MapPin size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Địa chỉ</p>
                                <p className="text-sm font-medium text-gray-900">{student.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin học tập</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <GraduationCap size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Khối</p>
                                <p className="text-sm font-medium text-gray-900">{student.grade}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <GraduationCap size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Lớp</p>
                                <p className="text-sm font-medium text-gray-900">{student.class}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                            <Calendar size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Ngày nhập học</p>
                                <p className="text-sm font-medium text-gray-900">{student.enrolledDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin phụ huynh</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <UserIcon size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Họ tên phụ huynh</p>
                                <p className="text-sm font-medium text-gray-900">{student.parentName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Số điện thoại phụ huynh</p>
                                <p className="text-sm font-medium text-gray-900">{student.parentPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
