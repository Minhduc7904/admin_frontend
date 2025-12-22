import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
    value: string;
    label: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    minWidth?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Chọn...',
    disabled = false,
    className = '',
    minWidth = '150px',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`} style={{ minWidth }}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full px-3 py-2 
                    border border-gray-300 rounded-lg 
                    bg-white
                    flex items-center justify-between gap-2
                    text-sm text-left
                    transition-all duration-200
                    ${disabled 
                        ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                        : 'hover:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent cursor-pointer'
                    }
                    ${isOpen ? 'ring-2 ring-gray-400 border-transparent' : ''}
                `}
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={`
                                w-full px-3 py-2 text-sm text-left
                                flex items-center justify-between gap-2
                                transition-colors duration-150
                                ${option.value === value 
                                    ? 'bg-gray-100 text-gray-900 font-medium' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }
                            `}
                        >
                            <span>{option.label}</span>
                            {option.value === value && (
                                <Check size={14} className="text-gray-700" strokeWidth={2.5} />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
