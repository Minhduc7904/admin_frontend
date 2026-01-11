import { BookOpen, User, Calendar, Eye, DollarSign, Tag } from 'lucide-react';
import { SkeletonText } from '../../../shared/components/loading';

const StatusBadge = ({ visibility }) => {
    const badges = {
        PUBLISHED: {
            label: 'Đã xuất bản',
            className: 'bg-emerald-500/15 text-emerald-500'
        },
        DRAFT: {
            label: 'Bản nháp',
            className: 'bg-gray-500/15 text-gray-500'
        },
        PRIVATE: {
            label: 'Riêng tư',
            className: 'bg-blue-500/15 text-blue-500'
        },
    };

    const badge = badges[visibility] || badges.DRAFT;
    
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${badge.className}`}>
            <Eye className="w-3 h-3" />
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

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

export const CourseProfileOverview = ({ course, loading }) => {
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 text-white shadow-sm border border-border/50">
                <div className="flex gap-4 items-center">
                    <SkeletonText lines={3} className="flex-1" />
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="bg-white border border-dashed border-border rounded-xl p-8 text-center text-foreground-light">
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-foreground-light" />
                <p>Chưa có dữ liệu khóa học. Hãy kiểm tra lại liên kết hoặc thử tải lại trang.</p>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 text-white shadow-lg border border-white/10">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-0.5 bg-white/10 text-[10px] uppercase tracking-widest rounded-full border border-white/20">
                                #{course.courseId}
                            </span>
                            {course.grade && (
                                <span className="px-3 py-0.5 bg-white/10 text-[10px] uppercase tracking-widest rounded-full border border-white/20">
                                    Khối {course.grade}
                                </span>
                            )}
                        </div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-1">Khóa học</p>
                        <h1 className="text-2xl font-semibold leading-tight mb-2">{course.title}</h1>
                        {course.subtitle && (
                            <p className="text-white/70 text-sm">{course.subtitle}</p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge visibility={course.visibility} />
                            {course.isFree && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-500/15 text-green-500 border border-green-500/20">
                                    <Tag className="w-3 h-3" />
                                    Miễn phí
                                </span>
                            )}
                            {course.hasDiscount && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-500/15 text-red-500 border border-red-500/20">
                                    <Tag className="w-3 h-3" />
                                    Giảm {course.discountPercentage}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Giá</p>
                        {course.isFree ? (
                            <p className="text-2xl font-bold text-green-400">Miễn phí</p>
                        ) : (
                            <div>
                                <p className="text-2xl font-bold">{formatPrice(course.priceVND)}</p>
                                {course.hasDiscount && course.compareAtVND && (
                                    <p className="text-sm text-white/60 line-through">{formatPrice(course.compareAtVND)}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <DataPill icon={User} label="Giáo viên" value={course.teacherName} />
                    <DataPill icon={BookOpen} label="Môn học" value={course.subjectName} />
                    <DataPill icon={Calendar} label="Năm học" value={course.academicYear} />
                    <DataPill 
                        icon={Calendar} 
                        label="Cập nhật" 
                        value={new Date(course.updatedAt).toLocaleDateString('vi-VN')} 
                    />
                </div>

                {/* Description */}
                {course.description && (
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-2">Mô tả</p>
                        <p className="text-sm text-white/80 leading-relaxed">{course.description}</p>
                    </div>
                )}
            </div>
        </section>
    );
};
