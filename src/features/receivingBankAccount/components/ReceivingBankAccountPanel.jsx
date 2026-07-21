import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button, Input, RightPanel, Textarea } from '../../../shared/components/ui';

const emptyForm = {
  bankCode: '',
  accountNumber: '',
  accountHolder: '',
  displayName: '',
  sepayBankAccountId: '',
  notes: '',
};

const toForm = (account) => ({
  bankCode: account?.bankCode || '',
  accountNumber: account?.isAccountNumberMasked ? '' : account?.accountNumber || '',
  accountHolder: account?.accountHolder || '',
  displayName: account?.displayName || '',
  sepayBankAccountId: account?.sepayBankAccountId || '',
  notes: account?.notes || '',
});

export const ReceivingBankAccountPanel = ({ account, isOpen, onClose, onSave, loading, canViewSensitive }) => {
  const isEditing = Boolean(account?.receivingBankAccountId);
  const accountNumberIsMasked = Boolean(account) && (account?.isAccountNumberMasked || !canViewSensitive);

  return (
    <RightPanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa tài khoản nhận tiền' : 'Thêm tài khoản nhận tiền'}
      width="w-full max-w-[620px]"
    >
      <ReceivingBankAccountForm
        key={account?.receivingBankAccountId || 'create'}
        account={account}
        isEditing={isEditing}
        accountNumberIsMasked={accountNumberIsMasked}
        onClose={onClose}
        onSave={onSave}
        loading={loading}
      />
    </RightPanel>
  );
};

const ReceivingBankAccountForm = ({ account, isEditing, accountNumberIsMasked, onClose, onSave, loading }) => {
  const [form, setForm] = useState(() => isEditing
    ? toForm({ ...account, isAccountNumberMasked: accountNumberIsMasked })
    : emptyForm);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (isEditing) {
      Object.keys(data).forEach((key) => {
        if (data[key] === '') delete data[key];
      });
      if (accountNumberIsMasked) delete data.accountNumber;
    }
    onSave(data);
  };

  return (
    <form onSubmit={submit} className="space-y-5 p-6">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          Tài khoản mới sẽ được kích hoạt ngay. Khi ngừng kích hoạt tài khoản mặc định, hãy đổi tài khoản mặc định trong cấu hình thu học phí trước.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            name="bankCode"
            label="Mã ngân hàng"
            value={form.bankCode}
            onChange={updateField}
            required={!isEditing}
            maxLength={30}
            placeholder="VD: MB, VCB"
          />
          <Input
            name="accountNumber"
            label="Số tài khoản"
            value={form.accountNumber}
            onChange={updateField}
            required={!isEditing}
            maxLength={50}
            placeholder={accountNumberIsMasked ? 'Để trống để giữ số tài khoản hiện tại' : 'Nhập số tài khoản'}
            helperText={accountNumberIsMasked ? 'Số tài khoản đang bị che theo quyền của bạn.' : undefined}
          />
        </div>

        <Input
          name="accountHolder"
          label="Chủ tài khoản"
          value={form.accountHolder}
          onChange={updateField}
          required={!isEditing}
          maxLength={150}
          placeholder="VD: TRUNG TÂM BEE"
        />

        <Input
          name="displayName"
          label="Tên hiển thị"
          value={form.displayName}
          onChange={updateField}
          maxLength={255}
          placeholder="VD: Tài khoản thu học phí"
        />

        <Input
          name="sepayBankAccountId"
          label="Sepay bank account ID"
          value={form.sepayBankAccountId}
          onChange={updateField}
          maxLength={255}
          placeholder="VD: sepay-account-01"
        />

        <Textarea
          name="notes"
          label="Ghi chú"
          value={form.notes}
          onChange={updateField}
          rows={4}
          maxLength={1000}
          placeholder="Ghi chú nội bộ cho tài khoản này"
        />

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
          <Button type="submit" loading={loading}>
            <Save className="h-4 w-4" />
            {isEditing ? 'Lưu thay đổi' : 'Tạo tài khoản'}
          </Button>
        </div>
    </form>
  );
};
