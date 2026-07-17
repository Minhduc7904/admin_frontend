import { useDispatch, useSelector } from 'react-redux';
import {
    autoSubmitExpiredCompetitionAttemptsAsync,
    clearAutoSubmitExpiredCompetitionAttemptsState,
    selectSuperAdminAutoSubmitExpiredCompetitionAttemptsResult,
    selectSuperAdminErrorAutoSubmitExpiredCompetitionAttempts,
    selectSuperAdminLoadingAutoSubmitExpiredCompetitionAttempts,
} from '../store/superAdminSlice';

export const useAutoSubmitExpiredCompetitionAttempts = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectSuperAdminLoadingAutoSubmitExpiredCompetitionAttempts);
    const error = useSelector(selectSuperAdminErrorAutoSubmitExpiredCompetitionAttempts);
    const result = useSelector(selectSuperAdminAutoSubmitExpiredCompetitionAttemptsResult);

    const autoSubmitExpiredCompetitionAttempts = async () =>
        dispatch(autoSubmitExpiredCompetitionAttemptsAsync()).unwrap();
    const clearState = () => dispatch(clearAutoSubmitExpiredCompetitionAttemptsState());

    return { loading, error, result, autoSubmitExpiredCompetitionAttempts, clearState };
};
