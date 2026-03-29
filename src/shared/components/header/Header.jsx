import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { logoutAsync } from '../../../features/auth/store/authSlice';
import { NotificationBell } from '../../../features/notification/components';
import { clearProfile } from '../../../features/profile/store/profileSlice';
import { ROUTES } from '../../../core/constants';

export const Header = ({ onMenuClick, title = 'Dashboard' }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { profile } = useAppSelector((state) => state.profile);
    const avatarUrl = profile?.avatarUrl || profile?.avatarurl || null;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await dispatch(logoutAsync());
        dispatch(clearProfile());
        navigate(ROUTES.LOGIN);
    };

    const getRoleName = (roles) => {
        if (!roles || roles.length === 0) return '';
        return roles.map((role) => role.roleName).join(', ');
    };

    return (
        <header className="bg-primary border-b border-border sticky top-0 z-40">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Left: Menu button + Title */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light lg:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu size={18} />
                    </button>
                    <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                </div>

                {/* Right: Notifications + User menu */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <NotificationBell />

                    {/* User Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="bg-primary rounded-lg flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors"
                        >
                            {/* Avatar */}
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white overflow-hidden">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={profile?.fullName || 'Avatar'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={16} />
                                )}
                            </div>

                            {/* User info - Hidden on mobile */}
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-foreground leading-tight">
                                    {profile?.fullName || 'User'}
                                </p>
                                <p className="text-xs text-foreground-light">
                                    {getRoleName(profile?.roles)}
                                </p>
                            </div>

                            <ChevronDown
                                size={16}
                                className={`text-foreground-light transition-transform ${showUserMenu ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-1 w-56 bg-primary border border-border rounded-sm shadow-lg overflow-hidden">
                                {/* User info - Show on mobile */}
                                <div className="md:hidden px-4 py-3 border-b border-border">
                                    <p className="text-sm font-medium text-foreground">
                                        {profile?.fullName || 'User'}
                                    </p>
                                    <p className="text-xs text-foreground-light">
                                        {profile?.email || ''}
                                    </p>
                                </div>

                                {/* Menu items */}
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate(ROUTES.PROFILE_INFO);
                                        }}
                                        className="bg-primary w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors"
                                    >
                                        <User size={16} className="text-foreground-light" />
                                        Thông tin cá nhân
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            // Navigate to settings page
                                        }}
                                        className="bg-primary w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors"
                                    >
                                        <Settings size={16} className="text-foreground-light" />
                                        Cài đặt
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-border py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="bg-primary w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error-bg transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
