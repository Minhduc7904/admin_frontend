import { Eye, Edit, Trash2, FileText, Youtube } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';
import { TYPE_OF_EXAM_LABELS } from '../../../core/constants';

export const ExamTable = ({ exams, onView, onEdit, onDelete, loading, showSubject = true }) => {
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
            key: 'examId',
            label: 'ID',
            render: (exam) => (
                <span className="text-sm text-foreground-light">#{exam.examId}</span>
            )
        },
        {
            key: 'title',
            label: 'Tiêu đề đề thi',
            render: (exam) => (
                <div className="flex flex-col max-w-md">
                    <span className="text-sm font-semibold text-foreground truncate">
                        {exam.title}
                    </span>
                    {exam.description && (
                        <span className="text-xs text-foreground-lighter truncate">
                            {exam.description}
                        </span>
                    )}
                </div>
            )
        },
        ...(showSubject ? [{
            key: 'subject',
            label: 'Môn học',
            render: (exam) => (
                <div className="text-sm text-foreground-light">
                    {exam.subjectName || <span className="italic text-foreground-lighter">Chưa có</span>}
                </div>
            )
        }] : []),
        {
            key: 'grade',
            label: 'Khối',
            render: (exam) => (
                exam.grade ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Khối {exam.grade}
                    </span>
                ) : (
                    <span className="italic text-foreground-lighter">-</span>
                )
            )
        },
        {
            key: 'typeOfExam',
            label: 'Loại đề thi',
            render: (exam) => (
                exam.typeOfExam ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {TYPE_OF_EXAM_LABELS[exam.typeOfExam] || exam.typeOfExam}
                    </span>
                ) : (
                    <span className="italic text-foreground-lighter">-</span>
                )
            )
        },
        {
            key: 'questionCount',
            label: 'Số câu hỏi',
            render: (exam) => (
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-foreground-lighter" />
                    <span className="text-sm text-foreground">
                        {exam.questionCount || 0}
                    </span>
                </div>
            )
        },
        {
            key: 'hasSolution',
            label: 'Video giải',
            render: (exam) => (
                exam.hasSolution ? (
                    <div className="flex items-center gap-1 text-red-600">
                        <Youtube size={14} />
                        <span className="text-xs">Có</span>
                    </div>
                ) : (
                    <span className="text-xs italic text-foreground-lighter">-</span>
                )
            )
        },
        {
            key: 'createdBy',
            label: 'Tạo bởi',
            render: (exam) => (
                <div className="text-sm text-foreground-light">
                    {exam.createdByAdmin?.fullName || <span className="italic text-foreground-lighter">Chưa có</span>}
                </div>
            )
        },
        {
            key: 'visibility',
            label: 'Trạng thái',
            render: (exam) => getVisibilityBadge(exam.visibility)
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (exam) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                        items={[
                            {
                                label: 'Xem chi tiết',
                                icon: <Eye size={14} />,
                                onClick: () => onView(exam),
                            },
                            {
                                label: 'Chỉnh sửa',
                                icon: <Edit size={14} />,
                                onClick: () => onEdit(exam),
                            },
                            {
                                label: 'Xóa đề thi',
                                icon: <Trash2 size={14} />,
                                variant: 'danger',
                                onClick: () => onDelete(exam),
                            },
                        ]}
                    />
                </div>
            )
        }
    ];

    return <Table
        columns={columns}
        data={exams}
        loading={loading}
        onRowClick={(exam) => onView(exam)}
    />;
};
