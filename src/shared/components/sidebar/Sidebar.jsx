import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STORAGE_KEYS } from '../../../core/constants';
import { OnlineUsersWidget } from '../socket/OnlineUsersWidget';
import { useHasPermission } from '../../../shared/hooks';
/* =========================================================
 * Small Components (same file)
 * ======================================================= */

const SidebarToggle = ({ isOpen, onToggle }) => (
    <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 z-40 w-6 h-6 bg-primary border border-border rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm"
    >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
    </button>
);

const SidebarLabelOrDivider = ({ label, isOpen }) => (
    <AnimatePresence mode="wait">
        {isOpen ? (
            <motion.p
                key="label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="px-3 mb-2 text-[10px] truncate font-semibold uppercase tracking-wider text-foreground-light"
            >
                {label}
            </motion.p>
        ) : (
            <motion.div
                key="divider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-3 mb-5 flex justify-center shrink-0"
            >
                <hr className="border-foreground-light w-full shrink-0" />
            </motion.div>
        )}
    </AnimatePresence>
);

const SidebarItem = ({ item, isOpen, isCollapseDone, isActive }) => {
    const Icon = item.icon;

    return (
        <Link
            to={item.href}
            title={!isOpen ? item.name : undefined}
            className={`
        flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors
        ${isCollapseDone ? 'justify-center' : 'justify-start'}
        ${isActive
                    ? 'bg-gray-100 text-foreground font-medium'
                    : 'text-foreground-light hover:bg-gray-50'}
      `}
        >
            <Icon size={18} className="shrink-0" />

            <AnimatePresence>
                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                    >
                        {item.name}
                    </motion.span>
                )}
            </AnimatePresence>
        </Link>
    );
};


const SidebarSection = ({
    section,
    location,
    isOpen,
    isCollapseDone,
}) => {
    const hasPermission = useHasPermission;

    // ✅ Filter items theo permission
    const visibleItems = section.items.filter((item) => {
        if (!item.permission) return true;
        return hasPermission(item.permission);
    });

    // 🚨 Nếu không có item nào → KHÔNG render section
    if (visibleItems.length === 0) {
        return null;
    }

    return (
        <div>
            {section.label && (
                <SidebarLabelOrDivider
                    label={section.label}
                    isOpen={isOpen}
                />
            )}

            <div className="space-y-1">
                {visibleItems.map((item) => (
                    <SidebarItem
                        key={item.key}
                        item={item}
                        isOpen={isOpen}
                        isCollapseDone={isCollapseDone}
                        isActive={location.pathname.startsWith(item.href)}
                    />
                ))}
            </div>
        </div>
    );
};

const SidebarFooter = ({ isOpen }) => (
    <div className="border-t border-border p-3">
        <OnlineUsersWidget isOpen={isOpen} />
    </div>
);

/* =========================================================
 * Main Sidebar
 * ======================================================= */

export const Sidebar = ({ sections }) => {
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_OPEN);
        return stored !== null ? stored === 'true' : true;
    });

    const [isCollapseDone, setIsCollapseDone] = useState(!isOpen);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_OPEN, isOpen.toString());
    }, [isOpen]);

    return (
        <div className="sticky top-[73.5px] h-[calc(100vh-73.5px)]">
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 256 : 92 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-primary border-r border-border h-full flex flex-col relative"
                onAnimationStart={() => {
                    if (isOpen) setIsCollapseDone(false);
                }}
                onAnimationComplete={() => {
                    if (!isOpen) setIsCollapseDone(true);
                }}
            >
                <SidebarToggle
                    isOpen={isOpen}
                    onToggle={() => setIsOpen((v) => !v)}
                />

                {/* ===== MENU ===== */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                    {sections.map((section, idx) => (
                        <SidebarSection
                            key={idx}
                            section={section}
                            location={location}
                            isOpen={isOpen}
                            isCollapseDone={isCollapseDone}
                        />
                    ))}
                </nav>

                <SidebarFooter isOpen={isOpen} />
            </motion.aside>
        </div>
    );
};
