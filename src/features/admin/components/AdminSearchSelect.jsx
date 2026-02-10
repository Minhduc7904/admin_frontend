import { useDispatch } from 'react-redux';
import { SearchableSelect } from '../../../shared/components/ui';
import { searchAdminsAsync, getAllAdminsAsync } from '../store/adminSlice';

/**
 * AdminSearchSelect - Wrapper component for searching and selecting admins
 * Sử dụng SearchableSelect với Redux thunk
 */
export const AdminSearchSelect = ({
    label = "Giáo viên",
    placeholder = "Tìm kiếm giáo viên...",
    onSelect,
    value,
    error,
    required = false,
    disabled = false,
    className = ''
}) => {
    const dispatch = useDispatch();

    // Search function using Redux thunk
    const handleSearch = async (keyword) => {
        try {
            const result = await dispatch(searchAdminsAsync({
                search: keyword,
            })).unwrap();
            return result.data;
        } catch (error) {
            console.error('Error searching admins:', error);
            return { data: [] };
        }
    };

    // Fetch default items (latest 10 admins)
    const fetchDefaultAdmins = async () => {
        try {
            const result = await dispatch(searchAdminsAsync()).unwrap();
            return result.data;
        } catch (error) {
            console.error('Error fetching default admins:', error);
            return { data: [] };
        }
    };

    // Custom render option để hiển thị thông tin chi tiết hơn
    const renderAdminOption = (admin) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium">{admin.fullName || 'N/A'}</span>
                <span className="text-xs text-foreground-light">
                    {admin.email || 'No email'}
                </span>
            </div>
        );
    };

    return (
        <SearchableSelect
            label={label}
            placeholder={placeholder}
            searchFunction={handleSearch}
            fetchDefaultItems={fetchDefaultAdmins}
            onSelect={onSelect}
            getOptionLabel={(admin) => admin?.fullName || 'N/A'}
            getOptionValue={(admin) => admin?.adminId}
            renderOption={renderAdminOption}
            value={value}
            error={error}
            required={required}
            disabled={disabled}
            className={className}
        />
    );
};
