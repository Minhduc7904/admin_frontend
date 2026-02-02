import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'

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
    const [isOpen, setIsOpen] = useState(false)
    const [menuStyle, setMenuStyle] = useState({})
    const triggerRef = useRef(null)
    const menuRef = useRef(null)
    const dropdownId = id || name

    // Click outside (trigger + menu)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(e.target) &&
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Calculate menu position
    useEffect(() => {
        if (!isOpen || !triggerRef.current) return

        const rect = triggerRef.current.getBoundingClientRect()

        const top = dropUp
            ? rect.top
            : rect.bottom

        setMenuStyle({
            position: 'fixed',
            top: dropUp ? rect.top - 4 : rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
        })
    }, [isOpen, dropUp])

    const selectedOption = options.find((opt) => opt.value === value)

    const handleSelect = (optionValue) => {
        onChange(optionValue)
        setIsOpen(false)
    }

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

            {/* Trigger */}
            <button
                ref={triggerRef}
                id={dropdownId}
                type="button"
                onClick={() => !disabled && setIsOpen((v) => !v)}
                disabled={disabled}
                className={`
                    w-full flex items-center justify-between px-3 py-2 text-sm border rounded-sm
                    focus:outline-none
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
                    className={`text-foreground-lighter transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Portal menu */}
            {isOpen &&
                !disabled &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={menuStyle}
                        className="
                            bg-primary border border-border rounded-sm shadow-lg
                            max-h-60 overflow-y-auto
                        "
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
                    </div>,
                    document.body,
                )}

            {/* Error / Helper */}
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
