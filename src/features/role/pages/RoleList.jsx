import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid } from '../../../shared/components/ui';
import { RoleTable, RoleFilters, RoleDeleteModal } from '../components';
import {
    getAllRolesAsync,
    deleteRoleAsync,
    selectRoles,
    selectRoleLoadingGet,
    selectRoleLoadingDelete,
} from '../store/roleSlice';
import { ROUTES } from '../../../core/constants';

export const RoleList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const roles = useSelector(selectRoles);
    const loadingGet = useSelector(selectRoleLoadingGet);
    const loadingDelete = useSelector(selectRoleLoadingDelete);

    const [search, setSearch] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = () => {
        dispatch(getAllRolesAsync({ limit: 100 }));
    };

    const handleCreate = () => {
        navigate(ROUTES.ROLES_CREATE);
    };

    const handleEdit = (role) => {
        navigate(ROUTES.ROLES_EDIT(role.roleId));
    };

    const handleDelete = (role) => {
        setSelectedRole(role);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteRoleAsync(selectedRole.roleId)).unwrap();
            setIsDeleteModalOpen(false);
            loadRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    // Filter roles based on search
    const filteredRoles = roles.filter(role => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
            role.roleName.toLowerCase().includes(searchLower) ||
            role.description?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <>
            {/* Header */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Quản lý vai trò</h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Quản lý các vai trò và quyền trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus size={16} />
                        Thêm vai trò mới
                    </Button>
                </div>

                {/* Filters */}
                <RoleFilters
                    search={search}
                    onSearchChange={setSearch}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <RoleTable
                    roles={filteredRoles}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loadingGet}
                />
            </div>

            {/* Delete Modal */}
            <RoleDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                role={selectedRole}
                loading={loadingDelete}
            />
        </>
    );
};
