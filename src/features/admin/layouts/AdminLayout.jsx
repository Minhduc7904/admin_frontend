import { useLocation } from 'react-router-dom';
import { Header } from '../../../shared/components/header';
import { AdminSidebar } from '../components';

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const isProfilePage = location.pathname.includes('/profile');

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <Header title="Admin Dashboard" />

      <div className="flex">
        {/* Sidebar */}
        {!isProfilePage && <AdminSidebar />}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
