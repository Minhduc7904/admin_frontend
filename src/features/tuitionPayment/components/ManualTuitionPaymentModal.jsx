import { useState } from 'react';
import { Landmark, ShieldCheck } from 'lucide-react';
import { Button, Input, Modal, Textarea } from '../../../shared/components/ui';
import { NoPermission } from '../../../shared/components/permissions';
import { BankTransferTransactionSearch } from '../../bankTransferTransaction/components';

const toIsoDateTime = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const formatMoney = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const ManualTuitionPaymentModal = ({
  payment,
  isOpen,
  onClose,
  onConfirm,
  loading,
  canSearchTransactions,
  mode = 'confirm',
  initialTransactions = [],
}) => {
  const [formData, setFormData] = useState({ paidAt: '', reference: '', reason: '' });
  const [selectedTransactions, setSelectedTransactions] = useState(initialTransactions);

  if (!payment) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {};
    const paidAt = toIsoDateTime(formData.paidAt);
    const reference = formData.reference.trim();
    const reason = formData.reason.trim();

    if (mode === 'confirm') {
      if (paidAt) payload.paidAt = paidAt;
      if (reference) payload.reference = reference;
      if (reason) payload.reason = reason;
    }

    if (selectedTransactions.length > 0) {
      payload.bankTransferTransactionIds = selectedTransactions.map(
        (transaction) => transaction.bankTransferTransactionId,
      );
    }

    if (mode === 'edit' && selectedTransactions.length === 0) return;
    onConfirm(payload);
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  const toggleTransaction = (transaction) => {
    setSelectedTransactions((current) => current.some(
      (item) => item.bankTransferTransactionId === transaction.bankTransferTransactionId,
    )
      ? current.filter((item) => item.bankTransferTransactionId !== transaction.bankTransferTransactionId)
      : [...current, transaction]);
  };

  const selectedTotal = selectedTransactions.reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={mode === 'edit' ? 'Sửa đối soát thủ công' : 'Xác nhận đối soát thủ công'} size="6xl" customContent>
      <form onSubmit={handleSubmit} className="flex max-h-[calc(100vh-8rem)] flex-col">
        <div className="grid min-h-0 gap-5 overflow-y-auto p-5 lg:grid-cols-2">
          <section className="space-y-5">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-700" />
                <div>
                  <h4 className="font-semibold text-amber-900">{mode === 'edit' ? 'Cập nhật giao dịch đối soát' : 'Xác nhận thanh toán học phí'}</h4>
                  <p className="mt-1 text-sm text-amber-800">{mode === 'edit' ? 'Các giao dịch bỏ chọn sẽ được trả về trạng thái chưa đối soát; giao dịch mới chọn sẽ được admin đối soát.' : 'Học phí sẽ được chuyển sang đã đóng và giao dịch được chọn sẽ được đánh dấu admin đối soát.'}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <p className="text-amber-800">Học phí: <span className="font-semibold">#{payment.paymentId}</span></p>
                <p className="text-amber-800">Số tiền: <span className="font-semibold">{formatMoney(payment.amount)}</span></p>
                <p className="text-amber-800">Kỳ thu: <span className="font-semibold">{payment.month}/{payment.year}</span></p>
                <p className="text-amber-800">Học sinh: <span className="font-semibold">{payment.student?.fullName || '-'}</span></p>
              </div>
            </div>

            {mode === 'confirm' && <Input
              label="Thời điểm thanh toán"
              type="datetime-local"
              value={formData.paidAt}
              onChange={(event) => setFormData((current) => ({ ...current, paidAt: event.target.value }))}
              helperText="Để trống để backend dùng thời gian xác nhận hiện tại."
            />}
            {mode === 'confirm' && <Input
              label="Mã tham chiếu"
              value={formData.reference}
              maxLength={100}
              onChange={(event) => setFormData((current) => ({ ...current, reference: event.target.value }))}
              placeholder="Mã sao kê hoặc mã tham chiếu"
            />}
            {mode === 'confirm' && <Textarea
              label="Lý do / ghi chú đối soát"
              value={formData.reason}
              maxLength={500}
              rows={5}
              onChange={(event) => setFormData((current) => ({ ...current, reason: event.target.value }))}
              placeholder="Ví dụ: Đã kiểm tra sao kê SePay"
            />}

            <div className="rounded-xl border border-border bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><Landmark className="h-4 w-4" /> Giao dịch được chọn</div>
              {selectedTransactions.length > 0 ? (
                <div className="mt-2 space-y-2 text-sm text-foreground-light">
                  <p className="font-semibold text-foreground">Đã chọn {selectedTransactions.length} giao dịch · {formatMoney(selectedTotal)}</p>
                  <div className="max-h-28 space-y-1 overflow-y-auto">
                    {selectedTransactions.map((transaction) => (
                      <p key={transaction.bankTransferTransactionId} className="break-words">
                        #{transaction.bankTransferTransactionId} · {formatMoney(transaction.amount)} · {transaction.providerTransactionId}
                      </p>
                    ))}
                  </div>
                </div>
              ) : <p className="mt-2 text-sm text-foreground-light">Chưa chọn giao dịch ngân hàng để đối soát.</p>}
            </div>
          </section>

          {canSearchTransactions ? (
            <BankTransferTransactionSearch
              selectedIds={selectedTransactions.map((transaction) => transaction.bankTransferTransactionId)}
              onToggle={toggleTransaction}
              initialSearch={`TP${payment.paymentId}`}
              tuitionPaymentId={payment.paymentId}
              initialReconciliationStatus={mode === 'edit' ? '' : 'UNRECONCILED'}
            />
          ) : <NoPermission variant="card" message="Bạn không có quyền xem giao dịch ngân hàng để đối soát." />}
        </div>

        <div className="flex justify-end gap-3 border-t border-border p-4">
          <Button variant="outline" onClick={handleClose} disabled={loading}>Hủy</Button>
          <Button type="submit" loading={loading} disabled={mode === 'edit' && selectedTransactions.length === 0}>
            <ShieldCheck className="h-4 w-4" /> {mode === 'edit' ? 'Lưu đối soát' : 'Xác nhận đã đóng'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
