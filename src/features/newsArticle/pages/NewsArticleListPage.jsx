import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import { Button, ConfirmModal, Pagination, StatsCard, StatsGrid } from '../../../shared/components/ui';
import { useSearch } from '../../../shared/hooks';
import { formatNumber } from '../../../shared/utils';
import { NewsArticleFilters, NewsArticleTable } from '../components';
import {
    deleteNewsArticleAsync,
    getAllNewsArticlesAsync,
    selectNewsArticleFilters,
    selectNewsArticleLoadingDelete,
    selectNewsArticleLoadingGet,
    selectNewsArticlePagination,
    selectNewsArticles,
    setNewsArticleFilters,
    setNewsArticlePagination,
} from '../store/newsArticleSlice';

export const NewsArticleListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const articles = useSelector(selectNewsArticles);
    const pagination = useSelector(selectNewsArticlePagination);
    const filters = useSelector(selectNewsArticleFilters);
    const loading = useSelector(selectNewsArticleLoadingGet);
    const loadingDelete = useSelector(selectNewsArticleLoadingDelete);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const loadArticles = useCallback(() => {
        dispatch(getAllNewsArticlesAsync({
            page: pagination.page,
            limit: pagination.limit,
            search: debouncedSearch || undefined,
            type: filters.type || undefined,
            visibility: filters.visibility || undefined,
            isFeatured: filters.isFeatured === '' ? undefined : filters.isFeatured,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        }));
    }, [debouncedSearch, dispatch, filters, pagination.limit, pagination.page]);

    useEffect(() => { loadArticles(); }, [loadArticles]);
    const applyFilter = (nextFilter) => {
        dispatch(setNewsArticlePagination({ page: 1 }));
        dispatch(setNewsArticleFilters(nextFilter));
    };
    const handleSearch = (value) => {
        handleSearchChange(value);
        applyFilter({ search: value });
    };
    const handleSort = (sortBy, sortOrder) => {
        dispatch(setNewsArticlePagination({ page: 1 }));
        dispatch(setNewsArticleFilters({ sortBy, sortOrder }));
    };
    const confirmDelete = async () => {
        if (!deleteTarget) return;
        await dispatch(deleteNewsArticleAsync(deleteTarget.newsArticleId)).unwrap();
        setDeleteTarget(null);
        loadArticles();
    };
    const publishedCount = articles.filter((article) => article.visibility === 'PUBLISHED').length;
    const featuredCount = articles.filter((article) => article.isFeatured).length;

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Quản lý tin tức</h1>
                    <p className="mt-1 text-sm text-foreground-light">Soạn, xuất bản và theo dõi toàn bộ bài viết tin tức.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={loadArticles} disabled={loading}><RefreshCw size={16} />Tải lại</Button>
                    <Button onClick={() => navigate(ROUTES.NEWS_ARTICLE_CREATE)}><Plus size={16} />Tạo bài viết</Button>
                </div>
            </div>

            <StatsGrid cols={3}>
                <StatsCard label="Tổng bài viết" value={formatNumber(pagination.total)} loading={loading} />
                <StatsCard label="Đã xuất bản (trang này)" value={formatNumber(publishedCount)} variant="success" loading={loading} />
                <StatsCard label="Nổi bật (trang này)" value={formatNumber(featuredCount)} variant="primary" loading={loading} />
            </StatsGrid>

            <NewsArticleFilters filters={filters} search={search} onSearchChange={handleSearch} onFilterChange={applyFilter} />
            <div className="overflow-hidden rounded-sm border border-border bg-white">
                <NewsArticleTable articles={articles} loading={loading} filters={filters} onView={(article) => navigate(ROUTES.NEWS_ARTICLE_DETAIL(article.newsArticleId))} onEdit={(article) => navigate(ROUTES.NEWS_ARTICLE_EDIT(article.newsArticleId))} onDelete={setDeleteTarget} onSort={handleSort} />
                <div className="border-t border-border p-4"><Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.total} hasNext={pagination.hasNext} hasPrevious={pagination.hasPrevious} itemsPerPage={pagination.limit} onPageChange={(page) => dispatch(setNewsArticlePagination({ page }))} onItemsPerPageChange={(limit) => dispatch(setNewsArticlePagination({ page: 1, limit }))} /></div>
            </div>

            <ConfirmModal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} isLoading={loadingDelete} title="Xóa bài viết" message={`Bạn có chắc muốn xóa “${deleteTarget?.title || ''}”? Liên kết media sẽ được gỡ nhưng tệp gốc không bị xóa.`} confirmText="Xóa bài viết" variant="danger" />
        </div>
    );
};
