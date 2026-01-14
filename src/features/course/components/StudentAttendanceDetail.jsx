import { useState } from 'react';
import { Info, FileImage } from 'lucide-react';
import { Badge, Tabs } from '../../../shared/components/ui';
import { formatDate, formatDateTime } from '../../../shared/utils';

const STATUS_BADGE_VARIANT = {
    PRESENT: 'success',
    ABSENT: 'danger',
    LATE: 'warning',
    MAKEUP: 'info',
};

const STATUS_LABEL = {
    PRESENT: 'Có mặt',
    ABSENT: 'Vắng',
    LATE: 'Muộn',
    MAKEUP: 'Học bù',
};

export const StudentAttendanceDetail = ({ student, fromDate, toDate }) => {
    const [activeTab, setActiveTab] = useState('detail');

    if (!student) {
        return (
            <div className="p-6 text-center text-foreground-light">
                Không có dữ liệu
            </div>
        );
    }

    const tabs = [
        {
            label: 'Chi tiết',
            isActive: activeTab === 'detail',
            onActivate: () => setActiveTab('detail'),
            icon: Info,
            className: 'bg-primary',
        },
        {
            label: 'Xuất phiếu',
            isActive: activeTab === 'export',
            onActivate: () => setActiveTab('export'),
            icon: FileImage,
            className: 'bg-primary',
        },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="px-6 pt-4">
                <Tabs tabs={tabs} />
            </div>

            {/* Tabs Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'detail' && (
                    <div className="p-6 space-y-6 overflow-y-auto h-full">
                        {/* Date Range Info */}
                        {fromDate && toDate && (
                            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                                <p className="text-sm text-blue-800">
                                    <span className="font-medium">Khoảng thời gian:</span>{' '}
                                    {formatDate(fromDate)} - {formatDate(toDate)}
                                </p>
                            </div>
                        )}

                        {/* Student Info */}
                        <div className="bg-background border border-border rounded-sm p-4">
                            <h3 className="text-sm font-semibold text-foreground mb-3">
                                Thông tin học sinh
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-foreground-light">Mã học sinh:</span>
                                    <span className="font-medium text-foreground">{student.studentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground-light">Họ tên:</span>
                                    <span className="font-medium text-foreground">
                                        {student.lastName} {student.firstName}
                                    </span>
                                </div>
                                {student.email && (
                                    <div className="flex justify-between">
                                        <span className="text-foreground-light">Email:</span>
                                        <span className="text-foreground">{student.email}</span>
                                    </div>
                                )}
                                {student.grade && (
                                    <div className="flex justify-between">
                                        <span className="text-foreground-light">Lớp:</span>
                                        <span className="text-foreground">Lớp {student.grade}</span>
                                    </div>
                                )}
                                {student.school && (
                                    <div className="flex justify-between">
                                        <span className="text-foreground-light">Trường:</span>
                                        <span className="text-foreground">{student.school}</span>
                                    </div>
                                )}
                                {student.studentPhone && (
                                    <div className="flex justify-between">
                                        <span className="text-foreground-light">SĐT học sinh:</span>
                                        <span className="text-foreground">{student.studentPhone}</span>
                                    </div>
                                )}
                                {student.parentPhone && (
                                    <div className="flex justify-between">
                                        <span className="text-foreground-light">SĐT phụ huynh:</span>
                                        <span className="text-foreground">{student.parentPhone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistics */}
                        {/* Statistics */}
                        <div className="bg-background border border-border rounded-sm p-4">
                            <h3 className="text-sm font-semibold text-foreground mb-4">
                                Thống kê điểm danh
                            </h3>

                            <div className="grid grid-cols-5 gap-4 text-center">
                                <div className="space-y-1">
                                    <div className="text-xl font-semibold text-foreground">
                                        {student.totalSessions}
                                    </div>
                                    <div className="text-xs text-foreground-light">
                                        Tổng buổi
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xl font-semibold text-foreground">
                                        {student.presentCount}
                                    </div>
                                    <div className="text-xs text-foreground-light">
                                        Có mặt
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xl font-semibold text-foreground">
                                        {student.absentCount}
                                    </div>
                                    <div className="text-xs text-foreground-light">
                                        Vắng
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xl font-semibold text-foreground">
                                        {student.lateCount}
                                    </div>
                                    <div className="text-xs text-foreground-light">
                                        Muộn
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xl font-semibold text-foreground">
                                        {student.makeupCount}
                                    </div>
                                    <div className="text-xs text-foreground-light">
                                        Học bù
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Records */}
                        <div>
                            <h3 className="text-sm font-semibold text-foreground mb-3">
                                Lịch sử điểm danh ({student.attendances?.length || 0} buổi)
                            </h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {student.attendances && student.attendances.length > 0 ? (
                                    student.attendances.map((attendance, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-border rounded-sm p-3"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <div className="font-medium text-foreground">
                                                        {attendance.sessionName} - {attendance.className}
                                                    </div>
                                                    <div className="text-sm text-foreground-light">
                                                        {formatDate(attendance.sessionDate)} •{' '}
                                                        {new Date(attendance.startTime).toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}{' '}
                                                        -{' '}
                                                        {new Date(attendance.endTime).toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </div>
                                                <Badge variant={STATUS_BADGE_VARIANT[attendance.status]}>
                                                    {STATUS_LABEL[attendance.status]}
                                                </Badge>
                                            </div>
                                            {attendance.markedAt && (
                                                <div className="text-xs text-foreground-light">
                                                    Điểm danh: {formatDateTime(attendance.markedAt)}
                                                </div>
                                            )}
                                            {attendance.notes && (
                                                <div className="mt-2 text-sm text-foreground">
                                                    <span className="font-medium">Ghi chú:</span> {attendance.notes}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-foreground-light">
                                        Chưa có dữ liệu điểm danh
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'export' && (
                    <div className="p-6 flex items-center justify-center h-full">
                        <div className="text-center">
                            <FileImage size={48} className="mx-auto text-foreground-light mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Đang phát triển
                            </h3>
                            <p className="text-foreground-light">
                                Tính năng xuất phiếu điểm danh sẽ sớm được cập nhật
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
