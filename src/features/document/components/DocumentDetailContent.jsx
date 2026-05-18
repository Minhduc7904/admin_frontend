import { FileText } from 'lucide-react';
import { Badge } from '../../../shared/components/ui';
import { MarkdownRenderer } from '../../../shared/components';
import { formatDateTime } from '../../../shared/utils/dateTime';
import { DOCUMENT_VISIBILITY_LABELS } from '../constants/document.constants';

export const DocumentDetailContent = ({ document }) => {
    const mediaUsages = document.mediaUsages || [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                <div>
                    {document.thumbnailUrl ? (
                        <img
                            src={document.thumbnailUrl}
                            alt={document.title}
                            className="aspect-[3/4] w-full rounded-sm border border-border object-cover"
                        />
                    ) : (
                        <div className="flex aspect-[3/4] w-full items-center justify-center rounded-sm border border-border bg-gray-50 text-foreground-light">
                            Chưa có thumbnail
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="info" size="small">
                                {DOCUMENT_VISIBILITY_LABELS[document.visibility] || document.visibility}
                            </Badge>
                            <Badge variant={document.isFeatured ? 'primary' : 'secondary'} size="small">
                                {document.isFeatured ? 'Nổi bật' : 'Không nổi bật'}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">{document.title}</h1>
                        <p className="mt-1 font-mono text-sm text-foreground-light">{document.slug}</p>
                    </div>

                    {document.shortDescription && (
                        <p className="text-sm text-foreground-light">{document.shortDescription}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 rounded-sm border border-border p-4 text-sm">
                        <div>
                            <div className="text-foreground-light">Lượt xem</div>
                            <div className="font-semibold text-foreground">{document.viewCount || 0}</div>
                        </div>
                        <div>
                            <div className="text-foreground-light">Lượt tải</div>
                            <div className="font-semibold text-foreground">{document.downloadCount || 0}</div>
                        </div>
                        <div>
                            <div className="text-foreground-light">Thời gian đọc</div>
                            <div className="font-semibold text-foreground">{document.readingTime || 0} phút</div>
                        </div>
                        <div>
                            <div className="text-foreground-light">Cập nhật</div>
                            <div className="font-semibold text-foreground">{formatDateTime(document.updatedAt)}</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {(document.tags || []).map((tag) => (
                            <Badge key={tag.tagId} variant="info" size="small">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-sm border border-border bg-white p-5">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Nội dung</h2>
                    {document.processedContent ? (
                        <MarkdownRenderer content={document.processedContent} />
                    ) : (
                        <p className="text-sm text-foreground-light">Chưa có nội dung.</p>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-sm border border-border bg-white p-5">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">Media gắn kèm</h2>
                        <div className="space-y-3">
                            {mediaUsages.length === 0 && (
                                <p className="text-sm text-foreground-light">Chưa có media gắn kèm.</p>
                            )}
                            {mediaUsages.map((usage) => (
                                <div key={usage.usageId} className="flex items-start gap-3 rounded-sm border border-border p-3">
                                    <FileText size={18} className="mt-0.5 shrink-0 text-foreground-light" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-foreground">{usage.fieldName}</div>
                                        <div className="truncate text-xs text-foreground-light">
                                            {usage.originalFilename || usage.url}
                                        </div>
                                        <div className="mt-1 text-xs text-foreground-light">{usage.mimeType}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-sm border border-border bg-white p-5">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">SEO</h2>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-foreground-light">Từ khóa mục tiêu</dt>
                                <dd className="text-foreground">{document.targetKeyword || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-foreground-light">Meta title</dt>
                                <dd className="text-foreground">{document.metaTitle || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-foreground-light">Meta description</dt>
                                <dd className="text-foreground">{document.metaDescription || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-foreground-light">SEO score</dt>
                                <dd className="text-foreground">{document.seoScore ?? '-'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};
