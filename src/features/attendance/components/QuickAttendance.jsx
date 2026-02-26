import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown } from '../../../shared/components/ui';
import { CourseSearchMultiSelect } from '../../course/components';
import { CourseClassSearchMultiSelect } from '../../courseClass/components';
import { ClassSessionSearchMultiSelect } from '../../classSesssion/components';
import { createAttendanceAsync } from '../store/attendanceSlice';
import {
    setQuickAttendanceCoursesSelection,
    setQuickAttendanceClassesSelection,
    setQuickAttendanceSessionsSelection,
    setQuickAttendanceAutoAddToCourse,
    setQuickAttendanceAutoAddToClass,
    setQuickAttendanceStatus,
    resetQuickAttendanceSelection,
    selectQuickAttendanceCoursesSelection,
    selectQuickAttendanceClassesSelection,
    selectQuickAttendanceSessionsSelection,
    selectQuickAttendanceAutoAddToCourse,
    selectQuickAttendanceAutoAddToClass,
    selectQuickAttendanceStatus,
} from '../store/attendanceSlice';
import { createEnrollmentAsync } from '../../courseEnrollment/store/courseEnrollmentSlice';
import { addStudentToClassAsync } from '../../classStudent/store/classStudentSlice';
import { ATTENDANCE_STATUS_OPTIONS } from '../../../core/constants/options';

/**
 * QuickAttendance - Điểm danh nhanh cho một học sinh
 * Cho phép chọn khóa học → lớp → buổi học, tùy chọn tự động ghi danh vào khóa/lớp
 *
 * @param {Object} student  - Học sinh cần điểm danh
 * @param {Function} onClose - Callback khi đóng
 */
export const QuickAttendance = ({ student, onClose }) => {
    const dispatch = useDispatch();

    /* ===================== REDUX SELECTION STATE ===================== */
    const coursesSelection = useSelector(selectQuickAttendanceCoursesSelection);
    const classesSelection = useSelector(selectQuickAttendanceClassesSelection);
    const sessionsSelection = useSelector(selectQuickAttendanceSessionsSelection);
    const autoAddToCourse = useSelector(selectQuickAttendanceAutoAddToCourse);
    const autoAddToClass = useSelector(selectQuickAttendanceAutoAddToClass);
    const status = useSelector(selectQuickAttendanceStatus);

    /* ===================== FORM STATE ===================== */
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    /* ===================== HANDLERS ===================== */
    const handleCourseChange = (courses) => {
        dispatch(setQuickAttendanceCoursesSelection(courses));
        // Filter classes that still belong to selected courses
        const courseIds = courses.map((c) => c.courseId);
        dispatch(setQuickAttendanceClassesSelection(
            classesSelection.filter((cls) => courseIds.includes(cls.courseId))
        ));
        setErrors((e) => ({ ...e, courses: '' }));
    };

    const handleClassChange = (classes) => {
        dispatch(setQuickAttendanceClassesSelection(classes));
        setErrors((e) => ({ ...e, classes: '' }));
    };

    const handleSessionChange = (sessions) => {
        dispatch(setQuickAttendanceSessionsSelection(sessions));
        setErrors((e) => ({ ...e, sessions: '' }));
    };

    /* ===================== ADD MODE ===================== */
    // Add-only mode: no sessions selected but user wants to auto-enroll in courses
    const isAddMode =
        sessionsSelection.length === 0 &&
        coursesSelection.length > 0 &&
        autoAddToCourse;

    /* ===================== VALIDATE ===================== */
    const validate = () => {
        const errs = {};
        if (!isAddMode && sessionsSelection.length === 0)
            errs.sessions = 'Vui lòng chọn ít nhất một buổi học';
        return errs;
    };

    /* ===================== SUBMIT ===================== */
    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        try {
            // 1. Auto-add to courses
            if (autoAddToCourse && coursesSelection.length > 0) {
                await Promise.allSettled(
                    coursesSelection.map((course) =>
                        dispatch(
                            createEnrollmentAsync({
                                studentId: student.studentId,
                                courseId: course.courseId,
                            }),
                        ),
                    ),
                );
            }

            // 2. Auto-add to classes
            if (autoAddToClass && classesSelection.length > 0) {
                await Promise.allSettled(
                    classesSelection.map((cls) =>
                        dispatch(
                            addStudentToClassAsync({
                                studentId: student.studentId,
                                classId: cls.classId,
                            }),
                        ),
                    ),
                );
            }

            // 3. Create attendance for each session (skip in add-only mode)
            if (!isAddMode && sessionsSelection.length > 0) {
                await Promise.allSettled(
                    sessionsSelection.map((session) =>
                        dispatch(
                            createAttendanceAsync({
                                studentId: student.studentId,
                                sessionId: session.sessionId,
                                status,
                            }),
                        ),
                    ),
                );
            }

            onClose();
        } catch (err) {
            console.error('Quick attendance failed:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!student) return null;

    return (
        <div className="flex flex-col h-full">
            {/* ===== STUDENT INFO ===== */}
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                <p className="text-sm text-foreground-light">Học sinh</p>
                <p className="text-sm font-semibold text-foreground">
                    {student.fullName}{' '}
                    <span className="font-normal text-foreground-light">
                        ({student.username})
                    </span>
                </p>
            </div>

            {/* ===== BODY ===== */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* ===== COURSE ===== */}
                <CourseSearchMultiSelect
                    label="Chọn khóa học"
                    value={coursesSelection}
                    onChange={handleCourseChange}
                    error={errors.courses}
                />

                {/* ===== CLASS ===== */}
                <div>
                    <CourseClassSearchMultiSelect
                        label="Chọn lớp học"
                        disabled={coursesSelection.length === 0}
                        value={classesSelection}
                        courseIds={coursesSelection.map((c) => c.courseId)}
                        onChange={handleClassChange}
                        error={errors.classes}
                    />
                    {coursesSelection.length === 0 && (
                        <p className="text-xs text-foreground-light mt-1">
                            Vui lòng chọn khóa học trước
                        </p>
                    )}
                </div>

                {/* ===== SESSION ===== */}
                <div>
                    <ClassSessionSearchMultiSelect
                        label="Chọn buổi học"
                        required
                        value={sessionsSelection}
                        classIds={classesSelection.map((c) => c.classId)}
                        onChange={handleSessionChange}
                        error={errors.sessions}
                    />
                </div>

                {/* ===== STATUS ===== */}
                <Dropdown
                    label="Trạng thái điểm danh"
                    required
                    value={status}
                    onChange={(val) => dispatch(setQuickAttendanceStatus(val))}
                    options={ATTENDANCE_STATUS_OPTIONS}
                />

                {/* ===== AUTO ADD OPTIONS ===== */}
                <div className="border border-border rounded-sm p-4 space-y-3 bg-gray-50">
                    <p className="text-sm font-medium text-foreground">
                        Tùy chọn tự động thêm học sinh
                    </p>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded border-border text-blue-600 focus:ring-blue-500"
                            checked={autoAddToCourse}
                            onChange={(e) => dispatch(setQuickAttendanceAutoAddToCourse(e.target.checked))}
                        />
                        <div>
                            <span className="text-sm text-foreground font-medium">
                                Tự động ghi danh vào khóa học
                            </span>
                            <p className="text-xs text-foreground-light mt-0.5">
                                Nếu học sinh chưa ghi danh, hệ thống sẽ tự động thêm vào{' '}
                                {coursesSelection.length > 0 ? (
                                    <span className="font-medium">
                                        {coursesSelection.length} khóa học đã chọn
                                    </span>
                                ) : (
                                    'các khóa học đã chọn'
                                )}
                            </p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded border-border text-blue-600 focus:ring-blue-500"
                            checked={autoAddToClass}
                            onChange={(e) => dispatch(setQuickAttendanceAutoAddToClass(e.target.checked))}
                        />
                        <div>
                            <span className="text-sm text-foreground font-medium">
                                Tự động thêm vào lớp học
                            </span>
                            <p className="text-xs text-foreground-light mt-0.5">
                                Nếu học sinh chưa vào lớp, hệ thống sẽ tự động thêm vào{' '}
                                {classesSelection.length > 0 ? (
                                    <span className="font-medium">
                                        {classesSelection.length} lớp học đã chọn
                                    </span>
                                ) : (
                                    'các lớp học đã chọn'
                                )}
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            {/* ===== FOOTER ===== */}
            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading || (!isAddMode && sessionsSelection.length === 0)}
                >
                    {isAddMode
                        ? `Thêm vào ${coursesSelection.length} khóa học${autoAddToClass && classesSelection.length > 0 ? ` & ${classesSelection.length} lớp` : ''}`
                        : `Điểm danh (${sessionsSelection.length} buổi)`}
                </Button>
            </div>
        </div>
    );
};
