import { Dashboard } from '../features/admin/pages';
import { RoleList, RoleCreate, RoleEdit } from '../features/role/pages';
import { PermissionList } from '../features/permission/pages';
import { AuditLogList } from '../features/adminAuditLog/pages';
import { MediaList } from '../features/media/pages';
import { AdminList } from '../features/admin/pages/AdminList';
import { AdminDetail } from '../features/admin/pages/AdminDetail';
import { AdminRole } from '../features/admin/pages/AdminRole';
import { AdminLayout, AdminProfileLayout } from '../features/admin/layouts';
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
            { path: ROUTES.MEDIA, element: <MediaList /> },
            { path: ROUTES.ADMINS, element: <AdminList /> },

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
                        element: <MediaList />,
                    },
                    {
                        path: 'audit-logs',
                        element: <AuditLogList />,
                    },
                ],
            },
        ],
    },
];

