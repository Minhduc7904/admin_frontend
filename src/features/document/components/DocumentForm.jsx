import { useState } from 'react';
import { Button, Input, Select, Switch, Tabs, Textarea } from '../../../shared/components/ui';
import { MarkdownEditorWithLabel } from '../../../shared/components/markdown/MarkdownEditorWithLabel';
import { DOCUMENT_VISIBILITY_OPTIONS } from '../constants/document.constants';
import { DocumentMediaField } from './DocumentMediaField';
import { DocumentPublishTagFields } from './DocumentPublishTagFields';

const FORM_TABS = [
    { key: 'basic', label: 'Cơ bản' },
    { key: 'content', label: 'Nội dung' },
    { key: 'seo', label: 'SEO' },
    { key: 'publish', label: 'Xuất bản' },
];

const ToggleRow = ({ title, description, checked, onChange }) => (
    <div className="rounded-sm border border-border p-3">
        <div className="flex items-center justify-between gap-3">
            <div>
                <div className="text-sm font-medium text-foreground">{title}</div>
                <div className="text-xs text-foreground-light">{description}</div>
            </div>
            <Switch checked={checked} onChange={onChange} />
        </div>
    </div>
);

export const DocumentForm = ({
    formData,
    errors,
    loading,
    onChange,
    onMarkdownChange,
    onSwitchChange,
    onModeSwitchChange,
    onTagChange,
    onSubmit,
    onCancel,
    onOpenMediaPicker,
    onClearMedia,
    submitLabel = 'Tạo tài liệu',
}) => {
    const [activeTab, setActiveTab] = useState('basic');

    return (
        <form onSubmit={onSubmit} className="flex h-full flex-col">
            <Tabs
                tabs={FORM_TABS.map((tab) => ({
                    label: tab.label,
                    isActive: activeTab === tab.key,
                    onActivate: () => setActiveTab(tab.key),
                }))}
            />

            <div className="flex-1 space-y-6 py-5">
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        <Input
                            label="Tiêu đề"
                            name="title"
                            value={formData.title}
                            onChange={onChange}
                            required
                            error={errors.title}
                            placeholder="VD: Tài liệu tích phân lớp 12"
                        />

                        <Textarea
                            label="Mô tả ngắn"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={onChange}
                            error={errors.shortDescription}
                            rows={3}
                        />

                        <DocumentMediaField
                            label="File PDF"
                            value={formData.mediaId}
                            type="document"
                            required
                            helperText="Bắt buộc, phải là media PDF."
                            error={errors.mediaId}
                            onOpen={() => onOpenMediaPicker('mediaId', 'DOCUMENT')}
                            onClear={() => onClearMedia('mediaId')}
                        />

                        <ToggleRow
                            title="Tự động tạo thumbnail"
                            description="Backend tự lấy trang đầu PDF để tạo thumbnail."
                            checked={formData.autoThumbnail}
                            onChange={(checked) => onModeSwitchChange('autoThumbnail', checked)}
                        />

                        {!formData.autoThumbnail && (
                            <DocumentMediaField
                                label="Thumbnail"
                                value={formData.thumbnailMediaId}
                                type="image"
                                helperText="Chọn thumbnail thủ công."
                                error={errors.thumbnailMediaId}
                                onOpen={() => onOpenMediaPicker('thumbnailMediaId', 'IMAGE')}
                                onClear={() => onClearMedia('thumbnailMediaId')}
                            />
                        )}

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input label="Nguồn" name="sourceName" value={formData.sourceName} onChange={onChange} />
                            <Input label="URL nguồn" name="sourceUrl" value={formData.sourceUrl} onChange={onChange} />
                        </div>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-6">
                        <ToggleRow
                            title="Tự động tạo nội dung"
                            description="Backend OCR nội dung từ khoảng trang PDF đã chọn."
                            checked={formData.autoContent}
                            onChange={(checked) => onModeSwitchChange('autoContent', checked)}
                        />

                        {formData.autoContent ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    label="Trang bắt đầu OCR"
                                    name="contentStartPage"
                                    type="number"
                                    min="1"
                                    value={formData.contentStartPage}
                                    onChange={onChange}
                                    error={errors.contentStartPage}
                                />
                                <Input
                                    label="Trang kết thúc OCR"
                                    name="contentEndPage"
                                    type="number"
                                    min="1"
                                    value={formData.contentEndPage}
                                    onChange={onChange}
                                    error={errors.contentEndPage}
                                />
                            </div>
                        ) : (
                            <MarkdownEditorWithLabel
                                label="Nội dung"
                                value={formData.content}
                                onChange={onMarkdownChange}
                                error={errors.content}
                                height="460px"
                                editable
                                required
                            />
                        )}
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="space-y-6">
                        <ToggleRow
                            title="Tự động tạo SEO"
                            description="Backend tự sinh SEO tiếng Việt từ tiêu đề và nội dung."
                            checked={formData.autoSeo}
                            onChange={(checked) => onModeSwitchChange('autoSeo', checked)}
                        />

                        {!formData.autoSeo && (
                            <>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Input
                                        label="Từ khóa mục tiêu"
                                        name="targetKeyword"
                                        value={formData.targetKeyword}
                                        onChange={onChange}
                                        error={errors.targetKeyword}
                                    />
                                    <Input
                                        label="Keyword text"
                                        name="keywordText"
                                        value={formData.keywordText}
                                        onChange={onChange}
                                        error={errors.keywordText}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Input
                                        label="Meta title"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={onChange}
                                        error={errors.metaTitle}
                                    />
                                    <Input
                                        label="OG title"
                                        name="ogTitle"
                                        value={formData.ogTitle}
                                        onChange={onChange}
                                        error={errors.ogTitle}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Textarea
                                        label="Meta description"
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={onChange}
                                        rows={3}
                                        error={errors.metaDescription}
                                    />
                                    <Textarea
                                        label="OG description"
                                        name="ogDescription"
                                        value={formData.ogDescription}
                                        onChange={onChange}
                                        rows={3}
                                        error={errors.ogDescription}
                                    />
                                </div>

                                <Input
                                    label="Search intent"
                                    name="searchIntent"
                                    value={formData.searchIntent}
                                    onChange={onChange}
                                    error={errors.searchIntent}
                                />
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'publish' && (
                    <div className="space-y-6">
                        <Select
                            label="Trạng thái"
                            name="visibility"
                            value={formData.visibility}
                            onChange={onChange}
                            options={DOCUMENT_VISIBILITY_OPTIONS}
                        />

                        <ToggleRow
                            title="Tài liệu nổi bật"
                            description="Ưu tiên hiển thị ở các vị trí nổi bật."
                            checked={formData.isFeatured}
                            onChange={onSwitchChange}
                        />

                        <Input
                            label="Thời gian đọc (phút)"
                            name="readingTime"
                            type="number"
                            min="0"
                            value={formData.readingTime}
                            onChange={onChange}
                            error={errors.readingTime}
                        />

                        <DocumentPublishTagFields
                            value={formData.tags}
                            onChange={onTagChange}
                            errors={errors}
                            disabled={loading}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Hủy
                </Button>
                <Button type="submit" loading={loading} disabled={loading}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};
