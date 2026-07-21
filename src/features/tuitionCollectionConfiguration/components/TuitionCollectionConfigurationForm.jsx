import { useState } from 'react';
import { Landmark, Save, Settings2 } from 'lucide-react';
import { Button, Dropdown, Textarea } from '../../../shared/components/ui';
import { ReceivingBankAccountSearchSelect } from '../../receivingBankAccount/components';

const COLLECTION_MODE_OPTIONS = [
  { value: 'AUTOMATIC', label: 'Tự động' },
  { value: 'MANUAL_FALLBACK', label: 'Chờ đối soát thủ công' },
];

const getInitialAccount = (configuration) => {
  const accountId = configuration.defaultManualReceivingBankAccountId;
  return accountId ? {
    receivingBankAccountId: accountId,
    displayName: `Tài khoản #${accountId}`,
  } : null;
};

export const TuitionCollectionConfigurationForm = ({ configuration, loading, onSave }) => {
  const [collectionMode, setCollectionMode] = useState(configuration.collectionMode || 'AUTOMATIC');
  const [selectedAccount, setSelectedAccount] = useState(getInitialAccount(configuration));
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!selectedAccount?.receivingBankAccountId) nextErrors.account = 'Vui lòng chọn tài khoản nhận tiền đang hoạt động.';
    if (reason.trim().length < 3) nextErrors.reason = 'Lý do thay đổi cần ít nhất 3 ký tự.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const saved = await onSave({
      collectionMode,
      defaultManualReceivingBankAccountId: selectedAccount.receivingBankAccountId,
      reason: reason.trim(),
    });
    if (saved) setReason('');
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-border bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-border p-5">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-700"><Settings2 className="h-5 w-5" /></div>
        <div>
          <h2 className="font-semibold text-foreground">Thiết lập cách thu học phí</h2>
          <p className="mt-1 text-sm text-foreground-light">Thay đổi chỉ được dùng cho payment attempt và QR tạo sau thời điểm lưu.</p>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <Dropdown
          label="Chế độ thu học phí"
          value={collectionMode}
          onChange={setCollectionMode}
          options={COLLECTION_MODE_OPTIONS}
          required
          helperText="Tự động ưu tiên SePay; chế độ thủ công dùng tài khoản mặc định bên dưới."
        />
        <ReceivingBankAccountSearchSelect
          value={selectedAccount}
          onSelect={(account) => {
            setSelectedAccount(account);
            setErrors((current) => ({ ...current, account: undefined }));
          }}
          error={errors.account}
          required
        />
        <div className="lg:col-span-2">
          <Textarea
            label="Lý do thay đổi"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setErrors((current) => ({ ...current, reason: undefined }));
            }}
            placeholder="Ví dụ: Chuyển tạm sang đối soát thủ công trong thời gian bảo trì SePay"
            error={errors.reason}
            required
            rows={3}
            maxLength={500}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-foreground-light">
          <Landmark className="h-4 w-4" />
          Chỉ có thể chọn tài khoản đang hoạt động.
        </div>
        <Button type="submit" loading={loading}>
          <Save className="h-4 w-4" /> Lưu cấu hình
        </Button>
      </div>
    </form>
  );
};
