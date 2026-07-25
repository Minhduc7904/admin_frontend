import { CalendarClock, Lock, LockKeyhole, Plus, Unlock, UnlockKeyhole, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { assistantShiftApi } from '../../../core/api';
import { Button, Checkbox, Input, Modal, Switch } from '../../../shared/components/ui';
import { AssistantShiftAvatar } from './AssistantShiftAvatar';
import { AssistantShiftMiniCalendar } from './AssistantShiftMiniCalendar';

const AssistantList = ({ canGetAssistants, selectedAssistant, assignmentCounts, loadingCounts, onSelect }) => {
  const [assistants, setAssistants] = useState(null);

  useEffect(() => {
    if (!canGetAssistants) return undefined;
    let active = true;
    assistantShiftApi.getEligibleAssistants({ page: 1, limit: 100, sortBy: 'adminId', sortOrder: 'asc' })
      .then((response) => { if (active) setAssistants(response.data?.data || []); })
      .catch((error) => { console.error('Error loading assistants for sidebar:', error); if (active) setAssistants([]); })
    return () => { active = false; };
  }, [canGetAssistants]);

  if (!canGetAssistants) return <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Bạn chưa có quyền xem danh sách trợ giảng.</p>;
  if (assistants === null) return <div className="space-y-2">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-lg bg-gray-100" />)}</div>;
  if (!assistants.length) return <p className="rounded-lg bg-gray-50 p-3 text-sm text-foreground-light">Chưa có trợ giảng có thể được phân công.</p>;

  return <div className="space-y-1.5">{assistants.map((assistant) => {
    const selected = selectedAssistant?.adminId === assistant.adminId;
    return <button key={assistant.adminId} type="button" aria-pressed={selected} onClick={() => onSelect(selected ? null : assistant)} className={`flex w-full items-center justify-between gap-2 rounded-lg border p-2 text-left transition-colors ${selected ? 'border-blue-300 bg-blue-50' : 'border-transparent hover:border-border hover:bg-gray-50'}`}><div className="flex min-w-0 items-center gap-2"><AssistantShiftAvatar admin={assistant} sizeClass="h-8 w-8" textClass="text-[10px]" /><div className="min-w-0"><p className="truncate text-sm font-medium">{assistant.fullName || `Admin #${assistant.adminId}`}</p><p className="truncate text-xs text-foreground-light">{assistant.email || `ID: ${assistant.adminId}`}</p></div></div><span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-foreground-light">{loadingCounts ? '…' : `${assignmentCounts[assistant.adminId] || 0} ca`}</span></button>;
  })}</div>;
};

export const AssistantShiftSidebar = ({ series, visibleSeries, loading, selectedWeekStart, canCreate, canUpdate, canGetAssistants, canLockWeek, canUnlockWeek, canSetRegistrationWindow, selectedAssistant, assistantAssignmentCounts, loadingAssistantAssignmentCounts, tab, onSelectWeek, onSelectAssistant, onTabChange, onVisibilityChange, onCreate, onUpdate, onLockWeek, onUnlockWeek, onSetRegistrationWindow }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const submit = async (event) => { event.preventDefault(); if (!name.trim()) return; await onCreate({ name: name.trim(), isLocked }); setName(''); setIsLocked(false); setOpen(false); };

  return <aside className="w-full shrink-0 rounded-xl border border-border bg-white p-4 shadow-sm xl:w-72 2xl:flex 2xl:h-full 2xl:min-h-0 2xl:flex-col"><div className="flex shrink-0 items-center justify-between"><div><h1 className="text-lg font-semibold text-foreground">Lịch trợ giảng</h1><p className="mt-1 text-xs text-foreground-light">Chuỗi lịch và trợ giảng</p></div>{canCreate && <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Tạo chuỗi</Button>}</div>
    <div className="mt-4 grid shrink-0 grid-cols-2 rounded-lg bg-gray-100 p-1"><button type="button" onClick={() => onTabChange('series')} className={`rounded-md px-2 py-1.5 text-xs font-medium ${tab === 'series' ? 'bg-white text-foreground shadow-sm' : 'text-foreground-light'}`}>Chuỗi lịch</button><button type="button" onClick={() => onTabChange('assistants')} className={`flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium ${tab === 'assistants' ? 'bg-white text-foreground shadow-sm' : 'text-foreground-light'}`}><UsersRound className="h-3.5 w-3.5" />Trợ giảng</button></div>
    <div className="mt-4 min-h-0 2xl:flex-1 2xl:overflow-y-auto 2xl:pr-1">{tab === 'series' ? <><AssistantShiftMiniCalendar key={selectedWeekStart.toISOString()} selectedWeekStart={selectedWeekStart} onSelectWeek={onSelectWeek} /><div className="mt-5"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-light">Chuỗi lịch</p><div className="space-y-2">{loading ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-10 animate-pulse rounded bg-gray-100" />) : series.map((item) => <div key={item.assistantShiftSeriesId} className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-2 hover:border-border hover:bg-gray-50"><Checkbox id={`series-${item.assistantShiftSeriesId}`} checked={visibleSeries[item.assistantShiftSeriesId] !== false} onChange={(checked) => onVisibilityChange(item.assistantShiftSeriesId, checked)} label={item.name} className="min-w-0 [&_span]:max-w-[130px] [&_span]:truncate" /><div className="flex items-center gap-1">{canUpdate && <button type="button" title={item.isLocked ? 'Mở khóa chuỗi lịch' : 'Khóa chuỗi lịch'} onClick={() => onUpdate(item.assistantShiftSeriesId, { isLocked: !item.isLocked })} className="rounded p-1 text-foreground-light hover:bg-gray-200 hover:text-foreground">{item.isLocked ? <LockKeyhole className="h-4 w-4 text-amber-600" /> : <UnlockKeyhole className="h-4 w-4 text-emerald-600" />}</button>}{canLockWeek && <button type="button" title="Khóa tất cả ca trong tuần" onClick={() => onLockWeek(item)} className="rounded p-1 text-foreground-light hover:bg-gray-200 hover:text-amber-700"><Lock className="h-4 w-4" /></button>}{canUnlockWeek && <button type="button" title="Mở khóa tất cả ca trong tuần" onClick={() => onUnlockWeek(item)} className="rounded p-1 text-foreground-light hover:bg-gray-200 hover:text-emerald-700"><Unlock className="h-4 w-4" /></button>}{canSetRegistrationWindow && <button type="button" title="Đặt cửa sổ tự đăng ký cho tuần đang chọn" onClick={() => onSetRegistrationWindow(item)} className="rounded p-1 text-foreground-light hover:bg-gray-200 hover:text-blue-700"><CalendarClock className="h-4 w-4" /></button>}</div></div>)}{!loading && !series.length && <p className="rounded-lg bg-gray-50 p-3 text-sm text-foreground-light">Chưa có chuỗi lịch. Hãy tạo chuỗi đầu tiên.</p>}</div></div></> : <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-light">Trợ giảng trong tuần</p><AssistantList canGetAssistants={canGetAssistants} selectedAssistant={selectedAssistant} assignmentCounts={assistantAssignmentCounts} loadingCounts={loadingAssistantAssignmentCounts} onSelect={onSelectAssistant} /></div>}</div>
    <Modal isOpen={open} onClose={() => setOpen(false)} title="Tạo chuỗi lịch"><form onSubmit={submit} className="space-y-4"><Input label="Tên chuỗi lịch" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Lớp 10" required autoFocus /><div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"><div><p className="text-sm font-medium">Khóa tự đăng ký</p><p className="text-xs text-foreground-light">Quản lý vẫn có thể phân công thủ công.</p></div><Switch checked={isLocked} onChange={setIsLocked} /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button><Button type="submit">Tạo chuỗi</Button></div></form></Modal>
  </aside>;
};
