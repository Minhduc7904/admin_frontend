import { useState } from 'react';
import { CircleCheckBig, RotateCcw, ShieldAlert } from 'lucide-react';

import { parentAccountDeletionApi } from '../../../core/api/parentAccountDeletionApi';
import { Button, ConfirmModal, Input } from '../../../shared/components/ui';

const PHONE_PATTERN = /^0\d{9}$/;

export const DeletedParentAccountPage = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const normalizedPhone = phone.trim();

  const requestConfirmation = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!PHONE_PATTERN.test(normalizedPhone)) {
      setError('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.');
      return;
    }
    setConfirming(true);
  };

  const allowRegistration = async () => {
    setSubmitting(true);
    setError('');
    try {
      await parentAccountDeletionApi.allowRegistration(normalizedPhone);
      setSuccess('Đã cho phép số điện thoại này đăng ký một tài khoản mới. Dữ liệu cũ không được khôi phục.');
      setPhone('');
      setConfirming(false);
    } catch (requestError) {
      setError(requestError.message || 'Không thể cập nhật. Vui lòng thử lại.');
      setConfirming(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm md:p-7">
        <div className="flex items-start gap-3">
          <span className="rounded-lg bg-amber-50 p-2 text-amber-700">
            <ShieldAlert className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tài khoản phụ huynh đã xóa</h1>
            <p className="mt-2 text-sm leading-6 text-foreground-light">
              Chỉ thực hiện sau khi phụ huynh đã liên hệ và được xác minh qua Zalo. Thao tác này cho phép đăng ký
              tài khoản mới, không khôi phục tài khoản hoặc dữ liệu đã ẩn danh.
            </p>
          </div>
        </div>

        <form className="mt-7 space-y-4" onSubmit={requestConfirmation}>
          <Input
            label="Số điện thoại phụ huynh"
            name="phone"
            inputMode="numeric"
            autoComplete="off"
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="0391234567"
            error={error || undefined}
          />
          {success && (
            <div role="status" className="flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{success}</span>
            </div>
          )}
          <Button type="submit" disabled={submitting}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Cho phép đăng ký mới
          </Button>
        </form>
      </div>

      <ConfirmModal
        isOpen={confirming}
        title="Cho phép đăng ký tài khoản mới?"
        message={`Số ${normalizedPhone} sẽ có thể đăng ký lại. Tài khoản và dữ liệu cũ vẫn không thể khôi phục.`}
        confirmText="Xác nhận cho đăng ký"
        cancelText="Hủy"
        isLoading={submitting}
        onConfirm={allowRegistration}
        onClose={() => !submitting && setConfirming(false)}
      />
    </main>
  );
};
