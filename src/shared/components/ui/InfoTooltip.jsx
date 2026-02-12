import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info } from 'lucide-react'

export const InfoTooltip = ({
    text,
    position = 'right',
    className = '',
    iconSize = 14,
    maxWidth = 240,
}) => {
    const triggerRef = useRef(null)
    const tooltipRef = useRef(null)

    const [visible, setVisible] = useState(false)
    const [coords, setCoords] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (!visible || !triggerRef.current || !tooltipRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()
        const gap = 8

        let top = 0
        let left = 0

        switch (position) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - gap
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
                break
            case 'bottom':
                top = triggerRect.bottom + gap
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
                break
            case 'left':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
                left = triggerRect.left - tooltipRect.width - gap
                break
            case 'right':
            default:
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
                left = triggerRect.right + gap
                break
        }

        setCoords({
            top: Math.max(top, 8),
            left: Math.max(left, 8),
        })
    }, [visible, position])

    return (
        <>
            {/* Trigger */}
            <span
                ref={triggerRef}
                className={`inline-flex ${className}`}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
            >
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary hover:bg-gray-200 transition-colors cursor-help">
                    <Info size={iconSize} className="text-gray-600" strokeWidth={2.5} />
                </span>
            </span>

            {/* Tooltip (Portal) */}
            {visible &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        style={{
                            top: coords.top,
                            left: coords.left,
                            maxWidth,
                        }}
                        className="
              fixed z-[9999]
              rounded-md bg-gray-800 px-3 py-2
              text-xs text-white shadow-lg
              whitespace-pre-line
            "
                    >
                        {text}
                    </div>,
                    document.body
                )}
        </>
    )
}
