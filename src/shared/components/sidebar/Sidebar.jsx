import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STORAGE_KEYS } from '../../../core/constants';
import { OnlineUsersWidget } from '../socket/OnlineUsersWidget';
import { useHasPermission } from '../../../shared/hooks';
import { Tooltip } from '../ui';

/* =========================================================
 * OPEN SIDEBAR (Full Width with Text)
 * ======================================================= */
const OpenSidebar = ({ sections, location, onToggle }) => {
    const hasPermission = useHasPermission;

    return (
        <aside className="w-64 bg-primary border-r border-border h-full flex flex-col relative">
            <button
                onClick={onToggle}
                className="absolute -right-3 top-1/2 z-40 w-6 h-6 bg-primary border border-border rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm"
            >
                <ChevronLeft size={16} />
            </button>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {sections.map((section, idx) => {
                    const visibleItems = section.items.filter((item) => {
                        if (!item.permission) return true;
                        return hasPermission(item.permission);
                    });

                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={idx}>
                            {section.label && (
                                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground-light">
                                    {section.label}
                                </p>
                            )}

                            <div className="space-y-1">
                                {visibleItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.key}
                                            to={item.href}
                                            className={`
                                                flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors
                                                ${isActive
                                                    ? 'bg-gray-100 text-foreground font-medium'
                                                    : 'text-foreground-light hover:bg-gray-50'}
                                            `}
                                        >
                                            <Icon size={18} className="shrink-0" />
                                            <span className="truncate">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="border-t border-border p-3">
                <OnlineUsersWidget isOpen={true} />
            </div>
        </aside>
    );
};

/* =========================================================
 * CLOSE SIDEBAR (Icon Only with Tooltip)
 * ======================================================= */
const CloseSidebar = ({ sections, location, onToggle }) => {
    const hasPermission = useHasPermission;

    return (
        <aside className="w-[92px] bg-primary border-r border-border h-full flex flex-col relative">
            <button
                onClick={onToggle}
                className="absolute -right-3 top-1/2 z-40 w-6 h-6 bg-primary border border-border rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm"
            >
                <ChevronRight size={16} />
            </button>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {sections.map((section, idx) => {
                    const visibleItems = section.items.filter((item) => {
                        if (!item.permission) return true;
                        return hasPermission(item.permission);
                    });

                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={idx}>
                            {section.label && (
                                <div className="px-3 mb-5 flex justify-center">
                                    <hr className="border-foreground-light w-full" />
                                </div>
                            )}

                            <div className="space-y-1">
                                {visibleItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname.startsWith(item.href);

                                    return (
                                        <Tooltip key={item.key} text={item.name} position="right">
                                            <Link
                                                to={item.href}
                                                className={`
                                                    flex items-center justify-center px-3 py-2 rounded-sm text-sm transition-colors
                                                    ${isActive
                                                        ? 'bg-gray-100 text-foreground font-medium'
                                                        : 'text-foreground-light hover:bg-gray-50'}
                                                `}
                                            >
                                                <Icon size={18} className="shrink-0" />
                                            </Link>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="border-t border-border p-3">
                <OnlineUsersWidget isOpen={false} />
            </div>
        </aside>
    );
};

/* =========================================================
 * Main Sidebar
 * ======================================================= */
export const Sidebar = ({ sections }) => {
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_OPEN);
        return stored !== null ? stored === 'true' : true;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_OPEN, isOpen.toString());
    }, [isOpen]);

    return (
        <div className="sticky top-[73.5px] h-[calc(100vh-73.5px)]">
            {isOpen ? (
                <OpenSidebar
                    sections={sections}
                    location={location}
                    onToggle={() => setIsOpen(false)}
                />
            ) : (
                <CloseSidebar
                    sections={sections}
                    location={location}
                    onToggle={() => setIsOpen(true)}
                />
            )}
        </div>
    );
};
