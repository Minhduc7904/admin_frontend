import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from '../../../shared/components/ui';
import { CourseSearchSelect } from '../../course/components';
import { AdminSearchSelect } from "../../admin/components/AdminSearchSelect";
import { updateCourseClassAsync, selectCourseClassLoadingUpdate } from '../store/courseClassSlice';

/**
 * EditClass - Form chỉnh sửa lớp học
 * @param {Object} courseClass - Thông tin lớp học cần chỉnh sửa
 * @param {Function} onClose - Callback khi đóng form
 * @param {boolean} disableInstructorEdit - Không cho phép chỉnh sửa giáo viên (cho "My Classes")
 */
export const EditClass = ({
    courseClass,
    onClose,
}) => {
    const dispatch = useDispatch();
    const loadingUpdate = useSelector(selectCourseClassLoadingUpdate);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        className: '',
        startDate: '',
        endDate: '',
        room: '',
        instructorId: null,
    });

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    // Initialize form data when courseClass changes
    useEffect(() => {
        if (courseClass) {
            setFormData({
                className: courseClass.className || '',
                startDate: courseClass.startDate ? new Date(courseClass.startDate).toISOString().split('T')[0] : '',
                endDate: courseClass.endDate ? new Date(courseClass.endDate).toISOString().split('T')[0] : '',
                room: courseClass.room || '',
                instructorId: courseClass.instructorId || null,
            });

            if (courseClass.course) {
                setSelectedCourse(courseClass.course);
            }

            if (courseClass.instructor) {
                setSelectedInstructor(courseClass.instructor);
            }
        }
    }, [courseClass]);

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
                className: formData.className.trim(),
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined,
                room: formData.room?.trim() || undefined,
                instructorId: formData.instructorId ? parseInt(formData.instructorId) : undefined,
            };

            await dispatch(updateCourseClassAsync({
                id: courseClass.classId,
                data: payload
            })).unwrap();
            onClose();
        } catch (error) {
            console.error('Error updating class:', error);
        }
    };

    if (!courseClass) {
        return (
            <div className="px-6 py-4 text-center text-foreground-light">
                Không tìm thấy thông tin lớp học
            </div>
        );
    }

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

                {/* Giáo viên */}
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
                    disabled={loadingUpdate}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loadingUpdate}
                    disabled={loadingUpdate}
                >
                    Cập nhật
                </Button>
            </div>
        </form>
    );
};
