import { formatDateTime } from '../../../shared/utils';

export const BackgroundJobRunDetailPanel = ({ run, loading }) => {
  if (loading) return <div className="p-6 text-center text-sm text-foreground-light">Đang tải chi tiết lần chạy…</div>;
  if (!run) return <div className="p-6 text-center text-sm text-foreground-light">Chưa có dữ liệu lần chạy.</div>;
  const fields = [['Lần chạy', `#${run.backgroundJobRunId}`], ['Job nền', `#${run.backgroundJobId}`], ['Trạng thái', run.status], ['Worker', run.workerId], ['Theo lịch', formatDateTime(run.scheduledAt)], ['Bắt đầu', formatDateTime(run.startedAt)], ['Kết thúc', formatDateTime(run.finishedAt)], ['Khóa đến', formatDateTime(run.leaseExpiresAt)], ['Số lần thử lại', run.retryCount]];
  return <div className="space-y-4 p-6">{fields.map(([label, value]) => <div key={label} className="rounded-lg border border-border p-3"><p className="text-xs text-foreground-light">{label}</p><p className="mt-1 font-medium text-foreground">{value ?? '—'}</p></div>)}{run.errorCode && <div className="rounded-lg border border-red-200 bg-red-50 p-3"><p className="text-xs text-red-700">Mã lỗi: {run.errorCode}</p><p className="mt-1 whitespace-pre-wrap text-sm text-red-800">{run.errorMessage || 'Không có chi tiết lỗi'}</p></div>}{run.resultSummary && <div className="rounded-lg border border-border p-3"><p className="text-xs text-foreground-light">Kết quả xử lý</p><pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-foreground">{JSON.stringify(run.resultSummary, null, 2)}</pre></div>}</div>;
};
