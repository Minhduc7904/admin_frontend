import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { setSidebarOpen } from '@/shared/store';

export interface SidebarMenuItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    badge?: string;
}

interface SidebarProps {
    title: string;
    subtitle?: string;
    menuItems: SidebarMenuItem[];
    activeItem: string;
    onItemClick: (itemId: string) => void;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
    title,
    subtitle,
    menuItems,
    activeItem,
    onItemClick,
    headerContent,
    footerContent,
}) => {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.ui.sidebarOpen);
    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 256 : 80 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white border-r border-gray-200 h-full flex flex-col relative"
        >
            {/* Toggle Button */}
            <button
                onClick={() => dispatch(setSidebarOpen(!isOpen))}
                className="absolute -right-3 top-1/2 z-[40] w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                aria-label={isOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
            >
                {isOpen ? (
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
            </button>

            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 ">
                <AnimatePresence>
                    {isOpen ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {headerContent || (
                                <>
                                    <h2 className="text-lg font-bold text-gray-900 truncate">{title}</h2>
                                    {subtitle && (
                                        <p className="text-xs text-gray-600 mt-1 truncate">{subtitle}</p>
                                    )}
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex justify-center"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{title.charAt(0)}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors relative ${
                            activeItem === item.id
                                ? 'bg-gray-900 text-white border-l-4 border-black'
                                : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                        }`}
                        title={!isOpen ? item.label : undefined}
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">{item.icon}</div>
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="whitespace-nowrap  truncate"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                        <AnimatePresence>
                            {isOpen && item.badge && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                                        activeItem === item.id
                                            ? 'bg-white text-gray-900'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {item.badge}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                ))}
            </nav>

            {/* Sidebar Footer */}
            {footerContent && (
                <div className="border-t border-gray-200 bg-gray-50 ">
                    <AnimatePresence>
                        {isOpen ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="p-4"
                            >
                                {footerContent}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="p-2 flex justify-center"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.aside>
    );
};
