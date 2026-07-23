import { LockKeyhole, Users } from 'lucide-react';
import { useMemo } from 'react';
import { AssistantShiftAvatar } from '../../assistantShift/components';

const DAY_NAMES = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'];
const START = 7 * 60;
const END = 22 * 60;
const BASE_PERIOD_HEIGHT = 220;
const PERIODS = [
  { label: 'Sáng', range: '07:00 - 12:00', start: 7 * 60, end: 12 * 60 },
  { label: 'Chiều', range: '12:00 - 17:00', start: 12 * 60, end: 17 * 60 },
  { label: 'Tối', range: '17:00 - 22:00', start: 17 * 60, end: 22 * 60 },
];

const dateKey = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const timeLabel = (value) => new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const minuteOf = (value) => {
  const date = new Date(value);
  return date.getHours() * 60 + date.getMinutes();
};
const bounded = (value) => Math.max(START, Math.min(END, value));
const isToday = (day) => dateKey(day) === dateKey(new Date());
const isMine = (item, profile) => (
  item.adminId === profile?.adminId
  || item.admin?.adminId === profile?.adminId
  || item.admin?.userId === profile?.userId
);

const requiredCardHeight = (shift) => Math.max(128, 96 + (shift.assignments?.length || 0) * 26);

const createScale = (shifts) => {
  const heights = PERIODS.map(() => BASE_PERIOD_HEIGHT);
  const position = (minute) => {
    const value = bounded(minute);
    if (value === END) return heights.reduce((sum, height) => sum + height, 0);

    const index = PERIODS.findIndex((period) => value >= period.start && value < period.end);
    const safeIndex = index < 0 ? 0 : index;
    const period = PERIODS[safeIndex];
    return heights.slice(0, safeIndex).reduce((sum, height) => sum + height, 0)
      + ((value - period.start) / (period.end - period.start)) * heights[safeIndex];
  };

  shifts.forEach((shift) => {
    const start = bounded(minuteOf(shift.startAt));
    const end = Math.max(start + 1, bounded(minuteOf(shift.endAt)));
    const extra = requiredCardHeight(shift) - (position(end) - position(start));
    if (extra <= 0) return;

    const coverage = PERIODS.map((period) => Math.max(0, Math.min(end, period.end) - Math.max(start, period.start)) / (period.end - period.start));
    const total = coverage.reduce((sum, value) => sum + value, 0);
    coverage.forEach((value, index) => {
      if (value) heights[index] += extra / total;
    });
  });

  return { heights, position, totalHeight: heights.reduce((sum, value) => sum + value, 0) };
};

const getRegistrationBlockReason = (shift, now = new Date()) => {
  if (shift.series?.isLocked) return 'Chuỗi lịch đã khóa';
  if (shift.isLocked) return 'Ca đã khóa';
  if (!shift.selfRegistrationOpenAt || !shift.selfRegistrationCloseAt) return 'Chưa mở đăng ký';

  const openAt = new Date(shift.selfRegistrationOpenAt);
  const closeAt = new Date(shift.selfRegistrationCloseAt);
  if (Number.isNaN(openAt.getTime()) || Number.isNaN(closeAt.getTime())) return 'Chưa mở đăng ký';
  if (now < openAt) return `Mở đăng ký ${openAt.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}`;
  if (now > closeAt) return 'Đã hết giờ đăng ký';
  return '';
};

const RegistrationShiftCard = ({ shift, profile, actionShiftId, canRegister, canCancel, onRegister, onCancel }) => {
  const assignments = shift.assignments || [];
  const joined = assignments.some((item) => isMine(item, profile));
  const full = assignments.length >= (shift.requiredAssistantCount || 1);
  const blockReason = getRegistrationBlockReason(shift);
  const isUnavailable = Boolean(blockReason);
  const isBusy = actionShiftId === shift.assistantShiftId;

  const palette = isUnavailable
    ? 'border-gray-300 bg-gray-100 text-gray-600'
    : joined
      ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
      : full
        ? 'border-red-300 bg-red-50 text-red-950'
        : 'border-blue-300 bg-blue-50 text-blue-950';

  const overlay = joined ? 'bg-amber-400/95 text-amber-950' : full ? 'bg-red-600/95 text-white' : 'bg-blue-600/95 text-white';
  const label = joined ? 'Hủy ca' : full ? 'Đã đủ' : 'Đăng ký';
  const disabled = isBusy || isUnavailable || (!joined && (full || !canRegister)) || (joined && !canCancel);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => joined ? onCancel(shift.assistantShiftId) : onRegister(shift.assistantShiftId)}
      className={`group relative h-full w-full overflow-hidden rounded-xl border p-3 text-left shadow-sm transition hover:z-20 hover:shadow-md disabled:cursor-default ${palette}`}
    >
      <div className={isUnavailable ? 'opacity-45' : ''}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold leading-snug">{shift.name}</p>
            <p className="mt-1 text-[11px] font-medium opacity-75">{timeLabel(shift.startAt)} - {timeLabel(shift.endAt)}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/65 px-2 py-1 text-[10px] font-semibold">
            <Users className="h-3.5 w-3.5" />
            {assignments.length}/{shift.requiredAssistantCount}
          </span>
        </div>

        <p className="mt-2 truncate text-[11px] opacity-75">{shift.courseClass?.className || shift.courseClass?.name || shift.series?.name || 'Ca trợ giảng'}</p>
        <div className="mt-2 space-y-1">
          {assignments.map((item) => (
            <div key={item.adminId} className="flex items-center gap-1.5">
              <AssistantShiftAvatar admin={item.admin} status={item.attendanceStatus} sizeClass="h-5 w-5" textClass="text-[8px]" />
              <span className="min-w-0 truncate text-[11px] font-medium">{item.admin?.fullName || `Admin #${item.adminId}`}</span>
            </div>
          ))}
        </div>
      </div>

      {isUnavailable ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-gray-500/35 px-3 text-center backdrop-grayscale">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
            {blockReason}
          </span>
        </div>
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100 ${overlay}`}>
          {isBusy ? 'Đang xử lý...' : label}
        </div>
      )}
    </button>
  );
};

export const AssistantShiftRegistrationPeriodCalendar = ({ days, shifts, loading, profile, actionShiftId, canRegister, canCancel, onRegister, onCancel }) => {
  const scale = useMemo(() => createScale(shifts), [shifts]);

  return (
    <section className="relative min-h-0 overflow-auto rounded-xl border border-border bg-white shadow-sm">
      <div className="min-w-[1040px]">
        <div className="grid grid-cols-[92px_repeat(7,minmax(135px,1fr))] border-b border-border bg-gray-50">
          <div />
          {days.map((day) => (
            <div key={dateKey(day)} className={`border-l border-border px-3 py-3 text-center ${isToday(day) ? 'bg-blue-600 text-white' : ''}`}>
              <p className="text-xs font-medium opacity-75">{DAY_NAMES[(day.getDay() + 6) % 7]}</p>
              <p className="mt-0.5 text-lg font-semibold">{day.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[92px_minmax(0,1fr)]">
          <aside className="border-r border-border bg-gray-50" style={{ height: scale.totalHeight }}>
            {PERIODS.map((period, index) => (
              <div key={period.label} className={`flex flex-col justify-center px-3 ${index < PERIODS.length - 1 ? 'border-b border-border' : ''}`} style={{ height: scale.heights[index] }}>
                <p className="text-sm font-semibold text-foreground">{period.label}</p>
                <p className="text-[11px] text-foreground-light">{period.range}</p>
              </div>
            ))}
          </aside>

          <div className="grid grid-cols-7">
            {days.map((day) => {
              const dayShifts = shifts.filter((shift) => dateKey(shift.startAt) === dateKey(day));
              return (
                <div key={dateKey(day)} className="relative border-r border-border bg-white" style={{ height: scale.totalHeight }}>
                  {PERIODS.slice(1).map((period) => (
                    <span key={period.label} className="pointer-events-none absolute inset-x-0 border-t border-border" style={{ top: scale.position(period.start) }} />
                  ))}
                  {dayShifts.map((shift) => {
                    const start = bounded(minuteOf(shift.startAt));
                    const end = Math.max(start + 1, bounded(minuteOf(shift.endAt)));
                    return (
                      <div key={shift.assistantShiftId} className="absolute left-1 right-1" style={{ top: scale.position(start), height: Math.max(requiredCardHeight(shift), scale.position(end) - scale.position(start)) }}>
                        <RegistrationShiftCard
                          shift={shift}
                          profile={profile}
                          actionShiftId={actionShiftId}
                          canRegister={canRegister}
                          canCancel={canCancel}
                          onRegister={onRegister}
                          onCancel={onCancel}
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
      </div>
      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/25">
          <span className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow">Đang tải lịch...</span>
        </div>
      )}
    </section>
  );
};
