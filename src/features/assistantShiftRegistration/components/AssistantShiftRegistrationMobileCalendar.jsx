import { Users } from 'lucide-react';
import { useMemo } from 'react';
import { AssistantShiftAvatar } from '../../assistantShift/components';
import { AssistantShiftCurrentTimeIndicator } from '../../assistantShift/components/AssistantShiftCurrentTimeIndicator';

const DAY_NAMES = ['T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7', 'CN'];
const START_HOUR = 4;
const END_HOUR = 23;
const TIME_COLUMN_WIDTH = 76;
const DAY_WIDTH = 118;
const HOUR_HEIGHT = 72;
const ROW_GAP = 4;
const dateKey = (value) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
const minuteOf = (value) => { const date = new Date(value); return date.getHours() * 60 + date.getMinutes(); };
const isToday = (value) => dateKey(value) === dateKey(new Date());
const isMine = (item, profile) => item.adminId === profile?.adminId || item.admin?.adminId === profile?.adminId || item.admin?.userId === profile?.userId;
const bounded = (value) => Math.max(START_HOUR * 60, Math.min(END_HOUR * 60, value));

const createLayout = (items) => {
  const sorted = [...items].sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  const ending = []; const positions = {};
  sorted.forEach((item) => {
    const start = bounded(minuteOf(item.startAt)); const end = Math.max(start + 1, bounded(minuteOf(item.endAt)));
    let lane = ending.findIndex((laneEnd) => laneEnd <= start);
    if (lane < 0) lane = ending.length;
    ending[lane] = end; positions[item.assistantShiftId] = lane;
  });
  return { lanes: Math.max(1, ending.length), positions };
};

const cardPalette = (shift, profile) => {
  const assignments = shift.assignments || [];
  if (shift.isLocked || shift.series?.isLocked || shift.isBaseShift) return 'border-slate-200 bg-slate-100 text-slate-600';
  if (assignments.some((item) => isMine(item, profile))) return 'border-emerald-300 bg-emerald-50 text-emerald-950';
  if (assignments.length >= (shift.requiredAssistantCount || 1)) return 'border-red-300 bg-red-50 text-red-950';
  return 'border-blue-300 bg-blue-50 text-blue-950';
};

const MobileShiftCard = ({ shift, profile, lane, laneCount, onOpenDetail }) => {
  const assignments = shift.assignments || [];
  const note = shift.notes?.trim();
  const start = bounded(minuteOf(shift.startAt)); const end = Math.max(start + 20, bounded(minuteOf(shift.endAt)));
  const top = ((start - START_HOUR * 60) / 60) * (HOUR_HEIGHT + ROW_GAP) + 3;
  const height = Math.max(note ? 70 : 54, ((end - start) / 60) * (HOUR_HEIGHT + ROW_GAP) - 7);
  return <button type="button" onClick={() => onOpenDetail(shift)} aria-label={`Xem chi tiết ca ${shift.name}`} className={`absolute z-10 overflow-hidden rounded-xl border px-2 py-2 text-left shadow-sm transition active:scale-[0.98] ${cardPalette(shift, profile)}`} style={{ top, height, left: `calc(${(lane / laneCount) * 100}% + 3px)`, width: `calc(${100 / laneCount}% - 6px)` }}><p className="truncate text-xs font-bold leading-snug">{shift.name}</p><div className="mt-1 flex items-center justify-between gap-1"><span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-semibold"><Users className="h-3 w-3" />{assignments.length}/{shift.requiredAssistantCount}</span><span className="flex -space-x-1.5 overflow-hidden">{assignments.slice(0, 3).map((item) => <AssistantShiftAvatar key={item.adminId} admin={item.admin} status={item.attendanceStatus} sizeClass="h-4 w-4" textClass="text-[6px]" />)}</span></div>{note && <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-snug opacity-85">{note}</p>}</button>;
};

export const AssistantShiftRegistrationMobileCalendar = ({ days, shifts, loading, profile, onOpenDetail }) => {
  const hours = useMemo(() => Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => START_HOUR + index), []);
  const layouts = useMemo(() => days.map((day) => createLayout(shifts.filter((shift) => dateKey(shift.startAt) === dateKey(day)))), [days, shifts]);
  const totalHeight = (END_HOUR - START_HOUR) * (HOUR_HEIGHT + ROW_GAP);
  const template = `${TIME_COLUMN_WIDTH}px repeat(7, ${DAY_WIDTH}px)`;

  return <section className="relative h-full min-h-0 overflow-auto bg-slate-50" aria-label="Lịch đăng ký theo tuần"><div className="min-w-max"><div className="sticky top-0 z-30 grid bg-white/95 shadow-sm backdrop-blur" style={{ gridTemplateColumns: template }}><div className="sticky left-0 z-40 h-[62px] bg-white" />{days.map((day) => <div key={dateKey(day)} className="flex h-[62px] flex-col items-center justify-center bg-white text-center"><span className={`text-xs font-semibold ${isToday(day) ? 'text-blue-600' : 'text-slate-600'}`}>{DAY_NAMES[(day.getDay() + 6) % 7]}</span><span className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${isToday(day) ? 'bg-blue-700 text-white' : 'text-slate-800'}`}>{day.getDate()}</span></div>)}</div><div className="relative grid" style={{ gridTemplateColumns: template }}><aside className="sticky left-0 z-20 bg-slate-50" style={{ height: totalHeight }}>{hours.slice(0, -1).map((hour) => <div key={hour} className="h-[76px] bg-slate-50 pr-3 pt-1 text-right text-[15px] font-medium text-slate-600">{String(hour).padStart(2, '0')}:00</div>)}<div className="pr-3 text-right text-[15px] font-medium text-slate-600">23:00</div></aside>{days.map((day, index) => { const dayShifts = shifts.filter((shift) => dateKey(shift.startAt) === dateKey(day)); const layout = layouts[index]; return <div key={dateKey(day)} className="relative bg-slate-50 px-[2px]" style={{ height: totalHeight }}>{hours.slice(0, -1).map((hour) => <div key={hour} className="mb-1 h-[72px] rounded-[10px] bg-white" />)}{dayShifts.map((shift) => <MobileShiftCard key={shift.assistantShiftId} shift={shift} profile={profile} lane={layout.positions[shift.assistantShiftId]} laneCount={layout.lanes} onOpenDetail={onOpenDetail} />)}</div>; })}<AssistantShiftCurrentTimeIndicator days={days} startMinute={START_HOUR * 60} endMinute={END_HOUR * 60} position={(minute) => ((minute - START_HOUR * 60) / 60) * (HOUR_HEIGHT + ROW_GAP)} /></div></div>{loading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/20"><span className="rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow">Đang tải lịch...</span></div>}</section>;
};
