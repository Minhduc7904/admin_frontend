import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw } from 'lucide-react';
import { PERMISSIONS } from '../../../core/constants';
import { useHasPermission } from '../../../shared/hooks';
import { Button, Pagination, SearchInput } from '../../../shared/components/ui';
import { SepayTransactionSyncCursorPanel, SepayTransactionSyncCursorTable } from '../components';
import {
  getSepayTransactionSyncCursorsAsync,
  selectSepayTransactionSyncCursorLoadingList,
  selectSepayTransactionSyncCursorPagination,
  selectSepayTransactionSyncCursorUpdatingScope,
  selectSepayTransactionSyncCursors,
  updateSepayTransactionSyncCursorAsync,
} from '../store/sepayTransactionSyncCursorSlice';

export const SepayTransactionSyncCursorPage = () => {
  const dispatch = useDispatch();
  const cursors = useSelector(selectSepayTransactionSyncCursors);
  const pagination = useSelector(selectSepayTransactionSyncCursorPagination);
  const loading = useSelector(selectSepayTransactionSyncCursorLoadingList);
  const updatingScope = useSelector(selectSepayTransactionSyncCursorUpdatingScope);
  const canUpdate = useHasPermission(PERMISSIONS.BACKGROUND_JOB.UPDATE);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ sortBy: 'scope', sortOrder: 'asc' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState(null);

  const params = useMemo(() => ({ page, limit, search: search.trim() || undefined, ...sort }), [limit, page, search, sort]);
  const load = useCallback(() => dispatch(getSepayTransactionSyncCursorsAsync(params)), [dispatch, params]);
  useEffect(() => { load(); }, [load]);

  const save = async (scope, data) => {
    try {
      await dispatch(updateSepayTransactionSyncCursorAsync({ scope, data })).unwrap();
      setSelected(null);
    } catch {
      // The thunk displays the server error, including a conflict with an active worker lock.
    }
  };

  return <div className="space-y-6 p-4 md:p-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div><p className="text-sm font-medium text-blue-600">VẬN HÀNH HỆ THỐNG</p><h1 className="mt-1 text-2xl font-semibold text-foreground">Cấu hình đồng bộ SePay nền</h1><p className="mt-1 text-sm text-foreground-light">Quản lý checkpoint đồng bộ; không làm thay đổi giao dịch, đối soát hay học phí.</p></div>
      <Button variant="outline" onClick={load} loading={loading}><RefreshCw className="h-4 w-4" />Làm mới</Button>
    </div>
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border p-4"><SearchInput value={search} onChange={(value) => { setPage(1); setSearch(value); }} placeholder="Tìm phạm vi đồng bộ..." /></div>
      <SepayTransactionSyncCursorTable cursors={cursors} loading={loading} canUpdate={canUpdate} updatingScope={updatingScope} onEdit={setSelected} sortBy={sort.sortBy} sortOrder={sort.sortOrder} onSort={(sortBy, sortOrder) => { setPage(1); setSort({ sortBy, sortOrder }); }} />
      <div className="border-t border-border p-4"><Pagination currentPage={pagination.page || page} totalPages={Math.max(pagination.totalPages || 1, 1)} totalItems={pagination.total || 0} itemsPerPage={limit} onPageChange={setPage} onItemsPerPageChange={(value) => { setLimit(Number(value)); setPage(1); }} disabled={loading} /></div>
    </div>
    {canUpdate && <SepayTransactionSyncCursorPanel key={selected?.scope || 'empty'} cursor={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} onSave={save} loading={Boolean(updatingScope)} />}
  </div>;
};
