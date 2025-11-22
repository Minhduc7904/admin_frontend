import React from 'react';
import { Card } from '@/shared/components/ui';
import { Mail, Phone, MapPin, Shield, Calendar, Clock, Edit2 } from 'lucide-react';

interface Admin {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    joinedDate: string;
    lastLogin: string;
}

interface AdminInfoTabProps {
    admin: Admin;
    onEdit?: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700';
        case 'inactive':
            return 'bg-gray-100 text-gray-700';
        case 'suspended':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'active':
            return 'Đang hoạt động';
        case 'inactive':
            return 'Không hoạt động';
        case 'suspended':
            return 'Bị tạm khóa';
        default:
            return status;
    }
};

export const AdminInfoTab: React.FC<AdminInfoTabProps> = ({ admin, onEdit }) => {
    return (
        <div className="space-y-4">
            <Card>
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-2xl font-bold">
                            {admin.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{admin.name}</h3>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(admin.status)}`}>
                                {getStatusText(admin.status)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Edit2 size={14} />
                        Chỉnh sửa
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail size={18} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">{admin.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone size={18} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Số điện thoại</p>
                            <p className="text-sm font-medium text-gray-900">{admin.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin size={18} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Địa chỉ</p>
                            <p className="text-sm font-medium text-gray-900">{admin.address}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Shield size={18} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Vai trò</p>
                            <p className="text-sm font-medium text-gray-900">{admin.role}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar size={18} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Ngày tham gia</p>
                            <p className="text-sm font-medium text-gray-900">{admin.joinedDate}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock size={18} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Đăng nhập lần cuối</p>
                            <p className="text-sm font-medium text-gray-900">{admin.lastLogin}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
