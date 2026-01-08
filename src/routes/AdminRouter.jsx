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
import { SubjectPage } from '../features/subject/pages/SubjectPage';
import { StudentList, StudentDetail, StudentRole, StudentMedia } from '../features/student/pages';
import { AdminLayout, AdminProfileLayout } from '../features/admin/layouts';
import { StudentProfileLayout } from '../features/student/layouts';
import { ROUTES } from '../core/constants';
import { Outlet } from 'react-router-dom';

export const adminRouter = [
    {
        path: '/',
        element: (
            <AdminLayout>
                <Outlet />
            </AdminLayout>
        ),
        children: [
            { path: ROUTES.DASHBOARD, element: <Dashboard /> },
            { path: ROUTES.ROLES, element: <RoleList /> },
            { path: ROUTES.ROLES_CREATE, element: <RoleCreate /> },
            { path: ROUTES.ROLES_EDIT(':id'), element: <RoleEdit /> },
            { path: ROUTES.PERMISSIONS, element: <PermissionList /> },
            { path: ROUTES.AUDIT_LOGS, element: <AuditLogList /> },
            { path: ROUTES.MEDIA, element: <MediaPage /> },
            { path: ROUTES.MEDIA_FOLDERS, element: <MediaFolderPage /> },
            { path: ROUTES.ADMINS, element: <AdminList /> },
            { path: ROUTES.STUDENTS, element: <StudentList /> },
            { path: ROUTES.CHAPTERS, element: <ChapterPage /> },
            { path: ROUTES.SUBJECTS, element: <SubjectPage /> },

            // 🔥 Admin profile group
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
                        element: <AdminMedia />,
                    },
                    {
                        path: 'audit-logs',
                        element: <AuditLogList />,
                    },
                ],
            },

            // 🔥 Student profile group
            {
                path: ROUTES.STUDENT_DETAIL(':id'),
                element: <StudentProfileLayout />,
                children: [
                    {
                        index: true,
                        element: <StudentDetail />,
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
];

