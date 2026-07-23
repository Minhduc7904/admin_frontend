import { BarChart3, CalendarDays, ChevronLeft, ChevronRight, Clock3, Hourglass, RefreshCw, UserCheck, UserX, UsersRound } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../shared/components/ui';
import { AssistantShiftMiniCalendar } from '../../assistantShift/components';
import {
  getAssistantShiftStatisticsAsync,
  selectAssistantShiftStatistics,
  selectAssistantShiftStatisticsError,
  selectAssistantShiftStatisticsLoading,
} from '../store/assistantShiftStatisticsSlice';

const mondayOf = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return date; };
const addDays = (date, days) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const dayString = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dateLabel = (date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
const formatNumber = (value) => Number(value || 0).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
const formatHours = (value) => `${formatNumber(value)} giờ`;
const initials = (name = '') => name.split(' ').filter(Boolean).slice(-2).map((part) => part[0]).join('').toUpperCase() || 'TG';
const assistantTotalHours = (item) => Number(item.workedHours || 0) + Number(item.absentHours || 0) + Number(item.pendingHours || 0);

const SummaryCard = ({ children, label, value, tone }) => (
  <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-foreground-light">{label}</p>
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}>
        {children}
      </span>
    </div>
    <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
  </div>
);

const AssistantStatisticCard = ({ assistant, rank, maxHours }) => {
  const worked = Number(assistant.workedHours || 0);
  const absent = Number(assistant.absentHours || 0);
  const pending = Number(assistant.pendingHours || 0);
  const total = worked + absent + pending;
  const completed = worked + absent;
  const attendanceRate = completed ? Math.round((worked / completed) * 100) : 0;
  const loadPercent = maxHours ? Math.round((total / maxHours) * 100) : 0;
  const width = (value) => total && value ? `${Math.max(4, (value / total) * 100)}%` : '0%';

  return (
    <article className="rounded-lg border border-border bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {initials(assistant.fullName)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-base font-semibold text-foreground">{assistant.fullName || `Admin #${assistant.adminId}`}</p>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-foreground-light">#{rank}</span>
            </div>
            <p className="mt-1 text-xs text-foreground-light">Admin ID {assistant.adminId} · User ID {assistant.userId || '—'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right sm:grid-cols-4 lg:min-w-[420px]">
          <div>
            <p className="text-[11px] font-medium uppercase text-foreground-light">Ca đăng ký</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{assistant.registeredShiftCount || 0}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase text-foreground-light">Tổng giờ</p>
            <p className="mt-1 text-lg font-semibold text-blue-700">{formatNumber(total)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase text-foreground-light">Có mặt</p>
            <p className="mt-1 text-lg font-semibold text-emerald-700">{formatNumber(worked)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase text-foreground-light">Tỷ lệ</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{completed ? `${attendanceRate}%` : '—'}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-foreground-light">
          <span>Mức tải so với người nhiều giờ nhất</span>
          <span>{loadPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${loadPercent}%` }} />
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-foreground-light">
          <span>Phân bổ giờ theo trạng thái</span>
          <span>{total ? formatHours(total) : 'Chưa có ca'}</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-gray-100">
          <span title={`Có mặt ${formatHours(worked)}`} className="bg-emerald-500" style={{ width: width(worked) }} />
          <span title={`Vắng ${formatHours(absent)}`} className="bg-rose-500" style={{ width: width(absent) }} />
          <span title={`Chờ ${formatHours(pending)}`} className="bg-amber-400" style={{ width: width(pending) }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Có mặt {formatNumber(worked)}</span>
          <span className="inline-flex items-center gap-1.5 text-rose-700"><span className="h-2 w-2 rounded-full bg-rose-500" />Vắng {formatNumber(absent)}</span>
          <span className="inline-flex items-center gap-1.5 text-amber-700"><span className="h-2 w-2 rounded-full bg-amber-400" />Chờ {formatNumber(pending)}</span>
        </div>
      </div>
    </article>
  );
};

export const AssistantShiftStatisticsPage = () => {
  const dispatch = useDispatch();
  const statistics = useSelector(selectAssistantShiftStatistics);
  const loading = useSelector(selectAssistantShiftStatisticsLoading);
  const error = useSelector(selectAssistantShiftStatisticsError);
  const [mode, setMode] = useState('week');
  const [cursor, setCursor] = useState(() => new Date());

  const range = useMemo(() => {
    if (mode === 'month') {
      return { start: startOfMonth(cursor), end: endOfMonth(cursor) };
    }
    const start = mondayOf(cursor);
    return { start, end: addDays(start, 6) };
  }, [cursor, mode]);

  const params = useMemo(() => ({ startAt: dayString(range.start), endAt: dayString(range.end) }), [range]);
  const assistants = useMemo(() => {
    const items = statistics?.assistants || [];
    return [...items].sort((first, second) => (
      assistantTotalHours(second) - assistantTotalHours(first)
      || Number(second.registeredShiftCount || 0) - Number(first.registeredShiftCount || 0)
      || String(first.fullName || '').localeCompare(String(second.fullName || ''), 'vi')
    ));
  }, [statistics]);
  const totals = useMemo(() => assistants.reduce((acc, item) => ({
    registeredShiftCount: acc.registeredShiftCount + Number(item.registeredShiftCount || 0),
    workedHours: acc.workedHours + Number(item.workedHours || 0),
    absentHours: acc.absentHours + Number(item.absentHours || 0),
    pendingHours: acc.pendingHours + Number(item.pendingHours || 0),
  }), { registeredShiftCount: 0, workedHours: 0, absentHours: 0, pendingHours: 0 }), [assistants]);
  const maxHours = useMemo(() => assistants.reduce((max, item) => Math.max(max, assistantTotalHours(item)), 0), [assistants]);
  const title = mode === 'month' ? `Tháng ${cursor.getMonth() + 1}/${cursor.getFullYear()}` : `${dateLabel(range.start)} - ${dateLabel(range.end)}`;

  const loadStatistics = useCallback(() => dispatch(getAssistantShiftStatisticsAsync(params)), [dispatch, params]);
  useEffect(() => { loadStatistics(); }, [loadStatistics]);

  const move = (offset) => setCursor((current) => (
    mode === 'month'
      ? new Date(current.getFullYear(), current.getMonth() + offset, 1)
      : addDays(current, offset * 7)
  ));
  const changeMode = (nextMode) => {
    setMode(nextMode);
    setCursor((current) => nextMode === 'month' ? startOfMonth(current) : mondayOf(current));
  };

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">THỐNG KÊ NHÂN SỰ</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Thống kê lịch trợ giảng</h1>
          <p className="mt-1 text-sm text-foreground-light">Theo dõi số ca, giờ làm và trạng thái điểm danh của từng trợ giảng.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Hôm nay</Button>
          <div className="flex items-center rounded-sm border border-border bg-white">
            <button type="button" aria-label="Lùi thời gian" onClick={() => move(-1)} className="p-2 hover:bg-gray-50"><ChevronLeft className="h-4 w-4" /></button>
            <span className="min-w-52 px-2 text-center text-sm font-medium">{title}</span>
            <button type="button" aria-label="Tiến thời gian" onClick={() => move(1)} className="p-2 hover:bg-gray-50"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="flex rounded-sm border border-border bg-white p-0.5">
            <button type="button" onClick={() => changeMode('week')} className={`rounded px-3 py-1.5 text-xs font-medium ${mode === 'week' ? 'bg-blue-600 text-white' : 'text-foreground-light hover:bg-gray-50'}`}>Tuần</button>
            <button type="button" onClick={() => changeMode('month')} className={`rounded px-3 py-1.5 text-xs font-medium ${mode === 'month' ? 'bg-blue-600 text-white' : 'text-foreground-light hover:bg-gray-50'}`}>Tháng</button>
          </div>
          <Button variant="outline" size="sm" onClick={loadStatistics} loading={loading}><RefreshCw className="h-4 w-4" />Làm mới</Button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Không thể tải thống kê lịch trợ giảng. Vui lòng thử lại.</div>}

      <div className="grid gap-5 xl:grid-cols-[288px_minmax(0,1fr)]">
        <aside className="h-fit rounded-lg border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="font-semibold text-foreground">Bộ lọc thời gian</h2>
              <p className="text-xs text-foreground-light">{mode === 'week' ? 'Chọn một tuần trong tháng' : 'Chọn một tháng trong năm'}</p>
            </div>
          </div>
          <AssistantShiftMiniCalendar
            key={`${mode}-${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`}
            mode={mode === 'month' ? 'month' : 'week'}
            selectedWeekStart={range.start}
            onSelectWeek={setCursor}
            selectedMonth={startOfMonth(cursor)}
            onSelectMonth={setCursor}
          />
          <div className="mt-4 rounded-lg border border-dashed border-border p-3 text-xs text-foreground-light">
            <p className="font-semibold text-foreground">Khoảng gửi API</p>
            <p className="mt-1">startAt: {params.startAt}</p>
            <p>endAt: {params.endAt}</p>
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Trợ giảng" value={loading ? '—' : assistants.length} tone="bg-indigo-50 text-indigo-700"><UsersRound className="h-4 w-4" /></SummaryCard>
            <SummaryCard label="Tổng ca đăng ký" value={loading ? '—' : totals.registeredShiftCount} tone="bg-blue-50 text-blue-700"><BarChart3 className="h-4 w-4" /></SummaryCard>
            <SummaryCard label="Giờ có mặt" value={loading ? '—' : formatHours(totals.workedHours)} tone="bg-emerald-50 text-emerald-700"><UserCheck className="h-4 w-4" /></SummaryCard>
            <SummaryCard label="Tổng giờ ghi nhận" value={loading ? '—' : formatHours(totals.workedHours + totals.absentHours + totals.pendingHours)} tone="bg-amber-50 text-amber-700"><Clock3 className="h-4 w-4" /></SummaryCard>
          </div>

          <section className="rounded-lg border border-border bg-gray-50/60 p-4">
            <div className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Hiệu suất trợ giảng</h2>
                <p className="mt-1 text-sm text-foreground-light">{title} · dữ liệu gồm cả trợ giảng chưa có assignment.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700"><UserCheck className="h-3.5 w-3.5" />Có mặt {formatHours(totals.workedHours)}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 font-medium text-rose-700"><UserX className="h-3.5 w-3.5" />Vắng {formatHours(totals.absentHours)}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700"><Hourglass className="h-3.5 w-3.5" />Chờ {formatHours(totals.pendingHours)}</span>
              </div>
            </div>

            <div className="relative mt-4 space-y-3">
              {assistants.map((assistant, index) => (
                <AssistantStatisticCard key={assistant.adminId} assistant={assistant} rank={index + 1} maxHours={maxHours} />
              ))}
              {!loading && !assistants.length && (
                <div className="rounded-lg border border-dashed border-border bg-white p-8 text-center">
                  <p className="text-base font-semibold text-foreground">Chưa có dữ liệu trợ giảng</p>
                  <p className="mt-1 text-sm text-foreground-light">API không trả trợ giảng nào trong khoảng đang chọn.</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-slate-950/20">
                  <span className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow">Đang tải thống kê...</span>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
