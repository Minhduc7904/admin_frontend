import { useDispatch, useSelector } from 'react-redux';
import {
    cleanupUnusedMediaOlderThan30DaysAsync,
    clearCleanupUnusedMediaOlderThan30DaysState,
    selectSuperAdminLoadingCleanupUnusedMediaOlderThan30Days,
    selectSuperAdminErrorCleanupUnusedMediaOlderThan30Days,
    selectSuperAdminCleanupUnusedMediaOlderThan30DaysResult,
} from '../store/superAdminSlice';

export const useCleanupUnusedMediaOlderThan30Days = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectSuperAdminLoadingCleanupUnusedMediaOlderThan30Days);
    const error = useSelector(selectSuperAdminErrorCleanupUnusedMediaOlderThan30Days);
    const result = useSelector(selectSuperAdminCleanupUnusedMediaOlderThan30DaysResult);

    const cleanupUnusedMediaOlderThan30Days = async (payload = {}) => {
        return dispatch(cleanupUnusedMediaOlderThan30DaysAsync(payload)).unwrap();
    };

    const clearState = () => {
        dispatch(clearCleanupUnusedMediaOlderThan30DaysState());
    };

    return {
        loading,
        error,
        result,
        cleanupUnusedMediaOlderThan30Days,
        clearState,
    };
};
