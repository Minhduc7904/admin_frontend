import { Input, PasswordInput, Dropdown } from '../../../../shared/components';
import { Checkbox } from '../../../../shared/components/ui';
import { GRADE_OPTIONS } from '../../../../core/constants/grade-constants';

export const StudentBasicInfoStep = ({
    formData,
    errors,
    onChange,
    onGradeChange,
    autoGenCredentials = false,
    onAutoGenChange,
}) => {
    return (
        <div className="space-y-6">
            {/* Auto-gen toggle */}
            <div className="bg-blue-50 border border-blue-100 rounded-sm px-4 py-3">
                <Checkbox
                    id="auto-gen-credentials"
                    checked={autoGenCredentials}
                    onChange={onAutoGenChange}
                    label="Tự động tạo tài khoản & mật khẩu"
                    tooltipText="Tài khoản và mật khẩu sẽ được tạo tự động từ tên + SĐT học sinh (VD: Đức 0392923661 → duc0392923661)"
                />
                {autoGenCredentials && formData.firstName && formData.studentPhone && (
                    <p className="text-xs text-blue-600 mt-2 ml-6">
                        Tài khoản được tạo:{' '}
                        <span className="font-semibold">{formData.username}</span>
                    </p>
                )}
                {autoGenCredentials && (!formData.firstName || !formData.studentPhone) && (
                    <p className="text-xs text-foreground-light mt-2 ml-6">
                        Nhập tên và SĐT học sinh để tự động tạo tài khoản
                    </p>
                )}
            </div>

            {/* Username */}
            <Input
                error={errors.username}
                name="username"
                label="Tên đăng nhập"
                required
                value={formData.username}
                onChange={onChange}
                placeholder="VD: student123"
                disabled={autoGenCredentials}
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
                disabled={autoGenCredentials}
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
                disabled={autoGenCredentials}
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
