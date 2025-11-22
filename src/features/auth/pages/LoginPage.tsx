import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { LoginHeader } from '../components/LoginHeader';
import { LoginFormCard } from '../components/LoginFormCard';
import { LoginFooter } from '../components/LoginFooter';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Mock login - kiểm tra email và password
        setTimeout(() => {
            if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
                // Login thành công - chuyển đến trang chọn module
                navigate(ROUTES.MODULE_SELECTION);
            } else {
                // Login thất bại
                setError('Email hoặc mật khẩu không đúng');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <LoginHeader 
                    title="Admin Panel" 
                    subtitle="Đăng nhập để tiếp tục" 
                />
                
                <LoginFormCard
                    formData={formData}
                    isLoading={isLoading}
                    error={error}
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                />
                
                <LoginFooter />
            </div>
        </div>
    );
};
