import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Edit3, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bookApi } from '../../../core/api';
import { PERMISSIONS, ROUTES } from '../../../core/constants';
import { Button, ConfirmModal, Dropdown, Pagination, SearchInput, Table } from '../../../shared/components/ui';
import { useDebounce, useHasPermission } from '../../../shared/hooks';
import { addNotification } from '../../notification/store/notificationSlice';

const visibilityOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'PRIVATE', label: 'Riêng tư' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
];

const featuredOptions = [
  { value: '', label: 'Tất cả sách' },
  { value: 'true', label: 'Nổi bật' },
  { value: 'false', label: 'Không nổi bật' },
];

const visibilityClass = { DRAFT: 'bg-gray-100 text-gray-700', PRIVATE: 'bg-violet-100 text-violet-800', PUBLISHED: 'bg-emerald-100 text-emerald-800' };
const visibilityLabel = { DRAFT: 'Nháp', PRIVATE: 'Riêng tư', PUBLISHED: 'Đã xuất bản' };
const getData = (response) => response?.data?.data ?? response?.data ?? response;
const formatMoney = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0));

const BookCategoryMultiSelect = ({ categories, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedSlugs = value || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCategories = categories.filter((category) => selectedSlugs.includes(category.slug));
  const triggerLabel = selectedCategories.length === 0
    ? 'Tất cả loại sách'
    : selectedCategories.length <= 2
      ? selectedCategories.map((category) => category.name).join(', ')
      : `Đã chọn ${selectedCategories.length} loại sách`;

  const toggleCategory = (slug) => {
    onChange(selectedSlugs.includes(slug)
      ? selectedSlugs.filter((selectedSlug) => selectedSlug !== slug)
      : [...selectedSlugs, slug]);
  };

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setIsOpen((current) => !current)} className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-left text-sm text-slate-700 transition-colors hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100">
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown size={16} className={`ml-2 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
          <button type="button" onClick={() => onChange([])} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${selectedSlugs.length === 0 ? 'bg-primary-50 font-medium text-primary-700' : 'text-slate-700'}`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded border ${selectedSlugs.length === 0 ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 bg-white'}`}>
              {selectedSlugs.length === 0 && <Check size={12} />}
            </span>
            Tất cả loại sách
          </button>
          {categories.map((category) => {
            const isSelected = selectedSlugs.includes(category.slug);
            return (
              <button key={category.id} type="button" onClick={() => toggleCategory(category.slug)} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${isSelected ? 'bg-primary-50 font-medium text-primary-700' : 'text-slate-700'}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded border ${isSelected ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 bg-white'}`}>
                  {isSelected && <Check size={12} />}
                </span>
                <span className="truncate">{category.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const BookListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filters, setFilters] = useState({ search: '', visibility: '', categorySlugs: [], isFeatured: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const debouncedSearch = useDebounce(filters.search, 400);
  const canCreate = useHasPermission(PERMISSIONS.BOOK.CREATE);
  const canUpdate = useHasPermission(PERMISSIONS.BOOK.UPDATE);
  const canDelete = useHasPermission(PERMISSIONS.BOOK.DELETE);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch.trim() || undefined,
        visibility: filters.visibility || undefined,
        categorySlugs: filters.categorySlugs.length ? filters.categorySlugs : undefined,
        isFeatured: filters.isFeatured === '' ? undefined : filters.isFeatured === 'true',
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      });
      const payload = response?.data ?? response;
      setBooks(payload?.data ?? []);
      setPagination((current) => ({ ...current, total: payload?.meta?.total ?? 0, totalPages: payload?.meta?.totalPages ?? 1 }));
    } catch (error) {
      setBooks([]);
      dispatch(addNotification({ type: 'error', title: 'Không thể tải danh sách sách', message: error?.data?.message || error?.message, autoHide: true }));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, dispatch, filters.categorySlugs, filters.isFeatured, filters.visibility, pagination.limit, pagination.page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    bookApi.getCategories().then((response) => setCategories(getData(response) || [])).catch(() => setCategories([]));
  }, []);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await bookApi.delete(deleteTarget.bookId);
      setDeleteTarget(null);
      dispatch(addNotification({ type: 'success', title: 'Đã xóa sách', message: 'Liên kết loại sách và media đã được gỡ.', autoHide: true }));
      await load();
    } catch (error) {
      dispatch(addNotification({ type: 'error', title: 'Không thể xóa sách', message: error?.data?.message || error?.message, autoHide: true }));
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(() => [
    {
      key: 'title', label: 'Sách', render: (book) => <div className="min-w-48"><p className="font-medium text-foreground">{book.title}</p><p className="text-xs text-foreground-light">{book.sku} · {book.author || 'Chưa có tác giả'}</p></div>,
    },
    { key: 'categories', label: 'Loại sách', render: (book) => <div className="flex flex-wrap gap-1">{book.categories?.map((category) => <span key={category.bookCategoryId} className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-800">{category.name}</span>) || '-'}</div> },
    { key: 'priceVnd', label: 'Giá', align: 'right', render: (book) => formatMoney(book.priceVnd) },
    { key: 'visibility', label: 'Hiển thị', align: 'center', render: (book) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${visibilityClass[book.visibility] || 'bg-gray-100 text-gray-700'}`}>{visibilityLabel[book.visibility] || book.visibility}</span> },
    { key: 'viewCount', label: 'Lượt xem', align: 'right', render: (book) => Number(book.viewCount || 0).toLocaleString('vi-VN') },
    {
      key: 'actions', label: '', align: 'right', render: (book) => <div className="flex justify-end gap-2">
        {canUpdate && <Button size="sm" variant="outline" onClick={() => navigate(ROUTES.BOOK_EDIT(book.bookId))}><Edit3 className="h-4 w-4" /> Sửa</Button>}
        {canDelete && book.visibility === 'DRAFT' && <Button size="sm" variant="danger" onClick={() => setDeleteTarget(book)}><Trash2 className="h-4 w-4" /> Xóa</Button>}
      </div>,
    },
  ], [canDelete, canUpdate, navigate]);

  return <div className="space-y-5 p-4 md:p-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div><p className="text-sm font-medium text-amber-700">QUẢN LÝ SÁCH</p><h1 className="mt-1 text-2xl font-semibold text-foreground">Danh sách sách</h1><p className="mt-1 text-sm text-foreground-light">Quản lý catalog giới thiệu sách và trạng thái xuất bản trên website.</p></div>
      <div className="flex gap-2"><Button variant="outline" onClick={load} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới</Button>{canCreate && <Button onClick={() => navigate(ROUTES.BOOK_CREATE)}><Plus className="h-4 w-4" /> Tạo sách</Button>}</div>
    </div>
    <div className="grid gap-3 rounded-xl border border-border bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
      <SearchInput value={filters.search} onChange={(value) => updateFilter('search', value)} placeholder="Tìm tên, SKU, ISBN..." />
      <Dropdown value={filters.visibility} onChange={(value) => updateFilter('visibility', value)} options={visibilityOptions} />
      <BookCategoryMultiSelect categories={categories} value={filters.categorySlugs} onChange={(value) => updateFilter('categorySlugs', value)} />
      <Dropdown value={filters.isFeatured} onChange={(value) => updateFilter('isFeatured', value)} options={featuredOptions} />
    </div>
    <div className="overflow-hidden rounded-xl border border-border bg-white"><Table columns={columns} data={books} loading={loading} emptyMessage="Chưa có sách" emptySubMessage="Tạo sách nháp đầu tiên để bắt đầu xây dựng catalog." /><Pagination currentPage={pagination.page} totalPages={Math.max(pagination.totalPages, 1)} totalItems={pagination.total} itemsPerPage={pagination.limit} disabled={loading} onPageChange={(page) => setPagination((current) => ({ ...current, page }))} onItemsPerPageChange={(limit) => setPagination((current) => ({ ...current, page: 1, limit: Number(limit) }))} /></div>
    <ConfirmModal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} isLoading={deleting} title="Xóa sách nháp" message={`Bạn có chắc muốn xóa “${deleteTarget?.title || ''}”? Chỉ sách ở trạng thái nháp mới có thể xóa.`} confirmText="Xóa sách" variant="danger" />
  </div>;
};
