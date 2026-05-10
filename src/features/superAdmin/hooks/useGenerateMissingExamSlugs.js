import { useDispatch, useSelector } from 'react-redux';
import {
    generateMissingExamSlugsAsync,
    clearGenerateMissingExamSlugsState,
    selectSuperAdminLoadingGenerateMissingExamSlugs,
    selectSuperAdminErrorGenerateMissingExamSlugs,
    selectSuperAdminGenerateMissingExamSlugsResult,
} from '../store/superAdminSlice';

export const useGenerateMissingExamSlugs = () => {
    const dispatch = useDispatch();

    const loading = useSelector(selectSuperAdminLoadingGenerateMissingExamSlugs);
    const error = useSelector(selectSuperAdminErrorGenerateMissingExamSlugs);
    const result = useSelector(selectSuperAdminGenerateMissingExamSlugsResult);

    const generateMissingExamSlugs = async (payload = {}) => {
        return dispatch(generateMissingExamSlugsAsync(payload)).unwrap();
    };

    const clearState = () => {
        dispatch(clearGenerateMissingExamSlugsState());
    };

    return {
        loading,
        error,
        result,
        generateMissingExamSlugs,
        clearState,
    };
};
