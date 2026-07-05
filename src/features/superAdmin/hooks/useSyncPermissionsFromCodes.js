import { useDispatch, useSelector } from 'react-redux';
import {
    clearSyncPermissionsFromCodesState,
    selectSuperAdminErrorSyncPermissionsFromCodes,
    selectSuperAdminLoadingSyncPermissionsFromCodes,
    selectSuperAdminSyncPermissionsFromCodesResult,
    syncPermissionsFromCodesAsync,
} from '../store/superAdminSlice';

export const useSyncPermissionsFromCodes = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectSuperAdminLoadingSyncPermissionsFromCodes);
    const error = useSelector(selectSuperAdminErrorSyncPermissionsFromCodes);
    const result = useSelector(selectSuperAdminSyncPermissionsFromCodesResult);

    const syncPermissionsFromCodes = async () => dispatch(syncPermissionsFromCodesAsync()).unwrap();
    const clearState = () => dispatch(clearSyncPermissionsFromCodesState());

    return {
        loading,
        error,
        result,
        syncPermissionsFromCodes,
        clearState,
    };
};
