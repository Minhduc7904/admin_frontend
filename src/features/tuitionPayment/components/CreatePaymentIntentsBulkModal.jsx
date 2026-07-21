import { useState } from 'react';
import { Layers3 } from 'lucide-react';
import { Button, Input, Modal } from '../../../shared/components/ui';

export const CreatePaymentIntentsBulkModal = ({ isOpen, onClose, onConfirm, loading, initialValues }) => {
  const [form, setForm] = useState(() => ({ grade: initialValues?.grade || '', month: initialValues?.month || '', year: initialValues?.year || new Date().getFullYear() }));
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    onConfirm({ grade: Number(form.grade), month: Number(form.month), year: Number(form.year) });
  };
  return <Modal isOpen={isOpen} onClose={() => !loading && onClose()} title="Tạo payment intent hàng loạt">
    <form className="space-y-5" onSubmit={submit}>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800"><Layers3 className="mr-2 inline h-4 w-4" />Chỉ tạo intent còn thiếu cho học phí chưa đóng, có số tiền dương. Không tạo payment attempt hoặc QR.</div>
      <Input label="Khối" type="number" min="1" max="12" required value={form.grade} onChange={(event) => update('grade', event.target.value)} />
      <Input label="Tháng" type="number" min="1" max="12" required value={form.month} onChange={(event) => update('month', event.target.value)} />
      <Input label="Năm" type="number" min="2000" required value={form.year} onChange={(event) => update('year', event.target.value)} />
      <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={onClose} disabled={loading}>Hủy</Button><Button type="submit" loading={loading}>Tạo intent</Button></div>
    </form>
  </Modal>;
};
