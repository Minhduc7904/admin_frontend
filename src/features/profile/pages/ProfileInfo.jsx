import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Save } from 'lucide-react';
import { Input, Button, Select } from '../../../shared/components/ui';
import { updateProfileAsync, selectProfile, selectProfileLoading, getProfileAsync } from '../store/profileSlice';

const GENDER_OPTIONS = [
    { value: 'MALE', label: 'Nam' },
    { value: 'FEMALE', label: 'Nữ' },
    { value: 'OTHER', label: 'Khác' }
];

export const ProfileInfo = () => {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const loading = useSelector(selectProfileLoading);

    const [formData, setFormData] = useState({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        username: profile?.username || '',
        gender: profile?.gender || '',
        dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
    });

    useEffect(() => {
        dispatch(getProfileAsync());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                username: profile.username || '',
                gender: profile.gender || '',
                dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
            });
        }
    }, [profile]);

    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Tên không được để trống';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Họ không được để trống';
        }

        if (formData.email.trim()) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Email không hợp lệ';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const submitData = { ...formData };
            if (submitData.dateOfBirth) {
                submitData.dateOfBirth = new Date(submitData.dateOfBirth).toISOString();
            }
            await dispatch(updateProfileAsync(submitData)).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            email: profile?.email || '',
            username: profile?.username || '',
            gender: profile?.gender || '',
            dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        });
        setErrors({});
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getGenderLabel = (gender) => {
        const option = GENDER_OPTIONS.find(opt => opt.value === gender);
        return option ? option.label : 'Chưa cập nhật';
    };

    return (
        <div className="p-6">
            <div className="border-b border-border pb-4 mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                    Thông tin cá nhân
                </h2>
                <p className="text-sm text-foreground-light mt-1">
                    Quản lý và cập nhật thông tin tài khoản của bạn
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="space-y-6">
                    {/* Name Fields - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Last Name */}
                        <div>
                            <Input
                                label="Họ"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={errors.lastName}
                                placeholder="Nhập họ"
                            />
                        </div>

                        {/* First Name */}
                        <div>
                            <Input
                                label="Tên"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={errors.firstName}
                                placeholder="Nhập tên"
                            />
                        </div>
                    </div>

                    {/* Email and Username - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email */}
                        <div>
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={errors.email}
                                placeholder="email@example.com"
                            />
                        </div>

                        {/* Username (Read-only) */}
                        <div>
                            <Input
                                label="Tên đăng nhập"
                                name="username"
                                value={formData.username}
                                disabled={true}
                                helperText="Không thể thay đổi"
                            />
                        </div>
                    </div>

                    {/* Gender and Date of Birth - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Gender */}
                        <div>
                            {isEditing ? (
                                <Select
                                    label="Giới tính"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    disabled={loading}
                                    options={GENDER_OPTIONS}
                                    placeholder="Chọn giới tính"
                                />
                            ) : (
                                <>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Giới tính
                                    </label>
                                    <div className="px-3 py-2 text-sm border border-border rounded-sm bg-gray-50 text-foreground-light">
                                        {getGenderLabel(profile?.gender)}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            {isEditing ? (
                                <Input
                                    label="Ngày sinh"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            ) : (
                                <>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Ngày sinh
                                    </label>
                                    <div className="px-3 py-2 text-sm border border-border rounded-sm bg-gray-50 text-foreground-light">
                                        {formatDate(profile?.dateOfBirth)}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Created At (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Ngày tạo tài khoản
                        </label>
                        <div className="px-3 py-2 text-sm border border-border rounded-sm bg-gray-50 text-foreground-light inline-flex items-center gap-2">
                            <Calendar size={16} />
                            {formatDate(profile?.createdAt)}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border">
                    {!isEditing ? (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsEditing(true);
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                disabled={loading}
                            >
                                <Save size={16} />
                                Lưu thay đổi
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCancel();
                                }}
                                disabled={loading}
                            >
                                Hủy
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};
