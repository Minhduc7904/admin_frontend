import { X } from 'lucide-react';

export const SectionTab = ({
    section,
    isActive,
    onClick,
    onClose,
    isFixed = false,
}) => {
    return (
        <div
            onClick={onClick}
            className={`
                relative group
                flex items-center gap-2
                h-9 px-4
                cursor-pointer select-none
                transition-all
                min-w-[140px] max-w-[220px]

                rounded-t-xl
                border border-b-0

                ${isActive
                    ? `
                            bg-white
                            border-gray-300
                            text-gray-900
                            z-10
                          `
                    : `
                            bg-gray-200
                            border-transparent
                            text-gray-600
                            hover:bg-gray-300
                          `
                }
            `}
        >
            {/* Title */}
            <span className="flex-1 truncate text-sm font-medium">
                {section?.title || 'Chưa phân loại'}
            </span>

            {/* Close button */}
            {!isFixed && onClose && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    title="Đóng tab"
                    className="
                        opacity-0 group-hover:opacity-100
                        transition-opacity
                        flex items-center justify-center
                        w-5 h-5
                        rounded
                        text-gray-500
                        hover:bg-gray-300
                        hover:text-gray-800
                    "
                >
                    <X size={14} />
                </button>
            )}

            {/* Bottom cover for inactive tabs */}
            {!isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300" />
            )}
        </div>
    );
};
