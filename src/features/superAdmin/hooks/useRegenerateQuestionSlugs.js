import { useDispatch, useSelector } from 'react-redux';
import {
    regenerateQuestionSlugsAsync,
    clearRegenerateQuestionSlugsState,
    selectSuperAdminLoadingRegenerateQuestionSlugs,
    selectSuperAdminErrorRegenerateQuestionSlugs,
    selectSuperAdminRegenerateQuestionSlugsResult,
} from '../store/superAdminSlice';

export const useRegenerateQuestionSlugs = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectSuperAdminLoadingRegenerateQuestionSlugs);
    const error = useSelector(selectSuperAdminErrorRegenerateQuestionSlugs);
    const result = useSelector(selectSuperAdminRegenerateQuestionSlugsResult);

    const regenerateQuestionSlugs = async (payload = {}) => {
        return dispatch(regenerateQuestionSlugsAsync(payload)).unwrap();
    };

    const clearState = () => {
        dispatch(clearRegenerateQuestionSlugsState());
    };

    return {
        loading,
        error,
        result,
        regenerateQuestionSlugs,
        clearState,
    };
};
