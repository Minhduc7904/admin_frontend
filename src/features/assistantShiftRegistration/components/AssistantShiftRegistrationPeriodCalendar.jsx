import { LockKeyhole, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AssistantShiftAvatar } from '../../assistantShift/components';
import { useDragToScroll } from '../../../shared/hooks';

const DAY_NAMES = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'];
const START = 7 * 60;
const END = 22 * 60;
const BASE_PERIOD_HEIGHT = 220;
const LANE_WIDTH = 210;
const PERIODS = [
  { label: 'Sáng', range: '07:00 - 12:00', start: 7 * 60, end: 12 * 60 },
  { label: 'Chiều', range: '12:00 - 18:00', start: 12 * 60, end: 18 * 60 },
  { label: 'Tối', range: '18:00 - 22:00', start: 18 * 60, end: 22 * 60 },
];

const dateKey = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const timeLabel = (value) => new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const minuteOf = (value) => { const date = new Date(value); return date.getHours() * 60 + date.getMinutes(); };
const bounded = (value) => Math.max(START, Math.min(END, value));
const displayInterval = (shift) => {
  const start = bounded(minuteOf(shift.startAt));
  const end = Math.max(start + 1, bounded(minuteOf(shift.endAt)));
  return { start, end };
};
const isToday = (day) => dateKey(day) === dateKey(new Date());
const isMine = (item, profile) => item.adminId === profile?.adminId
  || item.admin?.adminId === profile?.adminId || item.admin?.userId === profile?.userId;
const countdownLabel = (target, now) => {
  const totalSeconds = Math.max(0, Math.ceil((new Date(target).getTime() - now.getTime()) / 1000));
  const days = Math.floor(totalSeconds / 86_400); const hours = Math.floor((totalSeconds % 86_400) / 3_600); const minutes = Math.floor((totalSeconds % 3_600) / 60); const seconds = totalSeconds % 60;
  return `${days ? `${days} ngày ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
const requiredCardHeight = (shift) => Math.max(212, 166 + (shift.assignments?.length || 0) * 30);

const createLayout = (items) => {
  const sorted = [...items].sort((a, b) => displayInterval(a).start - displayInterval(b).start); const ending = []; const output = {};
  sorted.forEach((item) => { const { start, end } = displayInterval(item); let lane = ending.findIndex((laneEnd) => laneEnd <= start); if (lane < 0) lane = ending.length; ending[lane] = end; output[item.assistantShiftId] = lane; });
  return { lanes: Math.max(1, ending.length), positions: output };
};

const createScale = (shifts) => {
  const rates = PERIODS.map((period) => BASE_PERIOD_HEIGHT / (period.end - period.start));

  shifts.forEach((shift) => {
    const { start, end } = displayInterval(shift);
    const requiredRate = requiredCardHeight(shift) / (end - start);

    PERIODS.forEach((period, index) => {
      const overlap = Math.max(0, Math.min(end, period.end) - Math.max(start, period.start));
      if (overlap > 0) rates[index] = Math.max(rates[index], requiredRate);
    });
  });

  const heights = PERIODS.map((period, index) => (period.end - period.start) * rates[index]);
  const position = (minute) => {
    const value = bounded(minute);
    if (value === END) return heights.reduce((sum, height) => sum + height, 0);
    const index = PERIODS.findIndex((period) => value >= period.start && value < period.end);
    const safeIndex = index < 0 ? 0 : index;
    const period = PERIODS[safeIndex];
    return heights.slice(0, safeIndex).reduce((sum, height) => sum + height, 0)
      + ((value - period.start) / (period.end - period.start)) * heights[safeIndex];
  };

  return { heights, position, totalHeight: heights.reduce((sum, value) => sum + value, 0) };
};

const RegistrationShiftCard = ({ shift, compact, profile, now, actionShiftId, pendingActionShiftIds, canRegister, canCancel, canTransfer, canSwap, onRegister, onCancel, onTransfer, onSwap }) => {
  const assignments = shift.assignments || [];
  const ownAssignment = assignments.find((item) => isMine(item, profile));
  const joined = Boolean(ownAssignment);
  const full = assignments.length >= (shift.requiredAssistantCount || 1);
  const isPast = new Date(shift.endAt).getTime() <= now.getTime();
  const isBusy = actionShiftId === shift.assistantShiftId;
  const canManageOwnAssignment = ownAssignment?.attendanceStatus === 'PENDING' && (canCancel || canTransfer);
  const nextExchangeRequestAllowedAt = ownAssignment?.nextExchangeRequestAllowedAt;
  const nextExchangeRequestAllowedAtMs = new Date(nextExchangeRequestAllowedAt).getTime();
  const waitingForExchange = Boolean(ownAssignment?.isPendingExchangeRequest) && (!Number.isFinite(nextExchangeRequestAllowedAtMs) || nextExchangeRequestAllowedAtMs > now.getTime());
  const hasPendingExchangeRequest = waitingForExchange || pendingActionShiftIds.includes(shift.assistantShiftId);
  const exchangeCountdown = waitingForExchange && Number.isFinite(nextExchangeRequestAllowedAtMs) ? countdownLabel(nextExchangeRequestAllowedAt, now) : '';
  const persistentLockReason = hasPendingExchangeRequest ? (exchangeCountdown ? `Đã gửi email, có thể gửi lại sau ${exchangeCountdown}` : 'Đã gửi email, đang chờ xác nhận')
    : !isPast && (
    shift.isLocked || shift.series?.isLocked || shift.isBaseShift ? 'Ca đã khóa'
      : !joined && full ? (!canSwap ? 'Ca đã đủ trợ giảng' : '')
        : !joined && !canRegister ? 'Không có quyền đăng ký'
          : joined && !canManageOwnAssignment ? (ownAssignment?.attendanceStatus !== 'PENDING' ? 'Ca đã được điểm danh' : 'Đã đăng ký') : ''
  );
  const canAct = !isBusy && !isPast && !persistentLockReason;
  const palette = hasPendingExchangeRequest
    ? 'border-violet-300 bg-violet-50 text-violet-950'
    : persistentLockReason
    ? 'border-gray-300 bg-gray-100 text-gray-600'
    : joined ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
      : full ? 'border-red-300 bg-red-50 text-red-950'
        : 'border-blue-300 bg-blue-50 text-blue-950';
  const actionOverlay = joined ? 'bg-amber-400/95 text-amber-950' : full ? 'bg-red-600/95 text-white' : 'bg-blue-600/95 text-white';

  return (
    <article className={`group relative h-full w-full overflow-hidden rounded-xl border p-3 text-left shadow-sm transition hover:z-20 hover:shadow-md ${canAct ? '' : 'cursor-not-allowed'} ${palette}`}>
      <div className={`flex h-full flex-col ${persistentLockReason ? 'opacity-45' : ''}`}>
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{shift.name}</p>
        <div className="mt-1 flex items-center justify-between gap-2 text-sm font-semibold opacity-80"><span>{timeLabel(shift.startAt)} - {timeLabel(shift.endAt)}</span><span className="flex shrink-0 items-center gap-1 rounded-full bg-white/65 px-2 py-1 text-[10px] font-semibold"><Users className="h-3.5 w-3.5" />{assignments.length}/{shift.requiredAssistantCount}</span></div>
        <p className="mt-2 truncate text-[11px] opacity-75">{shift.courseClass?.className || shift.courseClass?.name || shift.series?.name || 'Ca trợ giảng'}</p>
        <div className={`mt-2 rounded-lg bg-white/60 px-2 py-2 text-xs font-bold leading-snug ${compact ? 'line-clamp-3' : 'line-clamp-4'}`}><span className="mr-1">Ghi chú:</span>{shift.notes || 'Chưa có ghi chú công việc.'}</div>
        <div className="mt-2 space-y-1 overflow-hidden">{assignments.length ? assignments.map((item) => <div key={item.adminId} className="flex min-w-0 items-center gap-1.5"><AssistantShiftAvatar admin={item.admin} status={item.attendanceStatus} sizeClass="h-5 w-5" textClass="text-[8px]" /><span title={item.admin?.fullName || `Admin #${item.adminId}`} className={`min-w-0 text-[11px] font-medium ${compact ? 'truncate' : 'line-clamp-2 leading-snug'}`}>{item.admin?.fullName || `Admin #${item.adminId}`}</span></div>) : <p className="text-[11px] font-medium opacity-65">Chưa có trợ giảng đăng ký</p>}</div>
      </div>
      {persistentLockReason && <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-3 text-center ${hasPendingExchangeRequest ? 'pointer-events-none bg-violet-700/20 opacity-0 transition-opacity group-hover:opacity-100' : 'bg-gray-500/35 backdrop-grayscale'}`}><span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow"><LockKeyhole className="h-5 w-5" /></span><span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">{persistentLockReason}</span></div>}
      {isPast && !persistentLockReason && <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-800/85 px-3 text-center text-white opacity-0 transition-opacity group-hover:opacity-100"><LockKeyhole className="h-6 w-6" /><span className="text-sm font-semibold">Ca đã qua</span></div>}
      {canAct && joined && <div className={`absolute inset-0 z-20 grid overflow-hidden text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100 ${canCancel && canTransfer ? 'grid-cols-2' : 'grid-cols-1'}`}>{canCancel && <button type="button" onClick={() => onCancel(shift.assistantShiftId)} className="bg-amber-400/95 text-amber-950 transition hover:bg-amber-500">{isBusy ? 'Đang xử lý...' : 'Hủy ca'}</button>}{canTransfer && <button type="button" onClick={() => onTransfer(shift)} className="bg-violet-600/95 text-white transition hover:bg-violet-700">Nhường ca</button>}</div>}
      {canAct && !joined && full && canSwap && <button type="button" onClick={() => onSwap(shift)} className="absolute inset-0 z-20 flex items-center justify-center bg-red-600/95 text-sm font-semibold text-white opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100">Đổi ca</button>}
      {canAct && !joined && !full && <button type="button" onClick={() => onRegister(shift.assistantShiftId)} className={`absolute inset-0 z-20 flex items-center justify-center text-sm font-semibold opacity-0 transition-opacity hover:brightness-95 group-hover:opacity-100 ${actionOverlay}`}>{isBusy ? 'Đang xử lý...' : 'Đăng ký'}</button>}
    </article>
  );
};

export const AssistantShiftRegistrationPeriodCalendar = ({ days, shifts, loading, profile, actionShiftId, pendingActionShiftIds = [], canRegister, canCancel, canTransfer, canSwap, onRegister, onCancel, onTransfer, onSwap }) => {
  const scale = useMemo(() => createScale(shifts), [shifts]);
  const [now, setNow] = useState(() => new Date());
  const { dragProps, isDragging } = useDragToScroll();
  const layouts = useMemo(() => days.map((day) => createLayout(shifts.filter((shift) => dateKey(shift.startAt) === dateKey(day)))), [days, shifts]);
  const template = `92px ${layouts.map((layout) => `minmax(${layout.lanes * LANE_WIDTH}px, 1fr)`).join(' ')}`;
  const totalMinWidth = useMemo(() => `calc(92px + ${layouts.reduce((sum, layout) => sum + layout.lanes * LANE_WIDTH, 0)}px)`, [layouts]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section {...dragProps} className={`relative min-h-0 overflow-auto rounded-xl border border-border bg-white shadow-sm ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}>
      <div style={{ minWidth: totalMinWidth }}>
        <div className="sticky top-0 z-20 grid border-b border-border bg-gray-50" style={{ gridTemplateColumns: template }}>
          <div />
          {days.map((day) => (
            <div key={dateKey(day)} className={`border-l border-border px-3 py-3 text-center ${isToday(day) ? 'bg-blue-600 text-white' : ''}`}>
              <p className="text-xs font-medium opacity-75">{DAY_NAMES[(day.getDay() + 6) % 7]}</p>
              <p className="mt-0.5 text-lg font-semibold">{day.getDate()}</p>
            </div>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: template }}>
          <aside className="border-r border-border bg-gray-50" style={{ height: scale.totalHeight }}>
            {PERIODS.map((period, index) => (
              <div key={period.label} className={`flex flex-col justify-center px-3 ${index < PERIODS.length - 1 ? 'border-b border-border' : ''}`} style={{ height: scale.heights[index] }}>
                <p className="text-sm font-semibold text-foreground">{period.label}</p>
                <p className="text-[11px] text-foreground-light">{period.range}</p>
              </div>
            ))}
          </aside>
          {days.map((day, index) => {
            const dayShifts = shifts.filter((shift) => dateKey(shift.startAt) === dateKey(day));
            const layout = layouts[index];
            return (
              <div key={dateKey(day)} className="relative border-r border-border bg-white" style={{ height: scale.totalHeight }}>
                {PERIODS.slice(1).map((period) => (
                  <span key={period.label} className="pointer-events-none absolute inset-x-0 border-t border-border" style={{ top: scale.position(period.start) }} />
                ))}
                {dayShifts.map((shift) => {
                  const { start, end } = displayInterval(shift);
                  const lane = layout.positions[shift.assistantShiftId];
                  return (
                    <div
                      key={shift.assistantShiftId}
                      className="absolute"
                      style={{
                        top: scale.position(start),
                        height: scale.position(end) - scale.position(start),
                        left: `calc(${(lane / layout.lanes) * 100}% + 4px)`,
                        width: `calc(${100 / layout.lanes}% - 8px)`,
                      }}
                    >
                      <RegistrationShiftCard
                        shift={shift}
                        compact={layout.lanes > 1}
                        profile={profile}
                        now={now}
                        actionShiftId={actionShiftId}
                        pendingActionShiftIds={pendingActionShiftIds}
                        canRegister={canRegister}
                        canCancel={canCancel}
                        canTransfer={canTransfer}
                        canSwap={canSwap}
                        onRegister={onRegister}
                        onCancel={onCancel}
                        onTransfer={onTransfer}
                        onSwap={onSwap}
                      />
                    </div>
                  );
                })}
                {!dayShifts.length && !loading && (
                  <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs text-foreground-light">Không có ca</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/25">
          <span className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow">Đang tải lịch...</span>
        </div>
      )}
    </section>
  );
};
