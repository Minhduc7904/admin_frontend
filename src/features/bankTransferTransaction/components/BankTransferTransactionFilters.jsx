import { RefreshCw } from 'lucide-react';
import { Button, Dropdown, Input, SearchInput } from '../../../shared/components/ui';
import { ReceivingBankAccountSearchSelect } from '../../receivingBankAccount/components';
import { UNIDENTIFIED_RECEIVING_BANK_ACCOUNT_ID, getReceivingBankAccountId } from './bankTransferTransactionAccount';
import { PROCESSING_STATUS_OPTIONS, RECONCILIATION_STATUS_OPTIONS } from './bankTransferTransactionStatus';

const PROVIDER_OPTIONS = [
  { value: '', label: 'Tất cả nhà cung cấp' },
  { value: 'SEPAY', label: 'SePay' },
];

export const BankTransferTransactionFilters = ({ filters, onChange, onRefresh, loading }) => (
  <div className="border-b border-border p-4">
    <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
      <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SearchInput
          value={filters.search}
          onChange={(search) => onChange({ search })}
          placeholder="Mã SePay, nội dung, tài khoản..."
        />
        <Dropdown value={filters.provider} onChange={(provider) => onChange({ provider })} options={PROVIDER_OPTIONS} />
        <Dropdown value={filters.processingStatus} onChange={(processingStatus) => onChange({ processingStatus })} options={PROCESSING_STATUS_OPTIONS} />
        <Dropdown value={filters.reconciliationStatus} onChange={(reconciliationStatus) => onChange({ reconciliationStatus })} options={RECONCILIATION_STATUS_OPTIONS} />
        <Input name="paymentAttemptId" type="number" min="1" value={filters.paymentAttemptId} onChange={(event) => onChange({ paymentAttemptId: event.target.value })} placeholder="ID payment attempt" />
        <Input name="minAmount" type="number" min="0" value={filters.minAmount} onChange={(event) => onChange({ minAmount: event.target.value })} placeholder="Số tiền từ" />
        <Input name="maxAmount" type="number" min="0" value={filters.maxAmount} onChange={(event) => onChange({ maxAmount: event.target.value })} placeholder="Số tiền đến" />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh} loading={loading}>
          <RefreshCw className="h-4 w-4" /> Làm mới
        </Button>
      </div>
    </div>
    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Input name="providerTransactionId" value={filters.providerTransactionId} onChange={(event) => onChange({ providerTransactionId: event.target.value })} placeholder="Mã giao dịch SePay" />
      <Input name="receivingAccountNumber" value={filters.receivingAccountNumber} onChange={(event) => onChange({ receivingAccountNumber: event.target.value })} placeholder="Số tài khoản nhận" />
      <Input name="fromTransactionAt" type="datetime-local" value={filters.fromTransactionAt} onChange={(event) => onChange({ fromTransactionAt: event.target.value })} />
      <Input name="toTransactionAt" type="datetime-local" value={filters.toTransactionAt} onChange={(event) => onChange({ toTransactionAt: event.target.value })} />
    </div>
    <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <ReceivingBankAccountSearchSelect
        label="Ngân hàng nhận"
        placeholder="Lọc theo ngân hàng / tài khoản nhận..."
        value={filters.receivingBankAccount}
        status=""
        onSelect={(account) => onChange({
          receivingBankAccount: account,
          receivingBankAccountId: account ? String(getReceivingBankAccountId(account)) : '',
        })}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={filters.receivingBankAccountId === UNIDENTIFIED_RECEIVING_BANK_ACCOUNT_ID ? 'primary' : 'outline'}
          onClick={() => onChange({
            receivingBankAccount: null,
            receivingBankAccountId: UNIDENTIFIED_RECEIVING_BANK_ACCOUNT_ID,
          })}
        >
          Chưa nhận diện
        </Button>
        {filters.receivingBankAccountId && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange({ receivingBankAccount: null, receivingBankAccountId: '' })}
          >
            Tất cả ngân hàng
          </Button>
        )}
      </div>
    </div>
  </div>
);
