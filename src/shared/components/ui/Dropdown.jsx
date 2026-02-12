import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { LabelWithTooltip } from './LabelWithTooltip'

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
    tooltipText,
    tooltipPosition = 'top',
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)
    const menuRef = useRef(null)
    const dropdownId = id || name

    // Click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find((opt) => opt.value === value)

    const handleSelect = (optionValue) => {
        onChange(optionValue)
        setIsOpen(false)
    }

    return (
        <div className={className}>
            {/* Label */}
            <LabelWithTooltip
                label={label}
                required={required}
                tooltipText={tooltipText}
                tooltipPosition={tooltipPosition}
                htmlFor={dropdownId}
            />

            <div ref={containerRef} className="relative">
                {/* Trigger */}
                <button
                id={dropdownId}
                type="button"
                onClick={() => !disabled && setIsOpen((v) => !v)}
                disabled={disabled}
                className={`
                    w-full flex items-center justify-between px-3 py-2 text-sm border rounded-sm
                    focus:outline-none truncate
                    ${error
                        ? 'border-red-500'
                        : 'border-border focus:border-foreground'}
                    ${disabled
                        ? 'bg-gray-50 text-foreground-light cursor-not-allowed'
                        : 'bg-primary'}
                `}
            >
                <span
                    className={
                        selectedOption
                            ? 'text-foreground'
                            : 'text-foreground-lighter'
                    }
                >
                    {selectedOption
                        ? selectedOption.label
                        : placeholder}
                </span>

                <ChevronDown
                    size={16}
                    className={`text-foreground-lighter shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

                {/* Menu */}
                {isOpen && !disabled && (
                    <div
                        ref={menuRef}
                        className={`
                            absolute ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'}
                            left-0 right-0 z-50
                            bg-primary border border-border rounded-sm shadow-lg
                            max-h-60 overflow-y-auto
                        `}
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    handleSelect(option.value)
                                }
                                className="
                                    w-full bg-primary flex items-center justify-between
                                    px-3 py-2 text-sm text-left
                                    hover:bg-gray-50
                                "
                            >
                                <span
                                    className={
                                        option.value === value
                                            ? 'font-medium'
                                            : ''
                                    }
                                >
                                    {option.label}
                                </span>
                                {option.value === value && (
                                    <Check size={16} />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
            {!error && helperText && (
                <p className="text-xs text-foreground-light mt-1">
                    {helperText}
                </p>
            )}
        </div>
    )
}
