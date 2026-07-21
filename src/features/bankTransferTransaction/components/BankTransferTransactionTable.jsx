import { Eye } from 'lucide-react';
import { Button, Table } from '../../../shared/components/ui';
import { ProcessingStatusBadge, ReconciliationStatusBadge } from './BankTransferTransactionStatusBadge';

const formatMoney = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const formatDateTime = (value) => value ? new Date(value).toLocaleString('vi-VN', {
  dateStyle: 'short',
  timeStyle: 'short',
}) : '-';

export const BankTransferTransactionTable = ({
  transactions,
  loading,
  canViewDetail,
  onViewDetail,
  onSort,
  sortBy,
  sortOrder,
}) => {
  const sortable = (key, label, options = {}) => ({
    key,
    label,
    ...options,
    sortDirection: sortBy === key ? sortOrder : undefined,
    onSort: (nextOrder) => onSort(key, nextOrder),
  });

  const columns = [
    sortable('bankTransferTransactionId', 'Giao dịch', {
      render: (transaction) => (
        <div>
          <p className="font-semibold text-foreground">#{transaction.bankTransferTransactionId}</p>
          <p className="mt-0.5 max-w-[190px] truncate text-xs text-foreground-light" title={transaction.providerTransactionId}>
            {transaction.providerTransactionId}
          </p>
        </div>
      ),
    }),
    sortable('amount', 'Số tiền', {
      align: 'right',
      render: (transaction) => <span className="font-semibold text-foreground">{formatMoney(transaction.amount)}</span>,
    }),
    sortable('transactionAt', 'Thời điểm GD', {
      render: (transaction) => formatDateTime(transaction.transactionAt),
    }),
    {
      key: 'paymentAttemptId',
      label: 'Payment attempt',
      render: (transaction) => transaction.paymentAttemptId ? `#${transaction.paymentAttemptId}` : '-',
    },
    sortable('processingStatus', 'Xử lý', {
      render: (transaction) => <ProcessingStatusBadge status={transaction.processingStatus} />,
    }),
    sortable('reconciliationStatus', 'Đối soát', {
      render: (transaction) => <ReconciliationStatusBadge status={transaction.reconciliationStatus} />,
    }),
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (transaction) => canViewDetail && (
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Xem giao dịch #${transaction.bankTransferTransactionId}`}
          onClick={(event) => {
            event.stopPropagation();
            onViewDetail(transaction);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={transactions}
      loading={loading}
      emptyMessage="Không có giao dịch ngân hàng nào"
      emptySubMessage="Thử thay đổi bộ lọc hoặc tải lại dữ liệu."
      emptyIcon="file-text"
      onRowClick={canViewDetail ? onViewDetail : undefined}
    />
  );
};
