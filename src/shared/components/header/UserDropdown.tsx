import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppDispatch } from '@/core/store/hooks';
import { clearModuleSelection } from '@/features/modules/store/moduleSlice';
import { ROUTES } from '@/core/constants';

export const UserDropdown: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfile = () => {
        setIsOpen(false);
        navigate(ROUTES.PROFILE);
    };

    const handleSettings = () => {
        setIsOpen(false);
        navigate(ROUTES.SETTINGS);
    };

    const handleLogout = () => {
        dispatch(clearModuleSelection());
        logout();
        setIsOpen(false);
    };

    // Get initials from user name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const userInitials = user?.name ? getInitials(user.name) : 'AD';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                {/* Avatar */}
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {userInitials}
                </div>
                {/* User Info */}
                <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-600">{user?.role || 'Administrator'}</p>
                </div>
                <ChevronDown size={16} className={`text-gray-600 transition-transform hidden md:block ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {userInitials}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                                <p className="text-sm text-gray-600">{user?.email || 'admin@example.com'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <button
                            onClick={handleProfile}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        >
                            <User size={18} className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Thông tin cá nhân</span>
                        </button>
                        <button
                            onClick={handleSettings}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        >
                            <Settings size={18} className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Cài đặt</span>
                        </button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors group"
                        >
                            <LogOut size={18} className="text-gray-600 group-hover:text-red-600 transition-colors" />
                            <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                Đăng xuất
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
