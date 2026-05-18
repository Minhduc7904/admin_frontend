import { Badge } from '../../../shared/components/ui';
import { MarkdownRenderer } from '../../../shared/components';
import { DOCUMENT_VISIBILITY_LABELS } from '../constants/document.constants';

const getMissingFields = (formData) => {
    const missing = [];
    const tagsByType = formData.tags.reduce((acc, tag) => {
        acc[tag.type] = [...(acc[tag.type] || []), tag];
        return acc;
    }, {});

    if (!formData.title.trim()) missing.push('Tiêu đề');
    if (!formData.mediaId) missing.push('File PDF');

    if (formData.autoContent) {
        if (!formData.contentStartPage) missing.push('Trang bắt đầu OCR');
        if (!formData.contentEndPage) missing.push('Trang kết thúc OCR');
    } else if (!formData.content.trim()) {
        missing.push('Nội dung');
    }

    if (!formData.autoSeo) {
        [
            ['targetKeyword', 'Từ khóa mục tiêu'],
            ['keywordText', 'Keyword text'],
            ['metaTitle', 'Meta title'],
            ['metaDescription', 'Meta description'],
            ['ogTitle', 'OG title'],
            ['ogDescription', 'OG description'],
            ['searchIntent', 'Search intent'],
        ].forEach(([field, label]) => {
            if (!formData[field].trim()) missing.push(label);
        });
    }
    if ((tagsByType.LEVEL || []).length !== 1) missing.push('Cấp học');
    if ((tagsByType.SUBJECT || []).length !== 1) missing.push('Môn học');
    if ((tagsByType.DOCUMENT_TYPE || []).length < 1) missing.push('Loại tài liệu');

    return missing;
};

export const DocumentCreatePreview = ({ formData }) => {
    const missingFields = getMissingFields(formData);
    const tagsText =
        formData.tags.length > 0
            ? formData.tags.map((tag) => tag.name).join(' · ')
            : 'Chưa chọn tag';

    return (
        <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[1.6rem] border border-border bg-white p-5">
            <div className="space-y-6">
                <section className="space-y-6">
                    <div className="space-y-3">
                        <div className="text-sm font-semibold text-blue-700">Preview giao diện tài liệu</div>
                        <h2 className="text-2xl font-bold text-blue-900">
                            {formData.title || 'Tiêu đề tài liệu'}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span>Ngày tạo sau khi lưu</span>
                            <span className="text-slate-300">•</span>
                            <span>{tagsText}</span>
                        </div>
                    </div>

                    <div className="space-y-4 text-base leading-7 text-slate-700">
                        <p>
                            {formData.shortDescription ||
                                'Mô tả ngắn sẽ hiển thị ở đây sau khi bạn nhập trong tab Cơ bản.'}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="flex h-[220px] w-[160px] flex-shrink-0 items-center justify-center rounded-md border border-black bg-white text-center text-sm text-slate-500">
                                    {!formData.autoThumbnail && formData.thumbnailMediaId ? (
                                        <span>Thumbnail media #{formData.thumbnailMediaId}</span>
                                    ) : (
                                        <span>Thumbnail tự động từ PDF</span>
                                    )}
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-900">Tóm tắt tài liệu</h3>
                                        <p className="mt-2 text-base leading-7 text-slate-700">
                                            {formData.shortDescription ||
                                                'Tóm tắt sẽ lấy từ mô tả ngắn hoặc nội dung backend sinh ra.'}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-600">Tài liệu bao gồm</h4>
                                        <ul className="mt-2 flex flex-wrap gap-2">
                                            {formData.tags.length === 0 && (
                                                <li className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                                                    Chưa chọn tag
                                                </li>
                                            )}
                                            {formData.tags.map((tag) => (
                                                <li
                                                    key={tag.tagId}
                                                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                                                >
                                                    {tag.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            disabled
                                            className="inline-flex w-fit items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white opacity-80"
                                        >
                                            Tải xuống tài liệu
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                                <div>
                                    <div className="text-slate-500">Trạng thái</div>
                                    <div className="font-semibold text-slate-800">
                                        {DOCUMENT_VISIBILITY_LABELS[formData.visibility] || formData.visibility}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500">File PDF</div>
                                    <div className="font-semibold text-slate-800">
                                        {formData.mediaId ? `#${formData.mediaId}` : 'Chưa chọn'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500">Thumbnail</div>
                                    <div className="font-semibold text-slate-800">
                                        {formData.autoThumbnail
                                            ? 'Tự động'
                                            : formData.thumbnailMediaId
                                                ? `#${formData.thumbnailMediaId}`
                                                : 'Chưa chọn'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500">Thời gian đọc</div>
                                    <div className="font-semibold text-slate-800">
                                        {formData.readingTime || 0} phút
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500">Hiển thị nổi bật</div>
                                    <div className="font-semibold text-slate-800">
                                        {formData.isFeatured ? 'Có' : 'Không'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-blue-900">Preview PDF</h3>
                        <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500">
                            {formData.mediaId
                                ? `PDF media #${formData.mediaId} sẽ hiển thị tại đây sau khi tài liệu được tạo.`
                                : 'Chọn file PDF để hoàn thiện phần này.'}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-blue-900">Nội dung tài liệu</h3>
                        {formData.autoContent ? (
                            <p className="text-base leading-7 text-slate-700">
                                Nội dung sẽ được backend tự OCR từ trang {formData.contentStartPage || '?'} đến trang{' '}
                                {formData.contentEndPage || '?'}.
                            </p>
                        ) : formData.content ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <MarkdownRenderer content={formData.content} />
                            </div>
                        ) : (
                            <p className="text-base leading-7 text-slate-500">Chưa có nội dung thủ công.</p>
                        )}
                    </div>
                </section>

                <aside className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant={formData.autoContent ? 'info' : 'secondary'} size="small">
                            {formData.autoContent ? 'Content tự động' : 'Content thủ công'}
                        </Badge>
                        <Badge variant={formData.autoSeo ? 'info' : 'secondary'} size="small">
                            {formData.autoSeo ? 'SEO tự động' : 'SEO thủ công'}
                        </Badge>
                        <Badge variant={formData.autoThumbnail ? 'info' : 'secondary'} size="small">
                            {formData.autoThumbnail ? 'Thumbnail tự động' : 'Thumbnail thủ công'}
                        </Badge>
                        <Badge variant={missingFields.length === 0 ? 'success' : 'warning'} size="small">
                            {missingFields.length === 0 ? 'Đủ dữ liệu để tạo' : `Còn thiếu ${missingFields.length} trường`}
                        </Badge>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-700">Thông tin người nhập cần biết</h3>
                        <ul className="mt-2 space-y-2 text-sm text-slate-600">
                            <li>
                                {formData.autoSeo
                                    ? 'SEO sẽ được backend tự sinh từ tiêu đề và nội dung.'
                                    : 'SEO thủ công đang bật, cần điền đầy đủ toàn bộ trường SEO.'}
                            </li>
                            <li>
                                {formData.autoThumbnail
                                    ? 'Thumbnail sẽ được backend tự tạo từ trang đầu PDF.'
                                    : 'Thumbnail thủ công đang bật, cần chọn media ảnh trước khi tạo.'}
                            </li>
                            <li>
                                {formData.autoContent
                                    ? 'Content tự động đang bật, backend cần khoảng trang OCR.'
                                    : 'Content thủ công đang bật, backend sẽ dùng markdown bạn nhập.'}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-700">Trường còn thiếu</h3>
                        {missingFields.length === 0 ? (
                            <p className="mt-2 text-sm text-slate-600">Không còn trường bắt buộc nào bị thiếu.</p>
                        ) : (
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {missingFields.map((field) => (
                                    <li
                                        key={field}
                                        className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                                    >
                                        {field}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};
