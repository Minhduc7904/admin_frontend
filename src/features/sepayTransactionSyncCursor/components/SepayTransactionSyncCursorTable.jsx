import { Pencil } from 'lucide-react';
import { Button, Table } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils';

export const SepayTransactionSyncCursorTable = ({ cursors, loading, canUpdate, updatingScope, onEdit, sortBy, sortOrder, onSort }) => {
  const sortable = (key, label, options = {}) => ({ key, label, ...options, sortDirection: sortBy === key ? sortOrder : undefined, onSort: (order) => onSort(key, order) });
  const columns = [sortable('scope', 'Phạm vi đồng bộ', { render: (cursor) => <div><p className="font-semibold text-foreground">{cursor.scope}</p><p className="text-xs text-foreground-light">#{cursor.sepayTransactionSyncCursorId}</p></div> }), { key: 'lastSinceId', label: 'Checkpoint gần nhất', render: (cursor) => <span className="block max-w-[180px] truncate text-sm" title={cursor.lastSinceId}>{cursor.lastSinceId || 'Chưa có'}</span> }, sortable('lastSyncedAt', 'Đồng bộ gần nhất', { render: (cursor) => formatDateTime(cursor.lastSyncedAt) }), sortable('lastErrorAt', 'Lỗi gần nhất', { render: (cursor) => cursor.lastErrorAt ? <div><p>{formatDateTime(cursor.lastErrorAt)}</p><p className="mt-0.5 max-w-[180px] truncate text-xs text-red-600" title={cursor.lastErrorMessage}>{cursor.lastErrorMessage || 'Không có nội dung'}</p></div> : 'Không có' }), { key: 'actions', label: '', align: 'right', render: (cursor) => canUpdate && <Button variant="ghost" size="sm" loading={updatingScope === cursor.scope} onClick={(event) => { event.stopPropagation(); onEdit(cursor); }}><Pencil className="h-4 w-4" /></Button> }];
  return <Table columns={columns} data={cursors} loading={loading} emptyMessage="Chưa có checkpoint SePay" emptySubMessage="Checkpoint được hệ thống tạo sẵn theo phạm vi đồng bộ." />;
};
