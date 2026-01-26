import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../core/store/hooks';
import { selectCurrentAdmin, selectAdminLoadingGet } from '../store/adminSlice';
import { UserRolePage } from '../../role/pages';

export const AdminRole = () => {
    const { id } = useParams();
    const adminId = Number(id);
    
    const admin = useAppSelector(selectCurrentAdmin);
    const adminLoading = useAppSelector(selectAdminLoadingGet);
    
    const invalidId = isNaN(adminId) || adminId <= 0;


    return (
        <UserRolePage 
            userId={admin?.userId} 
            userType="admin"
            loading={adminLoading}
        />
    );
};
