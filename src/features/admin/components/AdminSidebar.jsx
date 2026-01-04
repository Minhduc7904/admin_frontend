import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  UserCheck,
  Shield,
  Key,
  School,
  ScrollText,
  File,
  ShieldCheck,
  
} from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import { Sidebar } from '../../../shared/components/sidebar';

export const AdminSidebar = () => {
  const menuItems = [
    {
      key: 'dashboard',
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard
    },
    {
      key: 'roles',
      name: 'Quản lý vai trò',
      href: ROUTES.ROLES,
      icon: Shield
    },
    {
      key: 'permissions',
      name: 'Quản lý quyền',
      href: ROUTES.PERMISSIONS,
      icon: Key
    },
    {
      key: 'adminAuditLogs',
      name: 'Nhật ký ',
      href: ROUTES.AUDIT_LOGS,
      icon: ScrollText,
    },
    {
      key: 'media',
      name: 'Quản lý Media',
      href: ROUTES.MEDIA,
      icon: File,
    },
    {
      key: 'admin',
      name: 'Quản lý admin',
      href: ROUTES.ADMINS,
      icon: ShieldCheck,
    },
    {
      key: 'student',
      name: 'Quản lý học sinh',
      href: ROUTES.STUDENTS,
      icon: Users,
    },
    {
      key: 'classrooms',
      name: 'Quản lý lớp học',
      href: ROUTES.ADMIN_CLASSROOMS,
      icon: School
    },
  ];

  return <Sidebar menuItems={menuItems} />;
};
