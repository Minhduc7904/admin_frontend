import React from 'react';
import { Outlet } from 'react-router-dom';
import { ModuleDropdown, SubjectDropdown, UserDropdown } from '@/shared/components/header';

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo & Title */}
                        <div className="flex items-center gap-6">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Admin Panel
                            </h1>
                            
                            {/* Divider */}
                            <div className="h-8 w-px bg-gray-300 hidden md:block"></div>
                            
                            {/* Module & Subject Dropdowns */}
                            <div className="flex items-center gap-3">
                                <ModuleDropdown />
                                <SubjectDropdown />
                            </div>
                        </div>

                        {/* Right: User Dropdown */}
                        <div>
                            <UserDropdown />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full">
                <div className="max-w-7xl w-full mx-auto py-8 h-full">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-gray-600 text-sm">
                        © 2025 Admin Frontend. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};
