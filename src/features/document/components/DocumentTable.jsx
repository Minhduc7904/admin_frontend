import { Eye, Trash2 } from 'lucide-react';
import { ActionMenu, Badge, Table } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils/dateTime';
import { DOCUMENT_VISIBILITY_LABELS } from '../constants/document.constants';

const getVisibilityVariant = (visibility) => {
    if (visibility === 'PUBLISHED') return 'success';
    if (visibility === 'PRIVATE') return 'warning';
    return 'secondary';
};

export const DocumentTable = ({ documents, loading, onView, onDelete }) => {
    const columns = [
        {
            key: 'documentId',
            label: 'ID',
            render: (document) => <span className="text-sm text-foreground-light">#{document.documentId}</span>,
        },
        {
            key: 'title',
            label: 'Tài liệu',
            render: (document) => (
                <div className="flex min-w-0 items-center gap-3">
                    {document.thumbnailUrl ? (
                        <img
                            src={document.thumbnailUrl}
                            alt={document.title}
                            className="h-12 w-10 rounded-sm border border-border object-cover"
                        />
                    ) : (
                        <div className="flex h-12 w-10 items-center justify-center rounded-sm border border-border bg-gray-50 text-xs text-foreground-light">
                            PDF
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-foreground">{document.title}</div>
                        <div className="truncate font-mono text-xs text-foreground-light">{document.slug}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'visibility',
            label: 'Trạng thái',
            render: (document) => (
                <Badge variant={getVisibilityVariant(document.visibility)} size="small">
                    {DOCUMENT_VISIBILITY_LABELS[document.visibility] || document.visibility}
                </Badge>
            ),
        },
        {
            key: 'isFeatured',
            label: 'Nổi bật',
            render: (document) => (
                <Badge variant={document.isFeatured ? 'primary' : 'secondary'} size="small">
                    {document.isFeatured ? 'Có' : 'Không'}
                </Badge>
            ),
        },
        {
            key: 'stats',
            label: 'Lượt xem / tải',
            render: (document) => (
                <span className="text-sm text-foreground-light">
                    {document.viewCount || 0} / {document.downloadCount || 0}
                </span>
            ),
        },
        {
            key: 'tags',
            label: 'Tag',
            render: (document) => (
                <div className="flex max-w-xs flex-wrap gap-1">
                    {(document.tags || []).slice(0, 3).map((tag) => (
                        <Badge key={tag.tagId} variant="info" size="small">
                            {tag.name}
                        </Badge>
                    ))}
                    {(document.tags || []).length > 3 && (
                        <Badge variant="secondary" size="small">
                            +{document.tags.length - 3}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            key: 'updatedAt',
            label: 'Cập nhật',
            render: (document) => (
                <span className="text-sm text-foreground-light">{formatDateTime(document.updatedAt)}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (document) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                        items={[
                            {
                                label: 'Xem chi tiết',
                                icon: <Eye size={16} />,
                                onClick: () => onView(document),
                            },
                            {
                                label: 'Xóa',
                                icon: <Trash2 size={16} />,
                                variant: 'danger',
                                onClick: () => onDelete(document),
                            },
                        ]}
                    />
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={documents}
            loading={loading}
            onRowClick={onView}
            emptyMessage="Chưa có tài liệu nào"
            emptySubMessage="Tạo tài liệu đầu tiên để bắt đầu quản lý kho PDF."
        />
    );
};
