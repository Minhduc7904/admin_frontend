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
  ReceiptText,
  ArrowLeftRight,
  Landmark,
  Settings2,
  FileQuestion,
  Trophy,
  Globe2,
  ImageUp,
  Tags,
  UserRoundCheck,
  Newspaper,
  Workflow,
  History,
  RotateCw,
  CalendarDays,
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
      label: 'Super Admin',
      items: [
        {
          key: 'superAdmin',
          name: 'Trang Super Admin',
          href: ROUTES.SUPER_ADMIN,
          icon: Shield,
          permission: PERMISSIONS.ADMIN_PAGE.SUPER_ADMIN,
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
        {
          key: 'onlineCourseInvoices',
          name: 'Hóa đơn khóa online',
          href: ROUTES.ONLINE_COURSE_INVOICES,
          icon: ReceiptText,
          permission: PERMISSIONS.ONLINE_COURSE_INVOICE.GET_ALL,
        },
        {
          key: 'bankTransferTransactions',
          name: 'Giao dịch ngân hàng',
          href: ROUTES.BANK_TRANSFER_TRANSACTIONS,
          icon: ArrowLeftRight,
          permission: PERMISSIONS.BANK_TRANSFER_TRANSACTION.GET_ALL,
        },
        {
          key: 'receivingBankAccounts',
          name: 'Tài khoản nhận tiền',
          href: ROUTES.RECEIVING_BANK_ACCOUNTS,
          icon: Landmark,
          permission: PERMISSIONS.RECEIVING_BANK_ACCOUNT.GET_ALL,
        },
        {
          key: 'tuitionCollectionConfiguration',
          name: 'Cấu hình thu học phí',
          href: ROUTES.TUITION_COLLECTION_CONFIGURATION,
          icon: Settings2,
          permission: PERMISSIONS.TUITION_COLLECTION_CONFIGURATION.MANAGE,
        },
        {
          key: 'tuitionGradeBankAccounts',
          name: 'Tài khoản theo khối',
          href: ROUTES.TUITION_GRADE_BANK_ACCOUNTS,
          icon: Landmark,
          permission: PERMISSIONS.RECEIVING_BANK_ACCOUNT.CONFIGURE_GRADE_MAPPING,
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
      label: 'Vận hành hệ thống',
      items: [
        {
          key: 'backgroundJobs',
          name: 'Quản lý job nền',
          href: ROUTES.BACKGROUND_JOBS,
          icon: Workflow,
          permission: PERMISSIONS.BACKGROUND_JOB.GET_ALL,
        },
        {
          key: 'backgroundJobRuns',
          name: 'Lịch sử chạy job nền',
          href: ROUTES.BACKGROUND_JOB_RUNS,
          icon: History,
          permission: PERMISSIONS.BACKGROUND_JOB.GET_RUNS,
        },
        {
          key: 'sepaySyncCursors',
          name: 'Cấu hình đồng bộ SePay',
          href: ROUTES.SEPAY_SYNC_CURSORS,
          icon: RotateCw,
          permission: PERMISSIONS.BACKGROUND_JOB.GET_SEPAY_SYNC_CURSORS,
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
          key: 'classrooms',
          name: 'Quản lý lớp học',
          href: ROUTES.CLASSES,
          icon: School,
          permission: PERMISSIONS.ADMIN_PAGE.CLASSES,
        },
        {
          key: 'assistantShifts',
          name: 'Lịch trợ giảng',
          href: ROUTES.ASSISTANT_SHIFTS,
          icon: CalendarDays,
          permission: PERMISSIONS.ASSISTANT_SHIFT.GET_ALL_SERIES,
        },
        {
          key: 'assistantShiftRegistration',
          name: 'Đăng ký lịch trợ giảng',
          href: ROUTES.ASSISTANT_SHIFT_REGISTRATION,
          icon: CalendarDays,
          permission: PERMISSIONS.ASSISTANT_SHIFT.GET_AVAILABLE_SERIES,
        },
        {
          key: 'myAssistantSchedule',
          name: 'Lịch của tôi',
          href: ROUTES.MY_ASSISTANT_SCHEDULE,
          icon: CalendarDays,
          permission: PERMISSIONS.ASSISTANT_SHIFT.GET_MY_SCHEDULE,
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
          key: 'exams',
          name: 'Danh sách đề thi',
          href: ROUTES.EXAMS,
          icon: FileText,
          permission: PERMISSIONS.ADMIN_PAGE.EXAMS,
        },
        {
          key: 'competitions',
          name: 'Danh sách cuộc thi',
          href: ROUTES.COMPETITIONS,
          icon: Trophy,
          permission: PERMISSIONS.ADMIN_PAGE.COMPETITIONS,
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
      label: 'Tài liệu',
      items: [
        {
          key: 'newsArticles',
          name: 'Quản lý tin tức',
          href: ROUTES.NEWS_ARTICLES,
          icon: Newspaper,
          permission: PERMISSIONS.NEWS_ARTICLE.GET_ALL,
        },
        {
          key: 'tags',
          name: 'Quản lý tag',
          href: ROUTES.TAGS,
          icon: Tags,
          permission: PERMISSIONS.ADMIN_PAGE.TAGS,
        },
        {
          key: 'documents',
          name: 'Quản lý tài liệu',
          href: ROUTES.DOCUMENTS,
          icon: FileText,
          permission: PERMISSIONS.ADMIN_PAGE.DOCUMENTS,
        },
        {
          key: 'teacherProfiles',
          name: 'SEO profile giáo viên',
          href: ROUTES.TEACHER_PROFILES,
          icon: UserRoundCheck,
          permission: PERMISSIONS.ADMIN_PAGE.TEACHER_PROFILES,
        },
      ],
    },

    {
      label: 'Tài nguyên',
      items: [
        {
          key: 'mediaFolders',
          name: 'Media của tôi',
          href: ROUTES.MEDIA_FOLDERS,
          icon: File,
          permission: PERMISSIONS.ADMIN_PAGE.MEDIA_FOLDERS,
        },
      ],
    },
    {
      label: 'SEO',
      items: [
        {
          key: 'seoSlots',
          name: 'SEO slots',
          href: ROUTES.SEO_SLOTS,
          icon: Globe2,
          permission: PERMISSIONS.ADMIN_PAGE.SEO_SLOTS
        },
        {
          key: 'seoPages',
          name: 'SEO theo page',
          href: ROUTES.SEO_PAGES,
          icon: ImageUp,
          permission: PERMISSIONS.ADMIN_PAGE.SEO_MEDIA
        },
        {
          key: 'achievementBoards',
          name: 'Bảng thành tích',
          href: ROUTES.ACHIEVEMENT_BOARDS,
          icon: Trophy,
          permission: PERMISSIONS.ADMIN_PAGE.SEO_MEDIA
        },
      ],
    },
  ];

  return <Sidebar sections={sections} />;
};

