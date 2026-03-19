import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Input, Select } from '../../../../shared/components/ui';
import { useUpdateAdminDirect } from '../../hooks';
import { ApiEndpointCard } from '../shared/ApiEndpointCard';
import { ApiErrorAlert } from '../shared/ApiErrorAlert';
import { ApiJsonPreview } from '../shared/ApiJsonPreview';
import { ApiResponsePlaceholder } from '../shared/ApiResponsePlaceholder';

const GENDER_OPTIONS = [
    { value: 'MALE', label: 'MALE' },
    { value: 'FEMALE', label: 'FEMALE' },
    { value: 'OTHER', label: 'OTHER' },
];

const BOOLEAN_OPTIONS = [
    { value: 'true', label: 'true' },
    { value: 'false', label: 'false' },
];

const buildPayload = (formData) => {
    const payload = {
        adminId: Number(formData.adminId),
    };

    if (formData.username.trim()) payload.username = formData.username.trim();
    if (formData.email.trim()) payload.email = formData.email.trim();
    if (formData.firstName.trim()) payload.firstName = formData.firstName.trim();
    if (formData.lastName.trim()) payload.lastName = formData.lastName.trim();
    if (formData.gender) payload.gender = formData.gender;
    if (formData.dateOfBirth) payload.dateOfBirth = new Date(formData.dateOfBirth).toISOString();
    if (formData.password.trim()) payload.password = formData.password;
    if (formData.subjectId.trim()) payload.subjectId = Number(formData.subjectId);
    if (formData.isEmailVerified) payload.isEmailVerified = formData.isEmailVerified === 'true';
    if (formData.isActive) payload.isActive = formData.isActive === 'true';

    return payload;
};

const initialFormData = {
    adminId: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    isEmailVerified: '',
    isActive: '',
    password: '',
    subjectId: '',
};

export const UpdateAdminDirectApiCard = () => {
    const {
        loading,
        error,
        result,
        updateAdminDirect,
        clearState,
    } = useUpdateAdminDirect();

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState('');

    const requestBody = useMemo(() => buildPayload(formData), [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        if (!formData.adminId.trim()) {
            return 'Vui long nhap adminId.';
        }

        const adminId = Number(formData.adminId);
        if (!Number.isInteger(adminId) || adminId <= 0) {
            return 'adminId phai la so nguyen duong.';
        }

        if (formData.subjectId.trim()) {
            const subjectId = Number(formData.subjectId);
            if (!Number.isInteger(subjectId) || subjectId <= 0) {
                return 'subjectId phai la so nguyen duong.';
            }
        }

        if (formData.email.trim()) {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
            if (!isValidEmail) {
                return 'Email khong hop le.';
            }
        }

        return '';
    };

    const handleExecute = async () => {
        const message = validate();
        if (message) {
            setFormError(message);
            return;
        }

        setFormError('');
        await updateAdminDirect(buildPayload(formData));
    };

    const clearAll = () => {
        setFormData(initialFormData);
        setFormError('');
        clearState();
    };

    const updatedAdmin = result?.data;

    return (
        <ApiEndpointCard
            isOpen={isOpen}
            onToggle={() => setIsOpen((prev) => !prev)}
            method="POST"
            path="/super-admin/update-admin-direct"
            description="Cap nhat truc tiep thong tin Admin va User"
            methodClassName="bg-indigo-600"
            headerClassName="bg-indigo-50 hover:bg-indigo-100"
            pathClassName="text-indigo-800"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="number"
                        label="adminId"
                        name="adminId"
                        value={formData.adminId}
                        onChange={handleChange}
                        placeholder="Vi du: 12"
                        required
                    />
                    <Input
                        label="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="admin_username"
                    />
                    <Input
                        type="email"
                        label="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="admin@example.com"
                    />
                    <Input
                        label="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Nguyen"
                    />
                    <Input
                        label="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="An"
                    />
                    <Select
                        label="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={GENDER_OPTIONS}
                        placeholder="Chon gender"
                    />
                    <Input
                        type="date"
                        label="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                    <Select
                        label="isEmailVerified"
                        name="isEmailVerified"
                        value={formData.isEmailVerified}
                        onChange={handleChange}
                        options={BOOLEAN_OPTIONS}
                        placeholder="Chon true/false"
                    />
                    <Select
                        label="isActive"
                        name="isActive"
                        value={formData.isActive}
                        onChange={handleChange}
                        options={BOOLEAN_OPTIONS}
                        placeholder="Chon true/false"
                    />
                    <Input
                        type="password"
                        label="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhap mat khau moi"
                    />
                    <Input
                        type="number"
                        label="subjectId"
                        name="subjectId"
                        value={formData.subjectId}
                        onChange={handleChange}
                        placeholder="Vi du: 3"
                    />
                </div>

                <ApiErrorAlert message={formError || error} />

                <div className="flex items-center gap-2">
                    <Button onClick={handleExecute} loading={loading} disabled={loading}>
                        Execute
                    </Button>
                    <Button
                        variant="outline"
                        onClick={clearAll}
                        disabled={loading}
                    >
                        <RotateCcw size={14} />
                        Clear Form & Response
                    </Button>
                </div>

                <ApiJsonPreview title="Request body" value={requestBody} />
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Response</h2>

                {!result ? (
                    <ApiResponsePlaceholder message="Chua co du lieu phan hoi. Hay nhap adminId va bam Execute." />
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">Admin ID</p>
                                <p className="text-lg font-semibold text-foreground">{updatedAdmin?.adminId ?? '-'}</p>
                            </div>
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">User ID</p>
                                <p className="text-lg font-semibold text-foreground">{updatedAdmin?.user?.userId ?? '-'}</p>
                            </div>
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">Username</p>
                                <p className="text-sm font-medium text-foreground">{updatedAdmin?.user?.username || '-'}</p>
                            </div>
                            <div className="rounded-sm border border-border p-3">
                                <p className="text-xs text-foreground-light">Email</p>
                                <p className="text-sm font-medium text-foreground break-all">{updatedAdmin?.user?.email || '-'}</p>
                            </div>
                        </div>

                        <ApiJsonPreview
                            title="Raw JSON"
                            value={result}
                            className="text-xs bg-gray-900 text-blue-200 rounded-sm p-3 overflow-auto border border-gray-800 max-h-[320px]"
                        />
                    </>
                )}
            </div>
        </ApiEndpointCard>
    );
};
