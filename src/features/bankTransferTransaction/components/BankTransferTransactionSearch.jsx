import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Input, SearchInput } from '../../../shared/components/ui';
import { useDebounce } from '../../../shared/hooks';
import {
  searchBankTransferTransactionsAsync,
  searchBankTransferTransactionsForTuitionPaymentAsync,
  selectBankTransferTransactionLoadingSearch,
  selectBankTransferTransactionLoadingTuitionPaymentSearch,
  selectBankTransferTransactionSearchResults,
} from '../store/bankTransferTransactionSlice';
import {
  PROCESSING_STATUS_OPTIONS,
  RECONCILIATION_STATUS_OPTIONS,
} from './bankTransferTransactionStatus';
import { ProcessingStatusBadge, ReconciliationStatusBadge } from './BankTransferTransactionStatusBadge';

const formatMoney = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const toIsoDateTime = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export const BankTransferTransactionSearch = ({
  selectedIds = [],
  onToggle,
  initialSearch = '',
  tuitionPaymentId,
  initialReconciliationStatus = 'UNRECONCILED',
}) => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectBankTransferTransactionSearchResults);
  const loading = useSelector(selectBankTransferTransactionLoadingSearch);
  const loadingTuitionPaymentSearch = useSelector(selectBankTransferTransactionLoadingTuitionPaymentSearch);
  const [filters, setFilters] = useState({
    search: initialSearch,
    processingStatus: '',
    reconciliationStatus: initialReconciliationStatus,
    fromTransactionAt: '',
    toTransactionAt: '',
  });
  const debouncedSearch = useDebounce(filters.search, 400);

  const params = useMemo(() => ({
    page: 1,
    limit: 20,
    provider: 'SEPAY',
    search: debouncedSearch.trim() || undefined,
    processingStatus: filters.processingStatus || undefined,
    reconciliationStatus: filters.reconciliationStatus || undefined,
    fromTransactionAt: toIsoDateTime(filters.fromTransactionAt),
    toTransactionAt: toIsoDateTime(filters.toTransactionAt),
    sortBy: 'transactionAt',
    sortOrder: 'desc',
  }), [debouncedSearch, filters]);

  useEffect(() => {
    if (tuitionPaymentId) {
      dispatch(searchBankTransferTransactionsForTuitionPaymentAsync({ tuitionPaymentId, params }));
      return;
    }
    dispatch(searchBankTransferTransactionsAsync(params));
  }, [dispatch, params, tuitionPaymentId]);

  const updateFilter = (next) => setFilters((current) => ({ ...current, ...next }));

  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-border bg-white">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-foreground">Chọn giao dịch ngân hàng</h3>
            <p className="mt-1 text-xs text-foreground-light">Chỉ chọn giao dịch đã kiểm tra đúng số tiền và nội dung.</p>
          </div>
          {selectedIds.length > 0 && <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Đã chọn {selectedIds.length}</span>}
        </div>
        <div className="mt-3 space-y-3">
          <SearchInput value={filters.search} onChange={(search) => updateFilter({ search })} placeholder="Mã SePay, nội dung, tài khoản..." />
          <div className="grid gap-3 sm:grid-cols-2">
            <Dropdown value={filters.processingStatus} onChange={(processingStatus) => updateFilter({ processingStatus })} options={PROCESSING_STATUS_OPTIONS} />
            <Dropdown value={filters.reconciliationStatus} onChange={(reconciliationStatus) => updateFilter({ reconciliationStatus })} options={RECONCILIATION_STATUS_OPTIONS} />
            <Input type="datetime-local" value={filters.fromTransactionAt} onChange={(event) => updateFilter({ fromTransactionAt: event.target.value })} />
            <Input type="datetime-local" value={filters.toTransactionAt} onChange={(event) => updateFilter({ toTransactionAt: event.target.value })} />
          </div>
        </div>
      </div>
      <div className="max-h-[440px] space-y-2 overflow-y-auto p-3">
        {(tuitionPaymentId ? loadingTuitionPaymentSearch : loading) && <p className="p-3 text-sm text-foreground-light">Đang tìm giao dịch...</p>}
        {!(tuitionPaymentId ? loadingTuitionPaymentSearch : loading) && transactions.length === 0 && <p className="p-3 text-sm text-foreground-light">Không tìm thấy giao dịch phù hợp.</p>}
        {!(tuitionPaymentId ? loadingTuitionPaymentSearch : loading) && transactions.map((transaction) => {
          const isSelected = selectedIds.includes(transaction.bankTransferTransactionId);
          return (
            <button
              key={transaction.bankTransferTransactionId}
              type="button"
              onClick={() => onToggle(transaction)}
              className={`w-full rounded-lg border p-3 text-left transition ${isSelected ? 'border-foreground bg-slate-50 ring-1 ring-foreground' : 'border-border hover:border-foreground-light hover:bg-gray-50'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{formatMoney(transaction.amount)}</p>
                  <p className="mt-1 truncate text-xs text-foreground-light" title={transaction.providerTransactionId}>{transaction.providerTransactionId}</p>
                </div>
                <span className="text-xs text-foreground-light">{transaction.transactionAt ? new Date(transaction.transactionAt).toLocaleString('vi-VN') : '-'}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-foreground">{transaction.content || 'Không có nội dung chuyển khoản'}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <ProcessingStatusBadge status={transaction.processingStatus} />
                <ReconciliationStatusBadge status={transaction.reconciliationStatus} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
