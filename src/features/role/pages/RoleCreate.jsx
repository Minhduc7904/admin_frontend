// 1. Imports
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Tabs, PageHeader } from '../../../shared/components';
import { RoleFormFields, RolePermissionSelector } from '../components';
import {
    createRoleAsync,
    selectRoleLoadingCreate,
} from '../store/roleSlice';
import {
    getAllPermissionsAsync,
    selectPermissions,
    selectPermissionLoadingGet,
} from '../../permission/store/permissionSlice';
import { ROUTES } from '../../../core/constants';

// 2. Component
export const RoleCreate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // UI state (tab)
    const [activeTab, setActiveTab] = useState('basic');

    // Data
    const permissions = useSelector(selectPermissions);
    const loadingPermissions = useSelector(selectPermissionLoadingGet);
    const loadingCreate = useSelector(selectRoleLoadingCreate);

    // Form
    const [formData, setFormData] = useState({
        roleName: '',
        description: '',
        isAssignable: true,
        permissionIds: [],
    });

    const [errors, setErrors] = useState({});

    // Effects
    useEffect(() => {
        dispatch(getAllPermissionsAsync({ limit: 100 }));
    }, [dispatch]);

    // Handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handlePermissionToggle = (permissionId) => {
        setFormData((prev) => ({
            ...prev,
            permissionIds: prev.permissionIds.includes(permissionId)
                ? prev.permissionIds.filter((id) => id !== permissionId)
                : [...prev.permissionIds, permissionId],
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.roleName.trim()) {
            newErrors.roleName = 'Tên vai trò không được để trống';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await dispatch(createRoleAsync(formData)).unwrap();
            navigate(ROUTES.ROLES);
        } catch (error) {
            console.error('Error creating role:', error);
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.ROLES);
    };

    // Tabs config (UI only)
    const tabs = [
        {
            label: 'Thông tin cơ bản',
            isActive: activeTab === 'basic',
            onActivate: () => setActiveTab('basic'),
        },
        {
            label: 'Quyền hạn',
            isActive: activeTab === 'permissions',
            onActivate: () => setActiveTab('permissions'),
        },
    ];

    // 3. Render
    return (
        <div className="space-y-6">
            <PageHeader
                breadcrumb={[
                    { label: 'Bảng điều khiển', to: '/dashboard' },
                    { label: 'Vai trò', to: ROUTES.ROLES },
                    { label: 'Tạo vai trò' },
                ]}
                badge="Quản lý vai trò"
                description="Tạo vai trò mới và gán các quyền hạn tương ứng trong hệ thống."
            />
            <Tabs tabs={tabs} />
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tabs + content */}
                <div className="bg-white border border-border rounded-sm p-6 space-y-6">


                    {activeTab === 'basic' && (
                        <RoleFormFields
                            formData={formData}
                            errors={errors}
                            onChange={handleChange}
                        />
                    )}

                    {activeTab === 'permissions' && (
                        <>
                            <p className="text-sm text-foreground-light">
                                Đã chọn {formData.permissionIds.length} quyền
                            </p>

                            <RolePermissionSelector
                                permissions={permissions}
                                selectedPermissionIds={formData.permissionIds}
                                onPermissionToggle={handlePermissionToggle}
                                loading={loadingPermissions}
                                mode="create"
                            />
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 bg-white border border-border rounded-sm p-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loadingCreate}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        loading={loadingCreate}
                        disabled={loadingCreate}
                    >
                        Tạo vai trò
                    </Button>
                </div>
            </form>
        </div>
    );
};
