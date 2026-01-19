import {
    Image,
    Video,
    Music,
    FileText,
    File,
    Eye,
    GripVertical,
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
            key: 'dragHandle',
            label: '',
            width: 40,
            align: 'center',
            isDragHandle: true,
            render: (row) => (
                <div 
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors p-1"
                    title="Kéo để di chuyển"
                >
                    <GripVertical size={16} />
                </div>
            ),
        },
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
            onDragStart={(row, e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('mediaId', row.mediaId);
                e.dataTransfer.setData('mediaName', row.fileName || row.originalName);
                e.dataTransfer.setData('currentFolderId', row.folderId || 'null');

                // Create custom drag ghost
                const dragGhost = document.createElement('div');
                dragGhost.style.cssText = `
                    position: absolute;
                    top: -9999px;
                    left: -9999px;
                    padding: 12px 16px;
                    background: white;
                    border: 2px solid #3b82f6;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    max-width: 300px;
                    z-index: 9999;
                `;

                // Get icon based on type
                const iconMap = {
                    'IMAGE': `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #3b82f6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
                    'VIDEO': `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #a855f7"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
                    'AUDIO': `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #10b981"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
                    'DOCUMENT': `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #f97316"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
                    'default': `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #9ca3af"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`
                };

                const iconSvg = iconMap[row.type] || iconMap['default'];
                const fileName = row.fileName || row.originalName;

                dragGhost.innerHTML = `
                    ${iconSvg}
                    <span style="font-size: 14px; color: #1f2937; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fileName}</span>
                `;

                document.body.appendChild(dragGhost);
                e.dataTransfer.setDragImage(dragGhost, 20, 20);

                // Clean up after drag starts
                setTimeout(() => {
                    document.body.removeChild(dragGhost);
                }, 0);
            }}
        />
    )
}
