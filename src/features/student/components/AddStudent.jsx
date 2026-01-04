import { createStudentAsync, getAllStudentsAsync, selectStudentLoadingCreate } from "../store/studentSlice"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { Input, Button, PasswordInput, Dropdown, DotsLoading } from "../../../shared/components"

export const AddStudent = ({ onClose }) => {
    const dispatch = useDispatch();
    const loadingCreate = useSelector(selectStudentLoadingCreate);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        grade: '',
        school: '',
        studentPhone: '',
        parentPhone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const validateRegisterStudent = (formData) => {
        const errors = {}

        if (!formData.username?.trim()) {
            errors.username = 'Tên đăng nhập không được để trống'
        }

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Email không hợp lệ'
        }

        if (!formData.password || formData.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        if (!formData.firstName?.trim()) {
            errors.firstName = 'Tên không được để trống'
        }

        if (!formData.lastName?.trim()) {
            errors.lastName = 'Họ không được để trống'
        }

        if (!formData.grade) {
            errors.grade = 'Khối lớp không được để trống'
        }

        if (formData.studentPhone && !/^[0-9]{10,11}$/.test(formData.studentPhone)) {
            errors.studentPhone = 'Số điện thoại không hợp lệ (10-11 số)'
        }

        if (formData.parentPhone && !/^[0-9]{10,11}$/.test(formData.parentPhone)) {
            errors.parentPhone = 'Số điện thoại không hợp lệ (10-11 số)'
        }

        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const errors = validateRegisterStudent(formData)

        if (Object.keys(errors).length > 0) {
            setErrors(errors)
            console.log('Validate errors:', errors)
            return
        }

        const data = {
            username: formData.username.trim(),
            email: formData.email?.trim() || undefined,
            password: formData.password,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            grade: parseInt(formData.grade),
            school: formData.school?.trim() || undefined,
            studentPhone: formData.studentPhone?.trim() || undefined,
            parentPhone: formData.parentPhone?.trim() || undefined,
        }

        try {
            await dispatch(createStudentAsync(data)).unwrap()
            await dispatch(getAllStudentsAsync()).unwrap()
            onClose()
        } catch (error) {
            console.error('Error creating student:', error)
        }
    }

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
                {/* Username */}
                <div>
                    <Input
                        error={errors.username}
                        name="username"
                        label={"Tên đăng nhập"}
                        required={true}
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="VD: student123"
                    />
                </div>

                {/* Email */}
                <div>
                    <Input
                        error={errors.email}
                        name="email"
                        label={"Email"}
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="VD: student@example.com"
                    />
                </div>

                {/* Password */}
                <div>
                    <PasswordInput
                        error={errors.password}
                        required={true}
                        label={"Mật khẩu"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                {/* Confirm Password */}
                <div>
                    <PasswordInput
                        error={errors.confirmPassword}
                        required={true}
                        label={"Xác nhận mật khẩu"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Xác nhận mật khẩu"
                    />
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            error={errors.lastName}
                            name="lastName"
                            label={"Họ"}
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
                            label={"Tên"}
                            required={true}
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="VD: Văn A"
                        />
                    </div>
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
                        label={"Trường học"}
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
                            label={"SĐT học sinh"}
                            value={formData.studentPhone}
                            onChange={handleChange}
                            placeholder="VD: 0912345678"
                        />
                    </div>
                    <div>
                        <Input
                            error={errors.parentPhone}
                            name="parentPhone"
                            label={"SĐT phụ huynh"}
                            value={formData.parentPhone}
                            onChange={handleChange}
                            placeholder="VD: 0987654321"
                        />
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="submit"
                    loading={loadingCreate}
                    disabled={loadingCreate}
                >
                    Tạo học sinh
                </Button>
            </div>
        </form>
    );
}
