import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { loginAsync } from '../store/authSlice';
import { AuthLayout } from '../layouts';
import { AuthInput, AuthButton, AuthLink } from '../components';
import { Checkbox } from '../../../shared/components/ui';
import { ButtonLoading } from '../../../shared/components/loading';
import { ROUTES } from '../../../core/constants';
import { PasswordInput } from '../../../shared/components/ui';

export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading } = useAppSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(loginAsync({ username, password }));

        const isSuccess = result.payload.success;
        if (isSuccess) {
            navigate(ROUTES.LOADING_REDIRECT);
        }
    };

    return (
        <AuthLayout subtitle="Đăng nhập để tiếp tục">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Input */}
                <AuthInput
                    label="Tên đăng nhập"
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    required
                />

                {/* Password Input */}
                <PasswordInput
                    label="Mật khẩu"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    showPassword={showPassword}
                    onToggleVisibility={toggleShowPassword}
                    helperText="Mật khẩu tối thiểu 6 ký tự"
                />

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                    <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onChange={setRememberMe}
                        label="Ghi nhớ"
                    />
                    <AuthLink to="#">Quên mật khẩu?</AuthLink>
                </div>

                {/* Submit Button */}
                <AuthButton type="submit" variant="primary" fullWidth disabled={loading}>
                    {loading ? <ButtonLoading message="Đang đăng nhập..." /> : 'Đăng nhập'}
                </AuthButton>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-foreground-light mt-4">
                Chưa có tài khoản?{' '}
                <AuthLink to="#" className="font-medium">
                    Đăng ký ngay
                </AuthLink>
            </p>
        </AuthLayout>
    );
};
