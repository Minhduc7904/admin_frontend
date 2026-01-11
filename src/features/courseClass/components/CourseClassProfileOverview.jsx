import { Calendar, User, Users, Clock, MapPin, Tag } from 'lucide-react';
import { SkeletonText } from '../../../shared/components/loading';

const StatusBadge = ({ status }) => {
    const badges = {
        active: {
            label: 'Đang diễn ra',
            className: 'bg-green-500/15 text-green-500'
        },
        upcoming: {
            label: 'Sắp diễn ra',
            className: 'bg-blue-500/15 text-blue-500'
        },
        completed: {
            label: 'Đã kết thúc',
            className: 'bg-gray-500/15 text-gray-500'
        },
        unscheduled: {
            label: 'Chưa lên lịch',
            className: 'bg-yellow-500/15 text-yellow-500'
        },
    };

    const badge = badges[status] || badges.unscheduled;
    
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${badge.className}`}>
            <Clock className="w-3 h-3" />
            {badge.label}
        </span>
    );
};

const DataPill = ({ icon: Icon, label, value }) => (
    <div className="bg-white/10 rounded-md p-3 border border-white/10">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">{label}</p>
        <div className="flex items-center gap-2 text-white text-sm font-medium">
            <Icon className="w-4 h-4 text-white/70" />
            <span>{value || 'Chưa cập nhật'}</span>
        </div>
    </div>
);

const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

export const CourseClassProfileOverview = ({ courseClass, loading }) => {
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 rounded-xl p-6 text-white shadow-sm border border-border/50">
                <div className="flex gap-4 items-center">
                    <SkeletonText lines={3} className="flex-1" />
                </div>
            </div>
        );
    }

    if (!courseClass) {
        return (
            <div className="bg-white border border-dashed border-border rounded-xl p-8 text-center text-foreground-light">
                <Users className="w-10 h-10 mx-auto mb-3 text-foreground-light" />
                <p>Chưa có dữ liệu lớp học. Hãy kiểm tra lại liên kết hoặc thử tải lại trang.</p>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 rounded-xl p-6 text-white shadow-lg border border-white/10">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-0.5 bg-white/10 text-[10px] uppercase tracking-widest rounded-full border border-white/20">
                                #{courseClass.classId}
                            </span>
                        </div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-1">Lớp học</p>
                        <h1 className="text-2xl font-semibold leading-tight mb-2">{courseClass.className}</h1>
                        {courseClass.course && (
                            <p className="text-white/70 text-sm">Khóa: {courseClass.course.title}</p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge status={courseClass.status} />
                            {courseClass.isScheduled && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                                    <Calendar className="w-3 h-3" />
                                    Đã lên lịch
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Thời lượng</p>
                        {courseClass.durationInDays ? (
                            <p className="text-2xl font-bold">{courseClass.durationInDays} ngày</p>
                        ) : (
                            <p className="text-lg text-white/60">Chưa xác định</p>
                        )}
                    </div>
                </div>

                {/* Data Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <DataPill 
                        icon={User} 
                        label="Giáo viên" 
                        value={courseClass.instructor?.fullName || 'Chưa phân công'} 
                    />
                    <DataPill 
                        icon={MapPin} 
                        label="Phòng học" 
                        value={courseClass.room || 'Chưa xác định'} 
                    />
                    <DataPill 
                        icon={Calendar} 
                        label="Ngày bắt đầu" 
                        value={formatDate(courseClass.startDate) || 'Chưa xác định'} 
                    />
                    <DataPill 
                        icon={Calendar} 
                        label="Ngày kết thúc" 
                        value={formatDate(courseClass.endDate) || 'Chưa xác định'} 
                    />
                </div>

                {/* Course Info */}
                {courseClass.course && (
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-2">Khóa học</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white mb-1">{courseClass.course.title}</p>
                                {courseClass.course.subtitle && (
                                    <p className="text-xs text-white/70">{courseClass.course.subtitle}</p>
                                )}
                            </div>
                            {courseClass.course.teacherName && (
                                <div className="text-right">
                                    <p className="text-xs text-white/60">Giáo viên khóa</p>
                                    <p className="text-sm text-white">{courseClass.course.teacherName}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
