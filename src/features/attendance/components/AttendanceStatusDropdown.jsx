import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { ATTENDANCE_STATUS_OPTIONS } from '../../../core/constants/options';

/* ===================== STATUS BADGE MAP ===================== */
const STATUS_BADGE = {
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT: 'bg-red-100 text-red-700',
    LATE: 'bg-yellow-100 text-yellow-700',
    MAKEUP: 'bg-blue-100 text-blue-700',
};

const STATUS_LABEL = {
    PRESENT: 'Có mặt',
    ABSENT: 'Vắng',
    LATE: 'Muộn',
    MAKEUP: 'Học bù',
};

export const AttendanceStatusDropdown = ({ value, onChange, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    // Calculate dropdown position
    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    };

    // Update position when opening
    useEffect(() => {
        if (isOpen) {
            updatePosition();
        }
    }, [isOpen]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(e.target) &&
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen]);

    const selectedOption = ATTENDANCE_STATUS_OPTIONS.find((opt) => opt.value === value);

    const handleSelect = (optionValue) => {
        if (optionValue !== value) {
            onChange(optionValue);
        }
        setIsOpen(false);
    };

    return (
        <div
            className="relative inline-block w-full"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Selected Value Display */}
            <button
                ref={buttonRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    inline-flex items-center justify-between gap-2 px-2.5 py-1 rounded-full text-xs font-medium
                    w-full min-w-[100px]
                    ${STATUS_BADGE[value] || 'bg-gray-100 text-gray-700'}
                    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80'}
                    transition-opacity
                `}
            >
                <span className="flex-1 text-left truncate">
                    {selectedOption?.label || STATUS_LABEL[value] || 'Chọn...'}
                </span>
                <ChevronDown
                    size={14}
                    className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu - Rendered to document.body via Portal */}
            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    className="bg-white border border-border rounded-lg shadow-lg overflow-hidden"
                    style={{
                        position: 'absolute',
                        top: `${dropdownPosition.top + 4}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                        minWidth: '120px',
                        zIndex: 99999,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {ATTENDANCE_STATUS_OPTIONS.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`
                                    w-full px-3 py-2 bg-white text-left text-sm flex items-center justify-between gap-2
                                    hover:bg-gray-50 transition-colors
                                    ${isSelected ? 'bg-gray-50' : ''}
                                `}
                            >
                                <span className={`flex items-center gap-2 flex-1`}>
                                    <span
                                        className={`
                                            inline-block w-2 h-2 rounded-full
                                            ${option.value === 'PRESENT' ? 'bg-green-500' : ''}
                                            ${option.value === 'ABSENT' ? 'bg-red-500' : ''}
                                            ${option.value === 'LATE' ? 'bg-yellow-500' : ''}
                                            ${option.value === 'MAKEUP' ? 'bg-blue-500' : ''}
                                        `}
                                    />
                                    <span className="text-foreground">{option.label}</span>
                                </span>
                                {isSelected && (
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
};
