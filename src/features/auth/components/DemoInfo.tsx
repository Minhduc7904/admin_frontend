import React from 'react';

interface DemoInfoProps {
    email: string;
    password: string;
}

export const DemoInfo: React.FC<DemoInfoProps> = ({ email, password }) => {
    return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-900 mb-2">🔑 Thông tin demo:</p>
            <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Password:</strong> {password}</p>
            </div>
        </div>
    );
};
