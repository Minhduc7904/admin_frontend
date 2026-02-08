import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components';
import { ROUTES } from '../../core/constants';

/**
 * Trang hiển thị khi người dùng không có quyền truy cập
 * Navigation: /403 hoặc /no-permission
 */
export const NoPermissionPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate(ROUTES.DASHBOARD);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background-dark px-4">
            <div className="text-center max-w-2xl mx-auto">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-error-light mb-8 shadow-lg">
                    <ShieldOff className="w-12 h-12 text-error" strokeWidth={1.5} />
                </div>

                {/* Error Code */}
                <div className="mb-4">
                    <span className="text-6xl font-bold text-error opacity-20">403</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Không có quyền truy cập
                </h1>

                {/* Description */}
                <p className="text-foreground-light text-lg mb-3">
                    Bạn không có quyền truy cập vào trang này hoặc thực hiện hành động này.
                </p>
                <p className="text-foreground-lighter text-base mb-8">
                    Vui lòng liên hệ với quản trị viên hệ thống nếu bạn tin rằng đây là một lỗi, 
                    hoặc nếu bạn cần được cấp quyền truy cập.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        variant="outline"
                        onClick={handleGoBack}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft size={16} />
                        Quay lại
                    </Button>
                    <Button
                        onClick={handleGoHome}
                        className="w-full sm:w-auto"
                    >
                        <Home size={16} />
                        Về trang chủ
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="bg-background-light rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-foreground mb-3">
                            Tại sao tôi thấy trang này?
                        </h3>
                        <ul className="text-sm text-foreground-light text-left space-y-2 max-w-md mx-auto">
                            <li className="flex items-start gap-2">
                                <span className="text-error mt-0.5">•</span>
                                <span>Bạn chưa được cấp quyền truy cập vào trang này</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-error mt-0.5">•</span>
                                <span>Vai trò của bạn không có quyền thực hiện hành động này</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-error mt-0.5">•</span>
                                <span>Liên kết bạn sử dụng có thể không chính xác hoặc đã hết hạn</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
