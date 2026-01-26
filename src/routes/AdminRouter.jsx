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
import { CourseList, MyCourseListPage, CourseDetail, CourseClasses, CourseEnrollment, CourseStudentsAttendance, CourseLessons } from '../features/course/pages';
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
                element: <ProtectedRoute permission={PERMISSIONS.ROLE_VIEW_ROLE_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.ROLES,
                        element: <RoleList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ROLE_VIEW_ROLE_CREATION} />,
                children: [
                    {
                        path: ROUTES.ROLES_CREATE,
                        element: <RoleCreate />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ROLE_VIEW_ROLE_EDIT} />,
                children: [
                    {
                        path: ROUTES.ROLES_EDIT(':id'),
                        element: <RoleEdit />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.PERMISSION_VIEW_PERMISSION_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.PERMISSIONS,
                        element: <PermissionList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.AUDIT_LOG_VIEW_AUDIT_LOGS_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.AUDIT_LOGS,
                        element: <AuditLogList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.MEDIA_VIEW_MEDIA_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.MEDIA,
                        element: <MediaPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.MEDIA_VIEW_MY_MEDIA_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.MEDIA_FOLDERS,
                        element: <MediaFolderPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_VIEW_ADMIN_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.ADMINS,
                        element: <AdminList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.STUDENT_VIEW_STUDENT_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.STUDENTS,
                        element: <StudentList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.CHAPTER_VIEW_CHAPTER_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.CHAPTERS,
                        element: <ChapterPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.SUBJECT_VIEW_SUBJECT_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.SUBJECTS,
                        element: <SubjectPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.COURSE_VIEW_COURSE_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.COURSES,
                        element: <CourseListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.COURSE_VIEW_MY_COURSE_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.MY_COURSES,
                        element: <MyCourseListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.COURSE_CLASS_VIEW_CLASS_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.CLASSES,
                        element: <ClassListPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.COURSE_CLASS_VIEW_MY_CLASSES_MANAGEMENT} />,
                children: [
                    {
                        path: ROUTES.MY_CLASSES,
                        element: <MyClassList />,
                    },
                ],
            },
            {
                element: <ProtectedRoute permission={PERMISSIONS.NOTIFICATION_SEND} />,
                children: [
                    {
                        path: ROUTES.BROADCAST_NOTIFICATIONS,
                        element: <BroadcastNotificationsPage />,
                    },
                ],
            },
            // 🔥 Course profile group
            {
                element: <ProtectedRoute permission={PERMISSIONS.COURSE_VIEW_COURSE_DETAIL_MANAGEMENT} />,
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
                element: <ProtectedRoute permission={PERMISSIONS.COURSE_CLASS_VIEW_CLASS_DETAIL_MANAGEMENT} />,
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
                element: <ProtectedRoute permission={PERMISSIONS.ADMIN_VIEW_ADMIN_DETAIL_MANAGEMENT} />,
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
                element: <ProtectedRoute permission={PERMISSIONS.STUDENT_VIEW_STUDENT_DETAIL_MANAGEMENT} />,
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
        ],
    },
];

