import { Edit3, LockKeyhole } from 'lucide-react';
import { ActionMenu, Badge, Switch, Table, Tooltip } from '../../../shared/components/ui';

const StatusBadge = ({ status }) => (
  <Badge variant={status === 'ACTIVE' ? 'success' : 'default'}>
    {status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
  </Badge>
);

const SepayStatusBadge = ({ status }) => {
  const config = {
    ACTIVE: { label: 'Đã kết nối', variant: 'success' },
    INACTIVE: { label: 'Ngừng kết nối', variant: 'warning' },
    UNKNOWN: { label: 'Chưa kết nối', variant: 'default' },
  };
  const current = config[status] || config.UNKNOWN;
  return <Badge variant={current.variant} size="small">{current.label}</Badge>;
};

const formatDate = (value) => value ? new Date(value).toLocaleString('vi-VN', {
  dateStyle: 'short',
  timeStyle: 'short',
}) : '-';

const formatBalance = (value, currency = 'VND') => {
  if (value === null || value === undefined || value === '') return '-';
  const [integer, decimal = ''] = String(value).split('.');
  const formattedInteger = BigInt(integer || 0).toLocaleString('vi-VN');
  const formattedDecimal = decimal && !/^0+$/.test(decimal) ? `,${decimal}` : '';
  return `${formattedInteger}${formattedDecimal}${currency === 'VND' ? ' ₫' : ` ${currency}`}`;
};

export const ReceivingBankAccountTable = ({
  accounts,
  loading,
  canUpdate,
  canViewSensitive,
  canViewBalance,
  balancesByAccountId,
  balanceRequestStates,
  updatingStatusId,
  onEdit,
  onStatusChange,
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
    sortable('bankCode', 'Ngân hàng', {
      render: (account) => (
        <div>
          <p className="font-semibold text-foreground">{account.bankCode}</p>
          <p className="text-xs text-foreground-light">#{account.receivingBankAccountId}</p>
        </div>
      ),
    }),
    {
      key: 'accountNumber',
      label: 'Số tài khoản',
      render: (account) => (
        <div className="flex items-center gap-2 font-mono text-sm text-foreground">
          <span>{canViewSensitive ? account.accountNumber || '-' : account.isAccountNumberMasked ? account.accountNumber : '••••••••'}</span>
          {(!canViewSensitive || account.isAccountNumberMasked) && (
            <Tooltip text="Số tài khoản được che theo quyền hiện tại" position="top">
              <LockKeyhole className="h-3.5 w-3.5 text-foreground-light" />
            </Tooltip>
          )}
        </div>
      ),
    },
    sortable('accountHolder', 'Chủ tài khoản', {
      render: (account) => <span className="font-medium text-foreground">{account.accountHolder || '-'}</span>,
    }),
    sortable('displayName', 'Tên hiển thị', {
      render: (account) => (
        <div>
          <p className="text-foreground">{account.displayName || 'Chưa đặt tên'}</p>
          {account.sepayBankAccountId && <p className="text-xs text-foreground-light">Sepay: {account.sepayBankAccountId}</p>}
        </div>
      ),
    }),
    sortable('status', 'Trạng thái', {
      render: (account) => <StatusBadge status={account.status} />,
    }),
    {
      key: 'sepayStatus',
      label: 'SePay',
      render: (account) => (
        <div className="space-y-1">
          <SepayStatusBadge status={account.sepayStatus} />
          {account.sepayBankAccountId && <p className="text-xs text-foreground-light">ID: {account.sepayBankAccountId}</p>}
        </div>
      ),
    },
    ...(canViewBalance ? [{
      key: 'sepayBalance',
      label: 'Số dư SePay',
      align: 'right',
      render: (account) => {
        const accountId = account.receivingBankAccountId;
        const balance = balancesByAccountId[accountId];
        const requestState = balanceRequestStates[accountId];
        if (!account.sepayBankAccountId || account.sepayStatus === 'UNKNOWN') {
          return <span className="text-xs text-foreground-light">Chưa kết nối</span>;
        }
        if (requestState === 'pending') return <span className="text-xs text-foreground-light">Đang tải...</span>;
        if (requestState === 'error') return <span className="text-xs text-red-600">Không thể lấy</span>;
        return (
          <div>
            <p className="font-semibold text-foreground">{formatBalance(balance?.balance, balance?.currency)}</p>
            {balance?.fetchedAt && <p className="text-xs text-foreground-light">Lấy lúc {formatDate(balance.fetchedAt)}</p>}
          </div>
        );
      },
    }] : []),
    {
      key: 'active',
      label: 'Kích hoạt',
      align: 'center',
      render: (account) => (
        <Tooltip text={canUpdate ? 'Bật hoặc tắt tài khoản' : 'Bạn không có quyền cập nhật tài khoản'} position="top">
          <span className="inline-flex">
            <Switch
              checked={account.status === 'ACTIVE'}
              onChange={(active) => onStatusChange(account, active)}
              disabled={!canUpdate}
              loading={updatingStatusId === account.receivingBankAccountId}
            />
          </span>
        </Tooltip>
      ),
    },
    sortable('updatedAt', 'Cập nhật', {
      render: (account) => (
        <div className="text-xs text-foreground-light">
          <p>{formatDate(account.updatedAt)}</p>
          <p>Tạo: {formatDate(account.createdAt)}</p>
        </div>
      ),
    }),
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (account) => canUpdate ? (
        <ActionMenu items={[{
          label: 'Chỉnh sửa',
          icon: <Edit3 size={14} />,
          onClick: () => onEdit(account),
        }]} />
      ) : null,
    },
  ];

  return <Table
    columns={columns}
    data={accounts}
    loading={loading}
    emptyMessage="Chưa có tài khoản nhận tiền"
    emptySubMessage="Hãy thêm tài khoản ngân hàng đầu tiên để nhận thanh toán học phí."
    emptyIcon="credit-card"
  />;
};
