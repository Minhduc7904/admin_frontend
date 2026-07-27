import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const dateKey = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const AssistantShiftCurrentTimeIndicator = ({ days, startMinute, endMinute, position }) => {
  const [now, setNow] = useState(() => new Date());
  const [bounds, setBounds] = useState(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const minute = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const todayIndex = days.findIndex((day) => dateKey(day) === dateKey(now));
  const isVisible = todayIndex >= 0 && minute >= startMinute && minute <= endMinute;

  useLayoutEffect(() => {
    if (!isVisible || !indicatorRef.current) return undefined;

    const grid = indicatorRef.current.parentElement;
    const dayColumn = grid?.children[todayIndex + 1];
    if (!grid || !dayColumn) return undefined;

    const updateBounds = () => {
      const next = { left: dayColumn.offsetLeft, width: dayColumn.offsetWidth };
      setBounds((current) => current?.left === next.left && current?.width === next.width ? current : next);
    };
    updateBounds();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateBounds);
    observer?.observe(grid);
    observer?.observe(dayColumn);
    window.addEventListener('resize', updateBounds);
    return () => { observer?.disconnect(); window.removeEventListener('resize', updateBounds); };
  }, [isVisible, position, todayIndex]);

  if (!isVisible) return null;

  return <div ref={indicatorRef} aria-hidden="true" className="pointer-events-none absolute z-[5]" style={{ top: position(minute), left: bounds?.left || 0, width: bounds?.width || 0 }}><span className="absolute inset-x-0 top-0 h-px -translate-y-1/2 bg-orange-500 shadow-[0_0_2px_rgba(249,115,22,0.65)]" /><span className="absolute -left-1.5 top-0 h-3 w-3 -translate-y-1/2 rounded-full bg-orange-500 shadow-sm" /></div>;
};
