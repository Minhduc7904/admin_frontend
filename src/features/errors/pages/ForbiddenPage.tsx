import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/core/constants';

export const ForbiddenPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-50 rounded-full p-6">
                            <ShieldAlert className="text-red-600" size={64} />
                        </div>
                    </div>

                    {/* Error Code */}
                    <h1 className="text-6xl font-bold text-gray-900 mb-2">403</h1>
                    
                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                        Truy cập bị từ chối
                    </h2>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-8">
                        Bạn không có quyền truy cập trang này. 
                        Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là một sai sót.
                    </p>

                    {/* Permission Info */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <p className="text-sm text-red-800 font-medium">
                            ⚠️ Yêu cầu quyền truy cập cao hơn
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        {/* Go Home Button */}
                        <button
                            onClick={() => navigate(ROUTES.DASHBOARD)}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                        >
                            <Home size={20} />
                            Về trang chủ
                        </button>

                        {/* Go Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 py-3 px-4 rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all font-medium"
                        >
                            <ArrowLeft size={20} />
                            Quay lại
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        Mã lỗi: 403 - Forbidden Access
                    </p>
                </div>
            </div>
        </div>
    );
};
