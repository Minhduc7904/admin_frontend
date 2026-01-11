import { Users, User, Calendar, MapPin, Clock, Edit, Hash, Tag } from 'lucide-react';
import { SkeletonCard } from '../../../shared/components/loading';
import { Button } from '../../../shared/components';

const formatDate = (value) => {
    if (!value) return 'Chưa cập nhật';

    try {
        return new Date(value).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch (error) {
        return value;
    }
};

const formatDateTime = (value) => {
    if (!value) return 'Chưa cập nhật';

    try {
        return new Date(value).toLocaleString('vi-VN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch (error) {
        return value;
    }
};

const InfoRow = ({ icon: Icon, label, value, badge }) => (
    <div className="flex items-center gap-3 py-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-gray-50 text-foreground-light">
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground-light">{label}</p>
            <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-medium text-foreground truncate">{value || 'Chưa cập nhật'}</p>
                {badge}
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const badges = {
        active: {
            label: 'Đang diễn ra',
            className: 'bg-green-50 text-green-700'
        },
        upcoming: {
            label: 'Sắp diễn ra',
            className: 'bg-blue-50 text-blue-700'
        },
        completed: {
            label: 'Đã kết thúc',
            className: 'bg-gray-50 text-gray-700'
        },
        unscheduled: {
            label: 'Chưa lên lịch',
            className: 'bg-yellow-50 text-yellow-700'
        },
    };

    const badge = badges[status] || badges.unscheduled;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${badge.className}`}>
            <Clock className="w-3 h-3" />
            {badge.label}
        </span>
    );
};

export const CourseClassInfoTab = ({ courseClass, loading, onEdit }) => {
    if (loading) {
        return <SkeletonCard count={2} className="rounded-sm" />;
    }

    if (!courseClass) {
        return (
            <div className="bg-white border border-border rounded-sm p-6 text-center text-foreground-light">
                Không tìm thấy thông tin lớp học
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Edit Button */}
            <div className="flex justify-end">
                <Button onClick={onEdit} variant="primary">
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa thông tin
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">Thông tin cơ bản</h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow icon={Users} label="Tên lớp" value={courseClass.className} />
                            <InfoRow icon={User} label="Giáo viên" value={courseClass.instructor?.fullName || 'Chưa phân công'} />
                            <InfoRow icon={MapPin} label="Phòng học" value={courseClass.room} />
                            <InfoRow
                                icon={Clock}
                                label="Trạng thái"
                                value=""
                                badge={<StatusBadge status={courseClass.status} />}
                            />
                        </div>
                    </div>

                    {/* Thời gian */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">Thời gian</h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow icon={Calendar} label="Ngày bắt đầu" value={formatDate(courseClass.startDate)} />
                            <InfoRow icon={Calendar} label="Ngày kết thúc" value={formatDate(courseClass.endDate)} />
                            <InfoRow
                                icon={Clock}
                                label="Thời lượng"
                                value={courseClass.durationInDays ? `${courseClass.durationInDays} ngày` : 'Chưa xác định'}
                            />
                            {courseClass.isScheduled && (
                                <div className="pt-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                        <Calendar className="w-3 h-3" />
                                        Đã lên lịch
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Khóa học */}
                    {courseClass.course && (
                        <div className="bg-white border border-border rounded-sm">
                            <div className="px-4 py-3 border-b border-border">
                                <h3 className="text-sm font-semibold text-foreground">Khóa học</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <p className="text-xs text-foreground-light mb-1">Tên khóa học</p>
                                    <p className="text-sm font-medium text-foreground">{courseClass.course.title}</p>
                                </div>
                                {courseClass.course.subtitle && (
                                    <div>
                                        <p className="text-xs text-foreground-light mb-1">Phụ đề</p>
                                        <p className="text-sm text-foreground">{courseClass.course.subtitle}</p>
                                    </div>
                                )}
                                {courseClass.course.teacherName && (
                                    <div>
                                        <p className="text-xs text-foreground-light mb-1">Giáo viên khóa học</p>
                                        <p className="text-sm text-foreground">{courseClass.course.teacherName}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Hoạt động */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">Hoạt động</h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow icon={Calendar} label="Ngày tạo" value={formatDateTime(courseClass.createdAt)} />
                            <InfoRow icon={Clock} label="Cập nhật gần nhất" value={formatDateTime(courseClass.updatedAt)} />
                        </div>
                    </div>

                    {/* Thông tin hệ thống */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">Thông tin hệ thống</h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow icon={Hash} label="ID lớp học" value={`#${courseClass.classId}`} />
                            <InfoRow icon={Hash} label="ID khóa học" value={`#${courseClass.courseId}`} />
                            <InfoRow icon={Hash} label="ID giáo viên" value={courseClass.instructorId ? `#${courseClass.instructorId}` : 'Chưa có'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
