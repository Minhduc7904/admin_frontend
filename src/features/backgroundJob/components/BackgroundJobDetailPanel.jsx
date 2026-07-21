import { formatDateTime } from '../../../shared/utils';

export const BackgroundJobDetailPanel = ({ job, loading }) => {
  if (loading) return <div className="p-6 text-center text-sm text-foreground-light">Đang tải chi tiết job nền…</div>;
  if (!job) return <div className="p-6 text-center text-sm text-foreground-light">Chưa có dữ liệu job nền.</div>;
  const fields = [['Mã job', job.code], ['Tên hiển thị', job.displayName], ['Cron', job.cronExpression], ['Múi giờ', job.timezone], ['Thời gian chạy tối đa', `${job.maxRuntimeSeconds} giây`], ['Trạng thái lịch', job.isEnabled ? 'Đang bật' : 'Đã tắt'], ['Tạo lúc', formatDateTime(job.createdAt)], ['Cập nhật lúc', formatDateTime(job.updatedAt)]];
  return <div className="space-y-3 p-6">{fields.map(([label, value]) => <div key={label} className="rounded-lg border border-border p-3"><p className="text-xs text-foreground-light">{label}</p><p className="mt-1 font-medium text-foreground">{value || '—'}</p></div>)}</div>;
};
