import { useDispatch } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import { searchReceivingBankAccountsAsync } from '../store/receivingBankAccountSlice';

const getAccountLabel = (account) => account?.displayName
  || `${account?.bankCode || 'Ngân hàng'} · ${account?.accountNumber || '—'}`;

export const ReceivingBankAccountSearchSelect = ({
  label = 'Tài khoản nhận tiền mặc định',
  placeholder = 'Tìm theo tên, ngân hàng, chủ tài khoản...',
  onSelect,
  value,
  error,
  required = false,
  disabled = false,
  className = '',
  status = 'ACTIVE',
}) => {
  const dispatch = useDispatch();

  const searchAccounts = async (search = '') => {
    try {
      const result = await dispatch(searchReceivingBankAccountsAsync({
        page: 1,
        limit: 50,
        status: status || undefined,
        search: search || undefined,
        sortBy: 'displayName',
        sortOrder: 'asc',
      })).unwrap();
      return result?.data || [];
    } catch {
      return [];
    }
  };

  return (
    <SearchableSelect
      label={label}
      placeholder={placeholder}
      searchFunction={searchAccounts}
      fetchDefaultItems={() => searchAccounts()}
      onSelect={onSelect}
      getOptionLabel={getAccountLabel}
      getOptionValue={(account) => account?.receivingBankAccountId}
      renderOption={(account) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{getAccountLabel(account)}</span>
          <span className="text-xs text-foreground-light">
            {account.bankCode} · {account.accountNumber || 'Chưa có số tài khoản'} · {account.accountHolder || 'Chưa có chủ tài khoản'}
            {account.status === 'INACTIVE' ? ' · Đang tắt' : ''}
          </span>
        </div>
      )}
      value={value}
      error={error}
      required={required}
      disabled={disabled}
      className={className}
    />
  );
};
