// 1. Imports
import { useAppSelector } from '../../../core/store/hooks';
import {
    selectCurrentAdmin,
    selectAdminLoadingGet,
} from '../store/adminSlice';
import { AdminInfoTab } from '../components';

// 2. Component
export const AdminDetail = () => {
    const admin = useAppSelector(selectCurrentAdmin);
    const loading = useAppSelector(selectAdminLoadingGet);

    return <AdminInfoTab admin={admin} loading={loading} />;
};
