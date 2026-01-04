import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const Dropdown = ({
    label,
    name,
    id,
    value,
    onChange,
    options = [],
    placeholder = 'Chọn...',
    disabled = false,
    required = false,
    helperText,
    error,
    dropUp = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownId = id || name;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={className}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={dropdownId}
                    className="block text-sm font-medium text-foreground mb-1"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Wrapper for relative positioning */}
            <div ref={dropdownRef} className="relative">

                {/* Trigger */}
                <button
                    id={dropdownId}
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-sm focus:outline-none
          ${error
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-foreground'
                        }
          ${disabled
                            ? 'bg-gray-50 text-foreground-light cursor-not-allowed'
                            : 'bg-primary'
                        }
        `}
                >
                    <span className={selectedOption ? 'text-foreground' : 'text-foreground-lighter'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-foreground-lighter transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Menu */}
                {isOpen && !disabled && (
                    <div
                        className={`absolute z-50 w-full bg-primary border border-border rounded-sm shadow-lg max-h-60 overflow-y-auto
            ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'}
          `}
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className="w-full bg-primary flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50"
                            >
                                <span className={option.value === value ? 'font-medium' : ''}>
                                    {option.label}
                                </span>
                                {option.value === value && (
                                    <Check size={16} />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Error / Helper */}
                {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
                {!error && helperText && (
                    <p className="text-xs text-foreground-light mt-1">{helperText}</p>
                )}
            </div>
        </div>
    );
};
