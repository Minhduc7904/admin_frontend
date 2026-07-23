import { CalendarClock, LockKeyhole, Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ClassSearchSelect } from '../../courseClass/components';
import { Button, Input, RightPanel, Switch, Textarea } from '../../../shared/components/ui';
import { AssistantShiftAssignmentManager } from './AssistantShiftAssignmentManager';

const pad = (value) => String(value).padStart(2, '0');
const toDateInput = (value) => { const date = value ? new Date(value) : new Date(); return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; };
const toTimeInput = (value) => { const date = value ? new Date(value) : new Date(); return `${pad(date.getHours())}:${pad(date.getMinutes())}`; };
const toDateTimeInput = (value) => { if (!value) return ''; const date = new Date(value); return `${toDateInput(date)}T${toTimeInput(date)}`; };
const emptyForm = (draft) => {
  const value = draft || {};
  return {
  assistantShiftSeriesId: value.assistantShiftSeriesId || '', classId: value.classId || '', selectedClass: value.courseClass || null,
  name: value.name || '', date: toDateInput(value.startAt), startTime: toTimeInput(value.startAt), endTime: toTimeInput(value.endAt || new Date(new Date().getTime() + 60 * 60 * 1000)),
  requiredAssistantCount: value.requiredAssistantCount || 1, notes: value.notes || '', isLocked: Boolean(value.isLocked),
  selfRegistrationOpenAt: toDateTimeInput(value.selfRegistrationOpenAt), selfRegistrationCloseAt: toDateTimeInput(value.selfRegistrationCloseAt),
  };
};
const toIso = (date, time) => new Date(`${date}T${time}`).toISOString();

export const AssistantShiftDrawer = ({ open, onClose, shift, loadingDetail, series, saving, permissions, onSave, onDelete, onAddAssignment, onUpdateAssignment, onDeleteAssignment }) => {
  const [form, setForm] = useState(() => emptyForm(shift)); const [error, setError] = useState('');
  const isEdit = Boolean(shift?.assistantShiftId);
  const assignments = useMemo(() => shift?.assignments || [], [shift]);
  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => { event.preventDefault();
    if (!form.assistantShiftSeriesId || !form.name.trim() || !form.date || !form.startTime || !form.endTime) { setError('Vui lòng điền chuỗi lịch, tên ca, ngày và thời gian.'); return; }
    const startAt = toIso(form.date, form.startTime); const endAt = toIso(form.date, form.endTime);
    if (new Date(endAt) <= new Date(startAt)) { setError('Giờ kết thúc phải sau giờ bắt đầu.'); return; }
    setError(''); await onSave({ assistantShiftSeriesId: Number(form.assistantShiftSeriesId), classId: form.classId ? Number(form.classId) : null, name: form.name.trim(), startAt, endAt, requiredAssistantCount: Number(form.requiredAssistantCount), notes: form.notes.trim() || null, isLocked: form.isLocked, selfRegistrationOpenAt: form.selfRegistrationOpenAt ? new Date(form.selfRegistrationOpenAt).toISOString() : null, selfRegistrationCloseAt: form.selfRegistrationCloseAt ? new Date(form.selfRegistrationCloseAt).toISOString() : null });
  };
  const canSave = isEdit ? permissions.update : permissions.create;
  return <RightPanel isOpen={open} onClose={onClose} title={isEdit ? 'Chỉnh sửa ca trợ giảng' : 'Tạo ca trợ giảng'} width="w-full max-w-2xl"><form onSubmit={submit} className="space-y-5 p-5">
    {loadingDetail ? <div className="space-y-4 animate-pulse"><div className="h-10 rounded bg-gray-100" /><div className="h-10 rounded bg-gray-100" /><div className="h-48 rounded bg-gray-100" /></div> : <>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800"><CalendarClock className="mr-2 inline h-4 w-4" />Dùng cùng panel cho tạo và điều chỉnh ca. Chỉ các thao tác có quyền mới xuất hiện.</div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-medium text-foreground">Chuỗi lịch <span className="text-red-500">*</span><select disabled={!canSave || saving} value={form.assistantShiftSeriesId} onChange={(event) => change('assistantShiftSeriesId', event.target.value)} className="mt-1 w-full rounded-sm border border-border bg-primary px-3 py-2 text-sm"><option value="">Chọn chuỗi lịch</option>{series.map((item) => <option key={item.assistantShiftSeriesId} value={item.assistantShiftSeriesId}>{item.name}{item.isLocked ? ' (đang khóa)' : ''}</option>)}</select></label><ClassSearchSelect label="Lớp học" value={form.selectedClass} disabled={!canSave || saving} onSelect={(courseClass) => setForm((current) => ({ ...current, selectedClass: courseClass, classId: courseClass?.classId || '', name: current.name.trim() ? current.name : (courseClass?.className || '') }))} /></div>
      <Input label="Tên ca" value={form.name} onChange={(event) => change('name', event.target.value)} placeholder="Ví dụ: Trợ giảng Toán" required disabled={!canSave || saving} />
      <div className="grid gap-4 md:grid-cols-3"><Input label="Ngày" type="date" value={form.date} onChange={(event) => change('date', event.target.value)} required disabled={!canSave || saving} /><Input label="Bắt đầu" type="time" value={form.startTime} onChange={(event) => change('startTime', event.target.value)} required disabled={!canSave || saving} /><Input label="Kết thúc" type="time" value={form.endTime} onChange={(event) => change('endTime', event.target.value)} required disabled={!canSave || saving} /></div>
      <Input label="Số trợ giảng cần" type="number" min="1" value={form.requiredAssistantCount} onChange={(event) => change('requiredAssistantCount', event.target.value)} required disabled={!canSave || saving} />
      <Textarea label="Ghi chú" value={form.notes} onChange={(event) => change('notes', event.target.value)} placeholder="Thông tin cần lưu ý cho ca này" disabled={!canSave || saving} rows={3} maxLength={1000} />
      <div className="rounded-lg border border-border p-3"><div className="flex items-center justify-between gap-3"><div><p className="flex items-center gap-1 text-sm font-medium"><LockKeyhole className="h-4 w-4 text-amber-600" />Trạng thái khóa</p><p className="text-xs text-foreground-light">Khóa ca để ngăn trợ giảng tự đăng ký.</p></div><Switch checked={form.isLocked} onChange={(value) => change('isLocked', value)} disabled={!canSave || saving} /></div><div className="mt-4 grid gap-4 md:grid-cols-2"><Input label="Mở tự đăng ký" type="datetime-local" value={form.selfRegistrationOpenAt} onChange={(event) => change('selfRegistrationOpenAt', event.target.value)} disabled={!canSave || saving} /><Input label="Đóng tự đăng ký" type="datetime-local" value={form.selfRegistrationCloseAt} onChange={(event) => change('selfRegistrationCloseAt', event.target.value)} disabled={!canSave || saving} /></div></div>
      {isEdit && <AssistantShiftAssignmentManager assignments={assignments} disabled={saving} loading={permissions.assignmentLoading} canAssign={permissions.assign} canUpdate={permissions.updateAssignment} canDelete={permissions.deleteAssignment} onAdd={onAddAssignment} onUpdate={onUpdateAssignment} onDelete={onDeleteAssignment} />}
      <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-5"><div>{isEdit && permissions.delete && <Button type="button" variant="danger" onClick={() => { if (window.confirm('Bạn có chắc muốn xóa ca trợ giảng này?')) onDelete(); }} disabled={saving}><Trash2 className="h-4 w-4" />Xóa ca</Button>}</div><div className="flex gap-2"><Button type="button" variant="outline" onClick={onClose}>Đóng</Button>{canSave && <Button type="submit" loading={saving}><Save className="h-4 w-4" />Lưu</Button>}</div></div>
    </>}
  </form></RightPanel>;
};
