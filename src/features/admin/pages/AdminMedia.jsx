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

    if (invalidId) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID quản trị viên không hợp lệ. Vui lòng kiểm tra lại đường dẫn.
            </div>
        );
    }

    return (
        <MediaPage 
            userId={admin?.userId} 
            userType="admin"
            loading={adminLoading}
        />
    );
};
