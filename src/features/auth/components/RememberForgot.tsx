import React from 'react';

interface RememberForgotProps {
    remember: boolean;
    onRememberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RememberForgot: React.FC<RememberForgotProps> = ({
    remember,
    onRememberChange,
}) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={onRememberChange}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                </label>
            </div>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Quên mật khẩu?
            </a>
        </div>
    );
};
