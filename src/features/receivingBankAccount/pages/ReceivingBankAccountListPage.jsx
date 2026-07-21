import { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, CircleCheckBig, CircleOff, CloudSync, Plus, RefreshCw, WalletCards } from 'lucide-react';
import { PERMISSIONS } from '../../../core/constants';
import { useHasPermission } from '../../../shared/hooks';
import { Button, Dropdown, Pagination, SearchInput } from '../../../shared/components/ui';
import { ReceivingBankAccountPanel, ReceivingBankAccountTable } from '../components';
import {
  createReceivingBankAccountAsync,
  getReceivingBankAccountsAsync,
  selectReceivingBankAccountLoadingList,
  selectReceivingBankAccountLoadingSave,
  selectReceivingBankAccountPagination,
  selectReceivingBankAccounts,
  selectReceivingBankAccountBalanceRequestStates,
  selectReceivingBankAccountBalances,
  selectReceivingBankAccountSyncingFromSepay,
  selectReceivingBankAccountUpdatingStatusId,
  getReceivingBankAccountSepayBalanceAsync,
  setReceivingBankAccountStatusAsync,
  syncReceivingBankAccountsFromSepayAsync,
  updateReceivingBankAccountAsync,
} from '../store/receivingBankAccountSlice';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
];

const SORT_OPTIONS = [
  { value: 'updatedAt', label: 'Cập nhật gần nhất' },
  { value: 'createdAt', label: 'Ngày tạo' },
  { value: 'bankCode', label: 'Mã ngân hàng' },
  { value: 'accountHolder', label: 'Chủ tài khoản' },
  { value: 'displayName', label: 'Tên hiển thị' },
  { value: 'status', label: 'Trạng thái' },
];

const StatCard = ({ label, value, icon: Icon, tone }) => (
  <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-foreground-light">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      </div>
      <div className={`rounded-lg p-2 ${tone}`}>{createElement(Icon, { className: 'h-5 w-5' })}</div>
    </div>
  </div>
);

const toVndMinorUnits = (value) => {
  const [integer = '0', decimal = ''] = String(value || '0').split('.');
  return BigInt(integer || 0) * 100n + BigInt(decimal.padEnd(2, '0').slice(0, 2) || 0);
};

const formatVndMinorUnits = (value) => {
  const integer = value / 100n;
  const decimal = value % 100n;
  return decimal === 0n
    ? `${integer.toLocaleString('vi-VN')} ₫`
    : `${integer.toLocaleString('vi-VN')},${decimal.toString().padStart(2, '0')} ₫`;
};

export const ReceivingBankAccountListPage = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(selectReceivingBankAccounts);
  const pagination = useSelector(selectReceivingBankAccountPagination);
  const loading = useSelector(selectReceivingBankAccountLoadingList);
  const saving = useSelector(selectReceivingBankAccountLoadingSave);
  const updatingStatusId = useSelector(selectReceivingBankAccountUpdatingStatusId);
  const syncingFromSepay = useSelector(selectReceivingBankAccountSyncingFromSepay);
  const balancesByAccountId = useSelector(selectReceivingBankAccountBalances);
  const balanceRequestStates = useSelector(selectReceivingBankAccountBalanceRequestStates);
  const canCreate = useHasPermission(PERMISSIONS.RECEIVING_BANK_ACCOUNT.CREATE);
  const canUpdate = useHasPermission(PERMISSIONS.RECEIVING_BANK_ACCOUNT.UPDATE);
  const canViewSensitive = useHasPermission(PERMISSIONS.RECEIVING_BANK_ACCOUNT.VIEW_SENSITIVE);
  const canSyncFromSepay = useHasPermission(PERMISSIONS.RECEIVING_BANK_ACCOUNT.SYNC_FROM_SEPAY);
  const canViewBalance = useHasPermission(PERMISSIONS.RECEIVING_BANK_ACCOUNT.VIEW_BALANCE);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    bankCode: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const params = useMemo(() => ({
    page,
    limit,
    search: filters.search || undefined,
    status: filters.status || undefined,
    bankCode: filters.bankCode.trim() || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  }), [filters, limit, page]);

  const loadAccounts = useCallback(() => dispatch(getReceivingBankAccountsAsync(params)), [dispatch, params]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (!canViewBalance) return;

    accounts
      .filter((account) => account.sepayBankAccountId
        && account.sepayStatus !== 'UNKNOWN'
        && !balanceRequestStates[account.receivingBankAccountId])
      .forEach((account) => {
        dispatch(getReceivingBankAccountSepayBalanceAsync(account.receivingBankAccountId));
      });
  }, [accounts, balanceRequestStates, canViewBalance, dispatch]);

  const updateFilters = (next) => {
    setPage(1);
    setFilters((current) => ({ ...current, ...next }));
  };

  const openCreatePanel = () => {
    setSelectedAccount(null);
    setPanelOpen(true);
  };

  const openEditPanel = (account) => {
    setSelectedAccount(account);
    setPanelOpen(true);
  };

  const closePanel = () => {
    if (saving) return;
    setPanelOpen(false);
    setSelectedAccount(null);
  };

  const saveAccount = async (data) => {
    const action = selectedAccount
      ? updateReceivingBankAccountAsync({ id: selectedAccount.receivingBankAccountId, data })
      : createReceivingBankAccountAsync(data);

    try {
      await dispatch(action).unwrap();
      closePanel();
      if (!selectedAccount) setPage(1);
      await dispatch(getReceivingBankAccountsAsync({ ...params, page: selectedAccount ? page : 1 })).unwrap();
    } catch {
      // The thunk displays the backend validation/conflict message as a notification.
    }
  };

  const changeStatus = async (account, active) => {
    try {
      await dispatch(setReceivingBankAccountStatusAsync({
        id: account.receivingBankAccountId,
        active,
      })).unwrap();
    } catch {
      // A 409 for the default receiving account is surfaced by the thunk notification.
    }
  };

  const syncFromSepay = async () => {
    try {
      await dispatch(syncReceivingBankAccountsFromSepayAsync()).unwrap();
      await loadAccounts().unwrap();
    } catch {
      // The thunk reports SePay errors, including configuration and conflicting-record errors.
    }
  };

  const stats = useMemo(() => ({
    active: accounts.filter((account) => account.status === 'ACTIVE').length,
    inactive: accounts.filter((account) => account.status === 'INACTIVE').length,
  }), [accounts]);

  const totalSepayBalance = useMemo(() => accounts
    .map((account) => balancesByAccountId[account.receivingBankAccountId])
    .filter((balance) => balance?.currency === 'VND' && balance?.balance !== undefined)
    .reduce((total, balance) => total + toVndMinorUnits(balance.balance), 0n), [accounts, balancesByAccountId]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">THU HỌC PHÍ</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Tài khoản nhận tiền</h1>
          <p className="mt-1 text-sm text-foreground-light">Quản lý các tài khoản ngân hàng dùng để nhận thanh toán học phí.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canSyncFromSepay && (
            <Button variant="outline" onClick={syncFromSepay} loading={syncingFromSepay}>
              <CloudSync className="h-4 w-4" />
              Đồng bộ SePay
            </Button>
          )}
          {canCreate && (
            <Button onClick={openCreatePanel}>
              <Plus className="h-4 w-4" />
              Thêm tài khoản
            </Button>
          )}
        </div>
      </div>

      <div className={`grid gap-4 ${canViewBalance ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        <StatCard label="Tổng tài khoản" value={pagination.total} icon={Building2} tone="bg-gray-100 text-gray-700" />
        <StatCard label="Đang hoạt động" value={stats.active} icon={CircleCheckBig} tone="bg-emerald-50 text-emerald-700" />
        <StatCard label="Ngừng hoạt động" value={stats.inactive} icon={CircleOff} tone="bg-slate-100 text-slate-700" />
        {canViewBalance && <StatCard label="Tổng số dư SePay (đang hiển thị)" value={formatVndMinorUnits(totalSepayBalance)} icon={WalletCards} tone="bg-blue-50 text-blue-700" />}
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SearchInput
                value={filters.search}
                onChange={(search) => updateFilters({ search })}
                placeholder="Tìm tên, ngân hàng, chủ tài khoản..."
              />
              <InputFilter
                value={filters.bankCode}
                onChange={(bankCode) => updateFilters({ bankCode })}
              />
              <Dropdown label="Trạng thái" value={filters.status} onChange={(status) => updateFilters({ status })} options={STATUS_OPTIONS} />
              <Dropdown label="Sắp xếp" value={filters.sortBy} onChange={(sortBy) => updateFilters({ sortBy })} options={SORT_OPTIONS} />
            </div>
            <Button variant="outline" onClick={loadAccounts} loading={loading}>
              <RefreshCw className="h-4 w-4" /> Làm mới
            </Button>
          </div>
        </div>

        <ReceivingBankAccountTable
          accounts={accounts}
          loading={loading}
          canUpdate={canUpdate}
          canViewSensitive={canViewSensitive}
          canViewBalance={canViewBalance}
          balancesByAccountId={balancesByAccountId}
          balanceRequestStates={balanceRequestStates}
          updatingStatusId={updatingStatusId}
          onEdit={openEditPanel}
          onStatusChange={changeStatus}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={(sortBy, sortOrder) => updateFilters({ sortBy, sortOrder })}
        />

        <Pagination
          currentPage={pagination.page || page}
          totalPages={Math.max(pagination.totalPages || 1, 1)}
          totalItems={pagination.total || 0}
          itemsPerPage={limit}
          onPageChange={setPage}
          onItemsPerPageChange={(value) => { setLimit(Number(value)); setPage(1); }}
          disabled={loading}
        />
      </div>

      {(canCreate || canUpdate) && (
        <ReceivingBankAccountPanel
          account={selectedAccount}
          isOpen={panelOpen}
          onClose={closePanel}
          onSave={saveAccount}
          loading={saving}
          canViewSensitive={canViewSensitive}
        />
      )}
    </div>
  );
};

const InputFilter = ({ value, onChange }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-foreground">Mã ngân hàng</label>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      maxLength={30}
      placeholder="VD: MB"
      className="w-full rounded-sm border border-border bg-primary px-3 py-2 text-sm focus:outline-none focus:border-foreground"
    />
  </div>
);
