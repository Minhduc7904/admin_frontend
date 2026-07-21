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
