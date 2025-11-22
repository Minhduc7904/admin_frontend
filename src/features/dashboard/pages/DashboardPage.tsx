import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Card, Button } from '@/shared/components/ui';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { increment, decrement } from '@/core/store/features/counter/counterSlice';
import { MANAGEMENT_MODULES, SUBJECTS } from '@/features/modules';

export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const dispatch = useAppDispatch();
    const count = useAppSelector((state) => state.counter.value);
    const { selectedModule, selectedSubject } = useAppSelector((state) => state.module);

    // Get module and subject names
    const moduleName = MANAGEMENT_MODULES.find(m => m.id === selectedModule)?.name || 'N/A';
    const subjectName = selectedSubject 
        ? SUBJECTS.find(s => s.id === selectedSubject)?.name 
        : null;

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        {moduleName}
                        {subjectName && <span className="text-blue-600"> - Môn {subjectName}</span>}
                    </p>
                </div>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="User Information">
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                        <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
                    </div>
                </Card>

                <Card title="Module hiện tại">
                    <div className="space-y-2">
                        <p><strong>Module:</strong> {moduleName}</p>
                        {subjectName && (
                            <p><strong>Môn học:</strong> {subjectName}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-4">
                            Quay lại trang chọn module để thay đổi
                        </p>
                    </div>
                </Card>

                <Card title="Counter Demo">
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600">{count}</div>
                            <p className="text-gray-600 mt-2">Current Count</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => dispatch(increment())}>+</Button>
                            <Button size="sm" variant="danger" onClick={() => dispatch(decrement())}>-</Button>
                        </div>
                    </div>
                </Card>

                <Card title="Stats">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total Users:</span>
                            <span className="font-semibold">1,234</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Active:</span>
                            <span className="font-semibold text-green-600">987</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pending:</span>
                            <span className="font-semibold text-yellow-600">247</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
