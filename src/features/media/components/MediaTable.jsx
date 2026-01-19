import {
    Image,
    Video,
    Music,
    FileText,
    File,
    Eye,
} from 'lucide-react'
import { Table } from '../../../shared/components/ui';

/* =====================
   Helpers
===================== */
const getMediaIcon = (type) => {
    switch (type) {
        case 'IMAGE':
            return <Image size={20} className="text-blue-500" />
        case 'VIDEO':
            return <Video size={20} className="text-purple-500" />
        case 'AUDIO':
            return <Music size={20} className="text-green-500" />
        case 'DOCUMENT':
            return <FileText size={20} className="text-orange-500" />
        default:
            return <File size={20} className="text-gray-400" />
    }
}

const getStatusBadge = (status) => {
    const variants = {
        READY: 'bg-green-100 text-green-800',
        UPLOADING: 'bg-blue-100 text-blue-800',
        FAILED: 'bg-red-100 text-red-800',
        DELETED: 'bg-gray-100 text-gray-800',
    }

    const labels = {
        READY: 'Sẵn sàng',
        UPLOADING: 'Đang tải',
        FAILED: 'Thất bại',
        DELETED: 'Đã xóa',
    }

    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[status]}`}
        >
            {labels[status]}
        </span>
    )
}

const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

/* =====================
   MediaTable
===================== */
export const MediaTable = ({
    media = [],
    loading = false,
    onViewDetail,
    lastElementRef,
}) => {
    const columns = [
        {
            key: 'type',
            label: 'Loại',
            width: 80,
            align: 'center',
            render: (row) => getMediaIcon(row.type),
        },
        {
            key: 'fileName',
            label: 'Tên file',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                        {row.originalName || row.fileName}
                    </span>
                    {row.description && (
                        <span className="text-xs text-foreground-light">
                            {row.description}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'folder',
            label: 'Thư mục',
            render: (row) => (
                <span className="text-sm text-foreground-light">
                    {row.uploader ? row.uploader.username + " - " : ''}{row.folder ? row.folder.name : 'Chưa có'}
                </span>
            ),
        },
        {
            key: 'fileSize',
            label: 'Kích thước',
            align: 'right',
            className: 'text-sm text-foreground',
            render: (row) => formatFileSize(row.fileSize),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            align: 'center',
            render: (row) => getStatusBadge(row.status),
        },
        {
            key: 'createdAt',
            label: 'Ngày tải',
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
                <div className="flex items-center justify-end gap-2">
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
                </div>
            ),
        },
    ]

    return (
        <Table
            columns={columns}
            data={media}
            loading={loading}
            emptyMessage="Không có media nào"
            rowClassName="transition-colors"
            lastRowRef={lastElementRef}
            onRowClick={(row) => onViewDetail?.(row)}
            emptyIcon="file"
            emptySubMessage="Chưa có tệp media nào được tải lên hệ thống"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
        />
    )
}
