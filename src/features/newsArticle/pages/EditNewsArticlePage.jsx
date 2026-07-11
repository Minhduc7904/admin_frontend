import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { InlineLoading } from '../../../shared/components';
import { Spinner } from '../../../shared/components/loading';
import { MediaPickerModal } from '../../media/components/mediaPicker/MediaPickerModal';
import { NewsArticleForm } from '../components';
import { useNewsArticleForm } from '../hooks/useNewsArticleForm';
import { clearCurrentNewsArticle, getNewsArticleByIdAsync, selectCurrentNewsArticle, selectNewsArticleLoadingGet } from '../store/newsArticleSlice';

export const EditNewsArticlePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const article = useSelector(selectCurrentNewsArticle);
    const loading = useSelector(selectNewsArticleLoadingGet);
    useEffect(() => {
        dispatch(getNewsArticleByIdAsync(id));
        return () => dispatch(clearCurrentNewsArticle());
    }, [dispatch, id]);
    if (loading && !article) return <InlineLoading message="Đang tải bài viết…" />;
    if (!article) return <div className="text-sm text-foreground-light">Không tìm thấy bài viết.</div>;
    return <EditNewsArticleContent article={article} />;
};

const EditNewsArticleContent = ({ article }) => {
    const navigate = useNavigate();
    const form = useNewsArticleForm({ mode: 'edit', article });
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Chỉnh sửa bài viết</h1>
                <p className="mt-1 text-sm text-foreground-light">URL presigned chỉ dùng để xem trước; khi lưu, nội dung vẫn giữ đúng Media ID.</p>
            </div>
            <NewsArticleForm mode="edit" formData={form.formData} errors={form.errors} loading={form.loading} onChange={form.handleChange} onToggle={form.handleToggle} onContentChange={form.handleContentChange} onOpenThumbnailPicker={form.openThumbnailPicker} onClearThumbnail={form.clearThumbnail} onSubmit={form.submit} onCancel={() => navigate(ROUTES.NEWS_ARTICLE_DETAIL(article.newsArticleId))} />
            <MediaPickerModal isOpen={form.isThumbnailPickerOpen} onClose={form.closeThumbnailPicker} onSave={form.saveThumbnail} selectedMediaId={form.formData.thumbnailMediaId || null} title="Chọn ảnh đại diện bài viết" type="IMAGE" />
            {form.loading && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 backdrop-blur-sm"><div className="rounded-sm bg-white px-6 py-5 text-center shadow-lg"><Spinner size="lg" className="mx-auto mb-3 text-blue-700" /><p className="text-sm font-medium text-foreground">Đang lưu bài viết…</p></div></div>}
        </div>
    );
};
