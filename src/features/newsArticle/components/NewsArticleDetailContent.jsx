import { Clock3, Eye, Star } from 'lucide-react';
import { Badge } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils/dateTime';
import { NEWS_ARTICLE_TYPE_LABELS, NEWS_ARTICLE_VISIBILITY_LABELS } from '../constants/newsArticle.constants';

const detailValue = (value) => value || '—';

export const NewsArticleDetailContent = ({ article }) => (
    <div className="space-y-6">
        <section className="overflow-hidden rounded-sm border border-border bg-white">
            {article.thumbnailViewUrl && <img src={article.thumbnailViewUrl} alt={article.title} className="max-h-[420px] w-full object-cover" />}
            <div className="p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge variant="info" size="small">{NEWS_ARTICLE_TYPE_LABELS[article.type] || article.type}</Badge>
                    <Badge variant={article.visibility === 'PUBLISHED' ? 'success' : article.visibility === 'PRIVATE' ? 'warning' : 'secondary'} size="small">{NEWS_ARTICLE_VISIBILITY_LABELS[article.visibility] || article.visibility}</Badge>
                    {article.isFeatured && <Badge variant="primary" size="small"><Star size={13} className="mr-1 fill-current" />Nổi bật</Badge>}
                </div>
                <h1 className="text-3xl font-bold leading-tight text-foreground">{article.title}</h1>
                <p className="mt-2 font-mono text-sm text-foreground-light">{article.slug}</p>
                {article.excerpt && <p className="mt-5 max-w-3xl text-base leading-7 text-foreground-light">{article.excerpt}</p>}
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground-light">
                    <span>{article.authorName || 'Chưa có tác giả'}</span>
                    <span className="flex items-center gap-1"><Clock3 size={15} />{article.readingTime || '—'} phút đọc</span>
                    <span className="flex items-center gap-1"><Eye size={15} />{article.viewCount || 0} lượt xem</span>
                </div>
            </div>
        </section>

        <section className="rounded-sm border border-border bg-white p-6">
            <div className="mb-5 text-lg font-semibold text-foreground">Nội dung</div>
            {article.contentHtml ? (
                <div
                    className="max-w-none break-words text-[15px] leading-8 text-foreground [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:pl-4 [&_blockquote]:text-foreground-light [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-bold [&_img]:my-5 [&_img]:max-h-[560px] [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-sm [&_li]:ml-5 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:mb-4 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:text-white [&_ul]:my-4 [&_ul]:list-disc [&_video]:my-5 [&_video]:max-w-full [&_video]:rounded-sm"
                    dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
            ) : <div className="text-sm text-foreground-light">Bài viết chưa có nội dung.</div>}
        </section>

        <section className="grid grid-cols-1 gap-4 rounded-sm border border-border bg-white p-5 md:grid-cols-2">
            <div><div className="text-xs font-medium uppercase tracking-wide text-foreground-light">Xuất bản</div><div className="mt-1 text-sm text-foreground">{article.publishedAt ? formatDateTime(article.publishedAt) : 'Chưa đặt lịch'}</div></div>
            <div><div className="text-xs font-medium uppercase tracking-wide text-foreground-light">Cập nhật</div><div className="mt-1 text-sm text-foreground">{formatDateTime(article.updatedAt)}</div></div>
            <div><div className="text-xs font-medium uppercase tracking-wide text-foreground-light">Từ khóa mục tiêu</div><div className="mt-1 text-sm text-foreground">{detailValue(article.targetKeyword)}</div></div>
            <div><div className="text-xs font-medium uppercase tracking-wide text-foreground-light">Canonical URL</div><div className="mt-1 break-all text-sm text-foreground">{detailValue(article.canonicalUrl)}</div></div>
        </section>
    </div>
);
