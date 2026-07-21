import { Eye } from 'lucide-react';
import { Button, Switch, Table } from '../../../shared/components/ui';

const JOB_CODE_LABELS = { SEPAY_TRANSACTION_SYNC: 'Đồng bộ giao dịch SePay' };

export const BackgroundJobTable = ({ jobs, loading, canUpdate, canViewDetail, updatingId, onToggle, onView, sortBy, sortOrder, onSort }) => {
  const sortable = (key, label, options = {}) => ({ key, label, ...options, sortDirection: sortBy === key ? sortOrder : undefined, onSort: (order) => onSort(key, order) });
  const columns = [
    sortable('backgroundJobId', 'Job nền', { render: (job) => <div><p className="font-semibold text-foreground">{job.displayName || JOB_CODE_LABELS[job.code] || job.code}</p><p className="mt-0.5 text-xs text-foreground-light">#{job.backgroundJobId} · {job.code}</p></div> }),
    { key: 'schedule', label: 'Lịch chạy', render: (job) => <div className="text-sm"><p>{job.cronExpression}</p><p className="text-xs text-foreground-light">{job.timezone}</p></div> },
    { key: 'maxRuntimeSeconds', label: 'Thời gian tối đa', render: (job) => `${job.maxRuntimeSeconds || 0} giây` },
    sortable('isEnabled', 'Bật lịch', { render: (job) => <div className="flex items-center gap-2"><Switch checked={job.isEnabled} onChange={(isEnabled) => onToggle(job, isEnabled)} disabled={!canUpdate} loading={updatingId === job.backgroundJobId} /><span className="text-xs text-foreground-light">{job.isEnabled ? 'Đang bật' : 'Đã tắt'}</span></div> }),
    { key: 'actions', label: '', align: 'right', render: (job) => canViewDetail && <Button variant="ghost" size="sm" onClick={(event) => { event.stopPropagation(); onView(job); }} aria-label={`Xem job #${job.backgroundJobId}`}><Eye className="h-4 w-4" /></Button> },
  ];
  return <Table columns={columns} data={jobs} loading={loading} emptyMessage="Chưa có job nền nào" emptySubMessage="Không tìm thấy job phù hợp với bộ lọc." onRowClick={canViewDetail ? onView : undefined} />;
};
