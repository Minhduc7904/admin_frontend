import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw } from 'lucide-react';
import { PERMISSIONS } from '../../../core/constants';
import { useHasPermission } from '../../../shared/hooks';
import { Button, Dropdown, Pagination, RightPanel, SearchInput } from '../../../shared/components/ui';
import { BackgroundJobDetailPanel, BackgroundJobTable } from '../components';
import { clearBackgroundJobDetail, getBackgroundJobByIdAsync, getBackgroundJobsAsync, selectBackgroundJobDetail, selectBackgroundJobLoadingDetail, selectBackgroundJobLoadingList, selectBackgroundJobPagination, selectBackgroundJobs, selectBackgroundJobUpdatingId, updateBackgroundJobAsync } from '../store/backgroundJobSlice';

const ENABLED_OPTIONS = [{ value: '', label: 'Tất cả trạng thái' }, { value: 'true', label: 'Đang bật' }, { value: 'false', label: 'Đã tắt' }];

export const BackgroundJobListPage = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectBackgroundJobs); const pagination = useSelector(selectBackgroundJobPagination); const detail = useSelector(selectBackgroundJobDetail);
  const loading = useSelector(selectBackgroundJobLoadingList); const loadingDetail = useSelector(selectBackgroundJobLoadingDetail); const updatingId = useSelector(selectBackgroundJobUpdatingId);
  const canUpdate = useHasPermission(PERMISSIONS.BACKGROUND_JOB.UPDATE); const canViewDetail = useHasPermission(PERMISSIONS.BACKGROUND_JOB.GET_BY_ID);
  const [filters, setFilters] = useState({ search: '', isEnabled: '', sortBy: 'backgroundJobId', sortOrder: 'asc' }); const [page, setPage] = useState(1); const [limit, setLimit] = useState(10); const [detailOpen, setDetailOpen] = useState(false);
  const params = useMemo(() => ({ page, limit, search: filters.search.trim() || undefined, isEnabled: filters.isEnabled || undefined, sortBy: filters.sortBy, sortOrder: filters.sortOrder }), [filters, limit, page]);
  const load = useCallback(() => dispatch(getBackgroundJobsAsync(params)), [dispatch, params]);
  useEffect(() => { load(); }, [load]);
  const updateFilters = (next) => { setPage(1); setFilters((current) => ({ ...current, ...next })); };
  const toggleJob = async (job, isEnabled) => { try { await dispatch(updateBackgroundJobAsync({ id: job.backgroundJobId, data: { isEnabled } })).unwrap(); } catch { /* notification is handled by the thunk */ } };
  const viewDetail = (job) => { if (!canViewDetail) return; setDetailOpen(true); dispatch(getBackgroundJobByIdAsync(job.backgroundJobId)); };
  return <div className="space-y-6 p-4 md:p-6"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-medium text-blue-600">VẬN HÀNH HỆ THỐNG</p><h1 className="mt-1 text-2xl font-semibold text-foreground">Quản lý job nền</h1><p className="mt-1 text-sm text-foreground-light">Bật hoặc tắt lịch chạy của các tác vụ nền. Cấu hình cron là cố định theo hệ thống.</p></div><Button variant="outline" onClick={load} loading={loading}><RefreshCw className="h-4 w-4" />Làm mới</Button></div><div className="rounded-xl border border-border bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-end"><div className="flex-1"><SearchInput value={filters.search} onChange={(search) => updateFilters({ search })} placeholder="Tìm theo tên hoặc mã job..." /></div><Dropdown label="Trạng thái" value={filters.isEnabled} onChange={(isEnabled) => updateFilters({ isEnabled })} options={ENABLED_OPTIONS} /></div><BackgroundJobTable jobs={jobs} loading={loading} canUpdate={canUpdate} canViewDetail={canViewDetail} updatingId={updatingId} onToggle={toggleJob} onView={viewDetail} sortBy={filters.sortBy} sortOrder={filters.sortOrder} onSort={(sortBy, sortOrder) => updateFilters({ sortBy, sortOrder })} /><div className="border-t border-border p-4"><Pagination currentPage={pagination.page || page} totalPages={Math.max(pagination.totalPages || 1, 1)} totalItems={pagination.total || 0} itemsPerPage={limit} onPageChange={setPage} onItemsPerPageChange={(value) => { setLimit(Number(value)); setPage(1); }} disabled={loading} /></div></div>{canViewDetail && <RightPanel isOpen={detailOpen} onClose={() => { setDetailOpen(false); dispatch(clearBackgroundJobDetail()); }} title="Chi tiết job nền"><BackgroundJobDetailPanel job={detail} loading={loadingDetail} /></RightPanel>}</div>;
};
