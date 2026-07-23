import { CalendarDays, Clock3, UserCheck, UserX, UsersRound } from 'lucide-react';
import { createElement, useMemo } from 'react';

export const AssistantShiftCalendarStats = ({ shifts }) => {
  const stats = useMemo(() => shifts.reduce((total, shift) => {
    const assignments = shift.assignments || [];
    total.registered += assignments.length;
    total.required += Number(shift.requiredAssistantCount) || 0;
    assignments.forEach((assignment) => { if (assignment.attendanceStatus === 'PRESENT') total.present += 1; else if (assignment.attendanceStatus === 'ABSENT') total.absent += 1; else total.pending += 1; });
    return total;
  }, { total: shifts.length, registered: 0, required: 0, present: 0, absent: 0, pending: 0 }), [shifts]);
  const cards = [{ label: 'Tổng số ca', value: stats.total, icon: CalendarDays, color: 'text-blue-600' }, { label: 'Chỗ đã đăng ký', value: `${stats.registered}/${stats.required}`, icon: UsersRound, color: 'text-indigo-600' }, { label: 'Trợ giảng có mặt', value: stats.present, icon: UserCheck, color: 'text-emerald-600' }, { label: 'Trợ giảng vắng', value: stats.absent, icon: UserX, color: 'text-red-600' }, { label: 'Trợ giảng chưa đi', value: stats.pending, icon: Clock3, color: 'text-amber-600' }];
  return <div className="grid grid-cols-2 border-t border-border bg-white/95 backdrop-blur sm:grid-cols-5">{cards.map(({ label, value, icon, color }) => <div key={label} className="flex min-w-0 items-center justify-center gap-2 border-b border-border px-3 py-2 text-xs sm:border-b-0 sm:border-r last:border-r-0">{createElement(icon, { className: `h-4 w-4 shrink-0 ${color}` })}<span className="truncate text-foreground-light">{label}</span><strong className="text-foreground">{value}</strong></div>)}</div>;
};
