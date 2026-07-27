import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

let openModalCount = 0

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  customContent = false,
  fullScreenOnMobile = false,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined

    openModalCount += 1
    document.body.style.overflow = 'hidden'
    return () => {
      openModalCount = Math.max(0, openModalCount - 1)
      if (openModalCount === 0) document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    max: 'max-w-full',
  }

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${fullScreenOnMobile ? 'p-0 md:p-4' : 'p-4'}`}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className={`
          bg-primary shadow-lg w-full ${fullScreenOnMobile ? 'h-[100dvh] !max-h-none !rounded-none md:!h-auto md:!max-h-[calc(100vh-4rem)] md:!rounded-sm' : 'rounded-sm'}
          ${sizeClasses[size]}
          max-h-[calc(100vh-4rem)]   /* 👈 CHỪA KHOẢNG TRỐNG TRÊN & DƯỚI */
          flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            {title && (
              <h3 className="text-lg font-semibold text-foreground">
                {title}
              </h3>
            )}

            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-sm text-foreground-light hover:text-foreground hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content – SCROLL HERE */}
        {customContent ? (
          children
        ) : (
          <div className="p-4 overflow-y-auto flex-1">
            {children}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
