import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const Dropdown = ({
    value,
    onChange,
    options = [],
    placeholder = 'Chọn...',
    disabled = false,
    dropUp = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="w-full flex items-center justify-between px-3 py-2 text-sm border border-border rounded-sm bg-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className={selectedOption ? 'text-foreground' : 'text-foreground-lighter'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} className={`text-foreground-lighter transition-transform ${dropUp && isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-50 w-full bg-primary border border-border rounded-sm shadow-lg max-h-60 overflow-y-auto ${
                    dropUp ? 'bottom-full mb-1' : 'top-full mt-1'
                }`}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className="w-full flex bg-white items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
                        >
                            <span className={option.value === value ? 'text-foreground font-medium' : 'text-foreground'}>
                                {option.label}
                            </span>
                            {option.value === value && (
                                <Check size={16} className="text-foreground" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
