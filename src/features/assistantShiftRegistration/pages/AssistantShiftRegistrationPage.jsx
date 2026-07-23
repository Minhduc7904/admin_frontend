import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes';
import { Button } from '../../../shared/components/ui';
import { useHasPermission } from '../../../shared/hooks/permissions';
import { AssistantShiftMiniCalendar } from '../../assistantShift/components';
import { selectProfile } from '../../profile/store/profileSlice';
import { AssistantShiftRegistrationPeriodCalendar } from '../components';
import { cancelAssistantShiftRegistrationAsync, getAvailableAssistantShiftSeriesAsync, getAvailableAssistantShiftsAsync, registerAssistantShiftAsync, selectRegistrationActionShiftId, selectRegistrationError, selectRegistrationLoadingSeries, selectRegistrationLoadingShifts, selectRegistrationSeries, selectRegistrationShifts } from '../store/assistantShiftRegistrationSlice';

const mondayOf = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return date; };
const daysOf = (monday) => Array.from({ length: 7 }, (_, index) => { const date = new Date(monday); date.setDate(monday.getDate() + index); return date; });
const dayString = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const weekRange = (days) => `${days[0].getDate()}/${days[0].getMonth() + 1} – ${days[6].getDate()}/${days[6].getMonth() + 1}/${days[6].getFullYear()}`;

export const AssistantShiftRegistrationPage = () => {
  const dispatch = useDispatch(); const profile = useSelector(selectProfile); const series = useSelector(selectRegistrationSeries); const shifts = useSelector(selectRegistrationShifts); const loadingSeries = useSelector(selectRegistrationLoadingSeries); const loadingShifts = useSelector(selectRegistrationLoadingShifts); const actionShiftId = useSelector(selectRegistrationActionShiftId); const error = useSelector(selectRegistrationError);
  const canRegister = useHasPermission(PERMISSIONS.ASSISTANT_SHIFT.REGISTER); const canCancel = useHasPermission(PERMISSIONS.ASSISTANT_SHIFT.CANCEL_REGISTRATION);
  const [monday, setMonday] = useState(() => mondayOf(new Date())); const [seriesId, setSeriesId] = useState(null); const days = useMemo(() => daysOf(monday), [monday]); const selectedSeriesId = seriesId || series[0]?.assistantShiftSeriesId;
  const loadSeries = useCallback(() => dispatch(getAvailableAssistantShiftSeriesAsync()), [dispatch]);
  const loadShifts = useCallback(() => { if (!selectedSeriesId) return Promise.resolve(); return dispatch(getAvailableAssistantShiftsAsync({ seriesId: selectedSeriesId, params: { startAt: dayString(days[0]), endAt: dayString(days[6]) } })); }, [days, dispatch, selectedSeriesId]);
  useEffect(() => { loadSeries(); }, [loadSeries]); useEffect(() => { loadShifts(); }, [loadShifts]);
  const moveWeek = (offset) => setMonday((current) => { const next = new Date(current); next.setDate(next.getDate() + offset * 7); return next; });
  const run = async (thunk, id) => { await dispatch(thunk(id)).unwrap(); await loadShifts(); };
  const reload = async () => { await loadSeries(); await loadShifts(); };
  return <div className="flex min-h-full flex-col gap-4 2xl:h-full 2xl:min-h-0 2xl:overflow-hidden"><div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-medium text-blue-600">TỰ ĐĂNG KÝ</p><h1 className="mt-1 text-2xl font-semibold text-foreground">Đăng ký lịch trợ giảng</h1><p className="mt-1 text-sm text-foreground-light">Chọn ca còn chỗ trong cửa sổ đăng ký của tuần.</p></div><div className="flex flex-wrap items-center gap-2"><Button variant="outline" size="sm" onClick={() => setMonday(mondayOf(new Date()))}>Hôm nay</Button><div className="flex items-center rounded-sm border border-border bg-white"><button type="button" aria-label="Tuần trước" onClick={() => moveWeek(-1)} className="p-2 hover:bg-gray-50"><ChevronLeft className="h-4 w-4" /></button><span className="min-w-40 px-2 text-center text-sm font-medium">{weekRange(days)}</span><button type="button" aria-label="Tuần sau" onClick={() => moveWeek(1)} className="p-2 hover:bg-gray-50"><ChevronRight className="h-4 w-4" /></button></div><Button variant="outline" size="sm" onClick={reload} loading={loadingSeries || loadingShifts}><RefreshCw className="h-4 w-4" />Làm mới</Button></div></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Không thể tải hoặc cập nhật lịch. Vui lòng thử lại.</div>}
    <div className="grid gap-5 2xl:min-h-0 2xl:flex-1 2xl:grid-cols-[288px_minmax(0,1fr)]"><aside className="rounded-xl border border-border bg-white p-4 shadow-sm"><h2 className="text-lg font-semibold">Đăng ký lịch</h2><p className="mt-1 text-xs text-foreground-light">Chọn một chuỗi lịch</p><AssistantShiftMiniCalendar key={monday.toISOString()} selectedWeekStart={monday} onSelectWeek={setMonday} /><div className="mt-5 space-y-2">{loadingSeries ? Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-11 animate-pulse rounded-lg bg-gray-100" />) : series.map((item) => <button type="button" key={item.assistantShiftSeriesId} onClick={() => setSeriesId(item.assistantShiftSeriesId)} className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${selectedSeriesId === item.assistantShiftSeriesId ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-transparent bg-gray-50 hover:border-border hover:bg-white'}`}>{item.name}</button>)}{!loadingSeries && !series.length && <p className="rounded-lg bg-gray-50 p-3 text-sm text-foreground-light">Hiện chưa có chuỗi lịch mở đăng ký.</p>}</div></aside><AssistantShiftRegistrationPeriodCalendar days={days} shifts={shifts} loading={loadingShifts} profile={profile} actionShiftId={actionShiftId} canRegister={canRegister} canCancel={canCancel} onRegister={(id) => run(registerAssistantShiftAsync, id)} onCancel={(id) => run(cancelAssistantShiftRegistrationAsync, id)} /></div>
  </div>;
};
