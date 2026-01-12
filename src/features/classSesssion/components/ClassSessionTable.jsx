import { Edit2, Trash2, Clock } from 'lucide-react';
import { ActionMenu, Table } from '../../../shared/components/ui';

/* ===================== STATUS BADGE MAP ===================== */
const STATUS_BADGE = {
    past: 'bg-gray-100 text-gray-700',
    today: 'bg-blue-100 text-blue-700',
    upcoming: 'bg-green-100 text-green-700',
};

const STATUS_LABEL = {
    past: 'Đã qua',
    today: 'Hôm nay',
    upcoming: 'Sắp tới',
};

export const ClassSessionTable = ({
    sessions,
    onEdit,
    onDelete,
    loading,
}) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (session) => (
                <span className="text-sm text-foreground-light">
                    #{session.sessionId}
                </span>
            ),
        },
        {
            key: 'name',
            label: 'Tên buổi học',
            render: (session) => (
                <div className="max-w-xs">
                    <span className="text-sm font-medium text-foreground">
                        {session.name}
                    </span>
                    {session.makeupNote && (
                        <p className="text-xs text-foreground-light mt-0.5 truncate" title={session.makeupNote}>
                            Học bù: {session.makeupNote}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'sessionDate',
            label: 'Ngày học',
            render: (session) => (
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    {formatDate(session.sessionDate)}
                </span>
            ),
        },
        {
            key: 'time',
            label: 'Giờ học',
            render: (session) => (
                <div className="flex items-center gap-1 text-sm text-foreground-light">
                    <Clock size={14} />
                    <span className="whitespace-nowrap">
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </span>
                </div>
            ),
        },
        {
            key: 'duration',
            label: 'Thời lượng',
            render: (session) => (
                <span className="text-sm text-foreground-light">
                    {session.durationInHours > 0
                        ? `${session.durationInHours.toFixed(1)} giờ`
                        : `${session.durationInMinutes} phút`
                    }
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (session) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[session.status]}`}
                >
                    {STATUS_LABEL[session.status]}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (session) => (
                <div className="flex items-center justify-end gap-2">
                    {/* Edit */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(session);
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Cập nhật trạng thái"
                    >
                        <Edit2 size={16} className="text-warning" />
                    </button>
                    {/* Delete */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(session);
                        }}
                        className="p-1 rounded hover:bg-red-100 transition-colors"
                        title="Xóa ghi danh"
                    >
                        <Trash2
                            size={16}
                            className="text-red-600"
                        />
                    </button>
                </div>

            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={sessions}
            loading={loading}
            emptyMessage="Chưa có buổi học nào"
        />
    );
};
