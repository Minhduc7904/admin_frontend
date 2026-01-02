import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Dropdown } from './Dropdown'
import { Button } from './Button'

export const DateTimePicker = ({
    value,
    onChange,
    label,
    disabled = false,
    placeholder = 'Chọn thời gian',
    mode = 'datetime', // 👈 NEW
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [dateTime, setDateTime] = useState({
        day: '',
        month: '',
        year: '',
        hour: '',
        minute: '',
    })

    /* =====================
     * Parse value
     * ===================== */
    useEffect(() => {
        if (!value) return

        const date = new Date(value)
        setDateTime({
            day: date.getDate().toString().padStart(2, '0'),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            year: date.getFullYear().toString(),
            hour: date.getHours().toString().padStart(2, '0'),
            minute: date.getMinutes().toString().padStart(2, '0'),
        })
    }, [value])

    /* =====================
     * Options
     * ===================== */
    const dayOptions = Array.from({ length: 31 }, (_, i) => ({
        value: String(i + 1).padStart(2, '0'),
        label: String(i + 1).padStart(2, '0'),
    }))

    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1).padStart(2, '0'),
        label: String(i + 1).padStart(2, '0'),
    }))

    const currentYear = new Date().getFullYear()
    const yearOptions = Array.from({ length: 10 }, (_, i) => ({
        value: String(currentYear - 5 + i),
        label: String(currentYear - 5 + i),
    }))

    const hourOptions = Array.from({ length: 24 }, (_, i) => ({
        value: String(i).padStart(2, '0'),
        label: String(i).padStart(2, '0'),
    }))

    const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
        value: String(i).padStart(2, '0'),
        label: String(i).padStart(2, '0'),
    }))

    /* =====================
     * Helpers
     * ===================== */
    const emitChange = (next) => {
        const { day, month, year, hour, minute } = next

        if (mode === 'date' && day && month && year) {
            onChange?.(`${year}-${month}-${day}T00:00:00`)
        }

        if (mode === 'time' && hour && minute) {
            const today = new Date()
            onChange?.(
                `${today.toISOString().split('T')[0]}T${hour}:${minute}:00`
            )
        }

        if (
            mode === 'datetime' &&
            day && month && year && hour && minute
        ) {
            onChange?.(`${year}-${month}-${day}T${hour}:${minute}:00`)
        }
    }

    const handleChange = (field, value) => {
        const next = { ...dateTime, [field]: value }
        setDateTime(next)
        emitChange(next)
    }

    const handleClear = () => {
        setDateTime({ day: '', month: '', year: '', hour: '', minute: '' })
        onChange?.(null)
        setIsOpen(false)
    }

    const formatDisplay = () => {
        if (mode === 'date') {
            return dateTime.day
                ? `${dateTime.day}/${dateTime.month}/${dateTime.year}`
                : placeholder
        }

        if (mode === 'time') {
            return dateTime.hour
                ? `${dateTime.hour}:${dateTime.minute}`
                : placeholder
        }

        if (mode === 'datetime') {
            return dateTime.day
                ? `${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour || '00'}:${dateTime.minute || '00'}`
                : placeholder
        }
    }

    /* =====================
     * Render
     * ===================== */
    return (
        <div className="relative">
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(true)}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-primary flex items-center justify-between"
            >
                <span className={dateTime.day ? 'text-foreground' : 'text-foreground-lighter'}>
                    {formatDisplay()}
                </span>
                <div className="flex gap-1 text-foreground-light">
                    {mode !== 'time' && <Calendar size={16} />}
                    {mode !== 'date' && <Clock size={16} />}
                </div>
            </button>

            {isOpen && !disabled && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-full bg-primary border border-border rounded-sm shadow-lg z-20 p-3 space-y-3">

                        {/* Date */}
                        {mode !== 'time' && (
                            <div>
                                <p className="text-xs text-foreground-light mb-1">Ngày</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <Dropdown value={dateTime.day} onChange={(v) => handleChange('day', v)} options={dayOptions} placeholder="Ngày" />
                                    <Dropdown value={dateTime.month} onChange={(v) => handleChange('month', v)} options={monthOptions} placeholder="Tháng" />
                                    <Dropdown value={dateTime.year} onChange={(v) => handleChange('year', v)} options={yearOptions} placeholder="Năm" />
                                </div>
                            </div>
                        )}

                        {/* Time */}
                        {mode !== 'date' && (
                            <div>
                                <p className="text-xs text-foreground-light mb-1">Giờ</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Dropdown value={dateTime.hour} onChange={(v) => handleChange('hour', v)} options={hourOptions} placeholder="Giờ" />
                                    <Dropdown value={dateTime.minute} onChange={(v) => handleChange('minute', v)} options={minuteOptions} placeholder="Phút" />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2 border-t border-border">
                            <Button size="sm" variant="outline" onClick={handleClear} className="flex-1">
                                Xóa
                            </Button>
                            <Button size="sm" onClick={() => setIsOpen(false)} className="flex-1">
                                Xong
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
