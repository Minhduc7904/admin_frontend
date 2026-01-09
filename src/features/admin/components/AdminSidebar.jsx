import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
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
  const sections = [
    {
      label: null, // không cần label cho dashboard
      items: [
        {
          key: 'dashboard',
          name: 'Dashboard',
          href: ROUTES.DASHBOARD,
          icon: LayoutDashboard,
        },
      ],
    },

    {
      label: 'Quản lý người dùng',
      items: [
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
      ],
    },

    {
      label: 'Phân quyền & bảo mật',
      items: [
        {
          key: 'roles',
          name: 'Quản lý vai trò',
          href: ROUTES.ROLES,
          icon: Shield,
        },
        {
          key: 'permissions',
          name: 'Quản lý quyền',
          href: ROUTES.PERMISSIONS,
          icon: Key,
        },
        {
          key: 'adminAuditLogs',
          name: 'Nhật ký hệ thống',
          href: ROUTES.AUDIT_LOGS,
          icon: ScrollText,
        },
      ],
    },

    {
      label: 'Học tập & giảng dạy',
      items: [
        {
          key: 'subjects',
          name: 'Quản lý môn học',
          href: ROUTES.SUBJECTS,
          icon: GraduationCap,
        },
        {
          key: 'chapters',
          name: 'Quản lý chương',
          href: ROUTES.CHAPTERS,
          icon: FileText,
        },
        {
          key: 'classrooms',
          name: 'Quản lý lớp học',
          href: ROUTES.ADMIN_CLASSROOMS,
          icon: School,
        },
      ],
    },

    {
      label: 'Tài nguyên',
      items: [
        {
          key: 'media',
          name: 'Quản lý Media',
          href: ROUTES.MEDIA,
          icon: File,
        },
        {
          key: 'mediaFolders',
          name: 'Tài liệu của tôi',
          href: ROUTES.MEDIA_FOLDERS,
          icon: File,
        },
      ],
    },
  ];

  return <Sidebar sections={sections} />;
};
