import { useDispatch, useSelector } from 'react-redux';
import {
    backfillQuestionDefaultPointsAsync,
    clearBackfillQuestionDefaultPointsState,
    selectSuperAdminBackfillQuestionDefaultPointsResult,
    selectSuperAdminErrorBackfillQuestionDefaultPoints,
    selectSuperAdminLoadingBackfillQuestionDefaultPoints,
} from '../store/superAdminSlice';

export const useBackfillQuestionDefaultPoints = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectSuperAdminLoadingBackfillQuestionDefaultPoints);
    const error = useSelector(selectSuperAdminErrorBackfillQuestionDefaultPoints);
    const result = useSelector(selectSuperAdminBackfillQuestionDefaultPointsResult);

    const backfillQuestionDefaultPoints = async () =>
        dispatch(backfillQuestionDefaultPointsAsync()).unwrap();
    const clearState = () => dispatch(clearBackfillQuestionDefaultPointsState());

    return { loading, error, result, backfillQuestionDefaultPoints, clearState };
};
