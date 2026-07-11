import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { Spinner } from '../../../shared/components/loading';
import { MediaPickerModal } from '../../media/components/mediaPicker/MediaPickerModal';
import { NewsArticleForm } from '../components';
import { useNewsArticleForm } from '../hooks/useNewsArticleForm';

export const CreateNewsArticlePage = () => {
    const navigate = useNavigate();
    const form = useNewsArticleForm();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Tạo bài viết tin tức</h1>
                <p className="mt-1 text-sm text-foreground-light">Soạn thảo nội dung với TipTap, chèn ảnh/video trực tiếp từ thư viện media và chuẩn bị SEO trước khi xuất bản.</p>
            </div>
            <NewsArticleForm mode="create" formData={form.formData} errors={form.errors} loading={form.loading} onChange={form.handleChange} onToggle={form.handleToggle} onContentChange={form.handleContentChange} onOpenThumbnailPicker={form.openThumbnailPicker} onClearThumbnail={form.clearThumbnail} onSubmit={form.submit} onCancel={() => navigate(ROUTES.NEWS_ARTICLES)} />
            <MediaPickerModal isOpen={form.isThumbnailPickerOpen} onClose={form.closeThumbnailPicker} onSave={form.saveThumbnail} selectedMediaId={form.formData.thumbnailMediaId || null} title="Chọn ảnh đại diện bài viết" type="IMAGE" />
            {form.loading && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 backdrop-blur-sm"><div className="rounded-sm bg-white px-6 py-5 text-center shadow-lg"><Spinner size="lg" className="mx-auto mb-3 text-blue-700" /><p className="text-sm font-medium text-foreground">Đang tạo bài viết…</p></div></div>}
        </div>
    );
};
