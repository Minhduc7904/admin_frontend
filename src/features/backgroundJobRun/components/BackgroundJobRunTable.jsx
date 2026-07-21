import { Eye } from 'lucide-react';
import { Button, Table } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils';

const STATUS = { RUNNING: ['Đang chạy', 'bg-blue-100 text-blue-700'], SUCCEEDED: ['Thành công', 'bg-green-100 text-green-700'], FAILED: ['Thất bại', 'bg-red-100 text-red-700'], SKIPPED: ['Bỏ qua', 'bg-gray-100 text-gray-700'] };
const Badge = ({ status }) => { const [label, classes] = STATUS[status] || ['Không xác định', 'bg-gray-100 text-gray-700']; return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>{label}</span>; };
export const BackgroundJobRunTable = ({ runs, loading, canViewDetail, onView, sortBy, sortOrder, onSort }) => {
  const sortable = (key, label, options = {}) => ({ key, label, ...options, sortDirection: sortBy === key ? sortOrder : undefined, onSort: (order) => onSort(key, order) });
  const columns = [sortable('backgroundJobRunId', 'Lần chạy', { render: (run) => <div><p className="font-semibold text-foreground">#{run.backgroundJobRunId}</p><p className="text-xs text-foreground-light">Job #{run.backgroundJobId}</p></div> }), sortable('scheduledAt', 'Theo lịch', { render: (run) => formatDateTime(run.scheduledAt) }), sortable('startedAt', 'Bắt đầu', { render: (run) => formatDateTime(run.startedAt) }), sortable('finishedAt', 'Kết thúc', { render: (run) => formatDateTime(run.finishedAt) }), sortable('status', 'Trạng thái', { render: (run) => <Badge status={run.status} /> }), { key: 'workerId', label: 'Worker', render: (run) => <span className="max-w-[160px] truncate text-sm" title={run.workerId}>{run.workerId || '—'}</span> }, { key: 'actions', label: '', align: 'right', render: (run) => canViewDetail && <Button variant="ghost" size="sm" onClick={(event) => { event.stopPropagation(); onView(run); }}><Eye className="h-4 w-4" /></Button> }];
  return <Table columns={columns} data={runs} loading={loading} emptyMessage="Chưa có lần chạy job nền" emptySubMessage="Thử thay đổi bộ lọc thời gian hoặc trạng thái." onRowClick={canViewDetail ? onView : undefined} />;
};
