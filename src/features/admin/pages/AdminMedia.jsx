import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../core/store/hooks';
import { selectCurrentAdmin, selectAdminLoadingGet } from '../store/adminSlice';
import { MediaPage } from '../../media/pages';

export const AdminMedia = () => {
    const { id } = useParams();
    const adminId = Number(id);

    const admin = useAppSelector(selectCurrentAdmin);
    const adminLoading = useAppSelector(selectAdminLoadingGet);

    const invalidId = isNaN(adminId) || adminId <= 0;


    return (
        <MediaPage
            userId={admin?.userId}
            userType="admin"
            loading={adminLoading}
            requireUserId={true}
        />
    );
};
