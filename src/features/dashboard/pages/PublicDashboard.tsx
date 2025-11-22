import React from 'react';
import { Globe, Image as ImageIcon, Layout, Upload, Eye } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import { PublicSidebar } from '@/shared/components/sidebar';

export const PublicDashboard: React.FC = () => {
    return (
        <div className="flex gap-6 -mx-4 -my-8">
            {/* Sidebar */}
            <PublicSidebar />
            
            {/* Main Content */}
            <div className="flex-1 p-8 space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Trang Public</h1>
                <p className="text-gray-600 mt-1">Quản lý nội dung và hình ảnh trang công khai</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Tổng ảnh">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <ImageIcon className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">348</p>
                            <p className="text-sm text-gray-600">Ảnh đã upload</p>
                        </div>
                    </div>
                </Card>

                <Card title="Banner">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 rounded-full p-3">
                            <Layout className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">8</p>
                            <p className="text-sm text-gray-600">Banner hiện tại</p>
                        </div>
                    </div>
                </Card>

                <Card title="Lượt xem">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <Eye className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">12.5K</p>
                            <p className="text-sm text-gray-600">Tháng này</p>
                        </div>
                    </div>
                </Card>

                <Card title="Dung lượng">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-100 rounded-full p-3">
                            <Globe className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">2.4GB</p>
                            <p className="text-sm text-gray-600">Đã sử dụng</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Images */}
                <Card title="Ảnh gần đây">
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer group">
                                <ImageIcon className="text-gray-400 group-hover:text-gray-600 transition-colors" size={32} />
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-black hover:text-black transition-colors">
                        Xem tất cả
                    </button>
                </Card>

                {/* Banner Management */}
                <Card title="Quản lý Banner">
                    <div className="space-y-3">
                        {[
                            { name: 'Banner trang chủ', status: 'active', views: '3.2K' },
                            { name: 'Banner giới thiệu', status: 'active', views: '2.1K' },
                            { name: 'Banner khóa học', status: 'inactive', views: '1.5K' },
                            { name: 'Banner liên hệ', status: 'active', views: '890' },
                        ].map((banner, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                        <Layout className="text-gray-500" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{banner.name}</p>
                                        <p className="text-sm text-gray-600">{banner.views} lượt xem</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    banner.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {banner.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Storage Overview */}
            <Card title="Tổng quan dung lượng">
                <div className="space-y-4">
                    {[
                        { type: 'Ảnh Banner', size: '850 MB', percent: 35, color: 'bg-blue-500' },
                        { type: 'Ảnh Bài viết', size: '1.2 GB', percent: 50, color: 'bg-green-500' },
                        { type: 'Ảnh Slider', size: '280 MB', percent: 12, color: 'bg-purple-500' },
                        { name: 'Khác', size: '70 MB', percent: 3, color: 'bg-gray-500' },
                    ].map((storage, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{storage.type}</span>
                                <span className="text-sm text-gray-600">{storage.size} ({storage.percent}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className={`${storage.color} h-2 rounded-full transition-all`}
                                    style={{ width: `${storage.percent}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Thao tác nhanh">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <Upload className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Upload ảnh</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <Layout className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Quản lý Banner</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <ImageIcon className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Thư viện ảnh</p>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all group">
                        <Eye className="mx-auto mb-2 text-gray-600 group-hover:text-black transition-colors" size={32} />
                        <p className="text-sm font-medium text-gray-900">Xem trang</p>
                    </button>
                </div>
            </Card>
            </div>
        </div>
    );
};
