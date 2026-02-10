import { useState, useEffect } from 'react';

/**
 * Format number to VND currency format (1.000.000)
 */
const formatCurrency = (value) => {
    if (!value) return '';
    // Remove all non-digit characters
    const numbers = value.toString().replace(/\D/g, '');
    // Format with dots as thousand separators
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Parse formatted currency to number
 */
const parseCurrency = (value) => {
    if (!value) return '';
    return value.replace(/\./g, '');
};

export const CurrencyInput = ({
    label,
    name,
    value,
    onChange,
    error,
    placeholder = '0',
    required = false,
    disabled = false,
    helperText,
    className = '',
}) => {
    const [displayValue, setDisplayValue] = useState('');

    // Update display value when prop value changes
    useEffect(() => {
        if (value !== undefined && value !== null) {
            setDisplayValue(formatCurrency(value.toString()));
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e) => {
        const input = e.target.value;
        
        // Remove all non-digit characters
        const rawValue = parseCurrency(input);
        
        // Update display with formatting
        setDisplayValue(formatCurrency(rawValue));
        
        // Call parent onChange with raw number value
        if (onChange) {
            onChange({
                target: {
                    name,
                    value: rawValue,
                },
            });
        }
    };

    const handleFocus = (e) => {
        // Select all on focus for easier editing
        e.target.select();
    };

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`w-full px-3 py-2 pr-12 text-sm border rounded-sm focus:outline-none ${
                        error
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-foreground'
                    } ${
                        disabled
                            ? 'bg-gray-50 text-foreground-light cursor-not-allowed'
                            : 'bg-primary'
                    } ${className}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground-light pointer-events-none">
                    VNĐ
                </span>
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
            {!error && helperText && (
                <p className="text-xs text-foreground-light mt-1">{helperText}</p>
            )}
        </div>
    );
};