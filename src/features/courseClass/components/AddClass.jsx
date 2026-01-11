import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Textarea } from '../../../shared/components/ui';
import { CourseSearchSelect } from '../../course/components';
import { AdminSearchSelect } from "../../admin/components/AdminSearchSelect";
import { createCourseClassAsync, selectCourseClassLoadingCreate } from '../store/courseClassSlice';

/**
 * AddClass - Form tạo lớp học mới
 * @param {Function} onClose - Callback khi đóng form
 * @param {number} defaultInstructorId - ID giáo viên mặc định (cho "My Classes")
 * @param {boolean} canSelectInstructor - Cho phép chọn giáo viên hay không
 * @param {number} filterCourseTeacherId - Filter khóa học theo teacherId (cho "My Classes")
 * @param {number} defaultCourseId - ID khóa học mặc định
 * @param {boolean} canSelectCourse - Cho phép chọn khóa học hay không
 */
export const AddClass = ({
    onClose,
    defaultInstructorId = null,
    canSelectInstructor = true,
    filterCourseTeacherId = null,
    defaultCourseId = null,
    canSelectCourse = true
}) => {
    const dispatch = useDispatch();
    const loadingCreate = useSelector(selectCourseClassLoadingCreate);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        courseId: defaultCourseId || '',
        className: '',
        startDate: '',
        endDate: '',
        room: '',
        instructorId: defaultInstructorId || '',
    });

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.courseId) {
            newErrors.courseId = 'Vui lòng chọn khóa học';
        }

        if (!formData.className?.trim()) {
            newErrors.className = 'Vui lòng nhập tên lớp học';
        } else if (formData.className.trim().length < 3) {
            newErrors.className = 'Tên lớp học phải có ít nhất 3 ký tự';
        } else if (formData.className.trim().length > 255) {
            newErrors.className = 'Tên lớp học không được vượt quá 255 ký tự';
        }

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (end < start) {
                newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
        }

        if (formData.room && formData.room.trim().length > 100) {
            newErrors.room = 'Tên phòng học không được vượt quá 100 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const payload = {
                courseId: parseInt(formData.courseId),
                className: formData.className.trim(),
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined,
                room: formData.room?.trim() || undefined,
                instructorId: formData.instructorId ? parseInt(formData.instructorId) : undefined,
            };

            await dispatch(createCourseClassAsync(payload)).unwrap();
            onClose();
        } catch (error) {
            console.error('Error creating class:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* Tên lớp */}
                <div>
                    <Input
                        error={errors.className}
                        name="className"
                        label="Tên lớp học"
                        required={true}
                        value={formData.className}
                        onChange={handleChange}
                        placeholder="VD: Lớp Toán A1"
                    />
                </div>

                {/* Khóa học */}
                {canSelectCourse && (
                    <div>
                        <CourseSearchSelect
                            label="Khóa học"
                            placeholder="Tìm kiếm khóa học..."
                            required={true}
                            value={formData.courseId}
                            onSelect={(course) => {
                                setSelectedCourse(course);
                                setFormData(prev => ({
                                    ...prev,
                                    courseId: course.courseId
                                }));
                                if (errors.courseId) {
                                    setErrors(prev => ({ ...prev, courseId: '' }));
                                }
                            }}
                            error={errors.courseId}
                            filterTeacherId={filterCourseTeacherId}
                        />
                    </div>
                )}

                {/* Giáo viên (conditional) */}
                {canSelectInstructor && (
                    <div>
                        <AdminSearchSelect
                            label="Giáo viên"
                            placeholder="Tìm kiếm giáo viên..."
                            value={formData.instructorId}
                            onSelect={(admin) => {
                                setSelectedInstructor(admin);
                                setFormData(prev => ({
                                    ...prev,
                                    instructorId: admin.adminId
                                }));
                            }}
                            error={errors.instructorId}
                        />
                    </div>
                )}

                {/* Thời gian */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            error={errors.startDate}
                            name="startDate"
                            label="Ngày bắt đầu"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Input
                            error={errors.endDate}
                            name="endDate"
                            label="Ngày kết thúc"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Phòng học */}
                <div>
                    <Input
                        error={errors.room}
                        name="room"
                        label="Phòng học"
                        value={formData.room}
                        onChange={handleChange}
                        placeholder="VD: P101, Tầng 2"
                    />
                </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loadingCreate}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loadingCreate}
                    disabled={loadingCreate}
                >
                    Tạo lớp học
                </Button>
            </div>
        </form>
    );
};
