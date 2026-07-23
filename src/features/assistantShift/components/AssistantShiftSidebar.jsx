import { CalendarClock, Lock, LockKeyhole, Plus, Unlock, UnlockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Button, Checkbox, Input, Modal, Switch } from '../../../shared/components/ui';
import { AssistantShiftMiniCalendar } from './AssistantShiftMiniCalendar';

export const AssistantShiftSidebar = ({ series, visibleSeries, loading, selectedWeekStart, canCreate, canUpdate, canLockWeek, canUnlockWeek, canSetRegistrationWindow, onSelectWeek, onVisibilityChange, onCreate, onUpdate, onLockWeek, onUnlockWeek, onSetRegistrationWindow }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    await onCreate({ name: name.trim(), isLocked });
    setName(''); setIsLocked(false); setOpen(false);
  };

  return <aside className="w-full shrink-0 rounded-xl border border-border bg-white p-4 shadow-sm xl:w-72">
    <div className="flex items-center justify-between"><div><h1 className="text-lg font-semibold text-foreground">Lịch trợ giảng</h1><p className="mt-1 text-xs text-foreground-light">Chuỗi lịch và lớp học</p></div>{canCreate && <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Tạo chuỗi</Button>}</div>
    <AssistantShiftMiniCalendar key={selectedWeekStart.toISOString()} selectedWeekStart={selectedWeekStart} onSelectWeek={onSelectWeek} />
    <div className="mt-5"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-light">Chuỗi lịch</p><div className="space-y-2">{loading ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-10 animate-pulse rounded bg-gray-100" />) : series.map((item) => <div key={item.assistantShiftSeriesId} className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-2 hover:border-border hover:bg-gray-50"><Checkbox id={`series-${item.assistantShiftSeriesId}`} checked={visibleSeries[item.assistantShiftSeriesId] !== false} onChange={(checked) => onVisibilityChange(item.assistantShiftSeriesId, checked)} label={item.name} className="min-w-0 [&_span]:max-w-[130px] [&_span]:truncate" /><div className="flex items-center gap-1">{canUpdate && <button type="button" title={item.isLocked ? 'Mở khóa chuỗi lịch' : 'Khóa chuỗi lịch'} onClick={() => onUpdate(item.assistantShiftSeriesId, { isLocked: !item.isLocked })} className="rounded p-1 text-foreground-light hover:bg-gray-200 hover:text-foreground">{item.isLocked ? <LockKeyhole className="h-4 w-4 text-amber-600" /> : <UnlockKeyhole className="h-4 w-4 text-emerald-600" />}</button>}{canLockWeek && <button type="button" title="Khóa tất cả ca trong tuần" onClick={() => onLockWeek(item)} className="rounded p-1 text-foreground-light hover:bg-gray-200 hover:text-amber-700"><Lock className="h-4 w-4" /></button>}{canUnlockWeek && <button type="button" title="Mở khóa tất cả ca trong tuần" onClick={() => onUnlockWeek(item)} className="rounded p-1 text-foreground-light hover:bg-gray-200 hover:text-emerald-700"><Unlock className="h-4 w-4" /></button>}{canSetRegistrationWindow && <button type="button" title="Đặt cửa sổ tự đăng ký cho tuần đang chọn" onClick={() => onSetRegistrationWindow(item)} className="rounded p-1 text-foreground-light hover:bg-gray-200 hover:text-blue-700"><CalendarClock className="h-4 w-4" /></button>}</div></div>)}{!loading && !series.length && <p className="rounded-lg bg-gray-50 p-3 text-sm text-foreground-light">Chưa có chuỗi lịch. Hãy tạo chuỗi đầu tiên.</p>}</div></div>
    <Modal isOpen={open} onClose={() => setOpen(false)} title="Tạo chuỗi lịch"><form onSubmit={submit} className="space-y-4"><Input label="Tên chuỗi lịch" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Lớp 10" required autoFocus /><div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"><div><p className="text-sm font-medium">Khóa tự đăng ký</p><p className="text-xs text-foreground-light">Quản lý vẫn có thể phân công thủ công.</p></div><Switch checked={isLocked} onChange={setIsLocked} /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button><Button type="submit">Tạo chuỗi</Button></div></form></Modal>
  </aside>;
};
