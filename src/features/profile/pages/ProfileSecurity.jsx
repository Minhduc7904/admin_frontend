import { useState } from 'react';
import { Lock, Eye, EyeOff, Key, Shield } from 'lucide-react';
import { Input, Button } from '../../../shared/components/ui';

export const ProfileSecurity = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            // TODO: Implement change password API call
            // await dispatch(changePasswordAsync(formData)).unwrap();

            // Reset form on success
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            alert('Đổi mật khẩu thành công!');
        } catch (error) {
            console.error('Failed to change password:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="border-b border-border pb-4 mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                    Bảo mật
                </h2>
                <p className="text-sm text-foreground-light mt-1">
                    Quản lý mật khẩu và cài đặt bảo mật tài khoản
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <div className="relative">
                            <Input
                                label="Mật khẩu hiện tại"
                                name="currentPassword"
                                type={showPassword.current ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={handleChange}
                                disabled={loading}
                                error={errors.currentPassword}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-[34px] text-foreground-light hover:text-foreground transition-colors"
                            >
                                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password and Confirm Password - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* New Password */}
                        <div>
                            <div className="relative">
                                <Input
                                    label="Mật khẩu mới"
                                    name="newPassword"
                                    type={showPassword.new ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                    error={errors.newPassword}
                                    placeholder="Nhập mật khẩu mới"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-[34px] text-foreground-light hover:text-foreground transition-colors"
                                >
                                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <div className="relative">
                                <Input
                                    label="Xác nhận mật khẩu mới"
                                    name="confirmPassword"
                                    type={showPassword.confirm ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                    error={errors.confirmPassword}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-[34px] text-foreground-light hover:text-foreground transition-colors"
                                >
                                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                        <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                            <Key size={16} className="text-blue-600" />
                            Yêu cầu mật khẩu:
                        </p>
                        <ul className="text-sm text-foreground-light space-y-1 ml-6">
                            <li>• Tối thiểu 6 ký tự</li>
                            <li>• Nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                            <li>• Không sử dụng mật khẩu dễ đoán</li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border">
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        disabled={loading}
                    >
                        <Lock size={16} />
                        Đổi mật khẩu
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setFormData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                            });
                            setErrors({});
                        }}
                        disabled={loading}
                    >
                        Xóa
                    </Button>
                </div>
            </form>

            {/* Security Settings Section */}
            <div className="border-t border-border pt-6 mt-8 max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                    <Shield size={20} className="text-foreground-light" />
                    <h3 className="text-lg font-semibold text-foreground">
                        Cài đặt bảo mật
                    </h3>
                </div>

                <div className="space-y-3">
                    {/* Two-Factor Authentication (Coming Soon) */}
                    <div className="flex items-center justify-between p-4 border border-border rounded-sm hover:bg-gray-50 transition-colors">
                        <div>
                            <p className="font-medium text-foreground">
                                Xác thực hai yếu tố (2FA)
                            </p>
                            <p className="text-sm text-foreground-light mt-1">
                                Tăng cường bảo mật tài khoản với xác thực hai bước
                            </p>
                        </div>
                        <span className="text-xs text-foreground-light bg-gray-100 px-3 py-1 rounded-full">
                            Sắp ra mắt
                        </span>
                    </div>

                    {/* Login History (Coming Soon) */}
                    <div className="flex items-center justify-between p-4 border border-border rounded-sm hover:bg-gray-50 transition-colors">
                        <div>
                            <p className="font-medium text-foreground">
                                Lịch sử đăng nhập
                            </p>
                            <p className="text-sm text-foreground-light mt-1">
                                Xem lịch sử các lần đăng nhập vào tài khoản
                            </p>
                        </div>
                        <span className="text-xs text-foreground-light bg-gray-100 px-3 py-1 rounded-full">
                            Sắp ra mắt
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
