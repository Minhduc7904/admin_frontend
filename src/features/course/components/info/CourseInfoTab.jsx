import {
    BookOpen,
    User,
    Calendar,
    Eye,
    Hash,
    Clock,
    Edit,
    Tag,
} from 'lucide-react'
import { SkeletonCard } from '../../../../shared/components/loading'
import { Button } from '../../../../shared/components'

const formatDateTime = (value) => {
    if (!value) return 'Chưa cập nhật'

    try {
        return new Date(value).toLocaleString('vi-VN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
    } catch {
        return String(value)
    }
}

const InfoRow = ({ icon: Icon, label, value, badge }) => (
    <div className="flex items-center gap-3 py-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-gray-50 text-foreground-light">
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground-light">{label}</p>
            <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-medium text-foreground truncate">
                    {value || 'Chưa cập nhật'}
                </p>
                {badge}
            </div>
        </div>
    </div>
)

const VisibilityBadge = ({ visibility }) => {
    const badges = {
        PUBLISHED: {
            label: 'Đã xuất bản',
            className: 'bg-green-50 text-green-700',
        },
        DRAFT: {
            label: 'Bản nháp',
            className: 'bg-gray-50 text-gray-700',
        },
        PRIVATE: {
            label: 'Riêng tư',
            className: 'bg-blue-50 text-blue-700',
        },
    }

    const badge = badges[visibility] || badges.DRAFT

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${badge.className}`}
        >
            <Eye className="w-3 h-3" />
            {badge.label}
        </span>
    )
}

export const CourseInfoTab = ({ course, loading, onEdit }) => {
    if (loading) {
        return <SkeletonCard count={2} className="rounded-sm" />
    }

    if (!course) {
        return (
            <div className="bg-white border border-border rounded-sm p-6 text-center text-foreground-light">
                Không tìm thấy thông tin khóa học
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Edit */}
            <div className="flex justify-end">
                <Button onClick={onEdit} variant="primary">
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa thông tin
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                {/* LEFT */}
                <div className="space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">
                                Thông tin cơ bản
                            </h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow icon={BookOpen} label="Tiêu đề" value={course.title} />
                            <InfoRow icon={BookOpen} label="Phụ đề" value={course.subtitle} />
                            <InfoRow
                                icon={Tag}
                                label="Khối lớp"
                                value={course.grade ? `Khối ${course.grade}` : undefined}
                            />
                            <InfoRow
                                icon={Calendar}
                                label="Năm học"
                                value={course.academicYear}
                            />
                            <InfoRow
                                icon={BookOpen}
                                label="Môn học"
                                value={course.subjectName}
                            />
                            <InfoRow
                                icon={User}
                                label="Giáo viên"
                                value={course.teacherName}
                            />
                            <InfoRow
                                icon={Eye}
                                label="Trạng thái"
                                value=""
                                badge={<VisibilityBadge visibility={course.visibility} />}
                            />
                        </div>
                    </div>

                    {/* Mô tả */}
                    {course.description && (
                        <div className="bg-white border border-border rounded-sm">
                            <div className="px-4 py-3 border-b border-border">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Mô tả khóa học
                                </h3>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                    {course.description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                    {/* Hoạt động */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">
                                Hoạt động
                            </h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow
                                icon={Calendar}
                                label="Ngày tạo"
                                value={formatDateTime(course.createdAt)}
                            />
                            <InfoRow
                                icon={Clock}
                                label="Cập nhật gần nhất"
                                value={formatDateTime(course.updatedAt)}
                            />
                        </div>
                    </div>

                    {/* Thông tin hệ thống (basic) */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">
                                Thông tin hệ thống
                            </h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow
                                icon={Hash}
                                label="ID khóa học"
                                value={`#${course.courseId}`}
                            />
                            <InfoRow
                                icon={Hash}
                                label="ID môn học"
                                value={course.subjectId ? `#${course.subjectId}` : undefined}
                            />
                            <InfoRow
                                icon={Hash}
                                label="ID giáo viên"
                                value={course.teacherId ? `#${course.teacherId}` : undefined}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
