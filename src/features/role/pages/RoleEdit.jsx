// 1. Imports
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Tabs } from '../../../shared/components/ui';
import { RoleFormFields, RolePermissionSelector } from '../components';
import {
    getRoleByIdAsync,
    updateRoleAsync,
    toggleRolePermissionAsync,
    selectCurrentRole,
    selectRoleLoadingGet,
    selectRoleLoadingUpdate,
    selectRoleLoadingToggle,
    selectRoleLoadingPermissionIds,
} from '../store/roleSlice';
import {
    getAllPermissionsAsync,
    selectPermissions,
    selectPermissionLoadingGet,
} from '../../permission/store/permissionSlice';
import { ROUTES } from '../../../core/constants';

// 2. Component
export const RoleEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    // UI state (tab)
    const [activeTab, setActiveTab] = useState('basic');

    // Store selectors
    const currentRole = useSelector(selectCurrentRole);
    const permissions = useSelector(selectPermissions);
    const loadingPermissions = useSelector(selectPermissionLoadingGet);
    const loadingGet = useSelector(selectRoleLoadingGet);
    const loadingUpdate = useSelector(selectRoleLoadingUpdate);
    const loadingToggle = useSelector(selectRoleLoadingToggle);
    const loadingPermissionIds = useSelector(selectRoleLoadingPermissionIds);

    // Form state
    const [formData, setFormData] = useState({
        roleName: '',
        description: '',
        isAssignable: true,
        permissionIds: [],
    });

    const [errors, setErrors] = useState({});

    // Effects
    useEffect(() => {
        dispatch(getRoleByIdAsync(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (permissions.length === 0) {
            dispatch(getAllPermissionsAsync({ limit: 100 }));
        }
    }, [dispatch, permissions.length]);

    useEffect(() => {
        if (!currentRole) return;

        setFormData({
            roleName: currentRole.roleName || '',
            description: currentRole.description || '',
            isAssignable: currentRole.isAssignable ?? true,
            permissionIds:
                currentRole.permissions?.map((p) => p.permissionId) || [],
        });
    }, [currentRole]);

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

    const handlePermissionToggle = useCallback(
        async (permissionId) => {
            if (!currentRole?.roleId) return;

            try {
                await dispatch(
                    toggleRolePermissionAsync({
                        roleId: currentRole.roleId,
                        permissionId,
                    })
                ).unwrap();
            } catch (error) {
                console.error('Error toggling permission:', error);
            }
        },
        [dispatch, currentRole?.roleId]
    );

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
            await dispatch(
                updateRoleAsync({
                    id: Number(id),
                    data: formData,
                })
            ).unwrap();
            navigate(ROUTES.ROLES);
        } catch (error) {
            console.error('Error updating role:', error);
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

    if (loadingGet) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-foreground-light">Đang tải...</span>
            </div>
        );
    }

    // 3. Render
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="p-2 rounded-sm hover:bg-primary/40"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Chỉnh sửa vai trò
                    </h1>
                    <p className="text-sm text-foreground-light mt-1">
                        Cập nhật thông tin vai trò {currentRole?.roleName}
                    </p>
                </div>
            </div>
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
                                roleId={currentRole?.roleId}
                                permissions={permissions}
                                selectedPermissionIds={formData.permissionIds}
                                onPermissionToggle={handlePermissionToggle}
                                loading={loadingPermissions}
                                loadingToggle={loadingToggle}
                                loadingPermissionIds={loadingPermissionIds}
                                mode="edit"
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
                        disabled={loadingUpdate}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        loading={loadingUpdate}
                        disabled={loadingUpdate}
                    >
                        Cập nhật
                    </Button>
                </div>
            </form>
        </div>
    );
};
