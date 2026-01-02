import { ProfileInfo, ProfilePermissions, ProfileSecurity } from '../features/profile/pages';
import { ProfileLayout } from '../features/profile/layouts/ProfileLayout';
import { ROUTES } from '../core/constants';
import { Outlet } from 'react-router-dom';

export const profileRouter = [
    {
        path: '/',
        element: (
            <ProfileLayout>
                <Outlet />
            </ProfileLayout>
        ),
        children: [
            {
                path: ROUTES.PROFILE_INFO,
                element: <ProfileInfo />,
            },
            {
                path: ROUTES.PROFILE_PERMISSIONS,
                element: <ProfilePermissions />,
            },
            {
                path: ROUTES.PROFILE_SECURITY,
                element: <ProfileSecurity />,
            },
        ],
    },
];
