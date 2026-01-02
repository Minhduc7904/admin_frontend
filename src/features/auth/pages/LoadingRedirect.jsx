import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { getProfileAsync } from '../../profile/store/profileSlice';
import { ROUTES } from '../../../core/constants';
import { PageLoading } from '../../../shared/components/loading';

export const LoadingRedirect = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, loading } = useAppSelector((state) => state.profile);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }

        // Load profile
        dispatch(getProfileAsync());
    }, [isAuthenticated]);

    useEffect(() => {
        if (profile && !loading) {
            // Get the previous page from location state
            const from = location.state?.from?.pathname;
            console.log('Previous page:', from);

            // const rolePath = rolePathMap[profile.roleId];
            if (from) {
                navigate(from, { replace: true });
            } else {
                navigate(ROUTES.DASHBOARD, { replace: true });
            }
            // const roles = profile.roles.map((role) => role.);

        }
    }, [profile, loading]);

    return <PageLoading message="Đang tải thông tin..." />;
};
