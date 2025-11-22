import React from 'react';
import { Mail, KeyRound } from 'lucide-react';
import { ErrorMessage } from './ErrorMessage';
import { InputField } from './InputField';
import { RememberForgot } from './RememberForgot';
import { SubmitButton } from './SubmitButton';
import { DemoInfo } from './DemoInfo';

interface LoginFormCardProps {
    formData: {
        email: string;
        password: string;
        remember: boolean;
    };
    isLoading: boolean;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginFormCard: React.FC<LoginFormCardProps> = ({
    formData,
    isLoading,
    error,
    onSubmit,
    onChange,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                    <p className="text-sm text-gray-600">Nhập thông tin tài khoản của bạn</p>
                </div>

                <ErrorMessage message={error} />

                <InputField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    value={formData.email}
                    placeholder="admin@example.com"
                    icon={Mail}
                    required
                    onChange={onChange}
                />

                <InputField
                    id="password"
                    name="password"
                    type="password"
                    label="Mật khẩu"
                    value={formData.password}
                    placeholder="••••••••"
                    icon={KeyRound}
                    required
                    onChange={onChange}
                />

                <RememberForgot
                    remember={formData.remember}
                    onRememberChange={onChange}
                />

                <SubmitButton
                    isLoading={isLoading}
                    text="Đăng nhập"
                    loadingText="Đang xử lý..."
                />

                <DemoInfo email="admin@example.com" password="admin123" />
            </form>
        </div>
    );
};
