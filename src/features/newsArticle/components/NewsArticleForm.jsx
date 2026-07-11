import { useState } from 'react';
import { CalendarClock, Sparkles } from 'lucide-react';
import { Button, Input, Select, Switch, Tabs, Textarea } from '../../../shared/components/ui';
import {
    NEWS_ARTICLE_TYPE_OPTIONS,
    NEWS_ARTICLE_VISIBILITY_OPTIONS,
} from '../constants/newsArticle.constants';
import { NewsArticleEditor } from './NewsArticleEditor';
import { NewsArticleThumbnailField } from './NewsArticleThumbnailField';

const FORM_TABS = [
    { key: 'content', label: 'Nội dung' },
    { key: 'publish', label: 'Xuất bản' },
    { key: 'seo', label: 'SEO' },
];

const ToggleRow = ({ title, description, checked, onChange, icon: Icon }) => (
    <div className="rounded-sm border border-border p-4">
        <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
                {Icon && <div className="rounded-sm bg-blue-50 p-2 text-blue-700"><Icon size={18} /></div>}
                <div>
                    <div className="text-sm font-medium text-foreground">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-foreground-light">{description}</div>
                </div>
            </div>
            <Switch checked={checked} onChange={onChange} />
        </div>
    </div>
);

export const NewsArticleForm = ({ formData, errors, loading, mode, onChange, onToggle, onContentChange, onOpenThumbnailPicker, onClearThumbnail, onSubmit, onCancel }) => {
    const [activeTab, setActiveTab] = useState('content');
    const submitLabel = mode === 'edit' ? 'Lưu thay đổi' : 'Tạo bài viết';

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="rounded-sm border border-border bg-white p-5">
                <Tabs tabs={FORM_TABS.map((tab) => ({ label: tab.label, isActive: activeTab === tab.key, onActivate: () => setActiveTab(tab.key) }))} />

                <div className="pt-6">
                    {activeTab === 'content' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                                <div className="space-y-4">
                                    <Input label="Tiêu đề" name="title" value={formData.title} onChange={onChange} required error={errors.title} maxLength={255} placeholder="Nhập tiêu đề rõ ràng, dễ tìm kiếm" />
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Select label="Loại bài viết" name="type" value={formData.type} onChange={onChange} options={NEWS_ARTICLE_TYPE_OPTIONS} />
                                        <Input label="Tác giả" name="authorName" value={formData.authorName} onChange={onChange} maxLength={255} placeholder="VD: BEE Education" />
                                    </div>
                                    <Textarea label="Tóm tắt" name="excerpt" value={formData.excerpt} onChange={onChange} rows={5} maxLength={500} placeholder="Mô tả ngắn giúp người đọc hiểu nhanh nội dung bài viết." />
                                </div>
                                <NewsArticleThumbnailField mediaId={formData.thumbnailMediaId} viewUrl={formData.thumbnailViewUrl} onOpen={onOpenThumbnailPicker} onClear={onClearThumbnail} error={errors.thumbnailMediaId} />
                            </div>
                            <NewsArticleEditor value={formData.contentJson} error={errors.contentJson} onChange={onContentChange} />
                        </div>
                    )}

                    {activeTab === 'publish' && (
                        <div className="mx-auto max-w-2xl space-y-6">
                            <Select label="Trạng thái hiển thị" name="visibility" value={formData.visibility} onChange={onChange} options={NEWS_ARTICLE_VISIBILITY_OPTIONS} />
                            <Input label="Thời điểm xuất bản" name="publishedAt" type="datetime-local" value={formData.publishedAt} onChange={onChange} helperText="Để trống nếu chưa muốn đặt lịch xuất bản." />
                            <ToggleRow icon={Sparkles} title="Bài viết nổi bật" description="Ưu tiên bài viết này ở khu vực nội dung nổi bật trên website." checked={formData.isFeatured} onChange={(checked) => onToggle('isFeatured', checked)} />
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Input label="Thời gian đọc (phút)" name="readingTime" type="number" min="1" value={formData.readingTime} onChange={onChange} error={errors.readingTime} placeholder="Tự tính nếu để trống" />
                                <Input label="Thứ tự hiển thị" name="sortOrder" type="number" min="0" value={formData.sortOrder} onChange={onChange} error={errors.sortOrder} placeholder="0" />
                            </div>
                            <div className="rounded-sm border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                                <div className="flex items-center gap-2 font-medium"><CalendarClock size={17} /> Mẹo xuất bản</div>
                                <p className="mt-1 text-xs leading-5 text-blue-800">Đặt trạng thái “Đã xuất bản” và chọn thời điểm xuất bản để bài viết có thể xuất hiện trên website công khai.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="mx-auto max-w-3xl space-y-6">
                            {mode === 'create' && <ToggleRow icon={Sparkles} title="Tự động hoàn thiện SEO bằng AI" description="Backend sẽ tự bổ sung các trường SEO còn thiếu và tính thời gian đọc từ nội dung." checked={formData.auto} onChange={(checked) => onToggle('auto', checked)} />}
                            {!formData.auto && (
                                <>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Input label="Từ khóa mục tiêu" name="targetKeyword" value={formData.targetKeyword} onChange={onChange} maxLength={255} />
                                        <Input label="Danh sách từ khóa" name="keywordText" value={formData.keywordText} onChange={onChange} placeholder="Từ khóa 1, từ khóa 2" />
                                        <Input label="Meta title" name="metaTitle" value={formData.metaTitle} onChange={onChange} maxLength={255} />
                                        <Input label="OG title" name="ogTitle" value={formData.ogTitle} onChange={onChange} maxLength={255} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Textarea label="Meta description" name="metaDescription" value={formData.metaDescription} onChange={onChange} rows={4} maxLength={500} />
                                        <Textarea label="OG description" name="ogDescription" value={formData.ogDescription} onChange={onChange} rows={4} maxLength={500} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Input label="Canonical URL" name="canonicalUrl" value={formData.canonicalUrl} onChange={onChange} maxLength={1000} placeholder="https://…" />
                                        <Input label="Ý định tìm kiếm" name="searchIntent" value={formData.searchIntent} onChange={onChange} maxLength={100} />
                                        <Input label="Điểm SEO" name="seoScore" type="number" min="0" max="100" value={formData.seoScore} onChange={onChange} error={errors.seoScore} />
                                    </div>
                                    <Textarea label="Structured data (JSON-LD)" name="structuredDataText" value={formData.structuredDataText} onChange={onChange} rows={8} error={errors.structuredDataText} placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "NewsArticle"\n}'} />
                                </>
                            )}
                            {formData.auto && <div className="rounded-sm border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">SEO sẽ được backend hoàn thiện tự động khi lưu bài viết. Bạn có thể tắt tùy chọn này để nhập thủ công.</div>}
                        </div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 z-20 flex justify-end gap-3 rounded-sm border border-border bg-white/95 p-4 shadow-sm backdrop-blur">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Hủy</Button>
                <Button type="submit" loading={loading} disabled={loading}>{submitLabel}</Button>
            </div>
        </form>
    );
};
