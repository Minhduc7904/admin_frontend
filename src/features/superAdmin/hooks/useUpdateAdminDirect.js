import { useDispatch, useSelector } from 'react-redux';
import {
    updateAdminDirectAsync,
    clearUpdateAdminDirectState,
    selectSuperAdminLoadingUpdateAdminDirect,
    selectSuperAdminErrorUpdateAdminDirect,
    selectSuperAdminUpdateAdminDirectResult,
} from '../store/superAdminSlice';

export const useUpdateAdminDirect = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectSuperAdminLoadingUpdateAdminDirect);
    const error = useSelector(selectSuperAdminErrorUpdateAdminDirect);
    const result = useSelector(selectSuperAdminUpdateAdminDirectResult);

    const updateAdminDirect = async (payload) => {
        return dispatch(updateAdminDirectAsync(payload)).unwrap();
    };

    const clearState = () => {
        dispatch(clearUpdateAdminDirectState());
    };

    return {
        loading,
        error,
        result,
        updateAdminDirect,
        clearState,
    };
};
