import React from 'react';
import { Users, UserPlus, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import { StudentSidebar } from '@/shared/components/sidebar';

export const StudentDashboard: React.FC = () => {
    return (
        <div className="flex gap-6 -mx-4 -my-8">
            {/* Sidebar */}
            <StudentSidebar />
            
            {/* Main Content */}
            <div className="flex-1 p-8 space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Học sinh</h1>
                <p className="text-gray-600 mt-1">Quản lý thông tin, điểm danh và học phí</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Tổng học sinh">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <Users className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">485</p>
                            <p className="text-sm text-gray-600">Đang theo học</p>
                        </div>
                    </div>
                </Card>

                <Card title="Học sinh mới">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <UserPlus className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">24</p>
                            <p className="text-sm text-gray-600">Tháng này</p>
                        </div>
                    </div>
                </Card>

                <Card title="Học phí">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-100 rounded-full p-3">
                            <DollarSign className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">89%</p>
                            <p className="text-sm text-gray-600">Đã đóng đủ</p>
                        </div>
                    </div>
                </Card>

                <Card title="Điểm danh">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 rounded-full p-3">
                            <CheckCircle className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">92%</p>
                            <p className="text-sm text-gray-600">TB có mặt</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Students */}
                <Card title="Học sinh mới nhất">
                    <div className="space-y-3">
                        {[
                            { name: 'Nguyễn Văn A', class: '10A1', date: 'Hôm nay', status: 'active' },
                            { name: 'Trần Thị B', class: '10A2', date: 'Hôm qua', status: 'active' },
                            { name: 'Lê Văn C', class: '11A1', date: '2 ngày trước', status: 'pending' },
                            { name: 'Phạm Thị D', class: '11A2', date: '3 ngày trước', status: 'active' },
                        ].map((student, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900">{student.name}</p>
                                    <p className="text-sm text-gray-600">{student.class} • {student.date}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    student.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {student.status === 'active' ? 'Đã xác nhận' : 'Chờ duyệt'}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Payment Status */}
                <Card title="Trạng thái học phí">
                    <div className="space-y-3">
                        {[
                            { class: '10A1', paid: 32, total: 35, percent: 91 },
                            { class: '10A2', paid: 28, total: 32, percent: 88 },
                            { class: '11A1', paid: 35, total: 38, percent: 92 },
                            { class: '11A2', paid: 27, total: 30, percent: 90 },
                        ].map((item, index) => (
                            <div key={index} className="py-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">{item.class}</span>
                                    <span className="text-sm text-gray-600">{item.paid}/{item.total} HS</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full transition-all"
                                        style={{ width: `${item.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Attendance Overview */}
            <Card title="Điểm danh hôm nay">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { class: '10A1', present: 33, total: 35 },
                        { class: '10A2', present: 30, total: 32 },
                        { class: '11A1', present: 36, total: 38 },
                        { class: '11A2', present: 28, total: 30 },
                    ].map((attendance, index) => (
                        <div key={index} className="p-4 border-2 border-gray-200 rounded-lg">
                            <p className="text-lg font-bold text-gray-900 mb-1">{attendance.class}</p>
                            <p className="text-2xl font-bold text-green-600">{attendance.present}/{attendance.total}</p>
                            <p className="text-xs text-gray-600 mt-1">Có mặt</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Thao tác nhanh">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <UserPlus className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Thêm học sinh</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <Calendar className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Điểm danh</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <DollarSign className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Thu học phí</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <Users className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Xem danh sách</p>
                    </button>
                </div>
            </Card>
            </div>
        </div>
    );
};
