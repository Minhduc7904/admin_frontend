import { useDispatch, useSelector } from 'react-redux';
import {
    clearSyncSeoMediaSlotsFromPageSlotsState,
    selectSuperAdminErrorSyncSeoMediaSlotsFromPageSlots,
    selectSuperAdminLoadingSyncSeoMediaSlotsFromPageSlots,
    selectSuperAdminSyncSeoMediaSlotsFromPageSlotsResult,
    syncSeoMediaSlotsFromPageSlotsAsync,
} from '../store/superAdminSlice';

export const useSyncSeoMediaSlotsFromPageSlots = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectSuperAdminLoadingSyncSeoMediaSlotsFromPageSlots);
    const error = useSelector(selectSuperAdminErrorSyncSeoMediaSlotsFromPageSlots);
    const result = useSelector(selectSuperAdminSyncSeoMediaSlotsFromPageSlotsResult);

    const syncSeoMediaSlotsFromPageSlots = async () =>
        dispatch(syncSeoMediaSlotsFromPageSlotsAsync()).unwrap();
    const clearState = () => dispatch(clearSyncSeoMediaSlotsFromPageSlotsState());

    return {
        loading,
        error,
        result,
        syncSeoMediaSlotsFromPageSlots,
        clearState,
    };
};
