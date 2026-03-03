import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, Dropdown } from '../../../shared/components';
import { updateStudentAsync, getStudentByIdAsync } from '../store/studentSlice';

export const EditStudentForm = ({ student, onClose }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [originalData, setOriginalData] = useState({});

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        grade: '',
        school: '',
        studentPhone: '',
        parentPhone: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (student) {
            const initial = {
                firstName: student.firstName || '',
                lastName: student.lastName || '',
                email: student.email || '',
                grade: student.grade?.toString() || '',
                school: student.school || '',
                studentPhone: student.studentPhone || '',
                parentPhone: student.parentPhone || '',
                password: '',
                confirmPassword: '',
            };
            setFormData(initial);
            setOriginalData(initial);
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'Tên không được để trống';
        }

        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'Họ không được để trống';
        }

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.grade) {
            newErrors.grade = 'Khối lớp không được để trống';
        }

        if (formData.studentPhone && !/^[0-9]{10,11}$/.test(formData.studentPhone)) {
            newErrors.studentPhone = 'Số điện thoại không hợp lệ (10-11 số)';
        }

        if (formData.parentPhone && !/^[0-9]{10,11}$/.test(formData.parentPhone)) {
            newErrors.parentPhone = 'Số điện thoại không hợp lệ (10-11 số)';
        }

        if (formData.password) {
            if (formData.password.length < 6) {
                newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const updateData = {};

            if (formData.firstName.trim() !== originalData.firstName) {
                updateData.firstName = formData.firstName.trim();
            }
            if (formData.lastName.trim() !== originalData.lastName) {
                updateData.lastName = formData.lastName.trim();
            }
            if ((formData.email?.trim() || '') !== (originalData.email || '')) {
                updateData.email = formData.email?.trim() || undefined;
            }
            if (formData.grade !== originalData.grade) {
                updateData.grade = parseInt(formData.grade);
            }
            if ((formData.school?.trim() || '') !== (originalData.school || '')) {
                updateData.school = formData.school?.trim() || undefined;
            }
            if ((formData.studentPhone?.trim() || '') !== (originalData.studentPhone || '')) {
                updateData.studentPhone = formData.studentPhone?.trim() || undefined;
            }
            if ((formData.parentPhone?.trim() || '') !== (originalData.parentPhone || '')) {
                updateData.parentPhone = formData.parentPhone?.trim() || undefined;
            }
            if (formData.password) {
                updateData.password = formData.password;
            }

            if (Object.keys(updateData).length === 0) {
                onClose();
                return;
            }

            await dispatch(updateStudentAsync({
                id: student.studentId,
                data: updateData
            })).unwrap();

            // Refresh student data
            await dispatch(getStudentByIdAsync(student.studentId));

            onClose();
        } catch (error) {
            console.error('Error updating student:', error);
        } finally {
            setLoading(false);
        }
    };

    const gradeOptions = [
        { value: '', label: 'Chọn khối' },
        { value: '6', label: 'Khối 6' },
        { value: '7', label: 'Khối 7' },
        { value: '8', label: 'Khối 8' },
        { value: '9', label: 'Khối 9' },
        { value: '10', label: 'Khối 10' },
        { value: '11', label: 'Khối 11' },
        { value: '12', label: 'Khối 12' },
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            error={errors.lastName}
                            name="lastName"
                            label="Họ"
                            required={true}
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="VD: Nguyễn"
                        />
                    </div>
                    <div>
                        <Input
                            error={errors.firstName}
                            name="firstName"
                            label="Tên"
                            required={true}
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="VD: Văn A"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <Input
                        error={errors.email}
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="VD: student@example.com"
                    />
                </div>

                {/* Grade */}
                <div>
                    <Dropdown
                        label="Khối lớp"
                        required={true}
                        value={formData.grade}
                        onChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                        options={gradeOptions}
                        error={errors.grade}
                    />
                </div>

                {/* School */}
                <div>
                    <Input
                        error={errors.school}
                        name="school"
                        label="Trường học"
                        value={formData.school}
                        onChange={handleChange}
                        placeholder="VD: THPT Nguyễn Huệ"
                    />
                </div>

                {/* Phone Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            error={errors.studentPhone}
                            name="studentPhone"
                            label="SĐT học sinh"
                            value={formData.studentPhone}
                            onChange={handleChange}
                            placeholder="VD: 0912345678"
                        />
                    </div>
                    <div>
                        <Input
                            error={errors.parentPhone}
                            name="parentPhone"
                            label="SĐT phụ huynh"
                            value={formData.parentPhone}
                            onChange={handleChange}
                            placeholder="VD: 0987654321"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            error={errors.password}
                            name="password"
                            label="Mật khẩu mới"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Để trống nếu không đổi"
                        />
                    </div>
                    <div>
                        <Input
                            error={errors.confirmPassword}
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                >
                    Lưu thay đổi
                </Button>
            </div>
        </form>
    );
};
