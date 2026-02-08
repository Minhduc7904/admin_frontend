import { Dashboard } from '../features/admin/pages';
import { RoleList, RoleCreate, RoleEdit } from '../features/role/pages';
import { PermissionList } from '../features/permission/pages';
import { AuditLogList } from '../features/adminAuditLog/pages';
import { MediaPage } from '../features/media/pages';
import { MediaFolderPage } from '../features/mediaFolder/pages';
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
    CoursePricing
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
import { StudentList, StudentDetail, StudentRole, StudentMedia, StudentClasses, StudentCourses, StudentAttendance } from '../features/student/pages';
import { AdminLayout, AdminProfileLayout } from '../features/admin/layouts';
import { StudentProfileLayout } from '../features/student/layouts';
import { ROUTES } from '../core/constants';
import { Outlet } from 'react-router-dom';
import { CourseListPage } from '../features/course/pages/CourseListPage';
import { BroadcastNotificationsPage } from '../features/notification/pages/BroadcastNotificationsPage';
import { TuitionPaymentList } from '../features/tuitionPayment/pages/TuitionPaymentList';
import { ExamImportSessionList } from '../features/examImportSession/pages';
import { QuestionListPage, MyQuestionListPage } from '../features/question/pages';
import { ExamListPage, MyExamListPage } from '../features/exam/pages';
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

