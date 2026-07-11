import { Edit2, Eye, Star, Trash2 } from 'lucide-react';
import { ActionMenu, Badge, Table } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils/dateTime';
import {
    NEWS_ARTICLE_TYPE_LABELS,
    NEWS_ARTICLE_VISIBILITY_LABELS,
} from '../constants/newsArticle.constants';

const getVisibilityVariant = (visibility) => {
    if (visibility === 'PUBLISHED') return 'success';
    if (visibility === 'PRIVATE') return 'warning';
    return 'secondary';
};

export const NewsArticleTable = ({ articles, loading, filters, onView, onEdit, onDelete, onSort }) => {
    const sort = (field) => ({
        onSort: (sortOrder) => onSort(field, sortOrder),
        sortDirection: filters.sortBy === field ? filters.sortOrder : undefined,
    });
    const columns = [
        {
            key: 'article',
            label: 'Bài viết',
            ...sort('title'),
            render: (article) => (
                <div className="flex min-w-[260px] items-center gap-3">
                    {article.thumbnailViewUrl ? (
                        <img src={article.thumbnailViewUrl} alt="" className="h-12 w-16 rounded-sm border border-border object-cover" />
                    ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-sm border border-dashed border-border bg-gray-50 text-[10px] text-foreground-light">No image</div>
                    )}
                    <div className="min-w-0">
                        <div className="line-clamp-2 text-sm font-semibold text-foreground">{article.title}</div>
                        <div className="mt-1 truncate font-mono text-xs text-foreground-light">{article.slug}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Loại',
            ...sort('type'),
            render: (article) => <Badge variant="info" size="small">{NEWS_ARTICLE_TYPE_LABELS[article.type] || article.type}</Badge>,
        },
        {
            key: 'visibility',
            label: 'Trạng thái',
            ...sort('visibility'),
            render: (article) => <Badge variant={getVisibilityVariant(article.visibility)} size="small">{NEWS_ARTICLE_VISIBILITY_LABELS[article.visibility] || article.visibility}</Badge>,
        },
        {
            key: 'publishedAt',
            label: 'Xuất bản',
            ...sort('publishedAt'),
            render: (article) => <span className="whitespace-nowrap text-sm text-foreground-light">{article.publishedAt ? formatDateTime(article.publishedAt) : 'Chưa đặt lịch'}</span>,
        },
        {
            key: 'stats',
            label: 'Chỉ số',
            ...sort('viewCount'),
            render: (article) => (
                <div className="text-sm text-foreground-light">
                    <div>{article.viewCount || 0} lượt xem</div>
                    <div>{article.readingTime || '-'} phút đọc</div>
                </div>
            ),
        },
        {
            key: 'featured',
            label: 'Nổi bật',
            align: 'center',
            ...sort('isFeatured'),
            render: (article) => article.isFeatured ? <Star size={17} className="mx-auto fill-amber-400 text-amber-400" /> : <span className="text-foreground-light">-</span>,
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (article) => (
                <div onClick={(event) => event.stopPropagation()}>
                    <ActionMenu items={[
                        { label: 'Xem chi tiết', icon: <Eye size={16} />, onClick: () => onView(article) },
                        { label: 'Chỉnh sửa', icon: <Edit2 size={16} />, onClick: () => onEdit(article) },
                        { label: 'Xóa', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => onDelete(article) },
                    ]} />
                </div>
            ),
        },
    ];

    return <Table columns={columns} data={articles} loading={loading} onRowClick={onView} emptyMessage="Chưa có bài viết tin tức" emptySubMessage="Tạo bài viết đầu tiên để bắt đầu xây dựng kho nội dung." />;
};
