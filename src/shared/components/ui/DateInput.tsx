import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateInputProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
    placeholder = 'dd/mm/yyyy',
    label,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Convert ISO date (yyyy-mm-dd) to display format (dd/mm/yyyy)
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                setDisplayValue(`${day}/${month}/${year}`);
                setCurrentMonth(date);
            }
        } else {
            setDisplayValue('');
        }
    }, [value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
        
        if (input.length >= 2) {
            input = input.slice(0, 2) + '/' + input.slice(2);
        }
        if (input.length >= 5) {
            input = input.slice(0, 5) + '/' + input.slice(5, 9);
        }
        
        setDisplayValue(input);

        // Try to parse and convert to ISO format
        if (input.length === 10) {
            const [day, month, year] = input.split('/');
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            if (!isNaN(date.getTime())) {
                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                onChange(isoDate);
            }
        }
    };

    // Handle date selection from calendar
    const handleDateSelect = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        const isoDate = `${year}-${month}-${day}`;
        onChange(isoDate);
        setIsOpen(false);
    };

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty slots for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days in month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    // Navigate months
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    // Check if date is selected
    const isDateSelected = (date: Date | null) => {
        if (!date || !value) return false;
        const selectedDate = new Date(value);
        return date.getDate() === selectedDate.getDate() &&
               date.getMonth() === selectedDate.getMonth() &&
               date.getFullYear() === selectedDate.getFullYear();
    };

    // Check if date is today
    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    return (
        <div className={className} ref={containerRef}>
            {label && (
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    value={displayValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    maxLength={10}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <Calendar size={16} />
                </button>

                {/* Calendar Dropdown */}
                {isOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 w-64">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                onClick={goToPreviousMonth}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="text-xs font-semibold text-gray-900">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </div>
                            <button
                                type="button"
                                onClick={goToNextMonth}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Week Days */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-[10px] font-medium text-gray-500 py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((date, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => date && handleDateSelect(date)}
                                    disabled={!date}
                                    className={`
                                        text-[11px] py-1.5 rounded transition-colors
                                        ${!date ? 'invisible' : ''}
                                        ${isDateSelected(date) ? 'bg-gray-900 text-white font-semibold' : ''}
                                        ${!isDateSelected(date) && isToday(date) ? 'bg-blue-100 text-blue-700 font-semibold' : ''}
                                        ${!isDateSelected(date) && !isToday(date) ? 'hover:bg-gray-100 text-gray-700' : ''}
                                    `}
                                >
                                    {date?.getDate()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
