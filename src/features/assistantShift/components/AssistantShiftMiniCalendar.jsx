import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

const MONTH_NAMES = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
const WEEKDAY_NAMES = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const startOfWeek = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return date; };
const sameDay = (first, second) => first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();

export const AssistantShiftMiniCalendar = ({ selectedWeekStart, onSelectWeek, mode = 'week', selectedMonth, onSelectMonth }) => {
  const initialCursor = selectedMonth || selectedWeekStart || new Date();
  const [cursor, setCursor] = useState(() => new Date(initialCursor));
  const monthDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = startOfWeek(first);
    return Array.from({ length: 42 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return date; });
  }, [cursor]);
  const selectedEnd = useMemo(() => {
    if (!selectedWeekStart) return null;
    const end = new Date(selectedWeekStart);
    end.setDate(end.getDate() + 6);
    return end;
  }, [selectedWeekStart]);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const changeMonth = (offset) => setCursor((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  const changeYear = (offset) => setCursor((current) => new Date(current.getFullYear() + offset, current.getMonth(), 1));

  if (mode === 'month') {
    const selected = selectedMonth || cursor;
    return (
      <section className="mt-5 rounded-lg border border-border bg-gray-50/70 p-3">
        <div className="mb-3 grid grid-cols-[28px_1fr_28px] items-center">
          <button type="button" onClick={() => changeYear(-1)} aria-label="Năm trước" className="rounded p-1 text-foreground-light hover:bg-white hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
          <p className="text-center text-sm font-semibold text-foreground">{cursor.getFullYear()}</p>
          <button type="button" onClick={() => changeYear(1)} aria-label="Năm sau" className="rounded p-1 text-foreground-light hover:bg-white hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MONTH_NAMES.map((name, index) => {
            const active = selected.getFullYear() === cursor.getFullYear() && selected.getMonth() === index;
            const currentMonth = today.getFullYear() === cursor.getFullYear() && today.getMonth() === index;
            return (
              <button
                type="button"
                key={name}
                onClick={() => {
                  const next = new Date(cursor.getFullYear(), index, 1);
                  setCursor(next);
                  onSelectMonth?.(next);
                }}
                className={`rounded px-2 py-2 text-xs font-medium transition ${active ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-foreground hover:bg-blue-50 hover:text-blue-700'} ${currentMonth && !active ? 'ring-1 ring-blue-200' : ''}`}
              >
                {name.replace('Tháng ', 'T')}
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  return <section className="mt-5 rounded-lg border border-border bg-gray-50/70 p-3"><div className="mb-2 grid grid-cols-[28px_1fr_28px] items-center"><button type="button" onClick={() => changeMonth(-1)} aria-label="Tháng trước" className="rounded p-1 text-foreground-light hover:bg-white hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button><p className="text-center text-sm font-semibold text-foreground">{MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}</p><button type="button" onClick={() => changeMonth(1)} aria-label="Tháng sau" className="rounded p-1 text-foreground-light hover:bg-white hover:text-foreground"><ChevronRight className="h-4 w-4" /></button></div><div className="grid grid-cols-7 text-center">{WEEKDAY_NAMES.map((name) => <span key={name} className="py-1 text-[10px] font-medium text-foreground-light">{name}</span>)}{monthDays.map((date) => { const isCurrentMonth = date.getMonth() === cursor.getMonth(); const inSelectedWeek = selectedWeekStart && selectedEnd && date >= selectedWeekStart && date <= selectedEnd; const isToday = sameDay(date, today); return <button type="button" key={date.toISOString()} onClick={() => { setCursor(new Date(date.getFullYear(), date.getMonth(), 1)); onSelectWeek?.(startOfWeek(date)); }} className={`relative m-0.5 flex h-7 items-center justify-center rounded text-xs transition ${!isCurrentMonth ? 'text-gray-300' : 'text-foreground'} ${inSelectedWeek ? 'bg-blue-100 font-semibold text-blue-800' : 'hover:bg-white'} ${isToday ? 'z-10 bg-blue-600 font-bold text-white ring-2 ring-blue-200 ring-offset-1 hover:bg-blue-700' : ''}`}>{date.getDate()}</button>; })}</div></section>;
};
