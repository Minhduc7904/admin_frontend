import { useSelector } from 'react-redux';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { User, Shield, Lock, ChevronRight, Home } from 'lucide-react';
import { selectProfile } from '../store/profileSlice';
import { ROUTES } from '../../../core/constants';
import { Header, PageHeader } from '../../../shared/components/header';
import { ProfileAvatar } from '../components/ProfileAvatar';

export const ProfileLayout = ({ children }) => {
    const profile = useSelector(selectProfile)
    const location = useLocation()

    const tabs = [
        {
            id: 'info',
            label: 'Thông tin cá nhân',
            icon: User,
            path: ROUTES.PROFILE_INFO,
        },
        {
            id: 'permissions',
            label: 'Quyền hạn',
            icon: Shield,
            path: ROUTES.PROFILE_PERMISSIONS,
        },
        {
            id: 'security',
            label: 'Bảo mật',
            icon: Lock,
            path: ROUTES.PROFILE_SECURITY,
        },
    ]

    const getFullName = () => {
        if (profile?.firstName && profile?.lastName) {
            return `${profile.lastName} ${profile.firstName}`
        }
        return profile?.username || 'Người dùng'
    }

    return (
        <div className="min-h-screen bg-primary-dark">
            {/* Header */}
            <Header title="Admin Dashboard" />

            <div className="container mx-auto px-2 py-4 space-y-4">
                {/* ✅ Breadcrumb dùng chung */}
                <PageHeader
                    breadcrumb={[
                        { label: 'Dashboard', to: ROUTES.DASHBOARD },
                        { label: 'Hồ sơ cá nhân' },
                    ]}
                    badge="Tài khoản"
                    description="Quản lý thông tin cá nhân, quyền hạn và bảo mật tài khoản."
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 border-b border-border">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Tài khoản
                                </h2>
                            </div>

                            <nav className="p-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon
                                    const isActive = location.pathname === tab.path

                                    return (
                                        <NavLink
                                            key={tab.id}
                                            to={tab.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${isActive
                                                ? 'bg-gray-100 text-foreground font-medium'
                                                : 'text-foreground-light hover:bg-gray-50 hover:text-foreground'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span className="text-sm">{tab.label}</span>
                                        </NavLink>
                                    )
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-9">
                        <div className="space-y-6">
                            {/* Profile Card */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                                <div className="px-6 pb-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
                                        <ProfileAvatar size="large" />

                                        <div className="flex-1 sm:mt-12">
                                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                                {getFullName()}
                                            </h1>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-foreground-light">
                                                <span>@{profile?.username || 'username'}</span>
                                                {profile?.email && <span>•</span>}
                                                {profile?.email && <span>{profile.email}</span>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 sm:mt-12">
                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Hoạt động
                                            </span>

                                            {profile?.roles?.length > 0 && (
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {profile.roles[0].roleName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="bg-white rounded-lg shadow-md">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
