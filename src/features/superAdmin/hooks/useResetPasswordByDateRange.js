import { useDispatch, useSelector } from "react-redux";
import {
    resetPasswordByDateRangeAsync,
    clearResetPasswordByDateRangeState,
    selectSuperAdminLoadingResetPasswordByDateRange,
    selectSuperAdminErrorResetPasswordByDateRange,
    selectSuperAdminResetPasswordByDateRangeResult,
} from "../store/superAdminSlice";

export const useResetPasswordByDateRange = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectSuperAdminLoadingResetPasswordByDateRange);
    const error = useSelector(selectSuperAdminErrorResetPasswordByDateRange);
    const result = useSelector(selectSuperAdminResetPasswordByDateRangeResult);

    const resetByDateRange = async ({ fromDate, toDate }) => {
        return dispatch(resetPasswordByDateRangeAsync({ fromDate, toDate })).unwrap();
    };

    const clearState = () => {
        dispatch(clearResetPasswordByDateRangeState());
    };

    return {
        loading,
        error,
        result,
        resetByDateRange,
        clearState,
    };
};
