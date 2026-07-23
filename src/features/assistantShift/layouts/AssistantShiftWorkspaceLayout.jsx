import { ArrowLeft, BarChart3, CalendarCheck2, CalendarDays, CalendarPlus } from 'lucide-react';
import { createElement } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes';
import { useHasPermission } from '../../../shared/hooks/permissions';

const tabs = [
  {
    label: 'Quản lý lịch',
    href: ROUTES.ASSISTANT_SHIFTS,
    icon: CalendarDays,
    permission: PERMISSIONS.ASSISTANT_SHIFT.GET_ALL_SERIES,
  },
  {
    label: 'Đăng ký lịch',
    href: ROUTES.ASSISTANT_SHIFT_REGISTRATION,
    icon: CalendarPlus,
    permission: PERMISSIONS.ASSISTANT_SHIFT.GET_ALL_SERIES,
  },
  {
    label: 'Lịch của tôi',
    href: ROUTES.MY_ASSISTANT_SCHEDULE,
    icon: CalendarCheck2,
    permission: PERMISSIONS.ASSISTANT_SHIFT.GET_MY_SCHEDULE,
  },
  {
    label: 'Thống kê',
    href: ROUTES.ASSISTANT_SHIFT_STATISTICS,
    icon: BarChart3,
    permission: PERMISSIONS.ASSISTANT_SHIFT.GET_ALL_BY_SERIES,
  },
];

export const AssistantShiftWorkspaceLayout = () => {
  const hasPermission = useHasPermission;
  const visibleTabs = tabs.filter((tab) => hasPermission(tab.permission));

  return (
    <div className="flex h-screen min-h-0 flex-col bg-primary-dark">
      <header className="shrink-0 border-b border-border bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              to={ROUTES.DASHBOARD}
              className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-border bg-primary px-3 py-2 text-sm font-medium text-foreground transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </Link>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-blue-600">Lịch trợ giảng</p>
              <h1 className="truncate text-xl font-semibold text-foreground">Không gian quản lý lịch trợ giảng</h1>
            </div>
          </div>

          <nav className="flex overflow-x-auto rounded-sm border border-border bg-gray-50 p-1">
            {visibleTabs.map((tab) => (
              <NavLink
                key={tab.href}
                to={tab.href}
                className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-foreground-light hover:bg-white hover:text-foreground'
                }`}
              >
                {createElement(tab.icon, { className: 'h-4 w-4' })}
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto p-5">
        <Outlet />
      </main>
    </div>
  );
};
