import { useDispatch, useSelector } from 'react-redux';
import {
    clearUpdateStudentGraduationYearByGradeState,
    selectSuperAdminErrorUpdateStudentGraduationYearByGrade,
    selectSuperAdminLoadingUpdateStudentGraduationYearByGrade,
    selectSuperAdminUpdateStudentGraduationYearByGradeResult,
    updateStudentGraduationYearByGradeAsync,
} from '../store/superAdminSlice';

export const useUpdateStudentGraduationYearByGrade = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectSuperAdminLoadingUpdateStudentGraduationYearByGrade);
    const error = useSelector(selectSuperAdminErrorUpdateStudentGraduationYearByGrade);
    const result = useSelector(selectSuperAdminUpdateStudentGraduationYearByGradeResult);

    const updateStudentGraduationYearByGrade = async (payload) =>
        dispatch(updateStudentGraduationYearByGradeAsync(payload)).unwrap();
    const clearState = () => dispatch(clearUpdateStudentGraduationYearByGradeState());

    return {
        loading,
        error,
        result,
        updateStudentGraduationYearByGrade,
        clearState,
    };
};
