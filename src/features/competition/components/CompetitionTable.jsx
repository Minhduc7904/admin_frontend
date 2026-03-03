import { Eye, Edit, Trash2, Calendar, Trophy, FileText } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

export const CompetitionTable = ({ competitions, onView, onEdit, onDelete, onViewLeaderboard, loading }) => {
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
            },
        };

        const badge = badges[visibility] || badges.DRAFT;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                {badge.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (competition) => {
        const now = new Date();
        const startDate = new Date(competition.startDate);
        const endDate = new Date(competition.endDate);

        if (now < startDate) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Sắp diễn ra
                </span>
            );
        } else if (now >= startDate && now <= endDate) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Đang diễn ra
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Đã kết thúc
                </span>
            );
        }
    };

    const columns = [
        {
            key: 'competitionId',
            label: 'ID',
            render: (competition) => (
                <span className="text-sm text-foreground-light">#{competition.competitionId}</span>
            )
        },
        {
            key: 'title',
            label: 'Tiêu đề cuộc thi',
            render: (competition) => (
                <div className="flex flex-col max-w-md">
                    <span className="text-sm font-semibold text-foreground truncate">
                        {competition.title}
                    </span>
                    {competition.description && (
                        <span className="text-xs text-foreground-lighter truncate">
                            {competition.description}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'exam',
            label: 'Đề thi',
            render: (competition) => {
                if (!competition.exam) {
                    return (
                        <div className="flex items-center gap-2">
                            <FileText size={14} className="text-foreground-lighter" />
                            <span className="text-sm text-foreground-lighter italic">Chưa có</span>
                        </div>
                    );
                }
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <FileText size={14} className="text-foreground-lighter" />
                            <span className="text-sm text-foreground truncate max-w-[200px]" title={competition.exam.title}>
                                {competition.exam.title}
                            </span>
                        </div>
                        {competition.exam.grade && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                                Lớp {competition.exam.grade}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'duration',
            label: 'Thời gian làm bài',
            render: (competition) => (
                <span className="text-sm text-foreground">
                    {competition.duration ? `${competition.duration} phút` : '-'}
                </span>
            )
        },
        {
            key: 'period',
            label: 'Thời gian diễn ra',
            render: (competition) => (
                <div className="flex flex-col text-xs">
                    <div className="flex items-center gap-1 text-foreground-light">
                        <Calendar size={12} />
                        <span>Bắt đầu: {formatDate(competition.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-foreground-light">
                        <Calendar size={12} />
                        <span>Kết thúc: {formatDate(competition.endDate)}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (competition) => getStatusBadge(competition)
        },
        {
            key: 'participants',
            label: 'Số lượt thi',
            render: (competition) => (
                <div className="flex items-center gap-2">
                    <Trophy size={14} className="text-yellow-600" />
                    <span className="text-sm text-foreground">
                        {competition.totalSubmissions || 0}
                    </span>
                </div>
            )
        },
        {
            key: 'visibility',
            label: 'Hiển thị',
            render: (competition) => getVisibilityBadge(competition.visibility)
        },
        {
            key: 'createdBy',
            label: 'Tạo bởi',
            render: (competition) => (
                <div className="text-sm text-foreground-light">
                    {competition.createdByAdmin?.fullName || <span className="italic text-foreground-lighter">Chưa có</span>}
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (competition) => (
                <ActionMenu
                    items={[
                        {
                            label: 'Xem chi tiết',
                            icon: <Eye size={14} />,
                            onClick: () => onView(competition),
                        },
                        {
                            label: 'Bảng xếp hạng',
                            icon: <Trophy size={14} />,
                            onClick: () => onViewLeaderboard(competition),
                        },
                        {
                            label: 'Chỉnh sửa',
                            icon: <Edit size={14} />,
                            onClick: () => onEdit(competition),
                        },
                        {
                            label: 'Xóa cuộc thi',
                            icon: <Trash2 size={14} />,
                            variant: 'danger',
                            onClick: () => onDelete(competition),
                        },
                    ]}
                />
            )
        }
    ];

    return <Table
        columns={columns}
        data={competitions}
        loading={loading}
        onRowClick={(competition) => onView(competition)}
    />;
};
