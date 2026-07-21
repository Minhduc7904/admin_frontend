import { useState } from 'react';
import { Button, RightPanel } from '../../../shared/components/ui';

const toLocalInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

export const SepayTransactionSyncCursorPanel = ({ cursor, isOpen, onClose, onSave, loading }) => {
  const [form, setForm] = useState(() => ({
    lastSinceId: cursor?.lastSinceId || '',
    lastSyncedAt: toLocalInput(cursor?.lastSyncedAt),
    lastErrorAt: toLocalInput(cursor?.lastErrorAt),
    lastErrorMessage: cursor?.lastErrorMessage || '',
  }));
  const [touched, setTouched] = useState({});

  const update = (key, value) => {
    setTouched((current) => ({ ...current, [key]: true }));
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!cursor || !Object.keys(touched).length) return;
    const data = {};
    if (touched.lastSinceId) data.lastSinceId = form.lastSinceId.trim() || null;
    if (touched.lastSyncedAt) data.lastSyncedAt = form.lastSyncedAt ? new Date(form.lastSyncedAt).toISOString() : null;
    if (touched.lastErrorAt) data.lastErrorAt = form.lastErrorAt ? new Date(form.lastErrorAt).toISOString() : null;
    if (touched.lastErrorMessage) data.lastErrorMessage = form.lastErrorMessage.trim() || null;
    onSave(cursor.scope, data);
  };

  return <RightPanel isOpen={isOpen} onClose={onClose} title="Chỉnh checkpoint SePay">
    <form className="space-y-5 p-6" onSubmit={submit}>
      <div><p className="text-sm text-foreground-light">Phạm vi</p><p className="mt-1 font-semibold text-foreground">{cursor?.scope || '—'}</p></div>
      <label className="block text-sm font-medium text-foreground">Last since ID<input value={form.lastSinceId} maxLength={36} onChange={(event) => update('lastSinceId', event.target.value)} className="mt-1 w-full rounded-sm border border-border px-3 py-2 font-normal" /></label>
      <label className="block text-sm font-medium text-foreground">Đồng bộ gần nhất<input type="datetime-local" value={form.lastSyncedAt} onChange={(event) => update('lastSyncedAt', event.target.value)} className="mt-1 w-full rounded-sm border border-border px-3 py-2 font-normal" /></label>
      <label className="block text-sm font-medium text-foreground">Lỗi gần nhất<input type="datetime-local" value={form.lastErrorAt} onChange={(event) => update('lastErrorAt', event.target.value)} className="mt-1 w-full rounded-sm border border-border px-3 py-2 font-normal" /></label>
      <label className="block text-sm font-medium text-foreground">Nội dung lỗi<textarea value={form.lastErrorMessage} maxLength={1000} rows={4} onChange={(event) => update('lastErrorMessage', event.target.value)} className="mt-1 w-full rounded-sm border border-border px-3 py-2 font-normal" /></label>
      <p className="text-xs text-foreground-light">Chỉ trường bạn chỉnh sửa mới được gửi. Xóa nội dung trường để đặt giá trị thành rỗng.</p>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose} disabled={loading}>Hủy</Button><Button type="submit" loading={loading} disabled={!Object.keys(touched).length}>Lưu checkpoint</Button></div>
    </form>
  </RightPanel>;
};
