import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import { InlineLoading } from '../../../shared/components';
import { Button } from '../../../shared/components/ui';
import { NewsArticleDetailContent } from '../components';
import { clearCurrentNewsArticle, getNewsArticleByIdAsync, selectCurrentNewsArticle, selectNewsArticleLoadingGet } from '../store/newsArticleSlice';

export const NewsArticleDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const article = useSelector(selectCurrentNewsArticle);
    const loading = useSelector(selectNewsArticleLoadingGet);
    useEffect(() => {
        dispatch(getNewsArticleByIdAsync(id));
        return () => dispatch(clearCurrentNewsArticle());
    }, [dispatch, id]);
    if (loading && !article) return <InlineLoading message="Đang tải bài viết…" />;
    if (!article) return <div className="text-sm text-foreground-light">Không tìm thấy bài viết.</div>;
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(ROUTES.NEWS_ARTICLES)}><ArrowLeft size={16} />Quay lại danh sách</Button>
                <Button type="button" onClick={() => navigate(ROUTES.NEWS_ARTICLE_EDIT(article.newsArticleId))}><Edit2 size={16} />Chỉnh sửa</Button>
            </div>
            <NewsArticleDetailContent article={article} />
        </div>
    );
};
