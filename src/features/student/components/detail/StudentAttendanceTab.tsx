import React from 'react';
import { Card } from '@/shared/components/ui';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';

interface AttendanceRecord {
    id: string;
    date: string;
    subject: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    note?: string;
}

interface StudentAttendanceTabProps {
    attendanceRecords: AttendanceRecord[];
}

const getAttendanceStatusColor = (status: string) => {
    switch (status) {
        case 'present':
            return 'bg-green-100 text-green-700';
        case 'absent':
            return 'bg-red-100 text-red-700';
        case 'late':
            return 'bg-orange-100 text-orange-700';
        case 'excused':
            return 'bg-blue-100 text-blue-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getAttendanceStatusText = (status: string) => {
    switch (status) {
        case 'present':
            return 'Có mặt';
        case 'absent':
            return 'Vắng';
        case 'late':
            return 'Đi muộn';
        case 'excused':
            return 'Có phép';
        default:
            return status;
    }
};

const getAttendanceIcon = (status: string) => {
    switch (status) {
        case 'present':
            return <CheckCircle size={18} className="text-green-600" />;
        case 'absent':
        case 'late':
            return <XCircle size={18} className="text-red-600" />;
        case 'excused':
            return <CheckCircle size={18} className="text-blue-600" />;
        default:
            return null;
    }
};

export const StudentAttendanceTab: React.FC<StudentAttendanceTabProps> = ({ attendanceRecords }) => {
    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
    const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
    const excusedCount = attendanceRecords.filter(r => r.status === 'excused').length;
    const attendanceRate = ((presentCount / attendanceRecords.length) * 100).toFixed(1);

    return (
        <div className="space-y-4">
            {/* Statistics */}
            <div className="grid grid-cols-5 gap-3">
                <Card>
                    <p className="text-xs text-gray-600">Tổng buổi</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{attendanceRecords.length}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Có mặt</p>
                    <p className="text-xl font-bold text-green-600 mt-1">{presentCount}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Vắng</p>
                    <p className="text-xl font-bold text-red-600 mt-1">{absentCount}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Đi muộn</p>
                    <p className="text-xl font-bold text-orange-600 mt-1">{lateCount}</p>
                </Card>
                <Card>
                    <p className="text-xs text-gray-600">Tỷ lệ</p>
                    <p className="text-xl font-bold text-blue-600 mt-1">{attendanceRate}%</p>
                </Card>
            </div>

            {/* Attendance Records */}
            <Card>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Lịch sử điểm danh</h4>
                <div className="space-y-2">
                    {attendanceRecords.map((record) => (
                        <div
                            key={record.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                {getAttendanceIcon(record.status)}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-medium text-gray-900">{record.subject}</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getAttendanceStatusColor(record.status)}`}>
                                            {getAttendanceStatusText(record.status)}
                                        </span>
                                    </div>
                                    {record.note && (
                                        <p className="text-xs text-gray-600 mt-1">{record.note}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar size={14} />
                                <span>{record.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
