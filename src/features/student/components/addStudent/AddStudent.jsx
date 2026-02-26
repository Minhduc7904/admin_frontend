import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Button } from '../../../../shared/components';
import {
    createStudentAsync,
    selectStudentLoadingCreate,
    setAddStudentFormData,
    selectAddStudentFormData,
    setCoursesSelection,
    setCourseClassesSelection,
    setClassSessionsSelection,
    selectCourseClassesSelection,
    selectCoursesSelection,
    selectClassSessionsSelection,
} from '../../store/studentSlice';
import { StudentBasicInfoStep } from './StudentBasicInfoStep';
import { StudentEnrollmentStep } from './StudentEnrollmentStep';

/* ===================== HELPERS ===================== */
const toSlug = (str) =>
    str
        .replace(/[đĐ]/g, 'd')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

/* ===================== STEP PROGRESS ===================== */
const StepProgress = ({ currentStep }) => {
    return (
        <div className="flex items-center justify-center gap-6 text-sm">
            {/* STEP 1 */}
            <div className="flex items-center gap-2">
                <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold
                        ${currentStep === 1 ? 'bg-gray-200 text-gray-500' : 'bg-success text-white'}
                    `}
                >
                    1
                </div>
                <span
                    className={currentStep === 1 ? 'font-medium text-foreground' : 'text-success'}
                >
                    Thông tin học sinh
                </span>
            </div>

            <div className="w-10 h-px bg-border" />

            {/* STEP 2 */}
            <div className="flex items-center gap-2">
                <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold
                        ${currentStep === 2 ? 'bg-gray-200 text-gray-500' : 'bg-gray-200 text-gray-500'}
                    `}
                >
                    2
                </div>
                <span
                    className={currentStep === 2 ? 'font-medium text-foreground' : 'text-foreground-light'}
                >
                    Gán khóa học & lớp
                </span>
            </div>
        </div>
    );
};

export const AddStudent = ({ onClose, loadStudents }) => {
    const dispatch = useDispatch();
    const loadingCreate = useSelector(selectStudentLoadingCreate);

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [autoGenCredentials, setAutoGenCredentials] = useState(false);
    const formData = useSelector(selectAddStudentFormData);

    const coursesSelection = useSelector(selectCoursesSelection);
    const courseClassesSelection = useSelector(selectCourseClassesSelection);
    const classSessionsSelection = useSelector(selectClassSessionsSelection);

    /* ===================== HANDLERS ===================== */
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { [name]: value };

        // Auto-generate credentials when relevant fields change
        if (autoGenCredentials) {
            const firstName = name === 'firstName' ? value : formData.firstName;
            const studentPhone = name === 'studentPhone' ? value : formData.studentPhone;
            if (firstName && studentPhone) {
                const generated = toSlug(firstName) + studentPhone.trim();
                updated.username = generated;
                updated.password = generated;
                updated.confirmPassword = generated;
            }
        }

        dispatch(setAddStudentFormData(updated));
    };

    const handleAutoGenChange = (checked) => {
        setAutoGenCredentials(checked);
        if (checked && formData.firstName && formData.studentPhone) {
            const generated = toSlug(formData.firstName) + formData.studentPhone.trim();
            dispatch(setAddStudentFormData({
                username: generated,
                password: generated,
                confirmPassword: generated,
            }));
        }
    };

    const validateStep1 = () => {
        const errors = {};

        if (!formData.username?.trim()) errors.username = 'Tên đăng nhập không được để trống';
        if (!formData.password || formData.password.length < 6)
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        if (formData.password !== formData.confirmPassword)
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        if (!formData.firstName?.trim()) errors.firstName = 'Tên không được để trống';
        if (!formData.lastName?.trim()) errors.lastName = 'Họ không được để trống';
        if (!formData.grade) errors.grade = 'Khối lớp không được để trống';

        if (formData.studentPhone && !/^[0-9]{10,11}$/.test(formData.studentPhone))
            errors.studentPhone = 'SĐT không hợp lệ (10–11 số)';
        if (formData.parentPhone && !/^[0-9]{10,11}$/.test(formData.parentPhone))
            errors.parentPhone = 'SĐT không hợp lệ (10–11 số)';

        return errors;
    };

    /* ===================== STEP 1 ===================== */
    const handleNextStep = () => {
        const validationErrors = validateStep1();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setCurrentStep(2);
    };

    /* ===================== STEP 2 ===================== */
    const handleSubmit = async () => {

        const payload = {
            username: formData.username.trim(),
            password: formData.password,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            grade: Number(formData.grade),
            school: formData.school?.trim() || undefined,
            studentPhone: formData.studentPhone?.trim() || undefined,
            parentPhone: formData.parentPhone?.trim() || undefined,

            courseIds: coursesSelection.map(c => c.courseId),
            classIds: courseClassesSelection.map(c => c.classId),
            sessionIds: classSessionsSelection.map(s => s.sessionId),
        };

        await dispatch(createStudentAsync(payload)).unwrap();
        dispatch(setAddStudentFormData({
            username: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            school: '',
            studentPhone: '',
            parentPhone: '',
        }));
        if (loadStudents) await loadStudents();
        setCurrentStep(1);
    };

    /* ===================== STEP 2 SELECTION ===================== */
    const onCourseSelectionChange = (courses) => {
        const courseIds = courses.map(c => c.courseId);
        dispatch(setCoursesSelection(courses));
        const filteredCourseClasses = courseClassesSelection.filter(cc => courseIds.includes(cc.courseId));
        dispatch(setCourseClassesSelection(filteredCourseClasses));
    };

    const onCourseClassSelectionChange = (courseClasses) => {
        dispatch(setCourseClassesSelection(courseClasses));
    };

    const onSessionSelectionChange = (classSessions) => {
        dispatch(setClassSessionsSelection(classSessions));
    };

    const onGradeChange = (value) => {
        dispatch(setAddStudentFormData({ grade: value }));
    }

    /* ===================== RENDER ===================== */
    return (
        <div className="flex flex-col h-full">
            {/* ===== Progress ===== */}
            <div className="px-6 py-3 border-b border-border bg-white">
                <StepProgress currentStep={currentStep} />
            </div>

            {/* ===== Step Content ===== */}
            <div className="flex-1 px-6 py-4 overflow-y-auto">
                {currentStep === 1 && (
                    <StudentBasicInfoStep
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        onGradeChange={onGradeChange}
                        autoGenCredentials={autoGenCredentials}
                        onAutoGenChange={handleAutoGenChange}
                    />
                )}

                {currentStep === 2 && (
                    <StudentEnrollmentStep
                        formData={formData}
                        coursesSelection={coursesSelection}
                        courseClassesSelection={courseClassesSelection}
                        classSessionsSelection={classSessionsSelection}
                        onCourseSelectionChange={onCourseSelectionChange}
                        onCourseClassSelectionChange={onCourseClassSelectionChange}
                        onSessionSelectionChange={onSessionSelectionChange}
                    />
                )}
            </div>

            {/* ===== Footer ===== */}
            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-between">
                <Button
                    variant="secondary"
                    onClick={() => setCurrentStep(1)}
                    disabled={currentStep === 1}
                >
                    Quay lại
                </Button>

                {currentStep === 1 ? (
                    <Button onClick={handleNextStep}>
                        Bước tiếp
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        loading={loadingCreate}
                        disabled={loadingCreate}
                    >
                        Hoàn tất
                    </Button>
                )}
            </div>
        </div>
    );
};
