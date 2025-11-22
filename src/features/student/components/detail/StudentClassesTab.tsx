import React from 'react';
import { Card } from '@/shared/components/ui';
import { BookOpen, Users, Clock, Calendar } from 'lucide-react';

interface ClassInfo {
    id: string;
    name: string;
    subject: string;
    teacher: string;
    schedule: string;
    room: string;
    semester: string;
    studentCount: number;
    status: 'active' | 'completed' | 'upcoming';
}

interface StudentClassesTabProps {
    classes: ClassInfo[];
}

const getClassStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700';
        case 'completed':
            return 'bg-gray-100 text-gray-700';
        case 'upcoming':
            return 'bg-blue-100 text-blue-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getClassStatusText = (status: string) => {
    switch (status) {
        case 'active':
            return 'Đang học';
        case 'completed':
            return 'Đã hoàn thành';
        case 'upcoming':
            return 'Sắp học';
        default:
            return status;
    }
};

export const StudentClassesTab: React.FC<StudentClassesTabProps> = ({ classes }) => {
    const activeCount = classes.filter(c => c.status === 'active').length;
    const completedCount = classes.filter(c => c.status === 'completed').length;
    const upcomingCount = classes.filter(c => c.status === 'upcoming').length;

    return (
        <div className="space-y-4">
            {/* Statistics */}
            <div className="grid grid-cols-4 gap-3">
                <Card>
                    <p className="text-xs text-gray-600">Tổng lớp</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{classes.length}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Đang học</p>
                    <p className="text-xl font-bold text-green-600 mt-1">{activeCount}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Đã hoàn thành</p>
                    <p className="text-xl font-bold text-gray-600 mt-1">{completedCount}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Sắp học</p>
                    <p className="text-xl font-bold text-blue-600 mt-1">{upcomingCount}</p>
                </Card>
            </div>

            {/* Classes List */}
            <Card>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Danh sách lớp học</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {classes.map((classInfo) => (
                        <div
                            key={classInfo.id}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h5 className="text-sm font-semibold text-gray-900">{classInfo.name}</h5>
                                    <p className="text-xs text-gray-600 mt-1">{classInfo.subject}</p>
                                </div>
                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getClassStatusColor(classInfo.status)}`}>
                                    {getClassStatusText(classInfo.status)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <BookOpen size={14} className="text-gray-400" />
                                    <span>GV: {classInfo.teacher}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock size={14} className="text-gray-400" />
                                    <span>{classInfo.schedule}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span>Phòng: {classInfo.room}</span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Users size={14} className="text-gray-400" />
                                        <span>{classInfo.studentCount} học sinh</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{classInfo.semester}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
