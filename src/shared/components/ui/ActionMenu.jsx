import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export const ActionMenu = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
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

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right - 192 + window.scrollX // 192px = w-48
            });
        }
        setIsOpen(!isOpen);
    };

    const handleItemClick = (onClick) => {
        onClick();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="rounded-sm bg-primary group-hover:bg-gray-50 text-foreground-light hover:text-foreground"
            >
                <MoreVertical size={18} />
            </button>

            {isOpen && (
                <div
                    className="fixed w-48 bg-white border border-border rounded-sm shadow-lg z-50"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`
                    }}
                >
                    <div className="py-1">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleItemClick(item.onClick)}
                                disabled={item.disabled}
                                className={`w-full text-left px-4 py-2 text-sm bg-primary flex items-center gap-2 transition-colors ${item.variant === 'danger'
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-foreground hover:bg-gray-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};