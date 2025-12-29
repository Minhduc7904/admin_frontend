import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Sidebar = ({ menuItems }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="sticky top-[73.5px] h-[calc(100vh-73.5px)]">
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 256 : 80 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-primary border-r border-border h-full flex flex-col relative"
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-3 top-1/2 z-40 w-6 h-6 bg-primary border border-border rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                    aria-label={isOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
                >
                    {isOpen ? (
                        <ChevronLeft size={16} className="text-foreground" />
                    ) : (
                        <ChevronRight size={16} className="text-foreground" />
                    )}
                </button>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2 rounded-sm transition-colors text-sm relative
                                        ${isActive
                                            ? 'bg-gray-100 text-foreground font-medium'
                                            : 'text-foreground-light hover:bg-gray-50'
                                        }
                                    `}
                                    title={!isOpen ? item.name : undefined}
                                >
                                    <div className="flex-shrink-0">
                                        <Icon size={18} />
                                    </div>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="whitespace-nowrap truncate"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </motion.aside>
        </div>
    );
};
