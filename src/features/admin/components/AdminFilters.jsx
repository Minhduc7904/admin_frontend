import { SearchInput, Dropdown } from '../../../shared/components/ui';

export const AdminFilters = ({ search, onSearchChange, role, onRoleChange, roles, loadingRoles }) => {
    // const roleOptions = [
    //     { value: '', label: 'Tất cả vai trò' },
    //     ...roles.map(r => ({ value: r.roleId, label: r.roleName }))
    // ];

    return (
        <div className="mb-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm quản trị viên (username, email)..."
                    />
                </div>
                {/* <div className="w-64">
                    <Dropdown
                        value={role}
                        onChange={onRoleChange}
                        options={roleOptions}
                        placeholder="Chọn vai trò"
                        disabled={loadingRoles}
                    />
                </div> */}
            </div>
        </div>
    );
}