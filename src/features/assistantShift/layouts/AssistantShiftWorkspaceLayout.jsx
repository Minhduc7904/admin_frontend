import { ArrowLeft, BarChart3, CalendarCheck2, CalendarDays, CalendarPlus, Home, Menu, X } from 'lucide-react';
import { createElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes';
import { useHasPermission } from '../../../shared/hooks/permissions';
import { AssistantShiftAvatar } from '../components';
import { AssistantShiftWorkspaceContext } from './AssistantShiftWorkspaceContext';
import { selectRegistrationLoadingSeries, selectRegistrationSeries, selectRegistrationSelectedSeriesId, setRegistrationSelectedSeriesId } from '../../assistantShiftRegistration/store/assistantShiftRegistrationSlice';
import { selectProfile } from '../../profile/store/profileSlice';
import { selectMyAssistantStatistics, selectMyAssistantStatisticsLoading } from '../../myAssistantSchedule/store/myAssistantScheduleSlice';

const tabs = [
  { label: 'Lịch trợ giảng', href: ROUTES.ASSISTANT_SHIFTS, icon: CalendarDays, permission: PERMISSIONS.ASSISTANT_SHIFT.GET_ALL_SERIES },
  { label: 'Đăng kí lịch', href: ROUTES.ASSISTANT_SHIFT_REGISTRATION, icon: CalendarPlus, permission: PERMISSIONS.ASSISTANT_SHIFT.GET_AVAILABLE_BY_SERIES },
  { label: 'Lịch của tôi', href: ROUTES.MY_ASSISTANT_SCHEDULE, icon: CalendarCheck2, permission: PERMISSIONS.ASSISTANT_SHIFT.GET_MY_SCHEDULE },
  { label: 'Thống kê', href: ROUTES.ASSISTANT_SHIFT_STATISTICS, icon: BarChart3, permission: PERMISSIONS.ASSISTANT_SHIFT.GET_ALL_BY_SERIES },
];

export const AssistantShiftWorkspaceLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const profile = useSelector(selectProfile);
  const series = useSelector(selectRegistrationSeries);
  const selectedSeriesId = useSelector(selectRegistrationSelectedSeriesId);
  const loadingSeries = useSelector(selectRegistrationLoadingSeries);
  const myStatistics = useSelector(selectMyAssistantStatistics);
  const loadingMyStatistics = useSelector(selectMyAssistantStatisticsLoading);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const canManage = useHasPermission(PERMISSIONS.ASSISTANT_SHIFT.GET_ALL_SERIES);
  const canRegister = useHasPermission(PERMISSIONS.ASSISTANT_SHIFT.GET_AVAILABLE_BY_SERIES);
  const canViewMine = useHasPermission(PERMISSIONS.ASSISTANT_SHIFT.GET_MY_SCHEDULE);
  const canViewStatistics = useHasPermission(PERMISSIONS.ASSISTANT_SHIFT.GET_ALL_BY_SERIES);
  const tabPermissions = [canManage, canRegister, canViewMine, canViewStatistics];
  const visibleTabs = tabs.filter((_, index) => tabPermissions[index]);
  const isRegistration = location.pathname === ROUTES.ASSISTANT_SHIFT_REGISTRATION;
  const isMySchedule = location.pathname === ROUTES.MY_ASSISTANT_SCHEDULE;
  const activeTab = tabs.find((tab) => location.pathname === tab.href);

  return (
    <AssistantShiftWorkspaceContext.Provider value={{ openMobileSidebar: () => setMobileSidebarOpen(true) }}>
    <div className="flex h-[100dvh] min-h-0 flex-col bg-slate-50 md:bg-primary-dark">
      <header className="hidden shrink-0 border-b border-border bg-white px-5 py-4 shadow-sm md:block">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Link to={ROUTES.DASHBOARD} className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-border bg-primary px-3 py-2 text-sm font-medium text-foreground transition hover:bg-gray-50"><ArrowLeft className="h-4 w-4" />Về trang chủ</Link>
            <div className="min-w-0"><p className="text-xs font-semibold uppercase text-blue-600">Lịch trợ giảng</p><h1 className="truncate text-xl font-semibold text-foreground">Không gian quản lý lịch trợ giảng</h1></div>
          </div>
          <nav className="flex overflow-x-auto rounded-sm border border-border bg-gray-50 p-1">
            {visibleTabs.map((tab) => <NavLink key={tab.href} to={tab.href} className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-foreground-light hover:bg-white hover:text-foreground'}`}>{createElement(tab.icon, { className: 'h-4 w-4' })}{tab.label}</NavLink>)}
          </nav>
        </div>
      </header>

      {!isRegistration && !isMySchedule && <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 md:hidden"><button type="button" aria-label="Mở menu lịch trợ giảng" onClick={() => setMobileSidebarOpen(true)} className="rounded-lg p-2 text-slate-800 hover:bg-slate-100"><Menu className="h-5 w-5" /></button><p className="min-w-0 truncate px-3 text-sm font-semibold text-slate-900">{activeTab?.label || 'Lịch trợ giảng'}</p><AssistantShiftAvatar admin={profile} sizeClass="h-8 w-8" textClass="text-[10px]" /></header>}

      <div className={`fixed inset-0 z-[60] md:hidden ${mobileSidebarOpen ? '' : 'pointer-events-none'}`} aria-hidden={!mobileSidebarOpen}>
        <button type="button" aria-label="Đóng menu" onClick={() => setMobileSidebarOpen(false)} className={`absolute inset-0 bg-slate-950/35 transition-opacity ${mobileSidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute inset-y-0 left-0 flex w-[min(88vw,340px)] flex-col bg-white shadow-2xl transition-transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4"><Link to={ROUTES.DASHBOARD} onClick={() => setMobileSidebarOpen(false)} className="inline-flex min-w-0 items-center gap-3 text-slate-900"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100"><Home className="h-5 w-5" /></span><span className="truncate text-base font-semibold">Lịch trợ giảng</span></Link><button type="button" aria-label="Đóng menu" onClick={() => setMobileSidebarOpen(false)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
          <nav className="space-y-1 p-3">{visibleTabs.map((tab) => <NavLink key={tab.href} to={tab.href} onClick={() => setMobileSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}>{createElement(tab.icon, { className: 'h-5 w-5' })}{tab.label}</NavLink>)}</nav>
          {isRegistration && <div className="min-h-0 flex-1 border-t border-slate-100 px-4 py-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Chọn chuỗi lịch</p><div className="mt-3 space-y-2 overflow-y-auto">{loadingSeries ? Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-11 animate-pulse rounded-xl bg-slate-100" />) : series.map((item) => <button key={item.assistantShiftSeriesId} type="button" onClick={() => { dispatch(setRegistrationSelectedSeriesId(item.assistantShiftSeriesId)); setMobileSidebarOpen(false); }} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${selectedSeriesId === item.assistantShiftSeriesId ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>{item.name}</button>)}{!loadingSeries && !series.length && <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">Chưa có chuỗi lịch khả dụng.</p>}</div></div>}
          {isMySchedule && <div className="border-t border-slate-100 px-4 py-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Thống kê tháng này</p><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-xl bg-emerald-50 p-3"><p className="text-xs text-emerald-700">Ca đã đi</p><p className="mt-1 text-lg font-bold text-emerald-900">{loadingMyStatistics ? '—' : myStatistics?.workedShiftCount || 0}</p></div><div className="rounded-xl bg-red-50 p-3"><p className="text-xs text-red-700">Ca vắng</p><p className="mt-1 text-lg font-bold text-red-900">{loadingMyStatistics ? '—' : myStatistics?.absentShiftCount || 0}</p></div><div className="rounded-xl bg-blue-50 p-3"><p className="text-xs text-blue-700">Giờ đã đi</p><p className="mt-1 text-lg font-bold text-blue-900">{loadingMyStatistics ? '—' : Number(myStatistics?.workedHours || 0).toLocaleString('vi-VN')}</p></div><div className="rounded-xl bg-amber-50 p-3"><p className="text-xs text-amber-700">Giờ vắng</p><p className="mt-1 text-lg font-bold text-amber-900">{loadingMyStatistics ? '—' : Number(myStatistics?.absentHours || 0).toLocaleString('vi-VN')}</p></div></div></div>}
        </aside>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto p-0 md:p-5"><Outlet /></main>
    </div>
    </AssistantShiftWorkspaceContext.Provider>
  );
};
