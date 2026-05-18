import { useDispatch, useSelector } from 'react-redux';
import {
    clearSeedDefaultTagsState,
    seedDefaultTagsAsync,
    selectSuperAdminErrorSeedDefaultTags,
    selectSuperAdminLoadingSeedDefaultTags,
    selectSuperAdminSeedDefaultTagsResult,
} from '../store/superAdminSlice';

export const useSeedDefaultTags = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectSuperAdminLoadingSeedDefaultTags);
    const error = useSelector(selectSuperAdminErrorSeedDefaultTags);
    const result = useSelector(selectSuperAdminSeedDefaultTagsResult);

    const seedDefaultTags = async (payload = {}) => dispatch(seedDefaultTagsAsync(payload)).unwrap();
    const clearState = () => dispatch(clearSeedDefaultTagsState());

    return {
        loading,
        error,
        result,
        seedDefaultTags,
        clearState,
    };
};
