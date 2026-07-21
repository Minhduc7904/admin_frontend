import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CloudSync, Landmark } from 'lucide-react';
import { PERMISSIONS } from '../../../core/constants';
import { useHasPermission } from '../../../shared/hooks';
import { Button, Pagination, RightPanel } from '../../../shared/components/ui';
import {
  BankTransferTransactionDetailPanel,
  BankTransferTransactionFilters,
  BankTransferTransactionStatistics,
  BankTransferTransactionTable,
} from '../components';
import {
  clearBankTransferTransactionDetail,
  getBankTransferTransactionDetailAsync,
  getBankTransferTransactionStatisticsAsync,
  getBankTransferTransactionsAsync,
  syncBankTransferTransactionsFromSepayAsync,
  selectBankTransferTransactionDetail,
  selectBankTransferTransactionLoadingDetail,
  selectBankTransferTransactionLoadingList,
  selectBankTransferTransactionLoadingStatistics,
  selectBankTransferTransactionLoadingSyncSepay,
  selectBankTransferTransactionPagination,
  selectBankTransferTransactionStatistics,
  selectBankTransferTransactions,
} from '../store/bankTransferTransactionSlice';

const toIsoDateTime = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const toNumber = (value) => {
  if (value === '' || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const BankTransferTransactionListPage = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectBankTransferTransactions);
  const pagination = useSelector(selectBankTransferTransactionPagination);
  const statistics = useSelector(selectBankTransferTransactionStatistics);
  const selectedTransaction = useSelector(selectBankTransferTransactionDetail);
  const loadingList = useSelector(selectBankTransferTransactionLoadingList);
  const loadingStatistics = useSelector(selectBankTransferTransactionLoadingStatistics);
  const loadingDetail = useSelector(selectBankTransferTransactionLoadingDetail);
  const syncingSepay = useSelector(selectBankTransferTransactionLoadingSyncSepay);
  const canViewDetail = useHasPermission(PERMISSIONS.BANK_TRANSFER_TRANSACTION.GET_BY_ID);
  const canViewStatistics = useHasPermission(PERMISSIONS.BANK_TRANSFER_TRANSACTION.STATS);
  const canSyncSepay = useHasPermission(PERMISSIONS.BANK_TRANSFER_TRANSACTION.SYNC_SEPAY);

  const [filters, setFilters] = useState({
    search: '',
    provider: 'SEPAY',
    paymentAttemptId: '',
    processingStatus: '',
    reconciliationStatus: '',
    providerTransactionId: '',
    receivingAccountNumber: '',
    minAmount: '',
    maxAmount: '',
    fromTransactionAt: '',
    toTransactionAt: '',
    sortBy: 'transactionAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detailOpen, setDetailOpen] = useState(false);

  const queryParams = useMemo(() => ({
    page,
    limit,
    search: filters.search.trim() || undefined,
    provider: filters.provider || undefined,
    paymentAttemptId: toNumber(filters.paymentAttemptId),
    processingStatus: filters.processingStatus || undefined,
    reconciliationStatus: filters.reconciliationStatus || undefined,
    providerTransactionId: filters.providerTransactionId.trim() || undefined,
    receivingAccountNumber: filters.receivingAccountNumber.trim() || undefined,
    minAmount: toNumber(filters.minAmount),
    maxAmount: toNumber(filters.maxAmount),
    fromTransactionAt: toIsoDateTime(filters.fromTransactionAt),
    toTransactionAt: toIsoDateTime(filters.toTransactionAt),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  }), [filters, limit, page]);

  const statisticsParams = useMemo(() => {
    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...params } = queryParams;
    return params;
  }, [queryParams]);

  const loadTransactions = useCallback(() => dispatch(getBankTransferTransactionsAsync(queryParams)), [dispatch, queryParams]);
  const loadStatistics = useCallback(() => {
    if (canViewStatistics) return dispatch(getBankTransferTransactionStatisticsAsync(statisticsParams));
    return null;
  }, [canViewStatistics, dispatch, statisticsParams]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const updateFilters = (next) => {
    setPage(1);
    setFilters((current) => ({ ...current, ...next }));
  };

  const refresh = async () => {
    await Promise.all([loadTransactions(), loadStatistics()].filter(Boolean));
  };

  const syncSepay = async () => {
    try {
      await dispatch(syncBankTransferTransactionsFromSepayAsync()).unwrap();
      await refresh();
    } catch {
      // The thunk surfaces errors, including a conflict with a running scheduler sync.
    }
  };

  const openDetail = async (transaction) => {
    if (!canViewDetail) return;
    setDetailOpen(true);
    await dispatch(getBankTransferTransactionDetailAsync(transaction.bankTransferTransactionId));
  };

  const closeDetail = () => {
    setDetailOpen(false);
    dispatch(clearBankTransferTransactionDetail());
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">THU HỌC PHÍ</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Giao dịch ngân hàng</h1>
          <p className="mt-1 text-sm text-foreground-light">Theo dõi giao dịch SePay, trạng thái xử lý và nguồn đối soát thanh toán học phí.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          {canSyncSepay && <Button variant="outline" onClick={syncSepay} loading={syncingSepay}>
            <CloudSync className="h-4 w-4" /> Đồng bộ SePay
          </Button>}
          <Landmark className="mr-2 inline h-4 w-4" />
          Dữ liệu chỉ đọc từ hệ thống đối soát
        </div>
      </div>

      {canViewStatistics && <BankTransferTransactionStatistics statistics={statistics} loading={loadingStatistics} />}

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <BankTransferTransactionFilters
          filters={filters}
          onChange={updateFilters}
          onRefresh={refresh}
          loading={loadingList || loadingStatistics}
        />
        <BankTransferTransactionTable
          transactions={transactions}
          loading={loadingList}
          canViewDetail={canViewDetail}
          onViewDetail={openDetail}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={(sortBy, sortOrder) => updateFilters({ sortBy, sortOrder })}
        />
        <div className="border-t border-border p-4">
          <Pagination
            currentPage={pagination.page || page}
            totalPages={Math.max(pagination.totalPages || 1, 1)}
            totalItems={pagination.total || 0}
            itemsPerPage={limit}
            onPageChange={setPage}
            onItemsPerPageChange={(value) => { setLimit(Number(value)); setPage(1); }}
            disabled={loadingList}
          />
        </div>
      </div>

      {canViewDetail && (
        <RightPanel
          isOpen={detailOpen}
          onClose={closeDetail}
          title="Chi tiết giao dịch ngân hàng"
          width="w-[760px]"
        >
          <BankTransferTransactionDetailPanel transaction={selectedTransaction} loading={loadingDetail} />
        </RightPanel>
      )}
    </div>
  );
};
