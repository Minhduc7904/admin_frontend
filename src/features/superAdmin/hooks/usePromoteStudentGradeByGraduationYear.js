import { useDispatch, useSelector } from 'react-redux';
import {
    clearPromoteStudentGradeByGraduationYearState,
    promoteStudentGradeByGraduationYearAsync,
    selectSuperAdminErrorPromoteStudentGradeByGraduationYear,
    selectSuperAdminLoadingPromoteStudentGradeByGraduationYear,
    selectSuperAdminPromoteStudentGradeByGraduationYearResult,
} from '../store/superAdminSlice';

export const usePromoteStudentGradeByGraduationYear = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectSuperAdminLoadingPromoteStudentGradeByGraduationYear);
    const error = useSelector(selectSuperAdminErrorPromoteStudentGradeByGraduationYear);
    const result = useSelector(selectSuperAdminPromoteStudentGradeByGraduationYearResult);

    const promoteStudentGradeByGraduationYear = async (payload) =>
        dispatch(promoteStudentGradeByGraduationYearAsync(payload)).unwrap();
    const clearState = () => dispatch(clearPromoteStudentGradeByGraduationYearState());

    return {
        loading,
        error,
        result,
        promoteStudentGradeByGraduationYear,
        clearState,
    };
};
