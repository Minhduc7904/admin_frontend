export const UNIDENTIFIED_RECEIVING_BANK_ACCOUNT_ID = '0';

export const getReceivingBankAccountId = (account) => account?.receivingBankAccountId;

export const formatReceivingBankAccountLabel = (account) => {
  if (!account) return 'Chưa nhận diện ngân hàng';
  return account.displayName
    || [account.bankCode, account.accountNumber].filter(Boolean).join(' · ')
    || `Tài khoản #${account.receivingBankAccountId}`;
};

export const formatReceivingBankAccountDescription = (account, fallbackAccountNumber) => {
  if (!account) return fallbackAccountNumber ? `Số nhận: ${fallbackAccountNumber}` : 'Không có tài khoản ngân hàng nhận được nhận diện';

  const parts = [
    account.bankCode,
    account.accountNumber,
    account.accountHolder,
  ].filter(Boolean);

  return parts.length ? parts.join(' · ') : `Tài khoản #${account.receivingBankAccountId}`;
};
