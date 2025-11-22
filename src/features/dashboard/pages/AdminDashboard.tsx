import React from 'react';
import { Shield, Users as UsersIcon, Settings, LogOut } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import { AdminManagementLayout } from '@/shared/layouts/AdminManagementLayout';

export const AdminDashboard: React.FC = () => {
    return (
        <AdminManagementLayout>
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Admin</h1>
                <p className="text-gray-600 mt-1">Phân quyền và quản lý người quản trị</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Tổng Admin">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <Shield className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">12</p>
                            <p className="text-sm text-gray-600">Admin đang hoạt động</p>
                        </div>
                    </div>
                </Card>

                <Card title="Super Admin">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 rounded-full p-3">
                            <Shield className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">3</p>
                            <p className="text-sm text-gray-600">Quyền cao nhất</p>
                        </div>
                    </div>
                </Card>

                <Card title="Người dùng">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <UsersIcon className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">245</p>
                            <p className="text-sm text-gray-600">Tổng người dùng</p>
                        </div>
                    </div>
                </Card>

                <Card title="Vai trò">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-100 rounded-full p-3">
                            <Settings className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">8</p>
                            <p className="text-sm text-gray-600">Loại vai trò</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Admin List */}
                <Card title="Danh sách Admin gần đây">
                    <div className="space-y-3">
                        {[
                            { name: 'Nguyễn Văn A', role: 'Super Admin', status: 'active' },
                            { name: 'Trần Thị B', role: 'Admin', status: 'active' },
                            { name: 'Lê Văn C', role: 'Moderator', status: 'inactive' },
                            { name: 'Phạm Thị D', role: 'Admin', status: 'active' },
                        ].map((admin, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900">{admin.name}</p>
                                    <p className="text-sm text-gray-600">{admin.role}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    admin.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {admin.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Activities */}
                <Card title="Hoạt động gần đây">
                    <div className="space-y-3">
                        {[
                            { action: 'Thêm admin mới', user: 'Admin A', time: '5 phút trước' },
                            { action: 'Cập nhật quyền', user: 'Admin B', time: '15 phút trước' },
                            { action: 'Xóa người dùng', user: 'Admin C', time: '1 giờ trước' },
                            { action: 'Phân quyền mới', user: 'Admin D', time: '2 giờ trước' },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card title="Thao tác nhanh">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <Shield className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Thêm Admin</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <Settings className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Phân quyền</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <UsersIcon className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Quản lý User</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <LogOut className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Nhật ký</p>
                    </button>
                </div>
            </Card>
        </AdminManagementLayout>
    );
};
