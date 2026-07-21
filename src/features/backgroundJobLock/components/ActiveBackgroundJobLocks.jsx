import { LockKeyhole, Unlock } from 'lucide-react';
import { formatDateTime } from '../../../shared/utils';

export const ActiveBackgroundJobLocks = ({ locks, loading }) => {
  if (loading) return <div className="rounded-xl border border-border bg-white p-4 text-sm text-foreground-light">Đang kiểm tra job đang bị khóa…</div>;
  const activeLocks = locks.filter((lock) => lock.isActive);
  return <section className="rounded-xl border border-border bg-white p-4 shadow-sm"><div className="flex items-start gap-3"><div className={`rounded-lg p-2 ${activeLocks.length ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{activeLocks.length ? <LockKeyhole className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}</div><div><h2 className="font-semibold text-foreground">Job nền đang bị khóa</h2><p className="mt-1 text-sm text-foreground-light">{activeLocks.length ? `${activeLocks.length} job đang có worker nắm lock.` : 'Không có job nào đang bị khóa.'}</p></div></div>{activeLocks.length > 0 && <div className="mt-4 grid gap-3 md:grid-cols-2">{activeLocks.map((lock) => <div key={`${lock.backgroundJobId}-${lock.workerId}`} className="rounded-lg border border-amber-200 bg-amber-50 p-3"><p className="font-medium text-foreground">Job #{lock.backgroundJobId}</p><p className="mt-1 text-sm text-foreground-light">Worker: {lock.workerId}</p><p className="mt-1 text-xs text-foreground-light">Khóa đến {formatDateTime(lock.leaseExpiresAt)}</p></div>)}</div>}</section>;
};
