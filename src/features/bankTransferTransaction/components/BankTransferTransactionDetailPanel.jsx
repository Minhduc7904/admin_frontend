import { Copy, FileJson } from 'lucide-react';
import { Button } from '../../../shared/components/ui';
import { ProcessingStatusBadge, ReconciliationStatusBadge } from './BankTransferTransactionStatusBadge';

const formatMoney = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const formatDateTime = (value) => value ? new Date(value).toLocaleString('vi-VN', {
  dateStyle: 'short',
  timeStyle: 'medium',
}) : '-';

const InfoLine = ({ label, value }) => (
  <div className="rounded-lg bg-gray-50 p-3">
    <p className="text-xs text-foreground-light">{label}</p>
    <p className="mt-1 break-words font-medium text-foreground">{value ?? '-'}</p>
  </div>
);

export const BankTransferTransactionDetailPanel = ({ transaction, loading }) => {
  if (loading) return <div className="p-6 text-sm text-foreground-light">Đang tải chi tiết giao dịch...</div>;
  if (!transaction) return <div className="p-6 text-sm text-foreground-light">Chưa chọn giao dịch.</div>;

  const payload = transaction.rawPayload === undefined || transaction.rawPayload === null
    ? null
    : JSON.stringify(transaction.rawPayload, null, 2);

  const copyPayload = async () => {
    if (payload && navigator.clipboard) await navigator.clipboard.writeText(payload);
  };

  return (
    <div className="space-y-5 p-1">
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-foreground-light">Giao dịch ngân hàng</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">#{transaction.bankTransferTransactionId}</h2>
            <p className="mt-1 text-sm text-foreground-light">{transaction.provider} · {transaction.providerTransactionId}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ProcessingStatusBadge status={transaction.processingStatus} />
            <ReconciliationStatusBadge status={transaction.reconciliationStatus} />
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoLine label="Số tiền" value={formatMoney(transaction.amount)} />
          <InfoLine label="Thời điểm giao dịch" value={formatDateTime(transaction.transactionAt)} />
          <InfoLine label="Payment attempt" value={transaction.paymentAttemptId ? `#${transaction.paymentAttemptId}` : '-'} />
          <InfoLine label="Tài khoản nhận" value={transaction.receivingAccountNumber} />
          <InfoLine label="Reference" value={transaction.reference} />
          <InfoLine label="Tạo lúc" value={formatDateTime(transaction.createdAt)} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <p className="text-sm font-semibold text-foreground">Nội dung chuyển khoản</p>
        <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-3 text-sm text-foreground">{transaction.content || '-'}</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><FileJson className="h-4 w-4 text-foreground-light" /><p className="text-sm font-semibold text-foreground">Payload SePay gốc</p></div>
          {payload && <Button variant="outline" size="sm" onClick={copyPayload}><Copy className="h-4 w-4" /> Sao chép</Button>}
        </div>
        <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100">{payload || 'Không có payload được lưu.'}</pre>
      </div>
    </div>
  );
};
