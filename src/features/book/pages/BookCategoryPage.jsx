import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { bookApi } from '../../../core/api';
import { PERMISSIONS } from '../../../core/constants';
import { Button, Checkbox, ConfirmModal, Input, Modal, Table, Textarea } from '../../../shared/components/ui';
import { useHasPermission } from '../../../shared/hooks';
import { addNotification } from '../../notification/store/notificationSlice';

const blankCategory = { name: '', slug: '', description: '', isActive: true, sortOrder: '0' };
const getData = (response) => response?.data?.data ?? response?.data ?? response;

export const BookCategoryPage = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankCategory);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const canCreate = useHasPermission(PERMISSIONS.BOOK_CATEGORY.CREATE);
  const canUpdate = useHasPermission(PERMISSIONS.BOOK_CATEGORY.UPDATE);
  const canDelete = useHasPermission(PERMISSIONS.BOOK_CATEGORY.DELETE);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(getData(await bookApi.getCategories()) || []); }
    catch (requestError) { dispatch(addNotification({ type: 'error', title: 'Không thể tải loại sách', message: requestError?.data?.message || requestError?.message, autoHide: true })); }
    finally { setLoading(false); }
  }, [dispatch]);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing('create'); setForm(blankCategory); setError(''); };
  const openEdit = (category) => { setEditing(category); setForm({ name: category.name || '', slug: category.slug || '', description: category.description || '', isActive: Boolean(category.isActive), sortOrder: String(category.sortOrder || 0) }); setError(''); };
  const closeForm = () => { if (!saving) setEditing(null); };
  const change = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) { setError('Tên loại sách là bắt buộc.'); return; }
    setSaving(true); setError('');
    const payload = { name: form.name.trim(), slug: form.slug.trim() || undefined, description: form.description.trim() || undefined, isActive: form.isActive, sortOrder: Number(form.sortOrder || 0) };
    try {
      if (editing === 'create') await bookApi.createCategory(payload);
      else await bookApi.updateCategory(editing.bookCategoryId, payload);
      dispatch(addNotification({ type: 'success', title: editing === 'create' ? 'Đã tạo loại sách' : 'Đã cập nhật loại sách', message: 'Thay đổi sẽ áp dụng cho catalog sách.', autoHide: true }));
      setEditing(null); await load();
    } catch (requestError) {
      setError(requestError?.data?.message || requestError?.message || 'Không thể lưu loại sách.');
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await bookApi.deleteCategory(deleteTarget.bookCategoryId);
      setDeleteTarget(null);
      dispatch(addNotification({ type: 'success', title: 'Đã xóa loại sách', message: 'Loại sách không còn được sử dụng đã được xóa.', autoHide: true }));
      await load();
    } catch (requestError) {
      dispatch(addNotification({ type: 'error', title: 'Không thể xóa loại sách', message: requestError?.data?.message || requestError?.message, autoHide: true }));
    } finally { setDeleting(false); }
  };

  const columns = useMemo(() => [
    { key: 'name', label: 'Loại sách', render: (category) => <div><p className="font-medium text-foreground">{category.name}</p><p className="text-xs text-foreground-light">/{category.slug}</p></div> },
    { key: 'description', label: 'Mô tả', render: (category) => <span className="text-sm text-foreground-light">{category.description || '-'}</span> },
    { key: 'sortOrder', label: 'Thứ tự', align: 'center' },
    { key: 'isActive', label: 'Trạng thái', align: 'center', render: (category) => <span className={`rounded-full px-2 py-1 text-xs font-medium ${category.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>{category.isActive ? 'Đang hoạt động' : 'Đã ngừng'}</span> },
    { key: 'actions', label: '', align: 'right', render: (category) => <div className="flex justify-end gap-2">{canUpdate && <Button size="sm" variant="outline" onClick={() => openEdit(category)}><Edit3 className="h-4 w-4" /> Sửa</Button>}{canDelete && <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(category)}><Trash2 className="h-4 w-4" /> Xóa</Button>}</div> },
  ], [canDelete, canUpdate]);

  return <div className="space-y-5 p-4 md:p-6"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-medium text-amber-700">QUẢN LÝ SÁCH</p><h1 className="mt-1 text-2xl font-semibold text-foreground">Loại sách</h1><p className="mt-1 text-sm text-foreground-light">Sắp xếp và bật/tắt loại sách để dùng trong catalog công khai.</p></div><div className="flex gap-2"><Button variant="outline" onClick={load} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới</Button>{canCreate && <Button onClick={openCreate}><Plus className="h-4 w-4" /> Tạo loại sách</Button>}</div></div><div className="overflow-hidden rounded-xl border border-border bg-white"><Table columns={columns} data={categories} loading={loading} emptyMessage="Chưa có loại sách" emptySubMessage="Tạo loại sách trước khi thêm sách vào catalog." /></div><Modal isOpen={Boolean(editing)} onClose={closeForm} title={editing === 'create' ? 'Tạo loại sách' : 'Chỉnh sửa loại sách'} size="lg"><form onSubmit={save} className="space-y-4">{error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}<Input label="Tên loại sách" name="name" value={form.name} onChange={(event) => change('name', event.target.value)} required /><Input label="Slug" name="slug" value={form.slug} onChange={(event) => change('slug', event.target.value)} helperText="Để trống để backend tự tạo từ tên." /><Textarea label="Mô tả" name="description" value={form.description} onChange={(event) => change('description', event.target.value)} rows={3} /><Input label="Thứ tự hiển thị" name="sortOrder" type="number" min="0" value={form.sortOrder} onChange={(event) => change('sortOrder', event.target.value)} /><Checkbox id="book-category-active" checked={form.isActive} onChange={(checked) => change('isActive', checked)} label="Loại sách đang hoạt động" /><div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={closeForm} disabled={saving}>Hủy</Button><Button type="submit" loading={saving}>Lưu</Button></div></form></Modal><ConfirmModal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} isLoading={deleting} title="Xóa loại sách" message={`Bạn có chắc muốn xóa “${deleteTarget?.name || ''}”? Nếu loại đang được dùng, hãy ngừng hoạt động thay vì xóa.`} confirmText="Xóa loại" variant="danger" /></div>;
};
