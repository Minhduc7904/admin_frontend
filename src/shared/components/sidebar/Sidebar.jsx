import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STORAGE_KEYS } from '../../../core/constants';

export const Sidebar = ({ sections }) => {
    const location = useLocation();
    
    // Get initial state from localStorage, default to true
    const [isOpen, setIsOpen] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_OPEN);
        return stored !== null ? stored === 'true' : true;
    });

    // Save to localStorage whenever isOpen changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_OPEN, isOpen.toString());
    }, [isOpen]);

    return (
        <div className="sticky top-[73.5px] h-[calc(100vh-73.5px)]">
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 256 : 80 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-primary border-r border-border h-full flex flex-col relative"
            >
                {/* Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-3 top-1/2 z-40 w-6 h-6 bg-primary border border-border rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm"
                >
                    {isOpen ? (
                        <ChevronLeft size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                </button>

                {/* Menu */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                    {sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            {/* Section label */}
                            {section.label && (
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
                                            {section.label}
                                        </motion.p>
                                    ) : (
                                        <motion.div
                                            key="divider"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="px-3 mb-5 flex justify-center"
                                        >
                                            <hr className="border-foreground-light w-full" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}

                            {/* Section items */}
                            <div className="space-y-1">
                                {section.items.map((item) => {
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
                                                    : 'text-foreground-light hover:bg-gray-50'
                                                }
                                            `}
                                            title={!isOpen ? item.name : undefined}
                                        >
                                            <Icon size={18} />
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
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </motion.aside>
        </div>
    );
};
