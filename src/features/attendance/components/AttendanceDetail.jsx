import { User, Calendar, Clock, FileText, CheckCircle2, Info } from 'lucide-react';

/* ===================== STATUS CONFIG ===================== */
const STATUS_CONFIG = {
    PRESENT: { label: 'Có mặt', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle2 },
    ABSENT: { label: 'Vắng', color: 'text-red-600', bgColor: 'bg-red-50', icon: Info },
    LATE: { label: 'Muộn', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Clock },
    MAKEUP: { label: 'Học bù', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Calendar },
};

export const AttendanceDetail = ({ attendance }) => {
    if (!attendance) {
        return (
            <div className="p-6 text-center text-foreground-light">
                Không có dữ liệu điểm danh
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[attendance.status] || STATUS_CONFIG.PRESENT;
    const StatusIcon = statusConfig.icon;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* ===== STATUS BADGE ===== */}
                <div className={`${statusConfig.bgColor} rounded-sm p-4 flex items-center gap-3`}>
                    <div className={`p-2 rounded-full bg-white`}>
                        <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-foreground-light">Trạng thái điểm danh</p>
                        <p className={`text-lg font-semibold ${statusConfig.color}`}>
                            {statusConfig.label}
                        </p>
                    </div>
                </div>

                {/* ===== STUDENT INFO ===== */}
                <div className="border border-border rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-foreground-light" />
                        <h3 className="font-semibold text-foreground">Thông tin học sinh</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-foreground-light">Họ và tên:</span>
                            <span className="text-sm font-medium text-foreground">
                                {attendance.student?.fullName || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-foreground-light">Mã học sinh:</span>
                            <span className="text-sm font-medium text-foreground">
                                #{attendance.student?.studentId || 'N/A'}
                            </span>
                        </div>
                        {attendance.student?.school && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">Trường:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {attendance.student.school}
                                </span>
                            </div>
                        )}
                        {attendance.student?.studentPhone && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">SĐT học sinh:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {attendance.student.studentPhone}
                                </span>
                            </div>
                        )}
                        {attendance.student?.parentPhone && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">SĐT phụ huynh:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {attendance.student.parentPhone}
                                </span>
                            </div>
                        )}
                        {attendance.student?.email && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">Email:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {attendance.student.email}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== SESSION INFO ===== */}
                <div className="border border-border rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-foreground-light" />
                        <h3 className="font-semibold text-foreground">Thông tin buổi học</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-foreground-light">Tên buổi học:</span>
                            <span className="text-sm font-medium text-foreground">
                                {attendance.classSession?.name || `Buổi #${attendance.sessionId}`}
                            </span>
                        </div>
                        {attendance.classSession?.sessionDate && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">Ngày học:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {formatDate(attendance.classSession.sessionDate)}
                                </span>
                            </div>
                        )}
                        {attendance.classSession?.startTime && attendance.classSession?.endTime && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">Thời gian:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {formatTime(attendance.classSession.startTime)} - {formatTime(attendance.classSession.endTime)}
                                </span>
                            </div>
                        )}
                        {attendance.classSession?.durationInMinutes && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">Thời lượng:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {attendance.classSession.durationInMinutes} phút ({attendance.classSession.durationInHours} giờ)
                                </span>
                            </div>
                        )}
                        {attendance.classSession?.status && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">Trạng thái buổi học:</span>
                                <span className={`text-sm font-medium ${
                                    attendance.classSession.status === 'past' ? 'text-gray-600' :
                                    attendance.classSession.status === 'today' ? 'text-blue-600' :
                                    'text-green-600'
                                }`}>
                                    {attendance.classSession.status === 'past' ? 'Đã qua' :
                                     attendance.classSession.status === 'today' ? 'Hôm nay' : 'Sắp tới'}
                                </span>
                            </div>
                        )}
                        {attendance.classSession?.courseClass?.className && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">Lớp học:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {attendance.classSession.courseClass.className}
                                </span>
                            </div>
                        )}
                        {attendance.classSession?.makeupNote && (
                            <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-sm text-foreground-light mb-1">Ghi chú học bù:</p>
                                <p className="text-sm text-foreground bg-gray-50 p-2 rounded">
                                    {attendance.classSession.makeupNote}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== ATTENDANCE DETAILS ===== */}
                <div className="border border-border rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-foreground-light" />
                        <h3 className="font-semibold text-foreground">Chi tiết điểm danh</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-foreground-light">Mã điểm danh:</span>
                            <span className="text-sm font-medium text-foreground">
                                #{attendance.attendanceId}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-foreground-light">Thời gian điểm danh:</span>
                            <span className="text-sm font-medium text-foreground">
                                {formatDateTime(attendance.markedAt)}
                            </span>
                        </div>
                        {attendance.markerName && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">Người điểm danh:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {attendance.markerName}
                                </span>
                            </div>
                        )}
                        {attendance.updatedAt && (
                            <div className="flex justify-between">
                                <span className="text-sm text-foreground-light">Cập nhật lần cuối:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {formatDateTime(attendance.updatedAt)}
                                </span>
                            </div>
                        )}
                        {attendance.notes && (
                            <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-sm text-foreground-light mb-1">Ghi chú:</p>
                                <p className="text-sm text-foreground bg-gray-50 p-2 rounded">
                                    {attendance.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
