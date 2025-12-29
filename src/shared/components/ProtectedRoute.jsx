import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../core/constants';

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);

  // Nếu chưa đăng nhập → redirect về login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Nếu đã đăng nhập nhưng chưa có profile → redirect về LoadingRedirect để load profile
  if (!profile) {
    return <Navigate to={ROUTES.LOADING_REDIRECT} state={{ from: location }} replace />;
  }

  // Đã có profile → render children (dashboard)
  return children;
};
