// 1. Imports
import { useEffect, useMemo } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    getAdminByIdAsync,
    clearCurrentAdmin,
    selectCurrentAdmin,
    selectAdminLoadingGet,
} from '../store/adminSlice';
import { AdminDetailBreadcrumb } from '../components/AdminDetailBreadcrumb';
import { AdminProfileOverview } from '../components/AdminProfileOverview';
import { ROUTES } from '../../../core/constants';
import { Tabs } from '../../../shared/components/ui';

// 2. Component
export const AdminProfileLayout = () => {
    const { id } = useParams();
    const adminId = Number(id);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const admin = useAppSelector(selectCurrentAdmin);
    const loading = useAppSelector(selectAdminLoadingGet);

    const invalidId = Number.isNaN(adminId);

    // 🔑 FETCH ADMIN (ONCE per adminId)
    useEffect(() => {
        if (!invalidId && adminId !== admin?.adminId) {
            dispatch(getAdminByIdAsync(adminId));
        }
    }, [dispatch, adminId, invalidId, admin?.adminId]);

    // 3. Tabs config (route-driven)
    const tabs = useMemo(
        () => [
            {
                label: 'Thông tin',
                isActive:
                    location.pathname === ROUTES.ADMIN_DETAIL(adminId),
                onActivate: () =>
                    navigate(ROUTES.ADMIN_DETAIL(adminId)),
            },
            {
                label: 'Quyền hạn',
                isActive: location.pathname.startsWith(
                    ROUTES.ADMIN_ROLES(adminId)
                ),
                onActivate: () => {
                    console.log('Navigating to roles tab', ROUTES.ADMIN_ROLES(adminId));
                    navigate(ROUTES.ADMIN_ROLES(adminId));
                },
            },
            {
                label: 'Media',
                isActive: location.pathname.startsWith(
                    ROUTES.ADMIN_MEDIA(adminId)
                ),
                onActivate: () =>
                    navigate(ROUTES.ADMIN_MEDIA(adminId)),
            },
            {
                label: 'Hoạt động Admin',
                isActive: location.pathname.startsWith(
                    ROUTES.ADMIN_AUDIT_LOGS(adminId)
                ),
                onActivate: () =>
                    navigate(
                        ROUTES.ADMIN_AUDIT_LOGS(adminId)
                    ),
            }
        ],
        [adminId, location.pathname, navigate]
    );

    // 4. Guard invalid route
    if (invalidId) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID quản trị viên không hợp lệ.
            </div>
        );
    }

    // 5. Render
    return (
        <div className="space-y-6">
            <AdminDetailBreadcrumb adminName={admin?.fullName} />
            <AdminProfileOverview admin={admin} loading={loading} />
            <Tabs tabs={tabs} />

            {/* 🔑 Chỉ phần này thay đổi khi chuyển tab */}
            <Outlet />
        </div>
    );
};
