import { ShieldOff, Lock } from 'lucide-react';

/**
 * Component hiển thị khi người dùng không có quyền truy cập
 * @param {Object} props
 * @param {string} props.variant - Kiểu hiển thị: 'page' | 'inline' | 'card'
 * @param {string} props.message - Thông báo tùy chỉnh
 * @param {string} props.title - Tiêu đề tùy chỉnh
 */
export const NoPermission = ({ 
    variant = 'page', 
    message = 'Bạn không có quyền truy cập nội dung này',
    title = 'Không có quyền truy cập'
}) => {
    // Variant: Toàn trang (full page)
    if (variant === 'page') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error-light mb-6">
                        <ShieldOff className="w-10 h-10 text-error" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
                    <p className="text-foreground-light text-lg mb-6">
                        {message}
                    </p>
                    <p className="text-sm text-foreground-lighter">
                        Nếu bạn tin rằng đây là lỗi, vui lòng liên hệ với quản trị viên hệ thống.
                    </p>
                </div>
            </div>
        );
    }

    // Variant: Inline (nhỏ gọn, dùng trong danh sách)
    if (variant === 'inline') {
        return (
            <div className="flex items-center gap-2 text-foreground-light py-2">
                <Lock className="w-4 h-4" />
                <span className="text-sm">{message}</span>
            </div>
        );
    }

    // Variant: Card (dạng thẻ, dùng trong các section)
    return (
        <div className="bg-background border border-border rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-error-light mb-4">
                <Lock className="w-6 h-6 text-error" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-foreground-light text-sm">
                {message}
            </p>
        </div>
    );
};
