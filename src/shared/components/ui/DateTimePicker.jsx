import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { Button } from './Button';

export const DateTimePicker = ({ value, onChange, label, disabled = false, placeholder = 'Chọn ngày giờ' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dateTime, setDateTime] = useState({
        day: '',
        month: '',
        year: '',
        hour: '',
        minute: '',
    });

    // Parse ISO string to dateTime object
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            setDateTime({
                day: date.getDate().toString().padStart(2, '0'),
                month: (date.getMonth() + 1).toString().padStart(2, '0'),
                year: date.getFullYear().toString(),
                hour: date.getHours().toString().padStart(2, '0'),
                minute: date.getMinutes().toString().padStart(2, '0'),
            });
        }
    }, [value]);

    // Generate options
    const dayOptions = Array.from({ length: 31 }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        return { value: day, label: day };
    });
    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        return { value: month, label: month };
    });
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 10 }, (_, i) => {
        const year = (currentYear + i).toString();
        return { value: year, label: year };
    });
    const hourOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return { value: hour, label: hour };
    });
    const minuteOptions = Array.from({ length: 60 }, (_, i) => {
        const minute = i.toString().padStart(2, '0');
        return { value: minute, label: minute };
    });

    const handleChange = (field, value) => {
        const newDateTime = { ...dateTime, [field]: value };
        setDateTime(newDateTime);

        // If all fields are filled, create ISO string
        if (newDateTime.day && newDateTime.month && newDateTime.year && newDateTime.hour && newDateTime.minute) {
            const isoString = `${newDateTime.year}-${newDateTime.month}-${newDateTime.day}T${newDateTime.hour}:${newDateTime.minute}:00`;
            onChange?.(isoString);
        }
    };

    const handleClear = () => {
        setDateTime({ day: '', month: '', year: '', hour: '', minute: '' });
        onChange?.('');
        setIsOpen(false);
    };

    const formatDisplay = () => {
        if (!dateTime.day || !dateTime.month || !dateTime.year) return placeholder;
        return `${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour || '00'}:${dateTime.minute || '00'}`;
    };

    return (
        <div className="relative">
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1">
                    {label}
                </label>
            )}

            {/* Display button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between text-left"
            >
                <span className={dateTime.day ? 'text-foreground' : 'text-foreground-lighter'}>
                    {formatDisplay()}
                </span>
                <div className="flex items-center gap-1 text-foreground-light">
                    <Calendar size={16} />
                    <Clock size={16} />
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && !disabled && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-full bg-primary border border-border rounded-sm shadow-lg z-20 p-3">
                        {/* Date selectors */}
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-foreground-light mb-1">Ngày tháng năm</label>
                            <div className="grid grid-cols-3 gap-2">
                                <Dropdown
                                    value={dateTime.day}
                                    onChange={(value) => handleChange('day', value)}
                                    options={dayOptions}
                                    placeholder="Ngày"
                                />
                                <Dropdown
                                    value={dateTime.month}
                                    onChange={(value) => handleChange('month', value)}
                                    options={monthOptions}
                                    placeholder="Tháng"
                                />
                                <Dropdown
                                    value={dateTime.year}
                                    onChange={(value) => handleChange('year', value)}
                                    options={yearOptions}
                                    placeholder="Năm"
                                />
                            </div>
                        </div>

                        {/* Time selectors */}
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-foreground-light mb-1">Giờ phút</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Dropdown
                                    value={dateTime.hour}
                                    onChange={(value) => handleChange('hour', value)}
                                    options={hourOptions}
                                    placeholder="Giờ"
                                />
                                <Dropdown
                                    value={dateTime.minute}
                                    onChange={(value) => handleChange('minute', value)}
                                    options={minuteOptions}
                                    placeholder="Phút"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-border">
                            <Button
                                type="button"
                                onClick={handleClear}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                            >
                                Xóa
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                variant="primary"
                                size="sm"
                                className="flex-1"
                            >
                                Xong
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

