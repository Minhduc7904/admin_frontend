import { Link } from 'react-router-dom';
import { ROUTES } from '../../core/constants';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Không tìm thấy trang</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-block px-6 py-3 bg-info text-white font-medium rounded-lg hover:bg-info-dark transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

