import { Eye, Edit, Trash2, Archive, FileText } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

export const CourseTable = ({ courses, onView, onEdit, onDelete, loading }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getVisibilityBadge = (visibility) => {
        const badges = {
            DRAFT: {
                label: 'Bản nháp',
                className: 'bg-gray-100 text-gray-700'
            },
            PUBLISHED: {
                label: 'Đã xuất bản',
                className: 'bg-green-100 text-green-700'
            },
            PRIVATE: {
                label: 'Riêng tư',
                className: 'bg-yellow-100 text-yellow-700'
            }
        };

        const badge = badges[visibility] || badges.DRAFT;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                {badge.label}
            </span>
        );
    };

    const columns = [
        {
            key: 'courseId',
            label: 'ID',
            render: (course) => (
                <span className="text-sm text-foreground-light">#{course.courseId}</span>
            )
        },
        {
            key: 'title',
            label: 'Tiêu đề khóa học',
            render: (course) => (
                <div className="flex flex-col max-w-md">
                    <span className="text-sm font-semibold text-foreground truncate">
                        {course.title}
                    </span>
                    {course.subtitle && (
                        <span className="text-xs text-foreground-lighter truncate">
                            {course.subtitle}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'subject',
            label: 'Môn học',
            render: (course) => (
                <div className="text-sm text-foreground-light">
                    {course.subjectName || <span className="italic text-foreground-lighter">Chưa có</span>}
                </div>
            )
        },
        {
            key: 'grade',
            label: 'Khối',
            render: (course) => (
                course.grade ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Khối {course.grade}
                    </span>
                ) : (
                    <span className="italic text-foreground-lighter">-</span>
                )
            )
        },
        {
            key: 'academicYear',
            label: 'Năm học',
            render: (course) => (
                <div className="text-sm text-foreground-light">
                    {course.academicYear || <span className="italic text-foreground-lighter">-</span>}
                </div>
            )
        },
        {
            key: 'teacher',
            label: 'Giáo viên',
            render: (course) => (
                <div className="text-sm text-foreground-light">
                    {course.teacherName || <span className="italic text-foreground-lighter">Chưa có</span>}
                </div>
            )
        },
        {
            key: 'price',
            label: 'Giá',
            render: (course) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                        {course.isFree ? (
                            <span className="text-green-600">Miễn phí</span>
                        ) : (
                            formatPrice(course.priceVND)
                        )}
                    </span>
                    {course.hasDiscount && course.compareAtVND && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground-lighter line-through">
                                {formatPrice(course.compareAtVND)}
                            </span>
                            <span className="text-xs font-medium text-red-600">
                                -{course.discountPercentage}%
                            </span>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'visibility',
            label: 'Trạng thái',
            render: (course) => getVisibilityBadge(course.visibility)
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (course) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Xem chi tiết',
                            icon: <Eye size={14} />,
                            onClick: () => onView(course),
                        },
                        {
                            label: 'Chỉnh sửa',
                            icon: <Edit size={14} />,
                            onClick: () => onEdit(course),
                        },
                        {
                            label: 'Xóa khóa học',
                            icon: <Trash2 size={14} />,
                            variant: 'danger',
                            onClick: () => onDelete(course),
                        },
                    ]}
                />
            )
        },
    ];

    return (
        <Table
            columns={columns}
            data={courses}
            loading={loading}
            emptyMessage="Không có khóa học nào"
            emptySubMessage="Chưa có khóa học nào được thêm vào hệ thống"
            emptyIcon="book-open"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
            onRowClick={(course) => onView(course)}
        />
    );
}
