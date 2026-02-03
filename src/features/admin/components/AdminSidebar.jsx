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
          // permission: PERMISSIONS.VIEW_DASHBOARD,
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
          permission: PERMISSIONS.NOTIFICATION_SEND,
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
          permission: PERMISSIONS.ADMIN_VIEW_ADMIN_MANAGEMENT,
        },
        {
          key: 'student',
          name: 'Quản lý học sinh',
          href: ROUTES.STUDENTS,
          icon: Users,
          permission: PERMISSIONS.STUDENT_VIEW_STUDENT_MANAGEMENT,
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
          permission: PERMISSIONS.TUITION_PAYMENT_VIEW_MANAGEMENT,
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
          permission: PERMISSIONS.ROLE_VIEW_ROLE_MANAGEMENT,
        },
        {
          key: 'permissions',
          name: 'Quản lý quyền',
          href: ROUTES.PERMISSIONS,
          icon: Key,
          permission: PERMISSIONS.PERMISSION_VIEW_PERMISSION_MANAGEMENT,
        },
        {
          key: 'adminAuditLogs',
          name: 'Nhật ký hệ thống',
          href: ROUTES.AUDIT_LOGS,
          icon: ScrollText,
          permission: PERMISSIONS.AUDIT_LOG_VIEW_AUDIT_LOGS_MANAGEMENT,
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
          permission: PERMISSIONS.SUBJECT_VIEW_SUBJECT_MANAGEMENT,
        },
        {
          key: 'chapters',
          name: 'Quản lý chương',
          href: ROUTES.CHAPTERS,
          icon: FileText,
          permission: PERMISSIONS.CHAPTER_VIEW_CHAPTER_MANAGEMENT,
        },
        {
          key: 'courses',
          name: 'Quản lý khóa học',
          href: ROUTES.COURSES,
          icon: FileText,
          permission: PERMISSIONS.COURSE_VIEW_COURSE_MANAGEMENT,
        },
        {
          key: 'myCourses',
          name: 'Khóa học của tôi',
          href: ROUTES.MY_COURSES,
          icon: GraduationCap,
          permission: PERMISSIONS.COURSE_VIEW_MY_COURSE_MANAGEMENT,
        },
        {
          key: 'classrooms',
          name: 'Quản lý lớp học',
          href: ROUTES.CLASSES,
          icon: School,
          permission: PERMISSIONS.COURSE_CLASS_VIEW_CLASS_MANAGEMENT,
        },
        {
          key: 'myClasses',
          name: 'Lớp học của tôi',
          href: ROUTES.MY_CLASSES,
          icon: School,
          permission: PERMISSIONS.COURSE_CLASS_VIEW_MY_CLASSES_MANAGEMENT,
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
          // permission: PERMISSIONS.QUESTION_VIEW_MANAGEMENT,
        },
        {
          key: 'exams',
          name: 'Danh sách đề thi',
          href: ROUTES.EXAMS,
          icon: FileText,
          // permission: PERMISSIONS.EXAM_VIEW_MANAGEMENT,
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
          // permission: PERMISSIONS.EXAM_IMPORT_SESSION_VIEW_MANAGEMENT,
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
          permission: PERMISSIONS.MEDIA_VIEW_MEDIA_MANAGEMENT,
        },
        {
          key: 'mediaFolders',
          name: 'Tài liệu của tôi',
          href: ROUTES.MEDIA_FOLDERS,
          icon: File,
          permission: PERMISSIONS.MEDIA_VIEW_MY_MEDIA_MANAGEMENT,
        },
      ],
    },
  ];

  return <Sidebar sections={sections} />;
};
