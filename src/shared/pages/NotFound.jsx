import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components';
import { ROUTES } from '../../core/constants';

/**
 * Trang hiển thị khi không tìm thấy route
 * Navigation: /404
 */
export const NotFound = () => {
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
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-warning-light mb-8 shadow-lg">
          <FileQuestion className="w-12 h-12 text-warning" strokeWidth={1.5} />
        </div>

        {/* Error Code */}
        <div className="mb-4">
          <span className="text-6xl font-bold text-warning opacity-20">404</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Không tìm thấy trang
        </h1>

        {/* Description */}
        <p className="text-foreground-light text-lg mb-3">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <p className="text-foreground-lighter text-base mb-8">
          Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ để tiếp tục sử dụng hệ thống.
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
              Những điều bạn có thể làm
            </h3>
            <ul className="text-sm text-foreground-light text-left space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Kiểm tra lại đường dẫn URL trong thanh địa chỉ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Quay về trang chủ và điều hướng từ menu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Liên hệ quản trị viên nếu bạn tin rằng đây là một lỗi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

