import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Save } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { bookApi } from '../../../core/api';
import { Button, Input } from '../../../shared/components/ui';
import { InlineLoading } from '../../../shared/components';
import { addNotification } from '../../notification/store/notificationSlice';

const getData = (response) => response?.data?.data ?? response?.data ?? response;

export const BookSalesContactConfigurationPage = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ phone: '', facebookUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const configuration = getData(await bookApi.getSalesContactConfiguration());
      setForm({ phone: configuration?.phone || '', facebookUrl: configuration?.facebookUrl || '' });
    } catch (requestError) {
      if (requestError?.status !== 404) setError(requestError?.data?.message || requestError?.message || 'Không thể tải cấu hình liên hệ.');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (event) => {
    event.preventDefault();
    if (!form.phone.trim() || !form.facebookUrl.trim()) { setError('Hotline và URL Facebook là bắt buộc.'); return; }
    setSaving(true); setError('');
    try {
      const response = await bookApi.updateSalesContactConfiguration({ phone: form.phone.trim(), facebookUrl: form.facebookUrl.trim() });
      const configuration = getData(response);
      setForm({ phone: configuration?.phone || form.phone, facebookUrl: configuration?.facebookUrl || form.facebookUrl });
      dispatch(addNotification({ type: 'success', title: 'Đã cập nhật liên hệ bán sách', message: 'Thông tin này được dùng cho CTA của toàn bộ catalog.', autoHide: true }));
    } catch (requestError) {
      setError(requestError?.data?.message || requestError?.message || 'Không thể lưu cấu hình liên hệ.');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-4 md:p-6"><InlineLoading message="Đang tải cấu hình liên hệ bán sách..." /></div>;
  return <div className="space-y-5 p-4 md:p-6"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-medium text-amber-700">QUẢN LÝ SÁCH</p><h1 className="mt-1 text-2xl font-semibold text-foreground">Liên hệ bán sách</h1><p className="mt-1 text-sm text-foreground-light">Bắt buộc thiết lập trước khi xuất bản sách để website hiển thị CTA liên hệ mua.</p></div><Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4" /> Làm mới</Button></div><form onSubmit={save} className="max-w-2xl rounded-xl border border-border bg-white shadow-sm"><div className="border-b border-border p-5"><div className="flex gap-3"><AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" /><div><h2 className="font-semibold text-foreground">Kênh liên hệ chung</h2><p className="mt-1 text-sm text-foreground-light">Không lưu đơn hàng hoặc thanh toán; chỉ dùng cho CTA hotline và Facebook.</p></div></div></div><div className="space-y-4 p-5">{error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}<Input label="Hotline" name="phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} required maxLength={20} placeholder="0901234567" /><Input label="URL Facebook" name="facebookUrl" type="url" value={form.facebookUrl} onChange={(event) => setForm((current) => ({ ...current, facebookUrl: event.target.value }))} required maxLength={255} placeholder="https://www.facebook.com/..." /></div><div className="flex justify-end border-t border-border bg-gray-50 p-4"><Button type="submit" loading={saving}><Save className="h-4 w-4" /> Lưu cấu hình</Button></div></form></div>;
};
