import { useState, useRef, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'

const ActionMenuItem = ({ icon, label, onClick, disabled, variant = 'default' }) => {
    const variantClasses = {
        default: 'text-foreground hover:bg-gray-50',
        danger: 'text-red-600 hover:bg-red-50',
        success: 'text-green-600 hover:bg-green-50',
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full px-4 py-2 text-sm flex items-center gap-2 text-left transition-colors
        ${variantClasses[variant]}
        disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{label}</span>
        </button>
    )
}


export const ActionMenu = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const menuRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const toggleMenu = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right - 192 + window.scrollX, // w-48
            })
        }
        setIsOpen((prev) => !prev)
    }

    const handleItemClick = (onClick) => {
        onClick?.()
        setIsOpen(false)
    }

    return (
        <div ref={menuRef} className="relative">
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="rounded-sm bg-primary text-foreground-light hover:text-foreground hover:bg-gray-50"
            >
                <MoreVertical size={18} />
            </button>

            {isOpen && (
                <div
                    className="fixed z-50 w-48 bg-white border border-border rounded-sm shadow-lg"
                    style={{ top: position.top, left: position.left }}
                >
                    <div className="py-1">
                        {items.map((item, index) => (
                            <ActionMenuItem
                                key={index}
                                {...item}
                                onClick={() => handleItemClick(item.onClick)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
