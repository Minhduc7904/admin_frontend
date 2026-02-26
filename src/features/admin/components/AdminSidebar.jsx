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
  Bell,
  Send,
  CreditCard,
  FileQuestion,
  Trophy,
} from 'lucide-react';

import { ROUTES } from '../../../core/constants';
import { Sidebar } from '../../../shared/components/sidebar';
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes';

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
          permission: PERMISSIONS.ADMIN_PAGE.DASHBOARD,
        },
      ],
    },

    {
      label: 'Thông báo & tương tác',
      items: [
        {
          key: 'broadcastNotifications',
          name: 'Gửi thông báo hàng loạt',
          href: ROUTES.BROADCAST_NOTIFICATIONS,
          icon: Send,
          permission: PERMISSIONS.ADMIN_PAGE.BROADCAST_NOTIFICATIONS,
        },
        // {
        //   key: 'notificationLogs',
        //   name: 'Lịch sử thông báo',
        //   href: ROUTES.NOTIFICATION_LOGS,
        //   icon: Bell,
        // },
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
          permission: PERMISSIONS.ADMIN_PAGE.ADMINS,
        },
        {
          key: 'student',
          name: 'Quản lý học sinh',
          href: ROUTES.STUDENTS,
          icon: Users,
          permission: PERMISSIONS.ADMIN_PAGE.STUDENTS,
        },
      ],
    },
    {
      label: 'Tài chính',
      items: [
        {
          key: 'tuitionPayments',
          name: 'Quản lý học phí',
          href: ROUTES.TUITION_PAYMENTS,
          icon: CreditCard,
          permission: PERMISSIONS.ADMIN_PAGE.TUITION_PAYMENTS,
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
          permission: PERMISSIONS.ADMIN_PAGE.ROLES,
        },
        {
          key: 'permissions',
          name: 'Quản lý quyền',
          href: ROUTES.PERMISSIONS,
          icon: Key,
          permission: PERMISSIONS.ADMIN_PAGE.PERMISSIONS,
        },
        {
          key: 'adminAuditLogs',
          name: 'Nhật ký hệ thống',
          href: ROUTES.AUDIT_LOGS,
          icon: ScrollText,
          permission: PERMISSIONS.ADMIN_PAGE.AUDIT_LOGS,
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
          permission: PERMISSIONS.ADMIN_PAGE.SUBJECTS,
        },
        {
          key: 'chapters',
          name: 'Quản lý chương',
          href: ROUTES.CHAPTERS,
          icon: FileText,
          permission: PERMISSIONS.ADMIN_PAGE.CHAPTERS,
        },
        {
          key: 'courses',
          name: 'Quản lý khóa học',
          href: ROUTES.COURSES,
          icon: FileText,
          permission: PERMISSIONS.ADMIN_PAGE.COURSES,
        },
        {
          key: 'myCourses',
          name: 'Khóa học của tôi',
          href: ROUTES.MY_COURSES,
          icon: GraduationCap,
          permission: PERMISSIONS.ADMIN_PAGE.MY_COURSES,
        },
        {
          key: 'classrooms',
          name: 'Quản lý lớp học',
          href: ROUTES.CLASSES,
          icon: School,
          permission: PERMISSIONS.ADMIN_PAGE.CLASSES,
        },
        {
          key: 'myClasses',
          name: 'Lớp học của tôi',
          href: ROUTES.MY_CLASSES,
          icon: School,
          permission: PERMISSIONS.ADMIN_PAGE.MY_CLASSES,
        },
      ],
    },

    {
      label: 'Quản lý đề thi',
      items: [
        {
          key: 'questions',
          name: 'Danh sách câu hỏi',
          href: ROUTES.QUESTIONS,
          icon: FileQuestion,
          permission: PERMISSIONS.ADMIN_PAGE.QUESTIONS,
        },
        {
          key: 'myQuestions',
          name: 'Câu hỏi của tôi',
          href: ROUTES.MY_QUESTIONS,
          icon: FileQuestion,
          permission: PERMISSIONS.ADMIN_PAGE.MY_QUESTIONS,
        },
        {
          key: 'exams',
          name: 'Danh sách đề thi',
          href: ROUTES.EXAMS,
          icon: FileText,
          permission: PERMISSIONS.ADMIN_PAGE.EXAMS,
        },
        {
          key: 'myExams',
          name: 'Đề thi của tôi',
          href: ROUTES.MY_EXAMS,
          icon: FileText,
          permission: PERMISSIONS.ADMIN_PAGE.MY_EXAMS,
        },
        {
          key: 'competitions',
          name: 'Danh sách cuộc thi',
          href: ROUTES.COMPETITIONS,
          icon: Trophy,
          permission: PERMISSIONS.ADMIN_PAGE.COMPETITIONS,
        },
        {
          key: 'myCompetitions',
          name: 'Cuộc thi của tôi',
          href: ROUTES.MY_COMPETITIONS,
          icon: Trophy,
          permission: PERMISSIONS.ADMIN_PAGE.MY_COMPETITIONS,
        },
      ],
    },

    {
      label: 'Đề thi và câu hỏi',
      items: [
        {
          key: 'examImportSessions',
          name: 'Quản lý phiên import',
          href: ROUTES.EXAM_IMPORT_SESSIONS,
          icon: FileQuestion,
          permission: PERMISSIONS.ADMIN_PAGE.EXAM_IMPORT_SESSIONS,
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
          permission: PERMISSIONS.ADMIN_PAGE.MEDIA,
        },
        {
          key: 'mediaFolders',
          name: 'Tài liệu của tôi',
          href: ROUTES.MEDIA_FOLDERS,
          icon: File,
          permission: PERMISSIONS.ADMIN_PAGE.MEDIA_FOLDERS,
        },
      ],
    },
  ];

  return <Sidebar sections={sections} />;
};
