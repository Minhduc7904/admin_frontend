import React from 'react';
import { Card } from '@/shared/components/ui';
import { BookOpen, User, Users, Calendar, GraduationCap, Clock, Edit2 } from 'lucide-react';

interface ClassInfo {
    id: string;
    name: string;
    classCode: string;
    subject: string;
    grade: string;
    teacher: string;
    teacherEmail: string;
    teacherPhone: string;
    studentCount: number;
    room: string;
    schedule: string;
    academicYear: string;
    semester: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed' | 'archived';
    description?: string;
}

interface ClassInfoTabProps {
    classInfo: ClassInfo;
    onEdit?: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700';
        case 'completed':
            return 'bg-blue-100 text-blue-700';
        case 'archived':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'active':
            return 'Đang hoạt động';
        case 'completed':
            return 'Đã hoàn thành';
        case 'archived':
            return 'Lưu trữ';
        default:
            return status;
    }
};

export const ClassInfoTab: React.FC<ClassInfoTabProps> = ({ classInfo, onEdit }) => {
    return (
        <div className="space-y-4">
            <Card>
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-2xl font-bold">
                            {classInfo.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{classInfo.name}</h3>
                            <p className="text-sm text-gray-600">{classInfo.classCode} - {classInfo.subject}</p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(classInfo.status)}`}>
                                {getStatusText(classInfo.status)}
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
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin lớp học</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <BookOpen size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Môn học</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.subject}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <GraduationCap size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Khối</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.grade}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Users size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Sĩ số</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.studentCount} học sinh</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <BookOpen size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Phòng học</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.room}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                            <Clock size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Lịch học</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.schedule}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin giáo viên</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Giáo viên</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.teacher}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <BookOpen size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.teacherEmail}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                            <BookOpen size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Số điện thoại</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.teacherPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin học kỳ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Năm học</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.academicYear}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Học kỳ</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.semester}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Ngày bắt đầu</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.startDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Ngày kết thúc</p>
                                <p className="text-sm font-medium text-gray-900">{classInfo.endDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {classInfo.description && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Mô tả</h4>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{classInfo.description}</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
