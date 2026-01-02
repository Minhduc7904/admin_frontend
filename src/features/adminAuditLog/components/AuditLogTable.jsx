import { LoaderCircle, Eye } from 'lucide-react'
import { Table } from '../../../shared/components/ui'

/* =====================
   Helpers
===================== */
const getStatusBadge = (status) => {
    const statusConfig = {
        SUCCESS: {
            bg: 'bg-success-bg',
            text: 'text-success-text',
            label: 'Thành công',
        },
        FAIL: {
            bg: 'bg-error-bg',
            text: 'text-error-text',
            label: 'Thất bại',
        },
        ROLLBACK: {
            bg: 'bg-warning-bg',
            text: 'text-warning-text',
            label: 'Đã rollback',
        },
    }

    const config = statusConfig[status] || statusConfig.SUCCESS

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
            {config.label}
        </span>
    )
}

const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })

/* =====================
   AuditLogTable
===================== */
export const AuditLogTable = ({
    logs = [],
    loading = false,
    onViewDetail,
    lastElementRef,
}) => {
    const columns = [
        {
            key: 'logId',
            label: 'ID',
            width: 80,
            render: (row) => (
                <span className="text-sm text-foreground">#{row.logId}</span>
            ),
        },
        {
            key: 'admin',
            label: 'Người dùng',
            render: (row) =>
                row.admin ? (
                    <div>
                        <div className="font-medium">
                            {row.admin.firstName && row.admin.lastName
                                ? `${row.admin.lastName} ${row.admin.firstName}`
                                : row.admin.username || 'N/A'}
                        </div>
                        <div className="text-xs text-foreground-light">
                            @{row.admin.username || 'unknown'}
                        </div>
                    </div>
                ) : (
                    <span className="text-xs text-foreground-light">
                        Không có thông tin
                    </span>
                ),
        },
        {
            key: 'actionKey',
            label: 'Action',
            render: (row) => (
                <div>
                    <div className="font-medium">{row.actionKey}</div>
                    {row.errorMessage && (
                        <div className="text-xs text-error mt-1 truncate max-w-xs">
                            {row.errorMessage}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'resourceType',
            label: 'Resource',
            render: (row) => (
                <div>
                    <div className="font-medium">{row.resourceType}</div>
                    {row.resourceId && (
                        <div className="text-xs text-foreground-light">
                            ID: {row.resourceId}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => getStatusBadge(row.status),
        },
        {
            key: 'createdAt',
            label: 'Thời gian',
            render: (row) => (
                <span className="text-sm text-foreground-light">
                    {formatDate(row.createdAt)}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            render: (row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onViewDetail?.(row)
                    }}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Xem chi tiết"
                >
                    <Eye size={16} className="text-info" />
                </button>
            ),
        },
    ]

    return (
        <Table
            columns={columns}
            data={logs}
            loading={loading && logs.length === 0}
            emptyMessage="Không có audit log nào"
            rowClassName={(row, index) =>
                index === logs.length - 1 && lastElementRef
                    ? 'transition-colors'
                    : 'transition-colors'
            }
            lastRowRef={lastElementRef}
            onRowClick={(row) => onViewDetail?.(row)}
        />
    )
}
