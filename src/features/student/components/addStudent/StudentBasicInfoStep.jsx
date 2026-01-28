import { Input, PasswordInput, Dropdown } from '../../../../shared/components';
import { GRADE_OPTIONS } from '../../../../core/constants/grade-constants';

export const StudentBasicInfoStep = ({
    formData,
    errors,
    onChange,
    onGradeChange,
}) => {
    return (
        <div className="space-y-6">
            {/* Username */}
            <Input
                error={errors.username}
                name="username"
                label="Tên đăng nhập"
                required
                value={formData.username}
                onChange={onChange}
                placeholder="VD: student123"
            />

            {/* Password */}
            <PasswordInput
                error={errors.password}
                required
                label="Mật khẩu"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Nhập mật khẩu"
            />

            {/* Confirm Password */}
            <PasswordInput
                error={errors.confirmPassword}
                required
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                placeholder="Xác nhận mật khẩu"
            />

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    error={errors.lastName}
                    name="lastName"
                    label="Họ"
                    required
                    value={formData.lastName}
                    onChange={onChange}
                    placeholder="VD: Nguyễn"
                />

                <Input
                    error={errors.firstName}
                    name="firstName"
                    label="Tên"
                    required
                    value={formData.firstName}
                    onChange={onChange}
                    placeholder="VD: Văn A"
                />
            </div>

            {/* Grade */}
            <Dropdown
                label="Khối lớp"
                required
                value={formData.grade}
                onChange={onGradeChange}
                options={GRADE_OPTIONS}
                error={errors.grade}
            />

            {/* School */}
            <Input
                name="school"
                label="Trường học"
                value={formData.school}
                onChange={onChange}
                placeholder="VD: THPT Nguyễn Huệ"
            />

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    error={errors.studentPhone}
                    name="studentPhone"
                    label="SĐT học sinh"
                    value={formData.studentPhone}
                    onChange={onChange}
                    placeholder="VD: 0912345678"
                />

                <Input
                    error={errors.parentPhone}
                    name="parentPhone"
                    label="SĐT phụ huynh"
                    value={formData.parentPhone}
                    onChange={onChange}
                    placeholder="VD: 0987654321"
                />
            </div>
        </div>
    );
};
