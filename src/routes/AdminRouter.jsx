import { Dashboard, SuperAdminPage } from '../features/admin/pages';
import { RoleList, RoleCreate, RoleEdit } from '../features/role/pages';
import { PermissionList } from '../features/permission/pages';
import { AuditLogList } from '../features/adminAuditLog/pages';
import { MediaPage } from '../features/media/pages';
import { MediaFolderPage } from '../features/mediaFolder/pages';
import { SeoPageMediaPage, SeoSlotPage } from '../features/seoMedia/pages';
import { AchievementBoardPage } from '../features/achievementBoard/pages';
import { AdminList } from '../features/admin/pages/AdminList';
import { AdminDetail } from '../features/admin/pages/AdminDetail';
import { AdminRole } from '../features/admin/pages/AdminRole';
import { AdminMedia } from '../features/admin/pages/AdminMedia';
import { ChapterPage } from '../features/chapter/pages';
import {
    CourseList,
    MyCourseListPage,
    CourseDetail,
    CourseClasses,
    CourseEnrollment,
    CourseStudentsAttendance,
    CourseLessons,
    CoursePricing,
    CourseMedia
} from '../features/course/pages';
import { CourseDetailLayout } from '../features/course/layouts';
import {
    ClassListPage,
    MyClassList,
    CourseClassDetail,
    ClassStudents,
    ClassSessions,
    ClassSchedule,
    ClassAttendance,
    ClassNotifications
} from '../features/courseClass/pages';
import { CourseClassDetailLayout } from '../features/courseClass/layouts';
import { SubjectPage } from '../features/subject/pages/SubjectPage';
import { TagPage } from '../features/tag/pages';
import { CreateDocumentPage, DocumentDetail, DocumentListPage, EditDocumentPage } from '../features/document/pages';
import {
    CreateTeacherProfilePage,
    EditTeacherProfilePage,
    TeacherProfileDetail,
    TeacherProfileListPage,
} from '../features/teacherProfile/pages';
import {
    CreateNewsArticlePage,
    EditNewsArticlePage,
    NewsArticleDetailPage,
    NewsArticleListPage,
} from '../features/newsArticle/pages';
import {
    StudentList,
    StudentDetail,
    StudentRole,
    StudentMedia,
    StudentClasses,
    StudentCourses,
    StudentAttendance,
    StudentHomeworkSubmits,
    StudentCompetitionSubmits,
} from '../features/student/pages';
import { StudentPointLogPage } from '../features/studentPointLog/pages';
import { AdminLayout, AdminProfileLayout } from '../features/admin/layouts';
import { StudentProfileLayout } from '../features/student/layouts';
import { ROUTES } from '../core/constants';
import { Outlet } from 'react-router-dom';
import { CourseListPage } from '../features/course/pages/CourseListPage';
import { BroadcastNotificationsPage } from '../features/notification/pages/BroadcastNotificationsPage';
import { TuitionPaymentList } from '../features/tuitionPayment/pages/TuitionPaymentList';
import { OnlineCourseInvoiceListPage } from '../features/onlineCourseInvoice/pages';
import { BankTransferTransactionListPage } from '../features/bankTransferTransaction/pages';
import { ReceivingBankAccountListPage } from '../features/receivingBankAccount/pages';
import { TuitionCollectionConfigurationPage } from '../features/tuitionCollectionConfiguration/pages';
import { TuitionGradeBankAccountPage } from '../features/tuitionGradeBankAccount/pages';
import { BackgroundJobListPage } from '../features/backgroundJob/pages';
import { BackgroundJobRunListPage } from '../features/backgroundJobRun/pages';
import { SepayTransactionSyncCursorPage } from '../features/sepayTransactionSyncCursor/pages';
import { AssistantShiftCalendarPage } from '../features/assistantShift/pages';
import { AssistantShiftRegistrationPage } from '../features/assistantShiftRegistration/pages';
import { MyAssistantSchedulePage } from '../features/myAssistantSchedule/pages';
import { ExamImportSessionList } from '../features/examImportSession/pages';
import { QuestionListPage, MyQuestionListPage } from '../features/question/pages';
import { ExamListPage, MyExamListPage } from '../features/exam/pages';
import { CompetitionListPage } from '../features/competition/pages';
import { ExamDetail, ExamQuestions, ExamPreview } from '../features/exam/pages';
import { ExamDetailLayout } from '../features/exam/layouts';
import { ProtectedRoute } from '../shared/components';
import { PERMISSIONS } from '../core/constants/permission/permission.codes';

export const adminRouter = [
    {
        path: '/',
        element: (
            <AdminLayout>
                <Outlet />
            </AdminLayout>
        ),
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: ROUTES.DASHBOARD,
                        element: <Dashboard />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.SUPER_ADMIN} />,
                children: [
                    {
                        path: ROUTES.SUPER_ADMIN,
                        element: <SuperAdminPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.ROLES} />,
                children: [
                    {
                        path: ROUTES.ROLES,
                        element: <RoleList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.ROLE_CREATE} />,
                children: [
                    {
                        path: ROUTES.ROLES_CREATE,
                        element: <RoleCreate />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.ROLE_EDIT} />,
                children: [
                    {
                        path: ROUTES.ROLES_EDIT(':id'),
                        element: <RoleEdit />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.PERMISSIONS} />,
                children: [
                    {
                        path: ROUTES.PERMISSIONS,
                        element: <PermissionList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.AUDIT_LOGS} />,
                children: [
                    {
                        path: ROUTES.AUDIT_LOGS,
                        element: <AuditLogList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.MEDIA} />,
                children: [
                    {
                        path: ROUTES.MEDIA,
                        element: <MediaPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.MEDIA_FOLDERS} />,
                children: [
                    {
                        path: ROUTES.MEDIA_FOLDERS,
                        element: <MediaFolderPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: ROUTES.SEO_SLOTS,
                        element: <SeoSlotPage />,
                    },
                    {
                        path: ROUTES.SEO_PAGES,
                        element: <SeoPageMediaPage />,
                    },
                    {
                        path: ROUTES.ACHIEVEMENT_BOARDS,
                        element: <AchievementBoardPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.ADMINS} />,
                children: [
                    {
                        path: ROUTES.ADMINS,
                        element: <AdminList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.STUDENTS} />,
                children: [
                    {
                        path: ROUTES.STUDENTS,
                        element: <StudentList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.CHAPTERS} />,
                children: [
                    {
                        path: ROUTES.CHAPTERS,
                        element: <ChapterPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.SUBJECTS} />,
                children: [
                    {
                        path: ROUTES.SUBJECTS,
                        element: <SubjectPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.TAGS} />,
                children: [
                    {
                        path: ROUTES.TAGS,
                        element: <TagPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.DOCUMENTS} />,
                children: [
                    {
                        path: ROUTES.DOCUMENTS,
                        element: <DocumentListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.DOCUMENT_CREATE} />,
                children: [
                    {
                        path: ROUTES.DOCUMENT_CREATE,
                        element: <CreateDocumentPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.DOCUMENT_DETAIL} />,
                children: [
                    {
                        path: ROUTES.DOCUMENT_DETAIL(':id'),
                        element: <DocumentDetail />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.DOCUMENT_EDIT} />,
                children: [
                    {
                        path: ROUTES.DOCUMENT_EDIT(':id'),
                        element: <EditDocumentPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.TEACHER_PROFILES} />,
                children: [
                    {
                        path: ROUTES.TEACHER_PROFILES,
                        element: <TeacherProfileListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.TEACHER_PROFILE_CREATE} />,
                children: [
                    {
                        path: ROUTES.TEACHER_PROFILE_CREATE,
                        element: <CreateTeacherProfilePage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.TEACHER_PROFILE_DETAIL} />,
                children: [
                    {
                        path: ROUTES.TEACHER_PROFILE_DETAIL(':id'),
                        element: <TeacherProfileDetail />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.TEACHER_PROFILE_EDIT} />,
                children: [
                    {
                        path: ROUTES.TEACHER_PROFILE_EDIT(':id'),
                        element: <EditTeacherProfilePage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.COURSES} />,
                children: [
                    {
                        path: ROUTES.COURSES,
                        element: <CourseListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.MY_COURSES} />,
                children: [
                    {
                        path: ROUTES.MY_COURSES,
                        element: <MyCourseListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.CLASSES} />,
                children: [
                    {
                        path: ROUTES.CLASSES,
                        element: <ClassListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.MY_CLASSES} />,
                children: [
                    {
                        path: ROUTES.MY_CLASSES,
                        element: <MyClassList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.BROADCAST_NOTIFICATIONS} />,
                children: [
                    {
                        path: ROUTES.BROADCAST_NOTIFICATIONS,
                        element: <BroadcastNotificationsPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.TUITION_PAYMENTS} />,
                children: [
                    {
                        path: ROUTES.TUITION_PAYMENTS,
                        element: <TuitionPaymentList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.NEWS_ARTICLE.GET_ALL} />,
                children: [
                    {
                        path: ROUTES.NEWS_ARTICLES,
                        element: <NewsArticleListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.NEWS_ARTICLE.CREATE} />,
                children: [
                    {
                        path: ROUTES.NEWS_ARTICLE_CREATE,
                        element: <CreateNewsArticlePage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.NEWS_ARTICLE.GET_BY_ID} />,
                children: [
                    {
                        path: ROUTES.NEWS_ARTICLE_DETAIL(':id'),
                        element: <NewsArticleDetailPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.NEWS_ARTICLE.UPDATE} />,
                children: [
                    {
                        path: ROUTES.NEWS_ARTICLE_EDIT(':id'),
                        element: <EditNewsArticlePage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ONLINE_COURSE_INVOICE.GET_ALL} />,
                children: [
                    {
                        path: ROUTES.ONLINE_COURSE_INVOICES,
                        element: <OnlineCourseInvoiceListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.BANK_TRANSFER_TRANSACTION.GET_ALL} />,
                children: [
                    {
                        path: ROUTES.BANK_TRANSFER_TRANSACTIONS,
                        element: <BankTransferTransactionListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.RECEIVING_BANK_ACCOUNT.GET_ALL} />,
                children: [
                    {
                        path: ROUTES.RECEIVING_BANK_ACCOUNTS,
                        element: <ReceivingBankAccountListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.TUITION_COLLECTION_CONFIGURATION.MANAGE} />,
                children: [
                    {
                        path: ROUTES.TUITION_COLLECTION_CONFIGURATION,
                        element: <TuitionCollectionConfigurationPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.RECEIVING_BANK_ACCOUNT.CONFIGURE_GRADE_MAPPING} />,
                children: [
                    {
                        path: ROUTES.TUITION_GRADE_BANK_ACCOUNTS,
                        element: <TuitionGradeBankAccountPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.BACKGROUND_JOB.GET_ALL} />,
                children: [
                    { path: ROUTES.BACKGROUND_JOBS, element: <BackgroundJobListPage /> },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.BACKGROUND_JOB.GET_RUNS} />,
                children: [
                    { path: ROUTES.BACKGROUND_JOB_RUNS, element: <BackgroundJobRunListPage /> },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.BACKGROUND_JOB.GET_SEPAY_SYNC_CURSORS} />,
                children: [
                    { path: ROUTES.SEPAY_SYNC_CURSORS, element: <SepayTransactionSyncCursorPage /> },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ASSISTANT_SHIFT.GET_ALL_SERIES} />,
                children: [
                    { path: ROUTES.ASSISTANT_SHIFTS, element: <AssistantShiftCalendarPage /> },
                    { path: ROUTES.ASSISTANT_SHIFT_REGISTRATION, element: <AssistantShiftRegistrationPage /> },
                    { path: ROUTES.MY_ASSISTANT_SCHEDULE, element: <MyAssistantSchedulePage /> },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.EXAM_IMPORT_SESSIONS} />,
                children: [
                    {
                        path: ROUTES.EXAM_IMPORT_SESSIONS,
                        element: <ExamImportSessionList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.QUESTIONS} />,
                children: [
                    {
                        path: ROUTES.QUESTIONS,
                        element: <QuestionListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.MY_QUESTIONS} />,
                children: [
                    {
                        path: ROUTES.MY_QUESTIONS,
                        element: <MyQuestionListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.EXAMS} />,
                children: [
                    {
                        path: ROUTES.EXAMS,
                        element: <ExamListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.MY_EXAMS} />,
                children: [
                    {
                        path: ROUTES.MY_EXAMS,
                        element: <MyExamListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.COMPETITIONS} />,
                children: [
                    {
                        path: ROUTES.COMPETITIONS,
                        element: <CompetitionListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.MY_COMPETITIONS} />,
                children: [
                    {
                        path: ROUTES.MY_COMPETITIONS,
                        element: <CompetitionListPage />,
                    },
                ],
            },
            // 🔥 Course profile group
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.COURSE_DETAIL} />,
                children: [
                    {
                        path: ROUTES.COURSE_DETAIL(':id'),
                        element: <CourseDetailLayout />,
                        children: [
                            {
                                index: true,
                                element: <CourseDetail />
                            },
                            {
                                path: 'pricing',
                                element: <CoursePricing />
                            },
                            {
                                path: 'classes',
                                element: <CourseClasses />
                            },
                            {
                                path: 'students',
                                element: <CourseEnrollment />
                            },
                            {
                                path: 'attendance',
                                element: <CourseStudentsAttendance />
                            },
                            {
                                path: 'lessons',
                                element: <CourseLessons />
                            },
                            {
                                path: 'media',
                                element: <CourseMedia />
                            },
                        ],
                    },
                ],
            },
            // 🔥 Class profile group
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.CLASS_DETAIL} />,
                children: [
                    {
                        path: ROUTES.CLASS_DETAIL(':id'),
                        element: <CourseClassDetailLayout />,
                        children: [
                            {
                                index: true,
                                element: <CourseClassDetail />,
                            },
                            {
                                path: 'students',
                                element: <ClassStudents />,
                            },
                            {
                                path: 'sessions',
                                element: <ClassSessions />,
                            },
                            // {
                            //     path: 'schedule',
                            //     element: (
                            //         <ProtectedRoute permission={PERMISSIONS.CLASS_SESSION.GET_ALL}>
                            //             <ClassSchedule />
                            //         </ProtectedRoute>
                            //     ),
                            // },
                            {
                                path: 'attendance',
                                element: <ClassAttendance />,
                            },
                            {
                                path: 'notifications',
                                element: <ClassNotifications />,
                            },
                        ],
                    },
                ],
            },
            // 🔥 Admin profile group
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.ADMIN_DETAIL} />,
                children: [
                    {
                        path: ROUTES.ADMIN_DETAIL(':id'),
                        element: <AdminProfileLayout />,
                        children: [
                            {
                                index: true,
                                element: <AdminDetail />,
                            },
                            {
                                path: 'roles',
                                element: <AdminRole />,
                            },
                            {
                                path: 'media',
                                element: <AdminMedia />
                            },
                            {
                                path: 'audit-logs',
                                element: <AuditLogList />
                            },
                        ],
                    },
                ],
            },

            // 🔥 Student profile group
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.STUDENT_DETAIL} />,
                children: [
                    {
                        path: ROUTES.STUDENT_DETAIL(':id'),
                        element: <StudentProfileLayout />,
                        children: [
                            {
                                index: true,
                                element: <StudentDetail />,
                            },
                            {
                                path: 'classes',
                                element: <StudentClasses />
                            },
                            {
                                path: 'courses',
                                element: <StudentCourses />,
                            },
                            {
                                path: 'attendance',
                                element: <StudentAttendance />,
                            },
                            {
                                path: 'point-logs',
                                element: <StudentPointLogPage />,
                            },
                            {
                                path: 'homework-submits',
                                element: <StudentHomeworkSubmits />,
                            },
                            {
                                path: 'competition-submits',
                                element: <StudentCompetitionSubmits />,
                            },
                            {
                                path: 'roles',
                                element: <StudentRole />,
                            },
                            {
                                path: 'media',
                                element: <StudentMedia />,
                            },
                        ],
                    },
                ],
            },

            // 🔥 Exam detail group
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.EXAMS} />,
                children: [
                    {
                        path: ROUTES.EXAM_DETAIL(':id'),
                        element: <ExamDetailLayout />,
                        children: [
                            {
                                index: true,
                                element: <ExamDetail />,
                            },
                            {
                                path: 'questions',
                                element: <ExamQuestions />,
                            },
                            {
                                path: 'preview',
                                element: <ExamPreview />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

