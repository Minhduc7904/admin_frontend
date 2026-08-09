import { CircleDotDashed } from 'lucide-react';
import { PROCESSING_STATUS, RECONCILIATION_STATUS } from './bankTransferTransactionStatus';

const StatusBadge = ({ status, statuses }) => {
  const config = statuses[status] || { label: status || '-', className: 'bg-slate-100 text-slate-700', icon: CircleDotDashed };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};

export const ProcessingStatusBadge = ({ status }) => <StatusBadge status={status} statuses={PROCESSING_STATUS} />;
export const ReconciliationStatusBadge = ({ status }) => <StatusBadge status={status} statuses={RECONCILIATION_STATUS} />;

export const TransactionTypeBadge = ({ type }) => {
  const config = {
    TUITION_PAYMENT: { label: 'Thu học phí', className: 'bg-blue-50 text-blue-700' },
    COURSE_PURCHASE: { label: 'Mua khóa học', className: 'bg-violet-50 text-violet-700' },
  }[type] || { label: 'Chưa phân loại', className: 'bg-slate-100 text-slate-700' };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>{config.label}</span>;
};
