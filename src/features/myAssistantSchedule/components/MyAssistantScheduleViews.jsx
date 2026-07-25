import { LockKeyhole } from 'lucide-react';
import { AssistantShiftAvatar } from '../../assistantShift/components';

const DAY_NAMES = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'];
const dateKey = (value) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
const timeLabel = (value) => new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const isToday = (date) => dateKey(date) === dateKey(new Date());
const assignmentOfMine = (shift) => shift.assignments?.[0];
const statusStyle = { PENDING: 'border-amber-300 bg-amber-50 text-amber-950', PRESENT: 'border-emerald-300 bg-emerald-50 text-emerald-950', ABSENT: 'border-red-300 bg-red-50 text-red-950' };
const LANE_WIDTH = 210;

const groupOverlapping = (items) => {
  const sorted = [...items].sort((a, b) => new Date(a.startAt) - new Date(b.startAt)); const groups = [];
  sorted.forEach((shift) => {
    const start = new Date(shift.startAt).getTime();
    if (groups.length === 0) { groups.push([shift]); } else {
      const lastGroup = groups[groups.length - 1]; const lastGroupEnd = Math.max(...lastGroup.map((s) => new Date(s.endAt).getTime()));
      if (start < lastGroupEnd) lastGroup.push(shift); else groups.push([shift]);
    }
  });
  return groups;
};

export const MyAssistantShiftCard = ({ shift, compact = false }) => {
  const assignment = assignmentOfMine(shift); const status = assignment?.attendanceStatus || 'PENDING';
  return <article className={`rounded-lg border p-2 shadow-sm ${statusStyle[status] || statusStyle.PENDING}`}><div className="flex items-start justify-between gap-1"><p title={shift.name} className={`min-w-0 font-semibold ${compact ? 'line-clamp-1 text-[11px]' : 'line-clamp-2 text-sm leading-snug'}`}>{shift.name}</p>{shift.isLocked && <LockKeyhole className="mt-0.5 h-3 w-3 shrink-0 text-amber-700" />}</div><p className="mt-0.5 text-[10px] font-medium opacity-75">{timeLabel(shift.startAt)} – {timeLabel(shift.endAt)}</p>{!compact && <><p title={shift.courseClass?.name || shift.courseClass?.className || shift.series?.name} className="mt-1 line-clamp-2 text-xs opacity-75">{shift.courseClass?.name || shift.courseClass?.className || shift.series?.name}</p><div className="mt-2 flex items-center gap-1.5"><AssistantShiftAvatar admin={assignment?.admin} status={status} sizeClass="h-5 w-5" textClass="text-[8px]" /><span className="text-[11px] font-medium">{status === 'PRESENT' ? 'Có mặt' : status === 'ABSENT' ? 'Vắng' : 'Chờ xác nhận'}</span></div></>}</article>;
};

export const MyAssistantWeekView = ({ days, shifts, loading }) => {
  const layouts = days.map((day) => {
    const items = shifts.filter((shift) => dateKey(shift.startAt) === dateKey(day));
    const groups = groupOverlapping(items);
    return groups.reduce((max, group) => Math.max(max, group.length), 1);
  });
  const template = layouts.map((lanes) => `minmax(${lanes * LANE_WIDTH}px, 1fr)`).join(' ');
  const minWidth = `${layouts.reduce((sum, lanes) => sum + lanes * LANE_WIDTH, 0)}px`;

  return (
    <section className="relative min-h-0 flex-1 overflow-auto rounded-xl border border-border bg-white shadow-sm">
      <div style={{ minWidth }}>
        <div className="grid divide-x divide-border" style={{ gridTemplateColumns: template }}>
          {days.map((day) => {
            const items = shifts.filter((shift) => dateKey(shift.startAt) === dateKey(day)).sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
            return (
              <div key={dateKey(day)} className="min-h-[650px] bg-gray-50/30">
                <header className={`sticky top-0 z-10 border-b border-border px-3 py-3 text-center ${isToday(day) ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                  <p className="text-xs font-medium opacity-75">{DAY_NAMES[(day.getDay() + 6) % 7]}</p>
                  <p className="mt-0.5 text-lg font-semibold">{day.getDate()}</p>
                </header>
                <div className="flex flex-col gap-3 p-2">
                  {groupOverlapping(items).map((group, groupIdx) => (
                    <div key={groupIdx} className="flex flex-row gap-2">
                      {group.map((shift) => (
                        <div key={shift.assistantShiftId} className="min-w-0 flex-1">
                          <MyAssistantShiftCard shift={shift} />
                        </div>
                      ))}
                    </div>
                  ))}
                  {!items.length && !loading && <p className="pt-8 text-center text-xs text-foreground-light">Không có ca</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/25">
          <span className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow">Đang tải lịch…</span>
        </div>
      )}
    </section>
  );
};

export const MyAssistantMonthView = ({ days, cursor, shifts, loading }) => <section className="relative min-h-0 flex-1 overflow-auto rounded-xl border border-border bg-white shadow-sm"><div className="min-w-[1120px]"><div className="grid grid-cols-7 border-b border-border bg-gray-50">{DAY_NAMES.map((name) => <div key={name} className="px-3 py-3 text-center text-sm font-semibold text-foreground-light">{name}</div>)}</div><div className="grid grid-cols-7">{days.map((day) => { const inMonth = day.getMonth() === cursor.getMonth(); const items = shifts.filter((shift) => dateKey(shift.startAt) === dateKey(day)).sort((a, b) => new Date(a.startAt) - new Date(b.startAt)); return <div key={dateKey(day)} className={`min-h-[175px] border-b border-r border-border p-2 ${inMonth ? 'bg-white' : 'bg-gray-50/60'} ${isToday(day) ? 'ring-2 ring-inset ring-blue-500' : ''}`}><p className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${isToday(day) ? 'bg-blue-600 text-white' : inMonth ? 'text-foreground' : 'text-foreground-light'}`}>{day.getDate()}</p><div className="space-y-1.5">{items.map((shift) => <MyAssistantShiftCard key={shift.assistantShiftId} shift={shift} compact />)}</div></div>; })}</div></div>{loading && <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/25"><span className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow">Đang tải lịch…</span></div>}</section>;
