import { CourseSearchMultiSelect } from '../../../course/components';
import { CourseClassSearchMultiSelect } from '../../../courseClass/components';
import { ClassSessionSearchMultiSelect } from '../../../classSesssion/components';

export const StudentEnrollmentStep = ({
    formData,
    coursesSelection,
    courseClassesSelection,
    classSessionsSelection,
    onCourseSelectionChange,
    onCourseClassSelectionChange,
    onSessionSelectionChange,
}) => {
    return (
        <div className="space-y-6">
            {/* ================= COURSE ================= */}
            <div>
                <CourseSearchMultiSelect
                    label="Chọn khóa học"
                    required
                    value={coursesSelection || []}
                    onChange={(courses) => {
                        // Lưu object nếu cần render lại
                        onCourseSelectionChange(courses);
                    }}
                />
            </div>

            {/* ================= CLASS ================= */}
            <div>
                <CourseClassSearchMultiSelect
                    label="Chọn lớp học"
                    disabled={coursesSelection.length === 0}
                    value={courseClassesSelection || []}
                    courseIds={coursesSelection.map((c) => c.courseId)}
                    onChange={(classes) => {
                        onCourseClassSelectionChange(classes);
                    }}
                />
                {coursesSelection.length === 0 && (
                    <p className="text-xs text-foreground-light mt-1">
                        Vui lòng chọn khóa học trước
                    </p>
                )}
            </div>

            {/* ================= SESSION ================= */}
            <div>
                <ClassSessionSearchMultiSelect
                    label="Chọn buổi học (điểm danh)"
                    value={classSessionsSelection || []}
                    onChange={(classSessions) => {
                        onSessionSelectionChange(classSessions);
                    }}
                />
            </div>
        </div>
    );
};
