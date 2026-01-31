import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Tooltip = ({ children, text, position = 'right' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    useEffect(() => {
        if (!isVisible || !triggerRef.current) return;

        const updatePosition = () => {
            const rect = triggerRef.current.getBoundingClientRect();
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;

            let top = 0;
            let left = 0;

            switch (position) {
                case 'right':
                    top = rect.top + scrollY + rect.height / 2;
                    left = rect.right + scrollX + 12;
                    break;
                case 'left':
                    top = rect.top + scrollY + rect.height / 2;
                    left = rect.left + scrollX - 12;
                    break;
                case 'top':
                    top = rect.top + scrollY - 12;
                    left = rect.left + scrollX + rect.width / 2;
                    break;
                case 'bottom':
                    top = rect.bottom + scrollY + 12;
                    left = rect.left + scrollX + rect.width / 2;
                    break;
                default:
                    break;
            }

            setTooltipPosition({ top, left });
        };

        updatePosition();
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isVisible, position]);

    const transformClasses = {
        right: '-translate-y-1/2',
        left: '-translate-y-1/2 -translate-x-full',
        top: '-translate-x-1/2 -translate-y-full',
        bottom: '-translate-x-1/2',
    };

    const arrowClasses = {
        right: 'left-[-4px] top-1/2 -translate-y-1/2',
        left: 'right-[-4px] top-1/2 -translate-y-1/2',
        top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
        bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
    };

    const tooltipContent = isVisible && (
        <div
            style={{
                position: 'absolute',
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
            }}
            className={`
                pointer-events-none
                ${transformClasses[position]}
                transition-opacity duration-200
                z-[9999]
                whitespace-nowrap
            `}
        >
            <div className="relative bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg">
                {text}
                {/* ARROW */}
                <div className={`
                    absolute ${arrowClasses[position]}
                    w-2 h-2 bg-gray-900 rotate-45
                `} />
            </div>
        </div>
    );

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="inline-block w-full"
            >
                {children}
            </div>
            {tooltipContent && createPortal(tooltipContent, document.body)}
        </>
    );
};
