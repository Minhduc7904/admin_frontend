import { CalendarDays, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from '../../../shared/components/ui';
import { AssistantShiftMiniCalendar } from '../../assistantShift/components';
import {
  getAssistantShiftStatisticsAsync,
  selectAssistantShiftStatistics,
  selectAssistantShiftStatisticsError,
  selectAssistantShiftStatisticsLoading,
} from '../store/assistantShiftStatisticsSlice';

const mondayOf = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
};
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const dayString = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dateLabel = (date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
const formatNumber = (value) => Number(value || 0).toLocaleString('vi-VN', { maximumFractionDigits: 2 });

const groupClasses = (tone) => ({
  start: `border-l-2 border-slate-800 ${tone} font-bold`,
  end: `border-r-2 border-slate-800 ${tone} font-bold`,
});
const TOTAL_GROUP = groupClasses('bg-slate-50 text-foreground');
const PENDING_GROUP = groupClasses('bg-blue-50 text-blue-800');
const PRESENT_GROUP = groupClasses('bg-emerald-50 text-emerald-800');
const ABSENT_GROUP = groupClasses('bg-red-50 text-red-800');
const SUNDAY_GROUP = groupClasses('bg-amber-50 text-amber-800');
const HOURS = (value) => <span className="whitespace-nowrap">{formatNumber(value)} giờ</span>;

const columns = [
  {
    key: 'fullName',
    label: 'Tên trợ giảng',
    width: 220,
    headerClassName: 'sticky left-0 z-10 bg-white',
    className: 'sticky left-0 z-10 bg-white font-semibold text-foreground group-hover:bg-gray-50',
    render: (assistant) => (
      <div className="min-w-44">
        <p>{assistant.fullName || `Trợ giảng #${assistant.adminId}`}</p>
        <p className="mt-0.5 text-xs font-normal text-foreground-light">Mã trợ giảng: {assistant.adminId}</p>
      </div>
    ),
  },
  {
    key: 'totalAssignmentCount',
    label: 'Tổng lượt phân công',
    align: 'right',
    headerClassName: TOTAL_GROUP.start,
    className: TOTAL_GROUP.start,
    render: (assistant) => formatNumber(assistant.totalAssignmentCount ?? assistant.registeredShiftCount),
  },
  {
    key: 'totalHours',
    label: 'Tổng số giờ',
    align: 'right',
    headerClassName: TOTAL_GROUP.end,
    className: TOTAL_GROUP.end,
    render: (assistant) => HOURS(assistant.totalHours),
  },
  {
    key: 'pendingAssignmentCount',
    label: 'Chờ xác nhận · lượt',
    align: 'right',
    headerClassName: PENDING_GROUP.start,
    className: PENDING_GROUP.start,
    render: (assistant) => formatNumber(assistant.pendingAssignmentCount),
  },
  {
    key: 'pendingHours',
    label: 'Chờ xác nhận · giờ',
    align: 'right',
    headerClassName: PENDING_GROUP.end,
    className: PENDING_GROUP.end,
    render: (assistant) => HOURS(assistant.pendingHours),
  },
  {
    key: 'presentAssignmentCount',
    label: 'Có mặt · lượt',
    align: 'right',
    headerClassName: PRESENT_GROUP.start,
    className: PRESENT_GROUP.start,
    render: (assistant) => formatNumber(assistant.presentAssignmentCount),
  },
  {
    key: 'presentHours',
    label: 'Có mặt · giờ',
    align: 'right',
    headerClassName: PRESENT_GROUP.end,
    className: PRESENT_GROUP.end,
    render: (assistant) => HOURS(assistant.presentHours ?? assistant.workedHours),
  },
  {
    key: 'absentAssignmentCount',
    label: 'Vắng · lượt',
    align: 'right',
    headerClassName: ABSENT_GROUP.start,
    className: ABSENT_GROUP.start,
    render: (assistant) => formatNumber(assistant.absentAssignmentCount),
  },
  {
    key: 'absentHours',
    label: 'Vắng · giờ',
    align: 'right',
    headerClassName: ABSENT_GROUP.end,
    className: ABSENT_GROUP.end,
    render: (assistant) => HOURS(assistant.absentHours),
  },
  {
    key: 'sundayPresentAssignmentCount',
    label: 'Có mặt Chủ nhật · lượt',
    align: 'right',
    headerClassName: SUNDAY_GROUP.start,
    className: SUNDAY_GROUP.start,
    render: (assistant) => formatNumber(assistant.sundayPresentAssignmentCount),
  },
  {
    key: 'sundayPresentHours',
    label: 'Có mặt Chủ nhật · giờ',
    align: 'right',
    headerClassName: SUNDAY_GROUP.end,
    className: SUNDAY_GROUP.end,
    render: (assistant) => HOURS(assistant.sundayPresentHours),
  },
  {
    key: 'presentWorkDayCount',
    label: 'Số ngày có mặt',
    align: 'right',
    className: 'font-bold text-foreground',
    render: (assistant) => formatNumber(assistant.presentWorkDayCount),
  },
];

export const AssistantShiftStatisticsPage = () => {
  const dispatch = useDispatch();
  const statistics = useSelector(selectAssistantShiftStatistics);
  const loading = useSelector(selectAssistantShiftStatisticsLoading);
  const error = useSelector(selectAssistantShiftStatisticsError);
  const [mode, setMode] = useState('week');
  const [cursor, setCursor] = useState(() => new Date());

  const range = useMemo(() => {
    if (mode === 'month') return { start: startOfMonth(cursor), end: endOfMonth(cursor) };
    const start = mondayOf(cursor);
    return { start, end: addDays(start, 6) };
  }, [cursor, mode]);

  const params = useMemo(() => ({ startAt: dayString(range.start), endAt: dayString(range.end) }), [range]);
  const assistants = useMemo(() => [...(statistics?.assistants || [])]
    .sort((first, second) => String(first.fullName || '').localeCompare(String(second.fullName || ''), 'vi')),
  [statistics]);
  const title = mode === 'month'
    ? `Tháng ${cursor.getMonth() + 1}/${cursor.getFullYear()}`
    : `${dateLabel(range.start)} - ${dateLabel(range.end)}`;

  const loadStatistics = useCallback(
    () => dispatch(getAssistantShiftStatisticsAsync(params)),
    [dispatch, params],
  );
  useEffect(() => { loadStatistics(); }, [loadStatistics]);

  const move = (offset) => setCursor((current) => (
    mode === 'month'
      ? new Date(current.getFullYear(), current.getMonth() + offset, 1)
      : addDays(current, offset * 7)
  ));
  const changeMode = (nextMode) => {
    setMode(nextMode);
    setCursor((current) => (nextMode === 'month' ? startOfMonth(current) : mondayOf(current)));
  };

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">THỐNG KÊ NHÂN SỰ</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Thống kê lịch trợ giảng</h1>
          <p className="mt-1 text-sm text-foreground-light">Theo dõi số lượt phân công, giờ làm và điểm danh của từng trợ giảng.</p>
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
            <p className="font-semibold text-foreground">Khoảng thời gian thống kê</p>
            <p className="mt-1">Từ ngày: {params.startAt}</p>
            <p>Đến ngày: {params.endAt}</p>
          </div>
        </aside>

        <section className="min-w-0 rounded-lg border border-border bg-white shadow-sm">
          <div className="border-b border-border px-4 py-4">
            <h2 className="text-lg font-semibold text-foreground">Bảng thống kê trợ giảng</h2>
            <p className="mt-1 text-sm text-foreground-light">{title} · Bao gồm cả trợ giảng chưa được phân công ca trong khoảng thời gian này.</p>
          </div>
          <Table
            columns={columns}
            data={assistants}
            loading={loading}
            emptyMessage="Chưa có dữ liệu trợ giảng"
            emptySubMessage="Không có trợ giảng nào trong khoảng thời gian đang chọn."
            emptyIcon="users"
            rowClassName="whitespace-nowrap"
          />
        </section>
      </div>
    </div>
  );
};
