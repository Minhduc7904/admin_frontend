import { createAdminAsync, getAllAdminsAsync, selectAdminLoadingCreate } from "../store/adminSlice"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { Input, Button, PasswordInput, Checkbox, DotsLoading } from "../../../shared/components"
import { getAllRolesAsync, selectRoles, selectRoleLoadingGet } from "../../role/store/roleSlice"

export const AddAdmin = ({ onClose }) => {
    const dispatch = useDispatch();

    const roles = useSelector(selectRoles);
    const loadingRoles = useSelector(selectRoleLoadingGet);
    const loadingCreate = useSelector(selectAdminLoadingCreate);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (roles.length === 0) dispatch(getAllRolesAsync({ limit: 100 }));
    }, [dispatch, roles.length]);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        roleIds: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const validateRegisterAdmin = (formData) => {
        const errors = {}

        if (!formData.username?.trim()) {
            errors.username = 'Tên đăng nhập không được để trống'
        }

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Email không hợp lệ'
        }

        if (!formData.password || formData.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        if (!formData.firstName?.trim()) {
            errors.firstName = 'Họ không được để trống'
        }

        if (!formData.lastName?.trim()) {
            errors.lastName = 'Tên không được để trống'
        }

        if (formData.roleIds && !Array.isArray(formData.roleIds)) {
            errors.roleIds = 'Danh sách vai trò không hợp lệ'
        }

        return errors
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        const errors = validateRegisterAdmin(formData)

        if (Object.keys(errors).length > 0) {
            setErrors(errors)
            console.log('Validate errors:', errors)
            return
        }

        const data = {
            username: formData.username.trim(),
            email: formData.email?.trim() || undefined,
            password: formData.password,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            roleIds: formData.roleIds?.map(Number),
        }

        try {
            await dispatch(createAdminAsync(data)).unwrap()
            await dispatch(getAllAdminsAsync()).unwrap()
            onClose()
            // close panel / reset form
        } catch (error) {
            console.error('Error creating admin:', error)
        }
    }


    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6">
                {/* Username */}
                <div>
                    <Input
                        error={errors.username}
                        name="username"
                        label={"Tên đăng nhập"}
                        required={true}
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="VD: adminuser"
                    />
                </div>
                {/* Email */}
                <div>
                    <Input
                        error={errors.email}
                        name="email"
                        label={"Email"}
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="VD: example@example.com"
                    />
                </div>
                {/* Password */}
                <div>
                    <PasswordInput
                        error={errors.password}
                        required={true}
                        label={"Mật khẩu"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                    />
                </div>
                {/* Confirm Password */}
                <div>
                    <PasswordInput
                        error={errors.confirmPassword}
                        required={true}
                        label={"Xác nhận mật khẩu"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Xác nhận mật khẩu"
                    />
                </div>
                {/* Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            error={errors.lastName}
                            name="lastName"
                            label={"Họ"}
                            required={true}
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="VD: Nguyễn"
                        />
                    </div>
                    {/* First Name */}
                    <div>
                        <Input
                            error={errors.firstName}
                            name="firstName"
                            label={"Tên"}
                            required={true}
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="VD: Văn A"
                        />
                    </div>
                </div>

                {/* Roles */}

                {!loadingRoles ? (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Vai trò quản trị viên
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-sm p-3">
                            {roles.map((role) => {
                                if (role.roleId === 1) return null; // Skip Super Admin
                                return (
                                    <Checkbox
                                        key={role.roleId}
                                        label={role.roleName}
                                        checked={formData.roleIds.includes(role.roleId)}
                                        onChange={(isChecked) => {
                                            setFormData((prev) => {
                                                const updatedRoleIds = isChecked
                                                    ? [...prev.roleIds, role.roleId]
                                                    : prev.roleIds.filter(id => id !== role.roleId);
                                                return {
                                                    ...prev,
                                                    roleIds: updatedRoleIds,
                                                };
                                            });
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-col gap-2">
                        <DotsLoading />
                        <span className="ml-2 text-foreground-light">Đang tải vai trò...</span>
                    </div>
                )}

            </div>
            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="submit"
                    loading={loadingCreate}
                    disabled={loadingCreate}
                >
                    Tạo quản trị viên
                </Button>
            </div>
        </form>
    );
}