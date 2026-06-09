import { useDispatch, useSelector } from 'react-redux';
import {
    clearHardDeleteStudentsByGraduationYearGradeExcludedCoursesState,
    hardDeleteStudentsByGraduationYearGradeExcludedCoursesAsync,
    selectSuperAdminErrorHardDeleteStudentsByGraduationYearGradeExcludedCourses,
    selectSuperAdminHardDeleteStudentsByGraduationYearGradeExcludedCoursesResult,
    selectSuperAdminLoadingHardDeleteStudentsByGraduationYearGradeExcludedCourses,
} from '../store/superAdminSlice';

export const useHardDeleteStudentsByGraduationYearGradeExcludedCourses = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectSuperAdminLoadingHardDeleteStudentsByGraduationYearGradeExcludedCourses);
    const error = useSelector(selectSuperAdminErrorHardDeleteStudentsByGraduationYearGradeExcludedCourses);
    const result = useSelector(selectSuperAdminHardDeleteStudentsByGraduationYearGradeExcludedCoursesResult);

    const hardDeleteStudentsByGraduationYearGradeExcludedCourses = async (payload) =>
        dispatch(hardDeleteStudentsByGraduationYearGradeExcludedCoursesAsync(payload)).unwrap();
    const clearState = () => dispatch(clearHardDeleteStudentsByGraduationYearGradeExcludedCoursesState());

    return {
        loading,
        error,
        result,
        hardDeleteStudentsByGraduationYearGradeExcludedCourses,
        clearState,
    };
};
